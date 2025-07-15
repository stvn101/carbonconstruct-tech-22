
import { Material } from "./carbonTypes";
import { MaterialInput } from "./carbonExports";

export enum MaterialCategoryEnum {
  CONCRETE = 'concrete',
  STEEL = 'steel',
  TIMBER = 'timber',
  BRICK = 'brick',
  ALUMINUM = 'aluminum',
  GLASS = 'glass',
  INSULATION = 'insulation',
  OTHER = 'other',
  WOOD = 'wood' // Added wood as an alias for timber for compatibility
}

export const MATERIAL_UNITS = [
  'kg',
  'tonne',
  'm²',
  'm³',
  'unit',
  'litre'
];

export interface SustainableMaterial {
  id: string;
  name: string;
  carbonFootprint: number;
  quantity?: number;
  category?: string;
  unit?: string;
  sustainabilityScore: number; // 0-100
  alternativeTo?: string; // ID of material this is an alternative to
  carbonReduction: number; // percentage reduction compared to conventional
  costDifference?: number; // percentage difference (+/- %)
  availability?: 'low' | 'medium' | 'high';
  recyclable?: boolean;
  recycledContent?: number; // percentage
  locallySourced?: boolean;
}

// Add available materials function
export function getAvailableMaterials() {
  return [
    { name: 'Concrete', factor: 0.12 },
    { name: 'Steel', factor: 1.85 },
    { name: 'Timber', factor: 0.03 },
    { name: 'Glass', factor: 0.85 },
    { name: 'Brick', factor: 0.24 },
    { name: 'Aluminum', factor: 9.16 },
    { name: 'Plastic', factor: 3.1 },
    { name: 'Insulation', factor: 1.35 },
    { name: 'Recycled Concrete', factor: 0.08 },
    { name: 'Recycled Steel', factor: 1.2 },
    { name: 'Bamboo', factor: 0.02 },
    { name: 'Hemp Crete', factor: 0.05 }
  ];
}

// Add material factor function
export function getMaterialFactor(materialType: string): number {
  const materials = getAvailableMaterials();
  const material = materials.find(m => m.name === materialType);
  return material?.factor || 0;
}

// Updated MaterialAnalysisResult interface to include all properties used in SustainabilityAnalyzer
export interface MaterialAnalysisResult {
  materialScores?: Record<string, number>;
  impactSummary?: string;
  highImpactMaterials?: { id: string; name: string; carbonFootprint: number; quantity?: number; }[];
  sustainabilityScore?: number;
  sustainabilityPercentage?: number;
  recommendations?: string[];
  alternatives?: Record<string, SustainableMaterial[]>;
  sustainabilityIssues?: { id: string; title: string; description: string; recommendation: string; }[];
  // Update categories to use MaterialInput[] instead of string[]
  categories?: Record<string, MaterialInput[]>;
  materialCount?: number;
  sustainabilityStrengths?: { id: string; title: string; description: string; impact: string; }[];
  averageCarbonFootprint?: number;
  materialWithHighestFootprint?: any;
}

/**
 * Generates a material analysis based on the provided materials data
 */
export function generateMaterialAnalysis(materials: {
  id: string;
  name: string;
  carbon_footprint_kgco2e_kg?: number;
  quantity?: number;
}[]): MaterialAnalysisResult {
  if (!materials || materials.length === 0) {
    return {
      highImpactMaterials: [],
      sustainabilityScore: 0,
      sustainabilityPercentage: 0,
      recommendations: [],
      alternatives: {}
    };
  }

  // Sort materials by carbon footprint (highest first)
  const sortedMaterials = [...materials].sort((a, b) => 
    (b.carbon_footprint_kgco2e_kg || 0) - (a.carbon_footprint_kgco2e_kg || 0)
  );

  // Identify high impact materials (top 3 or materials with high carbon footprint)
  const highImpactMaterials = sortedMaterials
    .slice(0, Math.min(3, sortedMaterials.length))
    .map(m => ({
      id: m.id,
      name: m.name,
      carbonFootprint: m.carbon_footprint_kgco2e_kg || 0,
      quantity: m.quantity
    }));

  // Calculate sustainability score based on various factors
  // For simplicity, generate a score between 0-100
  // This could be enhanced with more sophisticated logic
  const avgCarbonFootprint = materials.reduce((sum, m) => sum + (m.carbon_footprint_kgco2e_kg || 0), 0) / materials.length;
  const sustainabilityScore = Math.max(0, Math.min(100, 100 - (avgCarbonFootprint * 10)));
  
  // Calculate percentage of sustainable materials (simplified calculation)
  // In a real app, this would be based on material properties
  const sustainableMaterialCount = materials.filter(m => (m.carbon_footprint_kgco2e_kg || 0) < 0.8).length;
  const sustainabilityPercentage = (sustainableMaterialCount / materials.length) * 100;

  // Generate generic recommendations
  const recommendations = [
    "Consider replacing high-carbon materials with sustainable alternatives",
    "Source materials locally to reduce transportation emissions",
    "Increase the percentage of recycled content in your materials",
    "Implement circular economy practices by selecting recyclable materials"
  ];

  return {
    highImpactMaterials,
    sustainabilityScore,
    sustainabilityPercentage,
    recommendations,
    alternatives: {}, // This would be populated by actual alternatives data
    materialScores: {},
    impactSummary: `Analysis based on ${materials.length} materials with average carbon footprint of ${avgCarbonFootprint.toFixed(2)} kg CO2e/kg`
  };
}
