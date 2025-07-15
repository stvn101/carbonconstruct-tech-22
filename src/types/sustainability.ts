
/**
 * Unified sustainability types to prevent conflicts
 */

import { MaterialInput } from '@/lib/carbonExports';
import { SustainableMaterial } from '@/lib/materialCategories';

export interface SustainabilityIssue {
  id: string;
  title: string;
  description: string;
  recommendation: string;
}

export interface SustainabilityStrength {
  id: string;
  title: string;
  description: string;
  impact: string;
}

export interface HighImpactMaterial {
  id: string;
  name: string;
  carbonFootprint: number;
  quantity: number;
}

export interface MaterialAnalysisResult {
  materialScores: Record<string, number>;
  impactSummary: string;
  highImpactMaterials: HighImpactMaterial[];
  sustainabilityScore: number;
  sustainabilityPercentage: number;
  recommendations: string[];
  alternatives: Record<string, SustainableMaterial[]>;
  sustainabilityIssues: SustainabilityIssue[];
  categories?: Record<string, MaterialInput[]>;
  materialCount?: number;
  sustainabilityStrengths?: SustainabilityStrength[];
  averageCarbonFootprint?: number;
  materialWithHighestFootprint?: MaterialInput | null;
}

export interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigateTab: (direction: "next" | "prev") => void;
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
}
