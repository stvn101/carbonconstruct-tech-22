import { useState, useCallback, useEffect } from 'react';
import { 
  MaterialInput, 
  TransportInput, 
  EnergyInput, 
  CalculationResult,
  calculateTotalEmissions,
  calculateComplianceScore
} from '@/lib/carbonCalculations';

export interface CalculatorState {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  result: CalculationResult | null;
  complianceScore: number;
  isCalculating: boolean;
}

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    materials: [],
    transport: [],
    energy: [],
    result: null,
    complianceScore: 0,
    isCalculating: false
  });

  const addMaterial = useCallback((material: Omit<MaterialInput, 'id'>) => {
    const newMaterial: MaterialInput = {
      ...material,
      id: `material_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setState(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
  }, []);

  const updateMaterial = useCallback((id: string, updates: Partial<MaterialInput>) => {
    setState(prev => ({
      ...prev,
      materials: prev.materials.map(material => 
        material.id === id ? { ...material, ...updates } : material
      )
    }));
  }, []);

  const removeMaterial = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      materials: prev.materials.filter(material => material.id !== id)
    }));
  }, []);

  const addTransport = useCallback((transport: Omit<TransportInput, 'id'>) => {
    const newTransport: TransportInput = {
      ...transport,
      id: `transport_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setState(prev => ({
      ...prev,
      transport: [...prev.transport, newTransport]
    }));
  }, []);

  const updateTransport = useCallback((id: string, updates: Partial<TransportInput>) => {
    setState(prev => ({
      ...prev,
      transport: prev.transport.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  }, []);

  const removeTransport = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      transport: prev.transport.filter(item => item.id !== id)
    }));
  }, []);

  const addEnergy = useCallback((energy: Omit<EnergyInput, 'id'>) => {
    const newEnergy: EnergyInput = {
      ...energy,
      id: `energy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setState(prev => ({
      ...prev,
      energy: [...prev.energy, newEnergy]
    }));
  }, []);

  const updateEnergy = useCallback((id: string, updates: Partial<EnergyInput>) => {
    setState(prev => ({
      ...prev,
      energy: prev.energy.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  }, []);

  const removeEnergy = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      energy: prev.energy.filter(item => item.id !== id)
    }));
  }, []);

  const calculate = useCallback(async () => {
    setState(prev => ({ ...prev, isCalculating: true }));
    
    try {
      // Simulate calculation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = calculateTotalEmissions(
        state.materials,
        state.transport,
        state.energy
      );
      
      const complianceScore = calculateComplianceScore(result);
      
      setState(prev => ({
        ...prev,
        result,
        complianceScore,
        isCalculating: false
      }));
    } catch (error) {
      console.error('Calculation error:', error);
      setState(prev => ({ ...prev, isCalculating: false }));
    }
  }, [state.materials, state.transport, state.energy]);

  const reset = useCallback(() => {
    setState({
      materials: [],
      transport: [],
      energy: [],
      result: null,
      complianceScore: 0,
      isCalculating: false
    });
  }, []);

  const resetSection = useCallback((section: 'materials' | 'transport' | 'energy') => {
    setState(prev => ({
      ...prev,
      [section]: []
    }));
  }, []);

  const loadProject = useCallback((projectData: {
    materials: MaterialInput[];
    transport: TransportInput[];
    energy: EnergyInput[];
  }) => {
    setState(prev => ({
      ...prev,
      materials: projectData.materials || [],
      transport: projectData.transport || [],
      energy: projectData.energy || [],
      result: null,
      complianceScore: 0
    }));
  }, []);

  // Auto-calculate when inputs change
  useEffect(() => {
    if (state.materials.length > 0 || state.transport.length > 0 || state.energy.length > 0) {
      const timeoutId = setTimeout(() => {
        calculate();
      }, 1000); // Debounce calculations

      return () => clearTimeout(timeoutId);
    }
  }, [state.materials, state.transport, state.energy, calculate]);

  return {
    ...state,
    actions: {
      addMaterial,
      updateMaterial,
      removeMaterial,
      addTransport,
      updateTransport,
      removeTransport,
      addEnergy,
      updateEnergy,
      removeEnergy,
      calculate,
      reset,
      resetSection,
      loadProject
    }
  };
};