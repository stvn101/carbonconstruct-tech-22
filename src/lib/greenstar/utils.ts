
import { BuildingLayer, AchievementLevel } from './calculator';

export interface BuildingLayerInfo {
  label: string;
  description: string;
  typicalMaterials: string[];
  weight: number;
}

export const BUILDING_LAYER_INFO: Record<BuildingLayer, BuildingLayerInfo> = {
  [BuildingLayer.STRUCTURE]: {
    label: 'Structure',
    description: 'Structural elements including foundations, frames, and load-bearing components',
    typicalMaterials: ['Steel', 'Concrete', 'Timber', 'Masonry'],
    weight: 0.4
  },
  [BuildingLayer.ENVELOPE]: {
    label: 'Envelope', 
    description: 'Building envelope including walls, roofing, and exterior elements',
    typicalMaterials: ['Insulation', 'Cladding', 'Windows', 'Roofing'],
    weight: 0.3
  },
  [BuildingLayer.SYSTEMS]: {
    label: 'Systems',
    description: 'Building systems including HVAC, electrical, and plumbing',
    typicalMaterials: ['HVAC Equipment', 'Electrical Systems', 'Plumbing', 'Fire Systems'],
    weight: 0.2
  },
  [BuildingLayer.FINISHES]: {
    label: 'Finishes',
    description: 'Interior and exterior finishes and fixtures',
    typicalMaterials: ['Flooring', 'Wall Finishes', 'Fixtures', 'Furniture'],
    weight: 0.1
  }
};

export function getAchievementLevelColor(level: AchievementLevel): string {
  switch (level) {
    case AchievementLevel.BEST_PRACTICE:
      return 'bg-green-100 text-green-800 border-green-300';
    case AchievementLevel.GOOD_PRACTICE:
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getComplianceColor(percentage: number): string {
  if (percentage >= 85) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateWeightedScore(layerScores: Record<BuildingLayer, number>): number {
  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(layerScores).forEach(([layer, score]) => {
    const layerInfo = BUILDING_LAYER_INFO[layer as BuildingLayer];
    if (layerInfo) {
      totalScore += score * layerInfo.weight;
      totalWeight += layerInfo.weight;
    }
  });

  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

export function getBuildingLayerSuggestions(layer: BuildingLayer): string[] {
  const info = BUILDING_LAYER_INFO[layer];
  return info ? info.typicalMaterials : [];
}

export function validateMaterialInput(material: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!material.name || material.name.trim().length === 0) {
    errors.push('Material name is required');
  }
  
  if (!material.quantity || material.quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }
  
  if (!material.cost || material.cost < 0) {
    errors.push('Cost must be 0 or greater');
  }
  
  if (!material.buildingLayer) {
    errors.push('Building layer selection is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
