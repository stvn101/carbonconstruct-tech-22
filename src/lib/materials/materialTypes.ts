export interface ExtendedMaterialData {
  id?: string;
  name?: string;
  factor?: number;
  unit?: string;
  region?: string;
  tags?: string[];
  sustainabilityScore?: number;
  recyclability?: 'High' | 'Medium' | 'Low';
  alternativeTo?: string;
  notes?: string;
  category?: string;
  carbon_footprint_kgco2e_kg?: number;
  carbon_footprint_kgco2e_tonne?: number;
  description?: string;
  
  // Enhanced unified database fields with Scope 1, 2, 3 emissions
  co2e_min?: number;
  co2e_max?: number;
  co2e_avg?: number;
  source?: string;
  sustainability_notes?: string;
  applicable_standards?: string;
  ncc_requirements?: string;
  material_type?: string;
  category_id?: number;
  created_at?: string;
  updated_at?: string;
  sustainability_score_is_manual?: boolean;
  green_star_compliant?: boolean;
  green_star_rpv_score?: number;
  green_star_categories?: string[];
  
  // New Scope 1, 2, 3 emissions tracking
  emission_scope?: string;
  scope1_emissions?: number;
  scope2_emissions?: number;
  scope3_emissions?: number;
  lifecycle_stage?: string;
  carbon_intensity_category?: 'low' | 'medium' | 'high';
  environmental_impact_score?: number;
  local_availability?: boolean;
  certification_standards?: string[];
  embodied_energy_mj_kg?: number;
  water_usage_liters_kg?: number;
  end_of_life_options?: string[];
  transport_emissions_kgco2e_km?: number;
  
  // EPD fields
  epd_registration_number?: string;
  epd_publisher?: string;
  epd_validity_date?: string;
  verification_status?: string;
  data_quality_rating?: number;
  source_hierarchy_level?: string;
}

export enum MATERIAL_TYPES {
  CONCRETE = 'concrete',
  STEEL = 'steel',
  TIMBER = 'timber',
  GLASS = 'glass',
  BRICK = 'brick',
  INSULATION = 'insulation',
  ALUMINUM = 'aluminum',
  PLASTIC = 'plastic',
  COPPER = 'copper',
  GYPSUM = 'gypsum'
}

export enum REGIONS {
  AUSTRALIA = 'Australia',
  EUROPE = 'Europe',
  NORTH_AMERICA = 'North America',
  ASIA = 'Asia',
  GLOBAL = 'Global'
}

export type MaterialsByRegion = Record<string, number>;
export type MaterialOption = {
  id: string;
  name: string;
};

// Fixed SimpleFetchResult interface
export interface SimpleFetchResult {
  materials: ExtendedMaterialData[];
  error?: Error | null;
  source?: 'cache' | 'database' | 'fallback';
  totalCount: number;
  dbCount?: number;        // Total count from database
  filteredCount?: number; // Number of materials filtered out
}
