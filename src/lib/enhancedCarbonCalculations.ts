import { materialDatabaseService } from '@/services/materialDatabaseService';
import { SelectedMaterial } from '@/components/calculator/materials/MaterialSelector';
import { MaterialInput, TransportInput, EnergyInput } from './carbonTypes';

export interface EnhancedCalculationInput {
  materials: SelectedMaterial[];
  transport: TransportInput[];
  energy: EnergyInput[];
}

export interface EnhancedCalculationResult {
  totalEmissions: number;
  materialEmissions: number;
  transportEmissions: number;
  energyEmissions: number;
  breakdown: {
    materials: number;
    transport: number;
    energy: number;
  };
  materialDetails: MaterialCalculationDetail[];
  recommendations: string[];
  sustainability: {
    score: number;
    greenStarCompliant: boolean;
    recyclabilityScore: number;
    confidence: number;
  };
}

export interface MaterialCalculationDetail {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  carbonFactor: number;
  emissions: number;
  confidence: number;
  alternatives: AlternativeRecommendation[];
  sustainabilityFeatures: string[];
}

export interface AlternativeRecommendation {
  name: string;
  carbonReduction: number;
  carbonFactor: number;
  costImpact?: string;
  benefits: string[];
}

/**
 * Enhanced carbon calculation that uses the material database
 */
export const calculateEnhancedEmissions = async (
  input: EnhancedCalculationInput
): Promise<EnhancedCalculationResult> => {
  const materialDetails: MaterialCalculationDetail[] = [];
  let totalMaterialEmissions = 0;
  let totalSustainabilityScore = 0;
  let totalConfidence = 0;
  let greenStarCompliantCount = 0;
  let recyclingScore = 0;

  // Process each selected material
  for (const selectedMaterial of input.materials) {
    const emissions = selectedMaterial.quantity * selectedMaterial.carbonFactor;
    totalMaterialEmissions += emissions;
    
    // Get alternatives for this material
    const alternatives = await materialDatabaseService.findAlternatives(
      selectedMaterial.material.material_type || selectedMaterial.material.name || '',
      selectedMaterial.id
    );

    const alternativeRecommendations: AlternativeRecommendation[] = alternatives.map(alt => {
      const altFactor = alt.carbon_footprint_kgco2e_kg || selectedMaterial.carbonFactor;
      const reduction = ((selectedMaterial.carbonFactor - altFactor) / selectedMaterial.carbonFactor) * 100;
      
      return {
        name: alt.name || '',
        carbonFactor: altFactor,
        carbonReduction: reduction,
        costImpact: reduction > 0 ? 'Similar or lower cost' : 'May increase cost',
        benefits: [
          ...(alt.green_star_compliant ? ['Green Star Compliant'] : []),
          ...(alt.recyclability === 'High' ? ['Highly Recyclable'] : []),
          ...(alt.local_availability ? ['Locally Available'] : [])
        ]
      };
    });

    // Build sustainability features
    const sustainabilityFeatures: string[] = [];
    if (selectedMaterial.material.green_star_compliant) {
      sustainabilityFeatures.push('Green Star Compliant');
      greenStarCompliantCount++;
    }
    if (selectedMaterial.material.recyclability === 'High') {
      sustainabilityFeatures.push('Highly Recyclable');
      recyclingScore += 100;
    } else if (selectedMaterial.material.recyclability === 'Medium') {
      sustainabilityFeatures.push('Moderately Recyclable');
      recyclingScore += 60;
    } else {
      recyclingScore += 20;
    }
    if (selectedMaterial.material.local_availability) {
      sustainabilityFeatures.push('Locally Available');
    }
    if (selectedMaterial.material.certification_standards?.length) {
      sustainabilityFeatures.push(`Certified: ${selectedMaterial.material.certification_standards.join(', ')}`);
    }

    materialDetails.push({
      id: selectedMaterial.id,
      name: selectedMaterial.material.name || '',
      quantity: selectedMaterial.quantity,
      unit: selectedMaterial.unit,
      carbonFactor: selectedMaterial.carbonFactor,
      emissions,
      confidence: selectedMaterial.confidence,
      alternatives: alternativeRecommendations,
      sustainabilityFeatures
    });

    totalSustainabilityScore += selectedMaterial.material.sustainabilityScore || 50;
    totalConfidence += selectedMaterial.confidence;
  }

  // Calculate transport emissions (enhanced with verification)
  let transportEmissions = 0;
  for (const transport of input.transport) {
    const distance = Number(transport.distance) || 0;
    const weight = Number(transport.weight) || 0;
    const factor = transport.factor || getTransportFactor(transport.type);
    transportEmissions += distance * weight * factor / 1000;
  }

  // Calculate energy emissions
  let energyEmissions = 0;
  for (const energy of input.energy) {
    const amount = Number(energy.amount) || 0;
    const factor = energy.factor || getEnergyFactor(energy.type);
    energyEmissions += amount * factor;
  }

  const totalEmissions = totalMaterialEmissions + transportEmissions + energyEmissions;

  // Generate recommendations
  const recommendations = generateRecommendations(materialDetails, {
    totalEmissions,
    materialEmissions: totalMaterialEmissions,
    transportEmissions,
    energyEmissions
  });

  // Calculate overall sustainability metrics
  const avgSustainabilityScore = input.materials.length > 0 
    ? totalSustainabilityScore / input.materials.length 
    : 0;
  const avgConfidence = input.materials.length > 0 
    ? totalConfidence / input.materials.length 
    : 0;
  const greenStarCompliant = greenStarCompliantCount / Math.max(input.materials.length, 1) >= 0.8;
  const avgRecyclingScore = input.materials.length > 0 
    ? recyclingScore / input.materials.length 
    : 0;

  return {
    totalEmissions,
    materialEmissions: totalMaterialEmissions,
    transportEmissions,
    energyEmissions,
    breakdown: {
      materials: (totalMaterialEmissions / totalEmissions) * 100 || 0,
      transport: (transportEmissions / totalEmissions) * 100 || 0,
      energy: (energyEmissions / totalEmissions) * 100 || 0
    },
    materialDetails,
    recommendations,
    sustainability: {
      score: avgSustainabilityScore,
      greenStarCompliant,
      recyclabilityScore: avgRecyclingScore,
      confidence: avgConfidence
    }
  };
};

function generateRecommendations(
  materialDetails: MaterialCalculationDetail[],
  emissions: { totalEmissions: number; materialEmissions: number; transportEmissions: number; energyEmissions: number }
): string[] {
  const recommendations: string[] = [];

  // Material-based recommendations
  const highImpactMaterials = materialDetails
    .filter(m => m.emissions > emissions.materialEmissions * 0.2)
    .sort((a, b) => b.emissions - a.emissions);

  if (highImpactMaterials.length > 0) {
    const topMaterial = highImpactMaterials[0];
    recommendations.push(
      `Consider alternatives for ${topMaterial.name} (${(topMaterial.emissions/1000).toFixed(1)}t CO₂-e)`
    );
    
    if (topMaterial.alternatives.length > 0) {
      const bestAlternative = topMaterial.alternatives
        .filter(alt => alt.carbonReduction > 0)
        .sort((a, b) => b.carbonReduction - a.carbonReduction)[0];
      
      if (bestAlternative) {
        recommendations.push(
          `Switch to ${bestAlternative.name} for ${bestAlternative.carbonReduction.toFixed(1)}% carbon reduction`
        );
      }
    }
  }

  // Low confidence materials
  const lowConfidenceMaterials = materialDetails.filter(m => m.confidence < 60);
  if (lowConfidenceMaterials.length > 0) {
    recommendations.push(
      `Verify carbon data for ${lowConfidenceMaterials.length} material(s) with low confidence ratings`
    );
  }

  // Transport recommendations
  if (emissions.transportEmissions > emissions.totalEmissions * 0.15) {
    recommendations.push('Consider local sourcing to reduce transport emissions');
  }

  // Energy recommendations
  if (emissions.energyEmissions > emissions.totalEmissions * 0.3) {
    recommendations.push('Implement renewable energy sources to reduce operational emissions');
  }

  // General sustainability recommendations
  const nonGreenStarMaterials = materialDetails.filter(m => 
    !m.sustainabilityFeatures.includes('Green Star Compliant')
  );
  if (nonGreenStarMaterials.length > materialDetails.length * 0.5) {
    recommendations.push('Increase use of Green Star compliant materials for better sustainability rating');
  }

  return recommendations;
}

// Fallback factors for transport and energy
function getTransportFactor(type: string): number {
  const factors: Record<string, number> = {
    truck: 0.10,
    train: 0.03,
    ship: 0.01,
    plane: 1.50,
    van: 0.25
  };
  return factors[type] || 0.10;
}

function getEnergyFactor(type: string): number {
  const factors: Record<string, number> = {
    electricity: 0.50,
    naturalGas: 0.20,
    renewableEnergy: 0.05,
    diesel: 0.27,
    coal: 0.34
  };
  return factors[type] || 0.50;
}