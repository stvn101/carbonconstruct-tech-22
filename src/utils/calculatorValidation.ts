
import { CalculationInput, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";
import { logger } from "@/services/logging/EnhancedLoggingService";

export interface ValidationError {
  field: string;
  message: string;
  index?: number;
}

export const validateMaterial = (material: MaterialInput, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!material.name || material.name.trim() === '') {
    errors.push({
      field: `materials[${index}].name`,
      message: `Material ${index + 1}: Name is required`,
      index
    });
  }
  
  if (!material.quantity || material.quantity <= 0) {
    errors.push({
      field: `materials[${index}].quantity`,
      message: `Material ${index + 1}: Quantity must be greater than 0`,
      index
    });
  }
  
  if (!material.carbonFootprint || material.carbonFootprint <= 0) {
    errors.push({
      field: `materials[${index}].carbonFootprint`,
      message: `Material ${index + 1}: Carbon footprint must be greater than 0`,
      index
    });
  }
  
  return errors;
};

export const validateTransport = (transport: TransportInput, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!transport.mode || transport.mode.trim() === '') {
    errors.push({
      field: `transport[${index}].mode`,
      message: `Transport ${index + 1}: Mode is required`,
      index
    });
  }
  
  if (!transport.distance || transport.distance <= 0) {
    errors.push({
      field: `transport[${index}].distance`,
      message: `Transport ${index + 1}: Distance must be greater than 0`,
      index
    });
  }
  
  if (!transport.weight || transport.weight <= 0) {
    errors.push({
      field: `transport[${index}].weight`,
      message: `Transport ${index + 1}: Weight must be greater than 0`,
      index
    });
  }
  
  return errors;
};

export const validateEnergy = (energy: EnergyInput, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!energy.type || energy.type.trim() === '') {
    errors.push({
      field: `energy[${index}].type`,
      message: `Energy ${index + 1}: Type is required`,
      index
    });
  }
  
  if (!energy.amount || energy.amount <= 0) {
    errors.push({
      field: `energy[${index}].amount`,
      message: `Energy ${index + 1}: Amount must be greater than 0`,
      index
    });
  }
  
  if (!energy.carbonFootprint || energy.carbonFootprint <= 0) {
    errors.push({
      field: `energy[${index}].carbonFootprint`,
      message: `Energy ${index + 1}: Carbon footprint must be greater than 0`,
      index
    });
  }
  
  return errors;
};

export const validateCalculationInput = (input: CalculationInput): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  logger.debug('Starting calculation input validation', 'CalculatorValidation', {
    materialsCount: input.materials?.length || 0,
    transportCount: input.transport?.length || 0,
    energyCount: input.energy?.length || 0
  });
  
  // Validate materials
  if (input.materials && input.materials.length > 0) {
    input.materials.forEach((material, index) => {
      const materialErrors = validateMaterial(material, index);
      errors.push(...materialErrors);
    });
  }
  
  // Validate transport
  if (input.transport && input.transport.length > 0) {
    input.transport.forEach((transport, index) => {
      const transportErrors = validateTransport(transport, index);
      errors.push(...transportErrors);
    });
  }
  
  // Validate energy
  if (input.energy && input.energy.length > 0) {
    input.energy.forEach((energy, index) => {
      const energyErrors = validateEnergy(energy, index);
      errors.push(...energyErrors);
    });
  }
  
  // Check if at least one category has valid data
  const hasValidMaterials = input.materials?.some(m => m.quantity > 0 && m.carbonFootprint > 0);
  const hasValidTransport = input.transport?.some(t => t.distance > 0 && t.weight > 0);
  const hasValidEnergy = input.energy?.some(e => e.amount > 0 && e.carbonFootprint > 0);
  
  if (!hasValidMaterials && !hasValidTransport && !hasValidEnergy) {
    errors.push({
      field: 'general',
      message: 'At least one category (materials, transport, or energy) must have valid data'
    });
  }
  
  logger.debug('Validation completed', 'CalculatorValidation', {
    errorsCount: errors.length,
    errors: errors.map(e => ({ field: e.field, message: e.message }))
  });
  
  return errors;
};

export const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
  const error = errors.find(e => e.field === field);
  return error?.message;
};

export const hasFieldError = (errors: ValidationError[], field: string): boolean => {
  return errors.some(e => e.field === field);
};
