/**
 * Green Star Materials Calculator - Additional Type Definitions
 * Supporting interfaces and types for the calculator implementation
 * Author: Manus AI
 * Date: June 26, 2025
 */

import { 
  BuildingLayer, 
  CategoryType, 
  CreditType, 
  AchievementLevel,
  ResponsibleProductValue,
  Product,
  ComplianceResult
} from './green-star-calculator';

// ============================================================================
// Extended Interface Definitions
// ============================================================================

export interface InitiativeDatabase {
  initiatives: Map<string, ResponsibleProductValue>;
  lastUpdated: Date;
  version: string;
}

export interface ProductDatabase {
  products: Map<string, Product>;
  searchIndex: Map<string, string[]>; // keyword -> product IDs
  lastUpdated: Date;
  version: string;
}

export interface ProjectConfiguration {
  projectId: string;
  projectName: string;
  projectType: 'Commercial' | 'Residential' | 'Industrial' | 'Mixed Use';
  location: string;
  targetRating: 'Good Practice' | 'Best Practice';
  customThresholds?: CreditThreshold[];
  excludedCredits?: CreditType[];
}

export interface CreditThreshold {
  creditName: CreditType;
  buildingLayer: BuildingLayer;
  goodPracticeThreshold: number;
  bestPracticeThreshold: number;
  minimumRPV: number;
  description: string;
}

export interface CalculationOptions {
  includeWarnings: boolean;
  strictValidation: boolean;
  roundingPrecision: number;
  currencyCode: string;
  dateFormat: string;
}

export interface ReportConfiguration {
  includeDetailedBreakdown: boolean;
  includeRecommendations: boolean;
  includeProductLists: boolean;
  includeCharts: boolean;
  format: 'PDF' | 'HTML' | 'CSV' | 'JSON';
}

// ============================================================================
// API Integration Interfaces
// ============================================================================

export interface GBCAApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
  version: string;
}

export interface InitiativeSearchCriteria {
  name?: string;
  category?: CategoryType;
  minimumRPV?: number;
  isActive?: boolean;
  recognitionDateFrom?: Date;
  recognitionDateTo?: Date;
}

export interface ProductSearchCriteria {
  name?: string;
  manufacturer?: string;
  category?: string;
  buildingLayer?: BuildingLayer;
  hasCertification?: boolean;
  minCost?: number;
  maxCost?: number;
}

export interface DataSyncStatus {
  lastSync: Date;
  nextScheduledSync: Date;
  status: 'Success' | 'Failed' | 'In Progress' | 'Pending';
  recordsUpdated: number;
  errors: string[];
}

// ============================================================================
// Calculation History and Audit Trail
// ============================================================================

export interface CalculationHistory {
  calculationId: string;
  projectId: string;
  timestamp: Date;
  userId?: string;
  inputData: any; // Serialized project data
  results: CalculationSummary;
  version: string;
  notes?: string;
}

export interface AuditLogEntry {
  timestamp: Date;
  action: 'Calculate' | 'Update' | 'Delete' | 'Export' | 'Import';
  userId?: string;
  projectId: string;
  details: string;
  ipAddress?: string;
}

export interface CalculationSummary {
  projectId: string;
  totalCompliance: ComplianceResult[];
  overallScore: number;
  achievedCredits: number;
  totalPossibleCredits: number;
  achievementLevel: AchievementLevel;
  recommendations: string[];
  calculationDate: Date;
  calculatorVersion: string;
}

// ============================================================================
// Error Handling and Validation
// ============================================================================

export interface ValidationError {
  field: string;
  value: any;
  message: string;
  severity: 'Error' | 'Warning' | 'Info';
  code: string;
}

export interface CalculationError extends Error {
  code: string;
  details: any;
  timestamp: Date;
  projectId?: string;
}

export interface DataIntegrityCheck {
  checkType: string;
  passed: boolean;
  message: string;
  affectedRecords: string[];
  timestamp: Date;
}

// ============================================================================
// Reporting and Analytics
// ============================================================================

export interface ComplianceAnalytics {
  averageComplianceByLayer: Map<BuildingLayer, number>;
  averageComplianceByCredit: Map<CreditType, number>;
  mostCommonFailures: CreditType[];
  topPerformingInitiatives: string[];
  costDistribution: Map<BuildingLayer, number>;
  trendData: ComplianceTrend[];
}

export interface ComplianceTrend {
  date: Date;
  overallScore: number;
  achievedCredits: number;
  totalProjects: number;
}

export interface BenchmarkData {
  projectType: string;
  location: string;
  averageScore: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  sampleSize: number;
}

// ============================================================================
// Import/Export Formats
// ============================================================================

export interface CSVImportMapping {
  productIdColumn: string;
  productNameColumn: string;
  manufacturerColumn: string;
  costColumn: string;
  buildingLayerColumn: string;
  certificationColumns: string[];
  customMappings: Map<string, string>;
}

export interface ExportOptions {
  format: 'CSV' | 'Excel' | 'JSON' | 'PDF';
  includeHeaders: boolean;
  includeMetadata: boolean;
  dateFormat: string;
  currencyFormat: string;
  decimalPlaces: number;
}

export interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsImported: number;
  recordsSkipped: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  summary: string;
}

// ============================================================================
// User Management and Permissions
// ============================================================================

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  role: 'Admin' | 'Calculator' | 'Viewer';
  permissions: Permission[];
  lastLogin: Date;
  preferences: UserPreferences;
}

export interface Permission {
  resource: string;
  actions: ('Create' | 'Read' | 'Update' | 'Delete' | 'Export')[];
}

export interface UserPreferences {
  defaultCurrency: string;
  defaultDateFormat: string;
  defaultRoundingPrecision: number;
  emailNotifications: boolean;
  autoSaveInterval: number;
}

// ============================================================================
// Configuration and Settings
// ============================================================================

export interface SystemConfiguration {
  version: string;
  environment: 'Development' | 'Testing' | 'Production';
  apiEndpoints: Map<string, string>;
  cacheSettings: CacheConfiguration;
  validationRules: ValidationRuleSet;
  reportingSettings: ReportingConfiguration;
}

export interface CacheConfiguration {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  maxSize: number;
  strategy: 'LRU' | 'FIFO' | 'LFU';
}

export interface ValidationRuleSet {
  strictMode: boolean;
  requiredFields: string[];
  customValidators: Map<string, (value: any) => boolean>;
  warningThresholds: Map<string, number>;
}

export interface ReportingConfiguration {
  defaultFormat: string;
  maxReportSize: number;
  includeCharts: boolean;
  chartLibrary: string;
  templatePath: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type CalculationStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed' | 'Cancelled';

export type DataSource = 'Manual Entry' | 'CSV Import' | 'API Integration' | 'Database Sync';

export type NotificationType = 'Info' | 'Warning' | 'Error' | 'Success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style: 'Primary' | 'Secondary' | 'Danger';
}

// ============================================================================
// Event System
// ============================================================================

export interface CalculatorEvent {
  type: string;
  timestamp: Date;
  data: any;
  source: string;
}

export interface EventHandler<T = any> {
  (event: CalculatorEvent & { data: T }): void;
}

export interface EventSubscription {
  eventType: string;
  handler: EventHandler;
  once: boolean;
}

// ============================================================================
// Plugin System
// ============================================================================

export interface CalculatorPlugin {
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies: string[];
  initialize: (calculator: any) => void;
  destroy: () => void;
}

export interface PluginConfiguration {
  enabled: boolean;
  settings: Map<string, any>;
  loadOrder: number;
}

// ============================================================================
// Export All Types
// ============================================================================

export * from './green-star-calculator';

