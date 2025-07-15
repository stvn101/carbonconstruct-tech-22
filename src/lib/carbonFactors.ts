// Carbon factors data for materials, transport, and energy calculations
// Enhanced with Australian-specific factors and NCC 2025 compliance data

// Material carbon factors (kgCO2e/kg)
export const materialCarbonFactors = {
  concrete: 0.13,
  steel: 1.70,
  aluminum: 8.40,
  timber: 0.40,
  glass: 1.10,
  plastic: 3.50,
  insulation: 1.80,
  brick: 0.50,
  // Add more materials as needed
};

// Transport carbon factors (kgCO2e/tonne-km)
export const transportCarbonFactors = {
  truck: 0.07,
  train: 0.03,
  ship: 0.01,
  plane: 0.70,
  // Add more transport modes as needed
};

// Energy carbon factors (kgCO2e/kWh) - Australian grid average
export const energyCarbonFactors = {
  electricity: 0.50, // Australian average, update based on region
  naturalGas: 0.18,
  renewableEnergy: 0.05, // Weighted average of renewables
  // Add more energy sources as needed
};

// Function to calculate material carbon footprint
export const calculateMaterialFootprint = (material: string, quantity: number): number => {
  const factor = materialCarbonFactors[material];
  if (!factor) {
    console.warn(`Carbon factor not found for material: ${material}`);
    return 0;
  }
  return factor * quantity;
};

// Function to calculate transport carbon footprint
export const calculateTransportFootprint = (mode: string, distance: number, weight: number): number => {
  const factor = transportCarbonFactors[mode];
  if (!factor) {
    console.warn(`Carbon factor not found for transport mode: ${mode}`);
    return 0;
  }
  return factor * distance * (weight / 1000); // weight in tonnes
};

// Function to calculate energy carbon footprint
export const calculateEnergyFootprint = (energySource: string, amount: number): number => {
  const factor = energyCarbonFactors[energySource];
  if (!factor) {
    console.warn(`Carbon factor not found for energy source: ${energySource}`);
    return 0;
  }
  return factor * amount;
};
