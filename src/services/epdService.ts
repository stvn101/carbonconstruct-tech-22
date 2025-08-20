import { supabase } from "@/integrations/supabase/client";
import {
  EPDRecord,
  EPDFormData,
  EPDCalculationResult,
  EPDStage,
} from "@/types/epd";

export class EPDService {
  // Create new EPD record
  static async createEPD(
    formData: EPDFormData,
  ): Promise<{ data: unknown | null; error: string | null }> {
    try {
      const calculation = await this.calculateEPD(formData);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("epd_records")
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
          data_sources: this.extractDataSources(formData) as any,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert stage emissions for detailed tracking
      if (data) {
        await this.insertStageEmissions(data.id, calculation.stages);
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Calculate EPD lifecycle emissions
  static async calculateEPD(
    formData: EPDFormData,
  ): Promise<EPDCalculationResult> {
    const stages: Record<EPDStage, number> = {
      // A1-A3: Production stages
      A1: this.calculateA1(formData), // Raw material supply
      A2: this.calculateA2(formData), // Transport to manufacturer
      A3: this.calculateA3(formData), // Manufacturing

      // A4-A5: Construction stages
      A4: this.calculateA4(formData), // Transport to site
      A5: this.calculateA5(formData), // Installation

      // B1-B7: Use stages
      B1: 0, // Use
      B2: 0, // Maintenance
      B3: 0, // Repair
      B4: 0, // Replacement
      B5: 0, // Refurbishment
      B6: 0, // Operational energy use
      B7: 0, // Operational water use

      // C1-C4: End-of-life stages
      C1: this.calculateC1(formData), // Deconstruction
      C2: this.calculateC2(formData), // Transport to waste processing
      C3: this.calculateC3(formData), // Waste processing
      C4: this.calculateC4(formData), // Disposal

      // D: Benefits beyond system boundary
      D: this.calculateD(formData),
    };

    const total_co2e = Object.values(stages).reduce((sum, value) => sum + value, 0);

    // Calculate GWP components (simplified)
    const gwp_fossil = total_co2e * 0.85; // Assume 85% fossil
    const gwp_biogenic = total_co2e * 0.1; // Assume 10% biogenic
    const gwp_total = gwp_fossil + gwp_biogenic;

    const breakdown = {
      production: stages.A1 + stages.A2 + stages.A3,
      construction: stages.A4 + stages.A5,
      use:
        stages.B1 +
        stages.B2 +
        stages.B3 +
        stages.B4 +
        stages.B5 +
        stages.B6 +
        stages.B7,
      end_of_life: stages.C1 + stages.C2 + stages.C3 + stages.C4,
      benefits: stages.D,
    };

    return {
      stages,
      total_co2e,
      gwp_fossil,
      gwp_biogenic,
      gwp_total,
      breakdown,
    };
  }

  // A1: Raw material supply
  private static calculateA1(formData: EPDFormData): number {
    return formData.materials.reduce((sum, material) => {
      return sum + material.quantity * material.carbon_footprint;
    }, 0);
  }

  // A2: Transport to manufacturer
  private static calculateA2(formData: EPDFormData): number {
    const transportFactor = this.getTransportFactor(
      formData.transport.mode,
      formData.transport.fuel_type,
    );
    const totalWeight = formData.materials.reduce((sum, m) => sum + m.quantity, 0);
    return (formData.transport.distance * totalWeight * transportFactor) / 1000; // Convert to kg CO2e
  }

  // A3: Manufacturing
  private static calculateA3(formData: EPDFormData): number {
    const energyEmissions =
      formData.energy.electricity * 0.82 + formData.energy.gas * 0.18; // kg CO2e/kWh
    const renewableReduction =
      energyEmissions * (formData.energy.renewable_percentage / 100);
    return energyEmissions - renewableReduction;
  }

  // A4: Transport to construction site
  private static calculateA4(formData: EPDFormData): number {
    // Assume average 50km transport to site
    const distance = 50;
    const transportFactor = 0.62; // kg CO2e/tonne.km for truck transport
    const totalWeight = formData.materials.reduce((sum, m) => sum + m.quantity, 0);
    return (distance * totalWeight * transportFactor) / 1000;
  }

  // A5: Installation process
  private static calculateA5(formData: EPDFormData): number {
    // Simplified: 5% of material emissions for installation
    return this.calculateA1(formData) * 0.05;
  }

  // C1: Deconstruction/demolition
  private static calculateC1(formData: EPDFormData): number {
    // Assume 2% of material emissions for deconstruction
    return this.calculateA1(formData) * 0.02;
  }

  // C2: Transport to waste processing
  private static calculateC2(formData: EPDFormData): number {
    // Assume 25km average transport to waste facility
    const distance = 25;
    const transportFactor = 0.62;
    const totalWeight = formData.materials.reduce((sum, m) => sum + m.quantity, 0);
    return (distance * totalWeight * transportFactor) / 1000;
  }

  // C3: Waste processing
  private static calculateC3(formData: EPDFormData): number {
    const totalEmissions = this.calculateA1(formData);
    const recyclingCredit =
      totalEmissions * (formData.waste.recycling_rate / 100) * 0.1;
    const incinerationEmissions =
      totalEmissions * (formData.waste.incineration_rate / 100) * 0.05;
    return incinerationEmissions - recyclingCredit;
  }

  // C4: Final disposal
  private static calculateC4(formData: EPDFormData): number {
    const totalEmissions = this.calculateA1(formData);
    return totalEmissions * (formData.waste.landfill_rate / 100) * 0.02;
  }

  // D: Benefits beyond system boundary
  private static calculateD(formData: EPDFormData): number {
    const totalEmissions = this.calculateA1(formData);
    return -(totalEmissions * (formData.waste.recycling_rate / 100) * 0.15); // Negative = benefit
  }

  private static getTransportFactor(mode: string, fuelType: string): number {
    const factors: Record<string, Record<string, number>> = {
      truck: { diesel: 0.62, electric: 0.31 },
      rail: { diesel: 0.22, electric: 0.14 },
      ship: { diesel: 0.11, electric: 0.08 },
    };
    return factors[mode]?.[fuelType] || 0.62;
  }

  private static extractDataSources(formData: EPDFormData): string[] {
    return [
      "CarbonConstruct Materials Database",
      "EN 15804 Standard Factors",
      "Manufacturer Declarations",
    ];
  }

  private static async insertStageEmissions(
    epdId: string,
    stages: Record<EPDStage, number>,
  ) {
    const emissions = Object.entries(stages).map(([stage, value]) => ({
      epd_record_id: epdId,
      stage: stage as EPDStage,
      co2e_value: value,
      description: this.getStageDescription(stage as EPDStage),
      data_source: "CarbonConstruct Calculation Engine",
    }));

    await supabase.from("epd_stage_emissions").insert(emissions);
  }

  private static getStageDescription(stage: EPDStage): string {
    const descriptions: Record<EPDStage, string> = {
      A1: "Raw material supply",
      A2: "Transport to manufacturer",
      A3: "Manufacturing",
      A4: "Transport to construction site",
      A5: "Installation process",
      B1: "Use",
      B2: "Maintenance",
      B3: "Repair",
      B4: "Replacement",
      B5: "Refurbishment",
      B6: "Operational energy use",
      B7: "Operational water use",
      C1: "Deconstruction/demolition",
      C2: "Transport to waste processing",
      C3: "Waste processing",
      C4: "Final disposal",
      D: "Benefits beyond system boundary",
    };
    return descriptions[stage];
  }

  // Get single EPD record
  static async getEPD(
    id: string,
  ): Promise<{ data: EPDRecord | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from("epd_records")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data: data as unknown as EPDRecord, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get user's EPD records
  static async getUserEPDs(): Promise<{
    data: unknown[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await supabase
        .from("epd_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Update EPD status
  static async updateEPDStatus(
    id: string,
    status: string,
  ): Promise<{ error: string | null }> {
    try {
      const updateData: unknown = { status };

      if (status === "submitted_for_review") {
        (updateData as any).submitted_at = new Date().toISOString();
      } else if (status === "verified") {
        (updateData as any).verified_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("epd_records")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Submit EPD for verification
  static async submitForVerification(
    epdId: string,
    consultantEmail?: string,
  ): Promise<{ error: string | null }> {
    try {
      // Update status to submitted
      await this.updateEPDStatus(epdId, "submitted_for_review");

      // Get EPD details for email
      const { data: epdData, error: epdError } = await this.getEPD(epdId);
      if (epdError || !epdData) {
        throw new Error(`Failed to get EPD data: ${epdError}`);
      }

      // Send email notifications
      await this.sendVerificationNotifications(epdData, consultantEmail);

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send verification notifications
  private static async sendVerificationNotifications(
    epdData: EPDRecord,
    consultantEmail?: string,
  ): Promise<void> {
    try {
      // Import email service dynamically to avoid circular dependencies
      const { sendEmail } = await import("@/utils/email/emailService");

      // Send notification to LCA consultant if provided
      if (consultantEmail) {
        await this.sendConsultantNotification(epdData, consultantEmail, sendEmail);
      }

      // Send notification to internal verification team
      await this.sendInternalNotification(epdData, sendEmail);

      // Send confirmation to user
      await this.sendUserConfirmation(epdData, sendEmail);

    } catch (error) {
      console.error("Failed to send verification notifications:", error);
      // Don't throw error - email failure shouldn't prevent EPD submission
    }
  }

  // Send notification to LCA consultant
  private static async sendConsultantNotification(
    epdData: EPDRecord,
    consultantEmail: string,
    sendEmail: any,
  ): Promise<void> {
    const subject = `New EPD Verification Request - ${epdData.product_name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New EPD Verification Request</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Project Details</h3>
          <p><strong>Product Name:</strong> ${epdData.product_name}</p>
          <p><strong>EPD ID:</strong> ${epdData.id}</p>
          <p><strong>Submitted:</strong> ${new Date(epdData.created_at).toLocaleDateString()}</p>
          <p><strong>Total CO₂e:</strong> ${epdData.total_co2e?.toFixed(2) || 'N/A'} kg CO₂e</p>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #92400e;">Action Required</h4>
          <p>Please review this EPD for verification. You can access the full details through the CarbonConstruct platform.</p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          This is an automated notification from CarbonConstruct. Please do not reply to this email.
        </p>
      </div>
    `;

    await sendEmail({
      to: consultantEmail,
      subject,
      html,
    });
  }

  // Send notification to internal verification team
  private static async sendInternalNotification(
    epdData: EPDRecord,
    sendEmail: any,
  ): Promise<void> {
    const subject = `EPD Submitted for Review - ${epdData.product_name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">EPD Submitted for Review</h2>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Submission Details</h3>
          <p><strong>Product Name:</strong> ${epdData.product_name}</p>
          <p><strong>EPD ID:</strong> ${epdData.id}</p>
          <p><strong>Submitted By:</strong> ${epdData.submitted_by}</p>
          <p><strong>Submitted:</strong> ${new Date(epdData.created_at).toLocaleDateString()}</p>
          <p><strong>Total CO₂e:</strong> ${epdData.total_co2e?.toFixed(2) || 'N/A'} kg CO₂e</p>
        </div>

        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #1e40af;">Next Steps</h4>
          <ul>
            <li>Review EPD calculations and methodology</li>
            <li>Verify data sources and assumptions</li>
            <li>Check compliance with relevant standards</li>
            <li>Update status in the platform</li>
          </ul>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          Internal notification from CarbonConstruct verification system.
        </p>
      </div>
    `;

    // Send to internal verification team (configure in environment)
    const internalEmail = import.meta.env.VITE_VERIFICATION_TEAM_EMAIL || "verification@carbonconstruct.com";
    
    await sendEmail({
      to: internalEmail,
      subject,
      html,
    });
  }

  // Send confirmation to user
  private static async sendUserConfirmation(
    epdData: EPDRecord,
    sendEmail: any,
  ): Promise<void> {
    const subject = `EPD Submission Confirmation - ${epdData.product_name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">EPD Submission Confirmed</h2>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your EPD has been submitted for verification</h3>
          <p><strong>Product Name:</strong> ${epdData.product_name}</p>
          <p><strong>EPD ID:</strong> ${epdData.id}</p>
          <p><strong>Submission Date:</strong> ${new Date(epdData.created_at).toLocaleDateString()}</p>
          <p><strong>Total CO₂e:</strong> ${epdData.total_co2e?.toFixed(2) || 'N/A'} kg CO₂e</p>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #92400e;">What happens next?</h4>
          <ol>
            <li>Our verification team will review your EPD</li>
            <li>We may request additional information if needed</li>
            <li>You'll receive updates on the verification status</li>
            <li>Once verified, your EPD will be available for use</li>
          </ol>
        </div>

        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #1e40af;">Need help?</h4>
          <p>If you have any questions about your EPD submission, please contact our support team.</p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          Thank you for using CarbonConstruct for your sustainability reporting needs.
        </p>
      </div>
    `;

    // Get user email from the EPD record or user profile
    // This would need to be implemented based on your user management system
    const userEmail = "user@example.com"; // Placeholder - would get from user context
    
    await sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }
}
