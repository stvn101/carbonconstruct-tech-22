export interface BaseInput {
  id: string;
  quantity: number;
  unit: string;
  notes?: string;
  source?: string;
  verified?: boolean;
}

export interface MaterialInput extends BaseInput {
  type: string;
  carbonFootprint?: number;
  supplier?: string;
  region?: string;
  category?: string;
  recycledContent?: number;
  biogenicCarbon?: number;
  endOfLifeScenario?: string;
}

export interface TransportInput extends BaseInput {
  type: string;
  distance: number;
  fuelType?: string;
  loadFactor?: number;
  returnTrip?: boolean;
  transportMode?: string;
  efficiency?: number;
}

export interface EnergyInput extends BaseInput {
  type: string;
  amount: number;
  source?: string;
  renewablePercentage?: number;
  peak?: boolean;
  timeOfUse?: string;
  tariff?: string;
}

export interface EmissionResult {
  total: number;
  breakdown: Record<string, number>;
  uncertainty?: number;
  dataQuality?: 'High' | 'Medium' | 'Low';
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
  uncertainty?: number;
  dataQuality?: 'High' | 'Medium' | 'Low';
  calculatedAt?: string;
  methodology?: string;
}

export interface ComplianceResult {
  score: number;
  level: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  standards: {
    ncc: { compliant: boolean; score: number; requirements: string[] };
    nabers: { rating: number; compliant: boolean; target: number };
    greenStar: { points: number; category: string; target: number };
    leed: { points: number; level: string; target: number };
    breeam: { score: number; rating: string; target: number };
  };
  recommendations: string[];
  improvements: Array<{
    action: string;
    impact: number;
    cost: 'Low' | 'Medium' | 'High';
    timeline: string;
  }>;
}

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  result?: CalculationResult;
  compliance?: ComplianceResult;
  status: 'draft' | 'calculating' | 'completed' | 'archived';
  tags: string[];
  total_emissions: number;
  premium_only: boolean;
  region?: string;
  projectType?: string;
  buildingType?: string;
  floorArea?: number;
  constructionYear?: number;
}

export interface CalculatorConfig {
  autoCalculate: boolean;
  showUncertainty: boolean;
  defaultRegion: string;
  units: 'metric' | 'imperial';
  precision: number;
  includeScope3: boolean;
  methodology: 'ISO14040' | 'GHGProtocol' | 'PAS2080';
}

export interface MaterialCategory {
  id: string;
  name: string;
  description: string;
  emissionFactor: number;
  unit: string;
  region: string;
  source: string;
  dataQuality: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  subcategories?: MaterialCategory[];
}

export interface TransportMode {
  id: string;
  name: string;
  emissionFactor: number;
  unit: string;
  fuelType: string;
  efficiency: number;
  loadFactor: number;
  description: string;
}

export interface EnergySource {
  id: string;
  name: string;
  emissionFactor: number;
  unit: string;
  renewable: boolean;
  region: string;
  peakFactor?: number;
  description: string;
}

export interface CalculationMetadata {
  version: string;
  methodology: string;
  emissionFactorsVersion: string;
  calculatedAt: string;
  calculatedBy: string;
  validated: boolean;
  validatedAt?: string;
  validatedBy?: string;
}

export type CalculatorTab = 
  | 'dashboard'
  | 'materials'
  | 'transport'
  | 'energy'
  | 'results'
  | 'compliance'
  | 'export'
  | 'settings';

export interface CalculatorActions {
  addMaterial: (material: Omit<MaterialInput, 'id'>) => void;
  updateMaterial: (id: string, updates: Partial<MaterialInput>) => void;
  removeMaterial: (id: string) => void;
  addTransport: (transport: Omit<TransportInput, 'id'>) => void;
  updateTransport: (id: string, updates: Partial<TransportInput>) => void;
  removeTransport: (id: string) => void;
  addEnergy: (energy: Omit<EnergyInput, 'id'>) => void;
  updateEnergy: (id: string, updates: Partial<EnergyInput>) => void;
  removeEnergy: (id: string) => void;
  calculate: () => Promise<void>;
  reset: () => void;
  resetSection: (section: 'materials' | 'transport' | 'energy') => void;
  loadProject: (project: Partial<ProjectData>) => void;
  exportData: (format: 'pdf' | 'csv' | 'json') => Promise<void>;
  saveProject: (name: string) => Promise<boolean>;
  resetCalculator: (calculator: string) => void;
  resetAll: () => void;
}