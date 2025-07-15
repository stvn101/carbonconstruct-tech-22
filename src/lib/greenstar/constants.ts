
/**
 * Green Star Calculator Constants and Default Configurations
 */

export const DEFAULT_THRESHOLDS = {
  GOOD_PRACTICE: 60,
  BEST_PRACTICE: 85,
  MINIMUM_RPV: 10
};

export const BUILDING_LAYERS = {
  STRUCTURE: 'Structure',
  ENVELOPE: 'Envelope', 
  SYSTEMS: 'Systems',
  FINISHES: 'Finishes'
} as const;

export const ACHIEVEMENT_LEVELS = {
  NONE: 'None',
  GOOD_PRACTICE: 'Good Practice',
  BEST_PRACTICE: 'Best Practice'
} as const;

export const CREDIT_TYPES = {
  // Responsible Category
  CORPORATE_COMMITMENT_CLIMATE: 'Corporate Commitment on Climate',
  ENVIRONMENTAL_MANAGEMENT: 'Environmental Management',
  CARBON_EMISSIONS_DISCLOSURE: 'Carbon Emissions Disclosure',
  SOCIALLY_RESPONSIBLE_EXTRACTION: 'Socially Responsible Extraction of Resources',
  TRANSPARENT_CHAIN_CUSTODY: 'Transparent Chain of Custody',
  ENVIRONMENTAL_IMPACT_DISCLOSURE: 'Environmental Impact Disclosure',
  
  // Healthy Category
  OCCUPANT_HEALTH_SAFETY: 'Occupant Health and Safety',
  CHEMICALS_OF_CONCERN: 'Chemicals of Concern',
  HEALTH_IMPACTS_DISCLOSURE: 'Health Impacts Disclosure',
  INGREDIENT_DISCLOSURE: 'Ingredient Disclosure',
  
  // Positive Category
  ENERGY_USE_REDUCTION: 'Energy Use Reduction',
  ENERGY_SOURCE: 'Energy Source',
  IMPACTS_TO_NATURE: 'Impacts to Nature',
  
  // Circular Category
  MATERIAL_EXTRACTION_IMPACT_REDUCTION: 'Material Extraction Impact Reduction',
  CARBON_EMISSIONS_REDUCTION: 'Carbon Emissions Reduction',
  WATER_USE_REDUCTION: 'Water Use Reduction',
  WASTE_GENERATION_REDUCTION: 'Waste Generation Reduction',
  PACKAGING: 'Packaging'
} as const;
