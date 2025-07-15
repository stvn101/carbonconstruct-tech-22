import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CalculatorState {
  ncc: any;
  nabers: any;
  lca: any;
  scope: any;
  leed: any;
  breeam: any;
  greenStar: any;
}

interface SavedCalculation {
  id: string;
  name: string;
  data: CalculatorState;
  total_emissions: number;
  created_at: string;
  updated_at: string;
}

export const useCalculatorState = () => {
  const [calculatorData, setCalculatorData] = useState<CalculatorState>({
    ncc: null,
    nabers: null,
    lca: null,
    scope: null,
    leed: null,
    breeam: null,
    greenStar: null
  });
  
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate total emissions
  const calculateTotalEmissions = () => {
    let total = 0;
    if (calculatorData.ncc?.totalEmissions) total += calculatorData.ncc.totalEmissions;
    if (calculatorData.nabers?.totalEmissions) total += calculatorData.nabers.totalEmissions;
    if (calculatorData.lca?.totalLCA) total += calculatorData.lca.totalLCA;
    if (calculatorData.scope?.totalEmissions) total += calculatorData.scope.totalEmissions;
    return total;
  };

  // Calculate compliance score
  const calculateComplianceScore = () => {
    let compliantCount = 0;
    let totalCount = 0;
    
    if (calculatorData.ncc?.isCompliant !== undefined) {
      totalCount++;
      if (calculatorData.ncc.isCompliant) compliantCount++;
    }
    if (calculatorData.nabers?.overallRating) {
      totalCount++;
      if (calculatorData.nabers.overallRating >= 4) compliantCount++;
    }
    if (calculatorData.leed?.certificationLevel) {
      totalCount++;
      if (calculatorData.leed.certificationLevel !== 'Not Certified') compliantCount++;
    }
    if (calculatorData.breeam?.rating) {
      totalCount++;
      if (calculatorData.breeam.rating !== 'Unclassified') compliantCount++;
    }
    
    return totalCount > 0 ? Math.round((compliantCount / totalCount) * 100) : 0;
  };

  // Load saved calculations for authenticated users
  const loadSavedCalculations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, result, total, created_at, updated_at')
        .eq('user_id', user.id)
        .not('result', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const calculations = data?.map(project => ({
        id: project.id,
        name: project.name,
        data: (project.result as unknown as CalculatorState) || {
          ncc: null,
          nabers: null,
          lca: null,
          scope: null,
          leed: null,
          breeam: null,
          greenStar: null
        },
        total_emissions: project.total || 0,
        created_at: project.created_at,
        updated_at: project.updated_at
      })) || [];

      setSavedCalculations(calculations);
    } catch (error) {
      console.error('Error loading saved calculations:', error);
      toast({
        title: "Error",
        description: "Failed to load saved calculations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save calculation as project
  const saveCalculation = async (name: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your calculations.",
        variant: "destructive",
      });
      return false;
    }

    setIsSaving(true);
    try {
      const totalEmissions = calculateTotalEmissions();
      const complianceScore = calculateComplianceScore();

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          description: `Carbon calculation - ${complianceScore}% compliance score`,
          result: calculatorData as any,
          total: totalEmissions,
          region: 'Australia', // Default region
          tags: ['carbon-calculation', 'calculator-pro'],
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Calculation Saved",
        description: `Your calculation "${name}" has been saved successfully.`,
      });

      // Reload saved calculations
      await loadSavedCalculations();
      
      return true;
    } catch (error) {
      console.error('Error saving calculation:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your calculation. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Load a saved calculation
  const loadCalculation = async (calculationId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('result')
        .eq('id', calculationId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data?.result) {
        const loadedData = data.result as unknown as CalculatorState;
        setCalculatorData(loadedData);
        toast({
          title: "Calculation Loaded",
          description: "Your saved calculation has been loaded successfully.",
        });
      }
    } catch (error) {
      console.error('Error loading calculation:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load the calculation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update handlers for each calculator
  const updateHandlers = {
    ncc: (data: any) => setCalculatorData(prev => ({ ...prev, ncc: data })),
    nabers: (data: any) => setCalculatorData(prev => ({ ...prev, nabers: data })),
    lca: (data: any) => setCalculatorData(prev => ({ ...prev, lca: data })),
    scope: (data: any) => setCalculatorData(prev => ({ ...prev, scope: data })),
    leed: (data: any) => setCalculatorData(prev => ({ ...prev, leed: data })),
    breeam: (data: any) => setCalculatorData(prev => ({ ...prev, breeam: data })),
    greenStar: (data: any) => setCalculatorData(prev => ({ ...prev, greenStar: data }))
  };

  // Load saved calculations on mount
  useEffect(() => {
    if (user) {
      loadSavedCalculations();
    }
  }, [user]);

  return {
    calculatorData,
    savedCalculations,
    isLoading,
    isSaving,
    totalEmissions: calculateTotalEmissions(),
    complianceScore: calculateComplianceScore(),
    updateHandlers,
    saveCalculation,
    loadCalculation,
    loadSavedCalculations,
    user
  };
};