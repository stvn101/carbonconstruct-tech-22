
import { materialCarbonFactors } from '@/lib/carbonFactors';
import { ExtendedMaterialData } from './materialTypes';

// Re-export types and constants
export * from './materialTypes';

// Export constants - use the correct import name
export const MATERIAL_FACTORS = materialCarbonFactors;

// Define material types enum
export const MATERIAL_TYPES = {
  CONCRETE: 'concrete',
  STEEL: 'steel',
  TIMBER: 'timber',
  GLASS: 'glass',
  BRICK: 'brick',
  INSULATION: 'insulation',
  ALUMINUM: 'aluminum',
  PLASTIC: 'plastic',
  COPPER: 'copper',
  GYPSUM: 'gypsum',
  RECYCLED: 'recycled',
  SUSTAINABLE: 'sustainable',
  NATURAL: 'natural'
} as const;

export const REGIONS = {
  AUSTRALIA: 'Australia',
  EUROPE: 'Europe',
  NORTH_AMERICA: 'North America',
  ASIA: 'Asia',
  GLOBAL: 'Global'
} as const;

// Create and export extended materials data with proper typing
export const EXTENDED_MATERIALS: Record<string, ExtendedMaterialData> = Object.entries(materialCarbonFactors).reduce((acc, [key, factor]) => {
  // Transform to ExtendedMaterialData format with proper typing
  acc[key] = {
    name: key,  // Use key as name since materialCarbonFactors is just numbers
    factor,
    unit: 'kg',
    region: 'Australia',
    tags: ['construction'],
    sustainabilityScore: Math.floor(Math.random() * 40) + 60,
    recyclability: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low',
    alternativeTo: undefined,
    notes: ''
  };
  return acc;
}, {} as Record<string, ExtendedMaterialData>);

// Helper function to filter materials
export const filterMaterials = (predicate: (material: ExtendedMaterialData) => boolean): ExtendedMaterialData[] => {
  return Object.values(EXTENDED_MATERIALS).filter(predicate);
};
