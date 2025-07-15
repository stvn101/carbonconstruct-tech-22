// Enhanced EPD Service with server-side export capabilities

import { supabase } from '@/integrations/supabase/client';
import { EPDRecord, EPDFormData, EPDCalculationResult, EPDStage } from '@/types/epd';

export class EnhancedEPDService {
  // Existing methods from EPDService...
  static async createEPD(formData: EPDFormData): Promise<{ data: any | null; error: string | null }> {
    try {
      const calculation = await this.calculateEPD(formData);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('epd_records')
        .insert({
          submitted_by: user.user.id,
          product_name: formData.product_name,
          product_description: formData.product_description,
          functional_unit: formData.functional_unit,
          manufacturer_name: formData.manufacturer_name,
          manufacturer_location: formData.manufacturer_location,
          manufacturer_abn: formData.manufacturer_abn,
          epd_stage_data: calculation.stages as any,
          total_co2e: calculation.total_co2e,
          gwp_fossil: calculation.gwp_fossil,
          gwp_biogenic: calculation.gwp_biogenic,
          gwp_total: calculation.gwp_total,
          data_sources: this.extractDataSources(formData) as any
        })
        .select()
        .single();

      if (error) throw error;
      
      // Insert stage emissions for detailed tracking
      if (data) {
        await this.insertStageEmissions(data.id, calculation.stages);
        
        // Trigger verifier notification
        try {
          await supabase.functions.invoke('notify-verifier', {
            body: { 
              epdId: data.id, 
              productName: data.product_name,
              manufacturerName: data.manufacturer_name 
            }
          });
        } catch (notificationError) {
          console.warn('Failed to send verifier notification:', notificationError);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating EPD:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Server-side export processing
  static async submitForServerExport(epdId: string): Promise<{ 
    success: boolean; 
    files?: { html: string; csv: string; json: string }; 
    error?: string 
  }> {
    try {
      console.log(`Submitting EPD ${epdId} for server-side export`);
      
      const { data, error } = await supabase.functions.invoke('submit-epd-for-export', {
        body: { epdId }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Export failed');
      }

      console.log('Server export completed:', data);
      return {
        success: true,
        files: data.files
      };
    } catch (error) {
      console.error('Error submitting EPD for export:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Download generated files
  static async downloadExportedFile(fileUrl: string, filename: string): Promise<void> {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  // Get EPD with export status
  static async getEPDWithExportStatus(id: string): Promise<{ 
    data: (EPDRecord & { exportUrls?: { html?: string; csv?: string; json?: string } }) | null; 
    error: string | null 
  }> {
    try {
      const { data, error } = await supabase
        .from('epd_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Check if files exist in storage
      const epdRecord = data as unknown as EPDRecord;
      const exportUrls: { html?: string; csv?: string; json?: string } = {};

      // List files in the EPD's storage folder
      const { data: files } = await supabase.storage
        .from('epd-exports')
        .list(epdRecord.id);

      if (files && files.length > 0) {
        // Find the latest files (by name timestamp)
        const latestFiles = files
          .filter(file => file.name.startsWith(`epd_${epdRecord.id}_v${epdRecord.version_number}`))
          .sort((a, b) => b.updated_at!.localeCompare(a.updated_at!));

        latestFiles.forEach(file => {
          const { data: url } = supabase.storage
            .from('epd-exports')
            .getPublicUrl(`${epdRecord.id}/${file.name}`);
          
          if (file.name.endsWith('.html')) {
            exportUrls.html = url.publicUrl;
          } else if (file.name.endsWith('.csv')) {
            exportUrls.csv = url.publicUrl;
          } else if (file.name.endsWith('.json')) {
            exportUrls.json = url.publicUrl;
          }
        });
      }

      return { 
        data: { ...epdRecord, exportUrls }, 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching EPD with export status:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Existing calculation methods...
  static async calculateEPD(formData: EPDFormData): Promise<EPDCalculationResult> {
    const stages: Record<EPDStage, number> = {
      A1: this.calculateA1(formData),
      A2: this.calculateA2(formData),
      A3: this.calculateA3(formData),
      A4: this.calculateA4(formData),
      A5: this.calculateA5(formData),
      B1: 0, B2: 0, B3: 0, B4: 0, B5: 0, B6: 0, B7: 0,
      C1: this.calculateC1(formData),
      C2: this.calculateC2(formData),
      C3: this.calculateC3(formData),
      C4: this.calculateC4(formData),
      D: this.calculateD(formData)
    };

    const total_co2e = Object.values(stages).reduce((sum, value) => sum + value, 0);
    const gwp_fossil = total_co2e * 0.85;
    const gwp_biogenic = total_co2e * 0.10;
    const gwp_total = gwp_fossil + gwp_biogenic;

    const breakdown = {
      production: stages.A1 + stages.A2 + stages.A3,
      construction: stages.A4 + stages.A5,
      use: stages.B1 + stages.B2 + stages.B3 + stages.B4 + stages.B5 + stages.B6 + stages.B7,
      end_of_life: stages.C1 + stages.C2 + stages.C3 + stages.C4,
      benefits: stages.D
    };

    return { stages, total_co2e, gwp_fossil, gwp_biogenic, gwp_total, breakdown };
  }

  // Calculation helper methods (abbreviated for brevity)
  private static calculateA1(formData: EPDFormData): number {
    return formData.materials.reduce((sum, material) => sum + (material.quantity * material.carbon_footprint), 0);
  }

  private static calculateA2(formData: EPDFormData): number {
    const transportFactor = this.getTransportFactor(formData.transport.mode, formData.transport.fuel_type);
    const totalWeight = formData.materials.reduce((sum, m) => sum + m.quantity, 0);
    return (formData.transport.distance * totalWeight * transportFactor) / 1000;
  }

  private static calculateA3(formData: EPDFormData): number {
    const energyEmissions = (formData.energy.electricity * 0.82) + (formData.energy.gas * 0.18);
    const renewableReduction = energyEmissions * (formData.energy.renewable_percentage / 100);
    return energyEmissions - renewableReduction;
  }

  private static calculateA4(formData: EPDFormData): number {
    const distance = 50;
    const transportFactor = 0.62;
    const totalWeight = formData.materials.reduce((sum, m) => sum + m.quantity, 0);
    return (distance * totalWeight * transportFactor) / 1000;
  }

  private static calculateA5(formData: EPDFormData): number {
    return this.calculateA1(formData) * 0.05;
  }

  private static calculateC1(formData: EPDFormData): number {
    return this.calculateA1(formData) * 0.02;
  }

  private static calculateC2(formData: EPDFormData): number {
    const distance = 25;
    const transportFactor = 0.62;
    const totalWeight = formData.materials.reduce((sum, m) => sum + m.quantity, 0);
    return (distance * totalWeight * transportFactor) / 1000;
  }

  private static calculateC3(formData: EPDFormData): number {
    const totalEmissions = this.calculateA1(formData);
    const recyclingCredit = totalEmissions * (formData.waste.recycling_rate / 100) * 0.1;
    const incinerationEmissions = totalEmissions * (formData.waste.incineration_rate / 100) * 0.05;
    return incinerationEmissions - recyclingCredit;
  }

  private static calculateC4(formData: EPDFormData): number {
    const totalEmissions = this.calculateA1(formData);
    return totalEmissions * (formData.waste.landfill_rate / 100) * 0.02;
  }

  private static calculateD(formData: EPDFormData): number {
    const totalEmissions = this.calculateA1(formData);
    return -(totalEmissions * (formData.waste.recycling_rate / 100) * 0.15);
  }

  private static getTransportFactor(mode: string, fuelType: string): number {
    const factors: Record<string, Record<string, number>> = {
      truck: { diesel: 0.62, electric: 0.31 },
      rail: { diesel: 0.22, electric: 0.14 },
      ship: { diesel: 0.11, electric: 0.08 }
    };
    return factors[mode]?.[fuelType] || 0.62;
  }

  private static extractDataSources(formData: EPDFormData): string[] {
    return [
      'CarbonConstruct Materials Database',
      'EN 15804 Standard Factors',
      'Manufacturer Declarations'
    ];
  }

  private static async insertStageEmissions(epdId: string, stages: Record<EPDStage, number>) {
    const emissions = Object.entries(stages).map(([stage, value]) => ({
      epd_record_id: epdId,
      stage: stage as EPDStage,
      co2e_value: value,
      description: this.getStageDescription(stage as EPDStage),
      data_source: 'CarbonConstruct Calculation Engine'
    }));

    await supabase.from('epd_stage_emissions').insert(emissions);
  }

  private static getStageDescription(stage: EPDStage): string {
    const descriptions: Record<EPDStage, string> = {
      A1: 'Raw material supply', A2: 'Transport to manufacturer', A3: 'Manufacturing',
      A4: 'Transport to construction site', A5: 'Installation process',
      B1: 'Use', B2: 'Maintenance', B3: 'Repair', B4: 'Replacement', B5: 'Refurbishment',
      B6: 'Operational energy use', B7: 'Operational water use',
      C1: 'Deconstruction/demolition', C2: 'Transport to waste processing',
      C3: 'Waste processing', C4: 'Final disposal', D: 'Benefits beyond system boundary'
    };
    return descriptions[stage];
  }

  // Legacy methods for compatibility
  static async getEPD(id: string): Promise<{ data: EPDRecord | null; error: string | null }> {
    const result = await this.getEPDWithExportStatus(id);
    return { data: result.data, error: result.error };
  }

  static async getUserEPDs(): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('epd_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching EPDs:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async updateEPDStatus(id: string, status: string): Promise<{ error: string | null }> {
    try {
      const updateData: any = { status };
      
      if (status === 'submitted_for_review') {
        updateData.submitted_at = new Date().toISOString();
      } else if (status === 'verified') {
        updateData.verified_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('epd_records')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error updating EPD status:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async submitForVerification(epdId: string, consultantEmail?: string): Promise<{ error: string | null }> {
    try {
      await this.updateEPDStatus(epdId, 'submitted_for_review');
      console.log(`EPD ${epdId} submitted for verification to ${consultantEmail || 'default consultant'}`);
      return { error: null };
    } catch (error) {
      console.error('Error submitting EPD for verification:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
