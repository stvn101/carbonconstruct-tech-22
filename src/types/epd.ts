export type EPDStatus = 'draft' | 'submitted_for_review' | 'verified' | 'published' | 'archived';

export type EPDStage = 
  | 'A1' | 'A2' | 'A3' | 'A4' | 'A5'
  | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7'
  | 'C1' | 'C2' | 'C3' | 'C4'
  | 'D';

export interface EPDStageData {
  stage: EPDStage;
  co2e_value: number;
  description?: string;
  data_source?: string;
}

export interface EPDRecord {
  id: string;
  material_id?: string;
  company_id?: string;
  submitted_by: string;
  
  // Product information
  product_name: string;
  product_description?: string;
  functional_unit: string;
  manufacturer_name: string;
  manufacturer_location?: string;
  manufacturer_abn?: string;
  
  // LCA data
  epd_stage_data: Record<EPDStage, EPDStageData>;
  total_co2e?: number;
  gwp_fossil?: number;
  gwp_biogenic?: number;
  gwp_total?: number;
  
  // Metadata
  version_number: number;
  status: EPDStatus;
  iso_compliant: boolean;
  verification_status: string;
  data_sources: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  verified_at?: string;
}

export interface EPDFormData {
  // Step 1: Product Description
  product_name: string;
  product_description: string;
  functional_unit: string;
  
  // Step 2: Manufacturer Details
  manufacturer_name: string;
  manufacturer_location: string;
  manufacturer_abn: string;
  
  // Step 3: Material Breakdown
  materials: Array<{
    material_id?: string;
    name: string;
    quantity: number;
    unit: string;
    carbon_footprint: number;
  }>;
  
  // Step 4: Transport & Energy
  transport: {
    mode: string;
    distance: number;
    fuel_type: string;
  };
  
  energy: {
    electricity: number;
    gas: number;
    renewable_percentage: number;
  };
  
  // Step 5: Waste Scenarios
  waste: {
    recycling_rate: number;
    landfill_rate: number;
    incineration_rate: number;
  };
}

export interface EPDCalculationResult {
  stages: Record<EPDStage, number>;
  total_co2e: number;
  gwp_fossil: number;
  gwp_biogenic: number;
  gwp_total: number;
  breakdown: {
    production: number; // A1-A3
    construction: number; // A4-A5
    use: number; // B1-B7
    end_of_life: number; // C1-C4
    benefits: number; // D
  };
}