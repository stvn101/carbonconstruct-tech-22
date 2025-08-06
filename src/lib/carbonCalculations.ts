export interface MaterialInput {
  id: string;
  type: string;
  quantity: number;
  unit: string;
  carbonFootprint?: number;
  supplier?: string;
  region?: string;
}

export interface TransportInput {
  id: string;
  type: string;
  distance: number;
  unit: string;
  fuelType?: string;
  loadFactor?: number;
}

export interface EnergyInput {
  id: string;
  type: string;
  amount: number;
  unit: string;
  source?: string;
  renewablePercentage?: number;
}

export interface CalculationResult {
  totalEmissions: number;
  materialEmissions: number;
  transportEmissions: number;
  energyEmissions: number;
  breakdownByMaterial: Record<string, number>;
  breakdownByTransport: Record<string, number>;
  breakdownByEnergy: Record<string, number>;
  scope1: number;
  scope2: number;
  scope3: number;
}

// Australian emission factors (kg CO2-e per unit)
export const EMISSION_FACTORS = {
  materials: {
    'Concrete': 0.11,
    'Steel (Structural)': 1.8,
    'Steel (Reinforcement)': 1.46,
    'Timber (Hardwood)': 0.45,
    'Timber (Softwood)': 0.33,
    'Aluminum': 8.24,
    'Glass': 0.85,
    'Brick': 0.24,
    'Insulation (Bulk)': 1.28,
    'Insulation (Reflective)': 1.35,
    'Plasterboard': 0.38,
    'Carpet': 5.14,
    'Paint': 2.91,
    'Ceramic Tiles': 0.78
  },
  transport: {
    'Road Transport - Light Vehicle': 0.18,
    'Road Transport - Heavy Vehicle': 0.68,
    'Rail Transport': 0.04,
    'Sea Transport': 0.014,
    'Air Transport': 0.67
  },
  energy: {
    'Electricity - Grid (AU)': 0.79,
    'Electricity - Solar': 0.048,
    'Electricity - Wind': 0.026,
    'Natural Gas': 0.184,
    'LPG': 0.214,
    'Diesel': 0.267,
    'Petrol': 0.233
  }
};

export function calculateMaterialEmissions(materials: MaterialInput[]): {
  total: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  let total = 0;

  materials.forEach(material => {
    const emissionFactor = material.carbonFootprint || 
      EMISSION_FACTORS.materials[material.type as keyof typeof EMISSION_FACTORS.materials] || 
      0.5; // Default factor

    const emissions = material.quantity * emissionFactor;
    breakdown[material.type] = (breakdown[material.type] || 0) + emissions;
    total += emissions;
  });

  return { total, breakdown };
}

export function calculateTransportEmissions(transport: TransportInput[]): {
  total: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  let total = 0;

  transport.forEach(item => {
    const emissionFactor = EMISSION_FACTORS.transport[item.type as keyof typeof EMISSION_FACTORS.transport] || 0.3;
    const loadFactor = item.loadFactor || 1;
    
    const emissions = item.distance * emissionFactor * loadFactor;
    breakdown[item.type] = (breakdown[item.type] || 0) + emissions;
    total += emissions;
  });

  return { total, breakdown };
}

export function calculateEnergyEmissions(energy: EnergyInput[]): {
  total: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  let total = 0;

  energy.forEach(item => {
    const emissionFactor = EMISSION_FACTORS.energy[item.type as keyof typeof EMISSION_FACTORS.energy] || 0.5;
    const renewableFactor = 1 - ((item.renewablePercentage || 0) / 100);
    
    const emissions = item.amount * emissionFactor * renewableFactor;
    breakdown[item.type] = (breakdown[item.type] || 0) + emissions;
    total += emissions;
  });

  return { total, breakdown };
}

export function calculateScopeEmissions(
  materials: MaterialInput[],
  transport: TransportInput[],
  energy: EnergyInput[]
): { scope1: number; scope2: number; scope3: number } {
  // Scope 1: Direct emissions (on-site combustion)
  const scope1Sources = ['Natural Gas', 'LPG', 'Diesel', 'Petrol'];
  const scope1 = energy
    .filter(item => scope1Sources.includes(item.type))
    .reduce((sum, item) => {
      const factor = EMISSION_FACTORS.energy[item.type as keyof typeof EMISSION_FACTORS.energy] || 0;
      return sum + (item.amount * factor);
    }, 0);

  // Scope 2: Indirect emissions (purchased electricity)
  const electricityItems = energy.filter(item => item.type.includes('Electricity'));
  const scope2 = electricityItems.reduce((sum, item) => {
    const factor = EMISSION_FACTORS.energy[item.type as keyof typeof EMISSION_FACTORS.energy] || 0;
    const renewableFactor = 1 - ((item.renewablePercentage || 0) / 100);
    return sum + (item.amount * factor * renewableFactor);
  }, 0);

  // Scope 3: All other indirect emissions (materials, transport)
  const materialEmissions = calculateMaterialEmissions(materials).total;
  const transportEmissions = calculateTransportEmissions(transport).total;
  const scope3 = materialEmissions + transportEmissions;

  return { scope1, scope2, scope3 };
}

export function calculateTotalEmissions(
  materials: MaterialInput[],
  transport: TransportInput[],
  energy: EnergyInput[]
): CalculationResult {
  const materialResult = calculateMaterialEmissions(materials);
  const transportResult = calculateTransportEmissions(transport);
  const energyResult = calculateEnergyEmissions(energy);
  const scopeEmissions = calculateScopeEmissions(materials, transport, energy);

  return {
    totalEmissions: materialResult.total + transportResult.total + energyResult.total,
    materialEmissions: materialResult.total,
    transportEmissions: transportResult.total,
    energyEmissions: energyResult.total,
    breakdownByMaterial: materialResult.breakdown,
    breakdownByTransport: transportResult.breakdown,
    breakdownByEnergy: energyResult.breakdown,
    ...scopeEmissions
  };
}

export function calculateComplianceScore(result: CalculationResult): number {
  // Basic compliance scoring based on total emissions
  const totalEmissions = result.totalEmissions;
  
  if (totalEmissions < 1000) return 100;
  if (totalEmissions < 5000) return 85;
  if (totalEmissions < 10000) return 70;
  if (totalEmissions < 20000) return 55;
  if (totalEmissions < 50000) return 40;
  return 25;
}