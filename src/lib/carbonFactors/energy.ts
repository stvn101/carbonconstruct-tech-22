
/**
 * Energy-related carbon factors for calculations
 */

export interface EnergyFactor {
  name: string;
  factor: number;
  unit: string;
  description?: string;
}

export const ENERGY_FACTORS = {
  electricity: {
    name: "Electricity",
    factor: 0.79, // kg CO2e per kWh
    unit: "kWh",
    description: "Grid electricity (Australian average)"
  },
  diesel: {
    name: "Diesel",
    factor: 2.7, // kg CO2e per liter
    unit: "L",
    description: "Diesel fuel combustion"
  },
  petrol: {
    name: "Petrol",
    factor: 2.3, // kg CO2e per liter
    unit: "L",
    description: "Petrol fuel combustion"
  },
  naturalGas: {
    name: "Natural Gas",
    factor: 1.9, // kg CO2e per m³
    unit: "m³",
    description: "Natural gas combustion"
  },
  solar: {
    name: "Solar Power",
    factor: 0.04, // kg CO2e per kWh
    unit: "kWh",
    description: "Solar photovoltaic electricity"
  },
  wind: {
    name: "Wind Power",
    factor: 0.01, // kg CO2e per kWh
    unit: "kWh",
    description: "Wind turbine electricity"
  },
  hydroelectric: {
    name: "Hydroelectric",
    factor: 0.024, // kg CO2e per kWh
    unit: "kWh",
    description: "Hydroelectric power"
  },
  coal: {
    name: "Coal",
    factor: 0.95, // kg CO2e per kWh
    unit: "kWh",
    description: "Coal-fired electricity"
  },
  gasGeneration: {
    name: "Gas Generation",
    factor: 0.49, // kg CO2e per kWh
    unit: "kWh",
    description: "Gas-fired electricity generation"
  }
} as const;

export type EnergyFactorKey = keyof typeof ENERGY_FACTORS;
