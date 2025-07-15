
/**
 * Material Performance Analytics Service
 * Provides comprehensive analytics and tracking for material performance over time
 */
import { MaterialInput } from '@/lib/carbonExports';
import { MaterialPerformanceData, SustainabilityTrendData, MaterialRecommendation } from './types';
import { storePerformanceData, storePerformanceInLocalCache, getHistoricalDataForMaterial } from './storageUtils';
import { generateTimeSeriesData, findAlternativeMaterials } from './dataGenerators';
import { 
  calculatePotentialReduction, 
  determineCostImpact, 
  determineAvailability, 
  generateRecommendationDetails,
  calculateSustainabilityScore,
  getCategoryFromType
} from './utils';

/**
 * Tracks material performance data for analytics
 */
export async function trackMaterialPerformance(
  materials: MaterialInput[],
  projectId?: string
): Promise<MaterialPerformanceData[]> {
  try {
    // Process each material to track its performance
    const performanceData: MaterialPerformanceData[] = materials.map(material => ({
      materialId: (material as any).id || material.type,
      materialName: material.type,
      carbonFootprint: Number(material.quantity) * ((material as any).factor || 1),
      timestamp: new Date().toISOString(),
      sustainabilityScore: calculateSustainabilityScore(material),
      quantity: Number(material.quantity) || 0,
      region: (material as any).region,
      category: getCategoryFromType(material.type)
    }));

    // Store in database if projectId is provided
    if (projectId) {
      await storePerformanceData(performanceData, projectId);
    }

    // Store in local cache for offline access
    storePerformanceInLocalCache(performanceData);

    return performanceData;
  } catch (error) {
    console.error('Failed to track material performance:', error);
    return [];
  }
}

/**
 * Gets historical trend data for a specific material
 */
export async function getMaterialTrends(materialType: string): Promise<SustainabilityTrendData | null> {
  try {
    // Try to get data from database first, fall back to local cache
    const dataPoints = await getHistoricalDataForMaterial(materialType);
    
    if (!dataPoints || dataPoints.length === 0) {
      // Generate sample trend data in the correct format
      const timeSeriesData = generateTimeSeriesData(12);
      
      return {
        materialName: materialType,
        materialId: materialType,
        dataPoints: timeSeriesData.map(point => ({
          timestamp: point.date,
          carbonFootprint: point.carbonFootprint,
          sustainabilityScore: point.sustainabilityScore,
          quantity: point.materialCount
        })),
        improvement: Math.random() * 20 - 5, // Random improvement between -5% and 15%
        averageFootprint: timeSeriesData.reduce((sum, point) => sum + point.carbonFootprint, 0) / timeSeriesData.length,
        projectedFootprint: timeSeriesData[timeSeriesData.length - 1].carbonFootprint * 0.9
      };
    }

    // Calculate improvement percentage
    const firstPoint = dataPoints[0];
    const lastPoint = dataPoints[dataPoints.length - 1];
    const improvement = firstPoint.carbonFootprint > 0 ? 
      ((firstPoint.carbonFootprint - lastPoint.carbonFootprint) / firstPoint.carbonFootprint) * 100 : 0;

    // Calculate average footprint
    const totalFootprint = dataPoints.reduce((sum, point) => sum + point.carbonFootprint, 0);
    const averageFootprint = dataPoints.length > 0 ? totalFootprint / dataPoints.length : 0;

    return {
      materialName: materialType,
      materialId: materialType,
      dataPoints,
      improvement,
      averageFootprint,
      projectedFootprint: lastPoint.carbonFootprint * 0.9 // Simple projection: 10% further reduction
    };
  } catch (error) {
    console.error(`Failed to get trends for material ${materialType}:`, error);
    // Return sample data as fallback
    const timeSeriesData = generateTimeSeriesData(12);
    
    return {
      materialName: materialType,
      materialId: materialType,
      dataPoints: timeSeriesData.map(point => ({
        timestamp: point.date,
        carbonFootprint: point.carbonFootprint,
        sustainabilityScore: point.sustainabilityScore,
        quantity: point.materialCount
      })),
      improvement: Math.random() * 20 - 5,
      averageFootprint: timeSeriesData.reduce((sum, point) => sum + point.carbonFootprint, 0) / timeSeriesData.length,
      projectedFootprint: timeSeriesData[timeSeriesData.length - 1].carbonFootprint * 0.9
    };
  }
}

/**
 * Gets material recommendations based on current material selections
 */
export async function getMaterialRecommendations(materials: MaterialInput[]): Promise<MaterialRecommendation[]> {
  try {
    const recommendations: MaterialRecommendation[] = [];

    // Process each material to find alternatives
    for (const material of materials) {
      const alternatives = await findAlternativeMaterials(material.type);
      
      if (alternatives.length > 0) {
        // Select the best alternative based on carbon reduction
        const bestAlternative = alternatives[0];
        
        recommendations.push({
          originalMaterial: material.type,
          recommendedMaterial: bestAlternative.name,
          potentialReduction: calculatePotentialReduction(material, bestAlternative),
          costImpact: determineCostImpact(bestAlternative),
          availability: determineAvailability(bestAlternative),
          details: generateRecommendationDetails(material, bestAlternative)
        });
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Failed to get material recommendations:', error);
    // Return sample recommendations matching the correct type
    return materials.slice(0, 3).map((material, index) => ({
      originalMaterial: material.type,
      recommendedMaterial: `Low-carbon ${material.type}`,
      potentialReduction: 15 + (index * 5), // 15%, 20%, 25%
      costImpact: ['similar', 'higher', 'lower'][index % 3] as 'similar' | 'higher' | 'lower',
      availability: ['high', 'medium', 'high'][index % 3] as 'high' | 'medium' | 'high',
      details: `Consider switching to a more sustainable version of ${material.type} to reduce carbon footprint.`
    }));
  }
}
