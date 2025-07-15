
/**
 * Green Star Materials Calculator - Additional Type Definitions
 * Author: Manus AI
 * Date: June 29, 2025
 */

// Import types from calculator first
import type {
  AchievementLevel,
  BuildingLayer,
  CategoryType,
  CreditType,
  Credit,
  Category,
  ResponsibleProductValue,
  Certification,
  Product,
  ProjectData,
  CreditThreshold,
  ComplianceResult,
  CalculationSummary
} from './calculator';

// Re-export main types from calculator for convenience
export type {
  AchievementLevel,
  BuildingLayer,
  CategoryType,
  CreditType,
  Credit,
  Category,
  ResponsibleProductValue,
  Certification,
  Product,
  ProjectData,
  CreditThreshold,
  ComplianceResult,
  CalculationSummary
} from './calculator';

// Additional utility types specific to the Green Star implementation
export interface GreenStarConfig {
  apiUrl?: string;
  enableCaching?: boolean;
  cacheExpiryHours?: number;
  defaultCurrency?: string;
  defaultLocale?: string;
}

export interface GreenStarApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface InitiativeSearchCriteria {
  name?: string;
  minRpvScore?: number;
  maxRpvScore?: number;
  categories?: CategoryType[];
  isActive?: boolean;
}

export interface ProductSearchCriteria {
  name?: string;
  manufacturer?: string;
  buildingLayers?: BuildingLayer[];
  minCost?: number;
  maxCost?: number;
  hasCertification?: boolean;
}

export interface BatchCalculationRequest {
  projects: ProjectData[];
  options?: {
    parallel?: boolean;
    maxConcurrency?: number;
    includeDetailedReports?: boolean;
  };
}

export interface BatchCalculationResult {
  projectId: string;
  summary: CalculationSummary;
  processingTime: number;
  errors?: string[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiryTime: number;
}

export interface DataValidationOptions {
  strictMode: boolean;
  requiredFields: string[];
  customValidators: Map<string, (value: any) => boolean>;
  warningThresholds: Map<string, number>;
}
