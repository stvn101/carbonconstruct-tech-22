import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { usePersonalization } from './usePersonalization';
import { toast } from 'sonner';

export const useCalculatorPersonalization = () => {
  const { user, profile } = useAuth();
  const personalization = usePersonalization(user?.id);

  const saveCalculationWithPersonalization = useCallback(async (
    calculatorType: string,
    inputData: any,
    results: any
  ) => {
    if (!user?.id || !profile?.calculator_preferences?.auto_save_calculations) {
      return;
    }

    try {
      // Extract carbon footprint from results
      const carbonFootprint = 
        results.totalEmissions || 
        results.totalLCA || 
        results.totalCO2e || 
        results.carbonImpact || 
        0;

      // Determine compliance status based on profile thresholds
      let complianceStatus = 'unknown';
      const thresholds = profile.compliance_thresholds || {};
      
      if (carbonFootprint > 0) {
        const relevantThreshold = 
          thresholds[calculatorType] || 
          thresholds.default || 
          thresholds.ncc || 
          10000; // Default threshold
        
        complianceStatus = carbonFootprint <= relevantThreshold ? 'compliant' : 'non_compliant';
      }

      // Generate improvement suggestions based on focus areas
      const improvementSuggestions = generateImprovementSuggestions(
        profile.focus_areas || [],
        results,
        calculatorType
      );

      // Save to history
      await personalization.saveCalculationHistory(
        calculatorType,
        inputData,
        results,
        carbonFootprint,
        complianceStatus,
        improvementSuggestions
      );

      // Check if carbon footprint exceeds user's goals
      const carbonGoals = profile.carbon_footprint_goals || {};
      if (carbonGoals.monthly_target && carbonFootprint > carbonGoals.monthly_target * 0.8) {
        await personalization.createComplianceAlert(
          'carbon_threshold',
          'High Carbon Footprint Detected',
          `Your recent ${calculatorType} calculation (${carbonFootprint.toFixed(1)} kg CO₂-e) is approaching your monthly target of ${carbonGoals.monthly_target} kg CO₂-e.`,
          'warning',
          calculatorType,
          true
        );
      }

    } catch (error) {
      console.error('Error saving calculation with personalization:', error);
      // Don't show error to user as this is background operation
    }
  }, [user, profile]);

  const getPersonalizedDefaults = useCallback((calculatorType: string) => {
    if (!profile) return {};

    const prefs = profile.calculator_preferences || {};
    const defaults: any = {};

    // Set default region
    if (profile.default_region) {
      defaults.region = profile.default_region;
    }

    // Set default units
    if (profile.preferred_units) {
      defaults.units = profile.preferred_units;
    }

    // Calculator-specific defaults based on focus areas
    const focusAreas = profile.focus_areas || [];
    
    if (calculatorType === 'lca') {
      if (focusAreas.includes('Material Sustainability')) {
        defaults.includeRecycledContent = true;
      }
      if (focusAreas.includes('Energy Efficiency')) {
        defaults.includeOperationalEnergy = true;
      }
    }

    if (calculatorType === 'green_star') {
      if (focusAreas.includes('Green Star Certification')) {
        defaults.targetRating = 'Good Practice';
      }
    }

    return defaults;
  }, [profile]);

  const getRecommendedMaterials = useCallback(() => {
    if (!profile?.focus_areas) return [];

    const focusAreas = profile.focus_areas;
    const recommendations: string[] = [];

    if (focusAreas.includes('Material Sustainability')) {
      recommendations.push('recycled_content', 'low_carbon', 'local_materials');
    }
    if (focusAreas.includes('Energy Efficiency')) {
      recommendations.push('insulation', 'high_performance_glazing');
    }
    if (focusAreas.includes('Water Management')) {
      recommendations.push('permeable_paving', 'water_efficient');
    }

    return recommendations;
  }, [profile]);

  const checkComplianceThresholds = useCallback((
    calculatorType: string,
    carbonFootprint: number
  ) => {
    if (!profile?.compliance_thresholds) return null;

    const thresholds = profile.compliance_thresholds;
    const threshold = thresholds[calculatorType] || thresholds.default;

    if (threshold && carbonFootprint > threshold) {
      return {
        exceeded: true,
        threshold,
        exceedance: carbonFootprint - threshold,
        percentage: ((carbonFootprint - threshold) / threshold) * 100
      };
    }

    return { exceeded: false, threshold };
  }, [profile]);

  return {
    saveCalculationWithPersonalization,
    getPersonalizedDefaults,
    getRecommendedMaterials,
    checkComplianceThresholds,
    ...personalization
  };
};

function generateImprovementSuggestions(
  focusAreas: string[],
  results: any,
  calculatorType: string
): string[] {
  const suggestions: string[] = [];

  if (focusAreas.includes('Material Sustainability')) {
    if (results.materialEmissions > 0) {
      suggestions.push('Consider using materials with lower embodied carbon');
      suggestions.push('Explore recycled content alternatives');
    }
  }

  if (focusAreas.includes('Energy Efficiency')) {
    if (results.energyEmissions > 0) {
      suggestions.push('Improve building envelope performance');
      suggestions.push('Consider renewable energy integration');
    }
  }

  if (focusAreas.includes('Carbon Footprint Reduction')) {
    suggestions.push('Review high-impact materials in your selection');
    suggestions.push('Consider local sourcing to reduce transport emissions');
  }

  if (calculatorType === 'green_star' && results.totalPoints < 60) {
    suggestions.push('Focus on energy and materials categories for maximum impact');
  }

  if (calculatorType === 'lca' && results.embodiedCarbon > results.operationalCarbon) {
    suggestions.push('Material selection has high impact on overall footprint');
  }

  return suggestions;
}