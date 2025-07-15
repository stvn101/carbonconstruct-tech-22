
import { MaterialInput } from '@/lib/carbonExports';

export const calculateSustainabilityScore = (material: MaterialInput): number => {
  // Simple scoring based on material type
  const scores: Record<string, number> = {
    timber: 85,
    bamboo: 90,
    recycled_steel: 80,
    concrete: 45,
    steel: 35,
    aluminum: 40,
    plastic: 25
  };
  
  return scores[material.type] || 50;
};

export const getCategoryFromType = (type: string): string => {
  const categories: Record<string, string> = {
    concrete: 'Structural',
    steel: 'Structural', 
    timber: 'Structural',
    aluminum: 'Metal',
    plastic: 'Synthetic',
    glass: 'Glazing',
    brick: 'Masonry'
  };
  
  return categories[type] || 'Other';
};

export const calculatePotentialReduction = (original: MaterialInput, alternative: any): number => {
  // Mock calculation - in reality this would be based on actual carbon factors
  return Math.floor(Math.random() * 30) + 10; // 10-40% reduction
};

export const determineCostImpact = (alternative: any): 'lower' | 'similar' | 'higher' => {
  const impacts = ['lower', 'similar', 'higher'] as const;
  return impacts[Math.floor(Math.random() * impacts.length)];
};

export const determineAvailability = (alternative: any): 'low' | 'medium' | 'high' => {
  const levels = ['low', 'medium', 'high'] as const;
  return levels[Math.floor(Math.random() * levels.length)];
};

export const generateRecommendationDetails = (original: MaterialInput, alternative: any): string => {
  return `Consider replacing ${original.type} with ${alternative.name} for improved sustainability performance.`;
};
