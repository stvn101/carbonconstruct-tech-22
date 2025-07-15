
/**
 * Green Star Materials Calculator - Core Engine
 * Adapted for CarbonConstruct integration
 * Author: Manus AI
 * Date: June 29, 2025
 */

// ============================================================================
// Type Definitions
// ============================================================================

export enum AchievementLevel {
  NONE = 'None',
  GOOD_PRACTICE = 'Good Practice',
  BEST_PRACTICE = 'Best Practice'
}

export enum BuildingLayer {
  STRUCTURE = 'Structure',
  ENVELOPE = 'Envelope',
  SYSTEMS = 'Systems',
  FINISHES = 'Finishes'
}

export enum CategoryType {
  RESPONSIBLE = 'Responsible',
  HEALTHY = 'Healthy',
  POSITIVE = 'Positive',
  CIRCULAR = 'Circular',
  LEADERSHIP = 'Leadership'
}

export enum CreditType {
  // Responsible Category
  CORPORATE_COMMITMENT_CLIMATE = 'Corporate Commitment on Climate',
  ENVIRONMENTAL_MANAGEMENT = 'Environmental Management',
  CARBON_EMISSIONS_DISCLOSURE = 'Carbon Emissions Disclosure',
  SOCIALLY_RESPONSIBLE_EXTRACTION = 'Socially Responsible Extraction of Resources',
  TRANSPARENT_CHAIN_CUSTODY = 'Transparent Chain of Custody',
  ENVIRONMENTAL_IMPACT_DISCLOSURE = 'Environmental Impact Disclosure',
  
  // Healthy Category
  OCCUPANT_HEALTH_SAFETY = 'Occupant Health and Safety',
  CHEMICALS_OF_CONCERN = 'Chemicals of Concern',
  HEALTH_IMPACTS_DISCLOSURE = 'Health Impacts Disclosure',
  INGREDIENT_DISCLOSURE = 'Ingredient Disclosure',
  
  // Positive Category
  ENERGY_USE_REDUCTION = 'Energy Use Reduction',
  ENERGY_SOURCE = 'Energy Source',
  IMPACTS_TO_NATURE = 'Impacts to Nature',
  
  // Circular Category
  MATERIAL_EXTRACTION_IMPACT_REDUCTION = 'Material Extraction Impact Reduction',
  CARBON_EMISSIONS_REDUCTION = 'Carbon Emissions Reduction',
  WATER_USE_REDUCTION = 'Water Use Reduction',
  WASTE_GENERATION_REDUCTION = 'Waste Generation Reduction',
  PACKAGING = 'Packaging'
}

export interface Credit {
  creditName: CreditType;
  achieved: boolean;
  score: number;
  requirements: string[];
  description: string;
}

export interface Category {
  categoryName: CategoryType;
  credits: Credit[];
  categoryWeight: number;
  totalPossibleScore: number;
  achievedScore: number;
}

export interface ResponsibleProductValue {
  initiativeId: string;
  initiativeName: string;
  rpvScore: number;
  categories: Category[];
  recognitionDate: Date;
  isActive: boolean;
  description: string;
}

export interface Certification {
  initiativeId: string;
  certificateNumber: string;
  issueDate: Date;
  expiryDate: Date;
  rpv: ResponsibleProductValue;
  verificationStatus: string;
}

export interface Product {
  productId: string;
  productName: string;
  manufacturer: string;
  description: string;
  certifications: Certification[];
  buildingLayers: BuildingLayer[];
  cost: number;
  quantity: number;
  unit: string;
  category: string;
  subcategory: string;
}

export interface ProjectData {
  projectId: string;
  projectName: string;
  products: Product[];
  buildingLayerCosts: Map<BuildingLayer, number>;
  totalProjectCost: number;
  submissionDate: Date;
}

export interface CreditThreshold {
  creditName: CreditType;
  buildingLayer: BuildingLayer;
  goodPracticeThreshold: number;
  bestPracticeThreshold: number;
  minimumRPV: number;
  description: string;
}

export interface ComplianceResult {
  buildingLayer: BuildingLayer;
  creditType: CreditType;
  percentage: number;
  achieved: boolean;
  pointsAwarded: number;
  compliantCost: number;
  totalCost: number;
  compliantProducts: Product[];
  nonCompliantProducts: Product[];
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
// Utility Functions
// ============================================================================

export function formatCurrency(amount: number, currencyCode: string = 'AUD', locale: string = 'en-AU'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export function formatPercentage(value: number, minimumFractionDigits: number = 0, maximumFractionDigits: number = 2): string {
  return new Intl.NumberFormat(undefined, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function createSampleRPV(initiativeId: string, initiativeName: string, rpvScore: number): ResponsibleProductValue {
  return {
    initiativeId,
    initiativeName,
    rpvScore,
    categories: [],
    recognitionDate: new Date(),
    isActive: true,
    description: `Sample RPV for ${initiativeName}`
  };
}

export function createSampleProduct(productId: string, productName: string, manufacturer: string): Product {
  return {
    productId,
    productName,
    manufacturer,
    description: `Sample product: ${productName} by ${manufacturer}`,
    certifications: [],
    buildingLayers: [BuildingLayer.FINISHES],
    cost: 100,
    quantity: 1,
    unit: 'unit',
    category: 'Sample Category',
    subcategory: 'Sample Subcategory'
  };
}

// ============================================================================
// Data Validation
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class ProductValidator {
  private strictMode: boolean;
  private requiredFields: string[];
  private customValidators: Map<string, (value: any) => boolean>;
  private warningThresholds: Map<string, number>;

  constructor(
    strictMode: boolean = true,
    requiredFields: string[] = ['productId', 'productName', 'manufacturer', 'cost'],
    customValidators: Map<string, (value: any) => boolean> = new Map(),
    warningThresholds: Map<string, number> = new Map()
  ) {
    this.strictMode = strictMode;
    this.requiredFields = requiredFields;
    this.customValidators = customValidators;
    this.warningThresholds = warningThresholds;
  }

  validateProduct(product: Product): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    for (const field of this.requiredFields) {
      if (!product[field as keyof Product]) {
        result.isValid = false;
        result.errors.push(`Required field missing: ${field}`);
      }
    }

    if (typeof product.cost === 'number' && product.cost < 0) {
      result.isValid = false;
      result.errors.push('Cost cannot be negative');
    }

    if (typeof product.quantity === 'number' && product.quantity < 0) {
      result.warnings.push('Quantity should not be negative');
    }

    for (const [field, validator] of this.customValidators) {
      if (!validator(product[field as keyof Product])) {
        result.isValid = false;
        result.errors.push(`Validation failed for ${field}`);
      }
    }

    for (const [field, threshold] of this.warningThresholds) {
      const value = product[field as keyof Product];
      if (typeof value === 'number' && value > threshold) {
        result.warnings.push(`Value for ${field} exceeds threshold`);
      }
    }

    return result;
  }
}

// ============================================================================
// Calculation Engine
// ============================================================================

interface CalculationOptions {
  includeWarnings: boolean;
  strictValidation: boolean;
  roundingPrecision: number;
  currencyCode: string;
  dateFormat: string;
}

export class ResponsibleProductsCalculator {
  private thresholds: CreditThreshold[];
  private options: CalculationOptions;
  private validator: ProductValidator;
  private calculatorVersion: string;

  constructor(thresholds?: CreditThreshold[], options?: CalculationOptions) {
    this.thresholds = thresholds || [];
    this.options = options || {
      includeWarnings: true,
      strictValidation: true,
      roundingPrecision: 2,
      currencyCode: 'AUD',
      dateFormat: 'dd/MM/yyyy'
    };
    this.validator = new ProductValidator(this.options.strictValidation);
    this.calculatorVersion = '1.0.0';
  }

  calculateCompliance(products: Product[], buildingLayer: BuildingLayer, creditType: CreditType): ComplianceResult {
    const layerProducts = products.filter(product => product.buildingLayers.includes(buildingLayer));
    const totalCost = layerProducts.reduce((sum, product) => sum + product.cost, 0);
    const compliantProducts = layerProducts.filter(product =>
      product.certifications.some(cert => cert.rpv && cert.rpv.categories.some(cat =>
        cat.credits.some(credit => credit.creditName === creditType && credit.achieved)
      ))
    );
    const compliantCost = compliantProducts.reduce((sum, product) => sum + product.cost, 0);
    const percentage = totalCost > 0 ? compliantCost / totalCost : 0;

    const threshold = this.thresholds.find(t => t.creditName === creditType && t.buildingLayer === buildingLayer);
    const goodPracticeThreshold = threshold?.goodPracticeThreshold || 0.6;
    const bestPracticeThreshold = threshold?.bestPracticeThreshold || 0.85;

    let achievementLevel: AchievementLevel = AchievementLevel.NONE;
    if (percentage >= bestPracticeThreshold) {
      achievementLevel = AchievementLevel.BEST_PRACTICE;
    } else if (percentage >= goodPracticeThreshold) {
      achievementLevel = AchievementLevel.GOOD_PRACTICE;
    }

    const pointsAwarded = this.calculatePoints(achievementLevel);
    const nonCompliantProducts = layerProducts.filter(product => !compliantProducts.includes(product));

    return {
      buildingLayer,
      creditType,
      percentage,
      achieved: achievementLevel !== AchievementLevel.NONE,
      pointsAwarded,
      compliantCost,
      totalCost,
      compliantProducts,
      nonCompliantProducts
    };
  }

  private calculatePoints(achievementLevel: AchievementLevel): number {
    switch (achievementLevel) {
      case AchievementLevel.BEST_PRACTICE:
        return 3;
      case AchievementLevel.GOOD_PRACTICE:
        return 2;
      default:
        return 0;
    }
  }

  calculateProjectCompliance(project: ProjectData): CalculationSummary {
    const totalCompliance: ComplianceResult[] = [];
    let overallScore = 0;
    let achievedCredits = 0;
    let totalPossibleCredits = 0;
    const recommendations: string[] = [];

    for (const layer of Object.values(BuildingLayer)) {
      for (const credit of Object.values(CreditType)) {
        const result = this.calculateCompliance(project.products, layer, credit);
        totalCompliance.push(result);
        overallScore += result.percentage;
        if (result.achieved) {
          achievedCredits++;
        }
        totalPossibleCredits++;

        if (result.percentage < 0.5) {
          recommendations.push(`Improve compliance for ${credit} in ${layer}`);
        }
      }
    }

    overallScore = totalCompliance.reduce((sum, compliance) => sum + compliance.percentage, 0) / totalCompliance.length;

    let achievementLevel: AchievementLevel = AchievementLevel.NONE;
    if (overallScore >= 0.85) {
      achievementLevel = AchievementLevel.BEST_PRACTICE;
    } else if (overallScore >= 0.6) {
      achievementLevel = AchievementLevel.GOOD_PRACTICE;
    }

    return {
      projectId: project.projectId,
      totalCompliance,
      overallScore,
      achievedCredits,
      totalPossibleCredits,
      achievementLevel,
      recommendations,
      calculationDate: new Date(),
      calculatorVersion: this.calculatorVersion
    };
  }

  exportToCSV(summary: CalculationSummary): string {
    let csv = 'Building Layer,Credit Type,Percentage,Achieved,Points Awarded,Compliant Cost,Total Cost\n';
    for (const result of summary.totalCompliance) {
      csv += `${result.buildingLayer},${result.creditType},${formatPercentage(result.percentage)},${result.achieved},${result.pointsAwarded},${formatCurrency(result.compliantCost)},${formatCurrency(result.totalCost)}\n`;
    }
    csv += `\nOverall Score,${formatPercentage(summary.overallScore)}\n`;
    csv += `Achievement Level,${summary.achievementLevel}\n`;
    csv += `Credits Achieved,${summary.achievedCredits}/${summary.totalPossibleCredits}\n`;
    return csv;
  }
}
