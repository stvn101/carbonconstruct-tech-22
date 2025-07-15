
import { CalculationInput, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";
import { materialCarbonFactors } from "@/lib/carbonFactors";
import { logger } from "@/services/logging/EnhancedLoggingService";

// Material handlers
export const handleAddMaterial = (currentInput: CalculationInput): CalculationInput => {
  const newMaterial: MaterialInput = {
    name: "New Material",
    type: "concrete",
    quantity: 1000,
    unit: "kg",
    carbonFootprint: materialCarbonFactors.concrete || 0.12
  };
  
  logger.debug('Adding new material', 'CalculatorHandlers', { material: newMaterial });
  
  return {
    ...currentInput,
    materials: [...(currentInput.materials || []), newMaterial]
  };
};

export const handleUpdateMaterial = (
  currentInput: CalculationInput,
  index: number,
  field: keyof MaterialInput,
  value: any
): CalculationInput => {
  if (!currentInput.materials || index < 0 || index >= currentInput.materials.length) {
    logger.warn('Invalid material update attempt', 'CalculatorHandlers', { index, field, value });
    return currentInput;
  }
  
  const updatedMaterials = [...currentInput.materials];
  const currentMaterial = { ...updatedMaterials[index] };
  
  // Handle type-specific updates
  if (field === 'type' && typeof value === 'string') {
    currentMaterial.type = value;
    // Auto-update carbon footprint when type changes
    const materialFactor = materialCarbonFactors[value as keyof typeof materialCarbonFactors];
    if (materialFactor) {
      currentMaterial.carbonFootprint = materialFactor;
    }
  } else if (field === 'quantity' || field === 'carbonFootprint') {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numValue) && numValue >= 0) {
      (currentMaterial as any)[field] = numValue;
    }
  } else {
    (currentMaterial as any)[field] = value;
  }
  
  updatedMaterials[index] = currentMaterial;
  
  logger.debug('Material updated', 'CalculatorHandlers', { 
    index, 
    field, 
    value, 
    updatedMaterial: currentMaterial 
  });
  
  return {
    ...currentInput,
    materials: updatedMaterials
  };
};

export const handleRemoveMaterial = (currentInput: CalculationInput, index: number): CalculationInput => {
  if (!currentInput.materials || index < 0 || index >= currentInput.materials.length) {
    logger.warn('Invalid material removal attempt', 'CalculatorHandlers', { index });
    return currentInput;
  }
  
  const updatedMaterials = currentInput.materials.filter((_, i) => i !== index);
  
  logger.debug('Material removed', 'CalculatorHandlers', { index, remainingCount: updatedMaterials.length });
  
  return {
    ...currentInput,
    materials: updatedMaterials
  };
};

// Transport handlers
export const handleAddTransport = (currentInput: CalculationInput): CalculationInput => {
  const newTransport: TransportInput = {
    mode: "truck",
    type: "truck",
    distance: 100,
    weight: 1000,
    carbonFootprint: 0.1
  };
  
  logger.debug('Adding new transport', 'CalculatorHandlers', { transport: newTransport });
  
  return {
    ...currentInput,
    transport: [...(currentInput.transport || []), newTransport]
  };
};

export const handleUpdateTransport = (
  currentInput: CalculationInput,
  index: number,
  field: keyof TransportInput,
  value: any
): CalculationInput => {
  if (!currentInput.transport || index < 0 || index >= currentInput.transport.length) {
    logger.warn('Invalid transport update attempt', 'CalculatorHandlers', { index, field, value });
    return currentInput;
  }
  
  const updatedTransport = [...currentInput.transport];
  const currentTransport = { ...updatedTransport[index] };
  
  // Handle numeric fields
  if (field === 'distance' || field === 'weight' || field === 'carbonFootprint') {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numValue) && numValue >= 0) {
      (currentTransport as any)[field] = numValue;
    }
  } else if (field === 'mode') {
    currentTransport.mode = value;
    currentTransport.type = value; // Keep type in sync with mode
  } else {
    (currentTransport as any)[field] = value;
  }
  
  updatedTransport[index] = currentTransport;
  
  logger.debug('Transport updated', 'CalculatorHandlers', { 
    index, 
    field, 
    value, 
    updatedTransport: currentTransport 
  });
  
  return {
    ...currentInput,
    transport: updatedTransport
  };
};

export const handleRemoveTransport = (currentInput: CalculationInput, index: number): CalculationInput => {
  if (!currentInput.transport || index < 0 || index >= currentInput.transport.length) {
    logger.warn('Invalid transport removal attempt', 'CalculatorHandlers', { index });
    return currentInput;
  }
  
  const updatedTransport = currentInput.transport.filter((_, i) => i !== index);
  
  logger.debug('Transport removed', 'CalculatorHandlers', { index, remainingCount: updatedTransport.length });
  
  return {
    ...currentInput,
    transport: updatedTransport
  };
};

// Energy handlers
export const handleAddEnergy = (currentInput: CalculationInput): CalculationInput => {
  const newEnergy: EnergyInput = {
    type: "electricity",
    amount: 500,
    unit: "kWh",
    carbonFootprint: 0.5
  };
  
  logger.debug('Adding new energy', 'CalculatorHandlers', { energy: newEnergy });
  
  return {
    ...currentInput,
    energy: [...(currentInput.energy || []), newEnergy]
  };
};

export const handleUpdateEnergy = (
  currentInput: CalculationInput,
  index: number,
  field: keyof EnergyInput,
  value: any
): CalculationInput => {
  if (!currentInput.energy || index < 0 || index >= currentInput.energy.length) {
    logger.warn('Invalid energy update attempt', 'CalculatorHandlers', { index, field, value });
    return currentInput;
  }
  
  const updatedEnergy = [...currentInput.energy];
  const currentEnergy = { ...updatedEnergy[index] };
  
  // Handle numeric fields
  if (field === 'amount' || field === 'carbonFootprint') {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numValue) && numValue >= 0) {
      (currentEnergy as any)[field] = numValue;
    }
  } else {
    (currentEnergy as any)[field] = value;
  }
  
  updatedEnergy[index] = currentEnergy;
  
  logger.debug('Energy updated', 'CalculatorHandlers', { 
    index, 
    field, 
    value, 
    updatedEnergy: currentEnergy 
  });
  
  return {
    ...currentInput,
    energy: updatedEnergy
  };
};

export const handleRemoveEnergy = (currentInput: CalculationInput, index: number): CalculationInput => {
  if (!currentInput.energy || index < 0 || index >= currentInput.energy.length) {
    logger.warn('Invalid energy removal attempt', 'CalculatorHandlers', { index });
    return currentInput;
  }
  
  const updatedEnergy = currentInput.energy.filter((_, i) => i !== index);
  
  logger.debug('Energy removed', 'CalculatorHandlers', { index, remainingCount: updatedEnergy.length });
  
  return {
    ...currentInput,
    energy: updatedEnergy
  };
};
