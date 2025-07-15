// Calculation Validation Service
import { CalculationResult, CalculationInput } from './carbonCalculations';
import { errorService } from '@/services/error/ErrorService';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateCalculationInput = (input: CalculationInput): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate materials
  if (input.materials) {
    input.materials.forEach((material, index) => {
      if (!material.type) {
        errors.push(`Material ${index + 1}: Type is required`);
      }
      const quantity = Number(material.quantity) || 0;
      if (quantity <= 0) {
        errors.push(`Material ${index + 1}: Quantity must be greater than 0`);
      }
      if (quantity > 1000000) {
        warnings.push(`Material ${index + 1}: Very large quantity (${quantity})`);
      }
    });
  }

  // Validate transport
  if (input.transport) {
    input.transport.forEach((transport, index) => {
      if (!transport.type) {
        errors.push(`Transport ${index + 1}: Type is required`);
      }
      const distance = Number(transport.distance) || 0;
      const weight = Number(transport.weight) || 0;
      if (distance <= 0) {
        errors.push(`Transport ${index + 1}: Distance must be greater than 0`);
      }
      if (weight <= 0) {
        errors.push(`Transport ${index + 1}: Weight must be greater than 0`);
      }
    });
  }

  // Validate energy
  if (input.energy) {
    input.energy.forEach((energy, index) => {
      if (!energy.type) {
        errors.push(`Energy ${index + 1}: Type is required`);
      }
      const amount = Number(energy.amount) || 0;
      if (amount <= 0) {
        errors.push(`Energy ${index + 1}: Amount must be greater than 0`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateCalculationResult = (result: CalculationResult): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for NaN or negative values
  if (isNaN(result.totalEmissions) || result.totalEmissions < 0) {
    errors.push('Total emissions is invalid');
  }

  if (isNaN(result.materialEmissions) || result.materialEmissions < 0) {
    errors.push('Material emissions is invalid');
  }

  if (isNaN(result.transportEmissions) || result.transportEmissions < 0) {
    errors.push('Transport emissions is invalid');
  }

  if (isNaN(result.energyEmissions) || result.energyEmissions < 0) {
    errors.push('Energy emissions is invalid');
  }

  // Validate breakdown percentages
  const totalPercentage = result.breakdown.materials + result.breakdown.transport + result.breakdown.energy;
  if (Math.abs(totalPercentage - 100) > 0.1 && result.totalEmissions > 0) {
    warnings.push(`Breakdown percentages don't sum to 100% (${totalPercentage.toFixed(1)}%)`);
  }

  // Log validation issues
  if (errors.length > 0) {
    errorService.logError('Calculation validation failed', { errors, result });
  }
  if (warnings.length > 0) {
    errorService.logError('Calculation validation warnings', { warnings, result }, 'warning');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};