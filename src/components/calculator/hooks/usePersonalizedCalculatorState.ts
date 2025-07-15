import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useCalculatorPersonalization } from '@/hooks/useCalculatorPersonalization';
import { useCalculatorState } from './useCalculatorState';
import { useToast } from '@/hooks/use-toast';

export const usePersonalizedCalculatorState = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const calculatorState = useCalculatorState();
  const personalization = useCalculatorPersonalization();
  
  const [personalizedDefaults, setPersonalizedDefaults] = useState<Record<string, any>>({});
  const [isApplyingDefaults, setIsApplyingDefaults] = useState(false);

  // Load personalized defaults when user or profile changes
  useEffect(() => {
    if (user && profile) {
      const defaults = {
        lca: personalization.getPersonalizedDefaults('lca'),
        scope: personalization.getPersonalizedDefaults('scope'),
        green_star: personalization.getPersonalizedDefaults('green_star'),
        nabers: personalization.getPersonalizedDefaults('nabers'),
        ncc: personalization.getPersonalizedDefaults('ncc'),
        leed: personalization.getPersonalizedDefaults('leed'),
        breeam: personalization.getPersonalizedDefaults('breeam')
      };
      
      setPersonalizedDefaults(defaults);
    }
  }, [user, profile]);

  // Enhanced save function with personalization
  const saveCalculationWithPersonalization = async (name: string) => {
    const success = await calculatorState.saveCalculation(name);
    
    if (success && user) {
      // Save calculation to personalization history
      const calculatorTypes = Object.keys(calculatorState.calculatorData).filter(
        key => calculatorState.calculatorData[key] !== null
      );
      
      for (const calculatorType of calculatorTypes) {
        const inputData = calculatorState.calculatorData[calculatorType];
        const results = inputData; // The calculation data contains the results
        
        await personalization.saveCalculationWithPersonalization(
          calculatorType,
          inputData,
          results
        );
      }
      
      toast({
        title: "Calculation Saved & Analyzed",
        description: "Your calculation has been saved and added to your personalization history.",
      });
    }
    
    return success;
  };

  // Apply template defaults to calculators
  const applyTemplateDefaults = (template: any) => {
    template.calculatorTypes.forEach((calculatorType: string) => {
      const defaults = template.defaultValues[calculatorType];
      if (defaults && calculatorState.updateHandlers[calculatorType as keyof typeof calculatorState.updateHandlers]) {
        calculatorState.updateHandlers[calculatorType as keyof typeof calculatorState.updateHandlers](defaults);
      }
    });
  };

  // Apply personalized defaults to a calculator
  const applyPersonalizedDefaults = async (calculatorType: string) => {
    if (!personalizedDefaults[calculatorType]) return;
    
    setIsApplyingDefaults(true);
    try {
      const defaults = personalizedDefaults[calculatorType];
      
      // Apply defaults based on calculator type
      const handler = calculatorState.updateHandlers[calculatorType as keyof typeof calculatorState.updateHandlers];
      if (handler) {
        handler(defaults);
        
        toast({
          title: "Defaults Applied",
          description: `Your personalized settings have been applied to the ${calculatorType.toUpperCase()} calculator.`,
        });
      }
    } catch (error) {
      console.error('Error applying personalized defaults:', error);
      toast({
        title: "Error",
        description: "Failed to apply personalized defaults.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingDefaults(false);
    }
  };

  // Get recommended materials based on user preferences
  const getRecommendedMaterials = () => {
    return personalization.getRecommendedMaterials();
  };

  // Check compliance against user thresholds
  const checkPersonalizedCompliance = (calculatorType: string) => {
    const totalEmissions = calculatorState.totalEmissions;
    return personalization.checkComplianceThresholds(calculatorType, totalEmissions);
  };

  // Get calculation insights based on history
  const getCalculationInsights = () => {
    const history = personalization.calculationHistory;
    const currentEmissions = calculatorState.totalEmissions;
    
    if (history.length === 0) return null;
    
    const averageEmissions = history.reduce((sum, calc) => 
      sum + (calc.carbon_footprint || 0), 0) / history.length;
    
    const improvement = averageEmissions > 0 ? 
      ((averageEmissions - currentEmissions) / averageEmissions) * 100 : 0;
    
    return {
      averageEmissions,
      currentEmissions,
      improvement,
      isImprovement: improvement > 0,
      calculationCount: history.length
    };
  };

  return {
    ...calculatorState,
    // Enhanced methods
    saveCalculation: saveCalculationWithPersonalization,
    applyPersonalizedDefaults,
    applyTemplateDefaults,
    getRecommendedMaterials,
    checkPersonalizedCompliance,
    getCalculationInsights,
    
    // Personalization data
    personalizedDefaults,
    isApplyingDefaults,
    
    // Personalization hooks
    ...personalization
  };
};