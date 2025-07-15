/**
 * Green Star Materials Calculator - TypeScript Implementation
 * Based on the Responsible Products Guidelines Version A
 * Author: Manus AI
 * Date: June 26, 2025
 */

// ============================================================================
// Type Definitions and Interfaces
// ============================================================================

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
  MANUFACTURING_HEALTH_SAFETY = 'Manufacturing Health and Safety',
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
  PACKAGING = 'Packaging',
  
  // Leadership Category
  LEADERSHIP = 'Leadership'
}

export enum AchievementLevel {
  NONE = 'None',
  GOOD_PRACTICE = 'Good Practice',
  BEST_PRACTICE = 'Best Practice'
}

export interface CreditScore {
  creditName: CreditType;
  achieved: boolean;
  score: number;
  requirements: string[];
  description: string;
}

export interface CategoryScore {
  categoryName: CategoryType;
  credits: CreditScore[];
  categoryWeight: number;
  totalPossibleScore: number;
  achievedScore: number;
}

export interface ResponsibleProductValue {
  initiativeId: string;
  initiativeName: string;
  rpvScore: number;
  categories: CategoryScore[];
  recognitionDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  description: string;
}

export interface Certification {
  initiativeId: string;
  certificateNumber: string;
  issueDate: Date;
  expiryDate?: Date;
  rpv: ResponsibleProductValue;
  verificationStatus: 'Valid' | 'Expired' | 'Pending' | 'Invalid';
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
  subcategory?: string;
}

export interface ProjectData {
  projectId: string;
  projectName: string;
  products: Product[];
  buildingLayerCosts: Map<BuildingLayer, number>;
  totalProjectCost: number;
  submissionDate: Date;
}

export interface ComplianceResult {
  buildingLayer: BuildingLayer;
  creditType: CreditType;
  totalCost: number;
  compliantCost: number;
  percentage: number;
  threshold: number;
  achieved: boolean;
  achievementLevel: AchievementLevel;
  pointsAwarded: number;
  compliantProducts: Product[];
  nonCompliantProducts: Product[];
}

export interface CreditThreshold {
  creditName: CreditType;
  buildingLayer: BuildingLayer;
  goodPracticeThreshold: number;
  bestPracticeThreshold: number;
  minimumRPV: number;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CalculationSummary {
  projectId: string;
  totalCompliance: ComplianceResult[];
  overallScore: number;
  achievedCredits: number;
  totalPossibleCredits: number;
  achievementLevel: AchievementLevel;
  recommendations: string[];
}

// ============================================================================
// Default Thresholds and Configuration
// ============================================================================

export const DEFAULT_CREDIT_THRESHOLDS: CreditThreshold[] = [
  // Structure Layer
  {
    creditName: CreditType.CORPORATE_COMMITMENT_CLIMATE,
    buildingLayer: BuildingLayer.STRUCTURE,
    goodPracticeThreshold: 50,
    bestPracticeThreshold: 75,
    minimumRPV: 10,
    description: 'Minimum percentage of structural products by cost with climate commitments'
  },
  {
    creditName: CreditType.ENVIRONMENTAL_MANAGEMENT,
    buildingLayer: BuildingLayer.STRUCTURE,
    goodPracticeThreshold: 50,
    bestPracticeThreshold: 75,
    minimumRPV: 10,
    description: 'Minimum percentage of structural products with environmental management systems'
  },
  
  // Envelope Layer
  {
    creditName: CreditType.OCCUPANT_HEALTH_SAFETY,
    buildingLayer: BuildingLayer.ENVELOPE,
    goodPracticeThreshold: 60,
    bestPracticeThreshold: 80,
    minimumRPV: 15,
    description: 'Minimum percentage of envelope products meeting health and safety requirements'
  },
  {
    creditName: CreditType.TRANSPARENT_CHAIN_CUSTODY,
    buildingLayer: BuildingLayer.ENVELOPE,
    goodPracticeThreshold: 40,
    bestPracticeThreshold: 70,
    minimumRPV: 12,
    description: 'Minimum percentage of envelope products with transparent supply chains'
  },
  
  // Systems Layer
  {
    creditName: CreditType.ENERGY_USE_REDUCTION,
    buildingLayer: BuildingLayer.SYSTEMS,
    goodPracticeThreshold: 55,
    bestPracticeThreshold: 80,
    minimumRPV: 15,
    description: 'Minimum percentage of systems with energy reduction measures'
  },
  {
    creditName: CreditType.CARBON_EMISSIONS_REDUCTION,
    buildingLayer: BuildingLayer.SYSTEMS,
    goodPracticeThreshold: 50,
    bestPracticeThreshold: 75,
    minimumRPV: 12,
    description: 'Minimum percentage of systems with carbon reduction measures'
  },
  
  // Finishes Layer
  {
    creditName: CreditType.INGREDIENT_DISCLOSURE,
    buildingLayer: BuildingLayer.FINISHES,
    goodPracticeThreshold: 70,
    bestPracticeThreshold: 90,
    minimumRPV: 10,
    description: 'Minimum percentage of finishes with full ingredient disclosure'
  },
  {
    creditName: CreditType.WASTE_GENERATION_REDUCTION,
    buildingLayer: BuildingLayer.FINISHES,
    goodPracticeThreshold: 45,
    bestPracticeThreshold: 70,
    minimumRPV: 12,
    description: 'Minimum percentage of finishes with waste reduction measures'
  }
];

// ============================================================================
// Data Validation Classes
// ============================================================================

export class DataValidator {
  /**
   * Validates a product object for completeness and logical consistency
   */
  validateProduct(product: Product): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!product.productId || product.productId.trim() === '') {
      errors.push('Product ID is required and cannot be empty');
    }

    if (!product.productName || product.productName.trim() === '') {
      errors.push('Product name is required and cannot be empty');
    }

    if (!product.manufacturer || product.manufacturer.trim() === '') {
      errors.push('Manufacturer is required and cannot be empty');
    }

    // Cost validation
    if (!product.cost || product.cost <= 0) {
      errors.push('Product cost must be greater than zero');
    }

    if (product.cost > 1000000) {
      warnings.push('Product cost is unusually high (>$1,000,000)');
    }

    // Quantity validation
    if (!product.quantity || product.quantity <= 0) {
      errors.push('Product quantity must be greater than zero');
    }

    // Building layer validation
    if (!product.buildingLayers || product.buildingLayers.length === 0) {
      errors.push('At least one building layer must be specified');
    }

    // Certification validation
    if (!product.certifications || product.certifications.length === 0) {
      warnings.push('Product has no certifications - will not contribute to compliance');
    } else {
      product.certifications.forEach((cert, index) => {
        if (!cert.certificateNumber || cert.certificateNumber.trim() === '') {
          errors.push(`Certification ${index + 1}: Certificate number is required`);
        }

        if (cert.expiryDate && cert.expiryDate < new Date()) {
          warnings.push(`Certification ${index + 1}: Certificate has expired`);
        }

        if (!cert.rpv || cert.rpv.rpvScore <= 0) {
          errors.push(`Certification ${index + 1}: Invalid or missing RPV score`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates project data for completeness
   */
  validateProjectData(projectData: ProjectData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!projectData.projectId || projectData.projectId.trim() === '') {
      errors.push('Project ID is required');
    }

    if (!projectData.projectName || projectData.projectName.trim() === '') {
      errors.push('Project name is required');
    }

    if (!projectData.products || projectData.products.length === 0) {
      errors.push('Project must contain at least one product');
    }

    // Validate each product
    let validProductCount = 0;
    projectData.products.forEach((product, index) => {
      const productValidation = this.validateProduct(product);
      if (!productValidation.isValid) {
        errors.push(`Product ${index + 1} (${product.productName}): ${productValidation.errors.join(', ')}`);
      } else {
        validProductCount++;
      }
    });

    if (validProductCount === 0) {
      errors.push('No valid products found in project');
    }

    // Validate building layer costs
    const totalCalculatedCost = projectData.products.reduce((sum, product) => sum + product.cost, 0);
    const totalDeclaredCost = Array.from(projectData.buildingLayerCosts.values()).reduce((sum, cost) => sum + cost, 0);

    if (Math.abs(totalCalculatedCost - totalDeclaredCost) > totalCalculatedCost * 0.05) {
      warnings.push('Declared building layer costs do not match sum of product costs (>5% difference)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates certification against current date and RPV requirements
   */
  validateCertification(certification: Certification): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (certification.expiryDate && certification.expiryDate < new Date()) {
      errors.push('Certification has expired');
    }

    if (!certification.rpv.isActive) {
      errors.push('Initiative is no longer active');
    }

    if (certification.rpv.expiryDate && certification.rpv.expiryDate < new Date()) {
      errors.push('Initiative recognition has expired');
    }

    if (certification.rpv.rpvScore < 5) {
      warnings.push('RPV score is very low and may not meet minimum requirements');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// ============================================================================
// Core Calculator Engine
// ============================================================================

export class ResponsibleProductsCalculator {
  private validator: DataValidator;
  private thresholds: Map<string, CreditThreshold>;

  constructor(customThresholds?: CreditThreshold[]) {
    this.validator = new DataValidator();
    this.thresholds = new Map();
    
    // Load default or custom thresholds
    const thresholdsToUse = customThresholds || DEFAULT_CREDIT_THRESHOLDS;
    thresholdsToUse.forEach(threshold => {
      const key = `${threshold.buildingLayer}-${threshold.creditName}`;
      this.thresholds.set(key, threshold);
    });
  }

  /**
   * Calculates compliance for a specific building layer and credit type
   */
  calculateCompliance(
    products: Product[],
    buildingLayer: BuildingLayer,
    creditType: CreditType
  ): ComplianceResult {
    // Filter products for the specified building layer
    const layerProducts = products.filter(product => 
      product.buildingLayers.includes(buildingLayer)
    );

    // Calculate total cost for the layer
    const totalCost = this.calculateTotalCost(layerProducts);

    // Calculate compliant cost
    const { compliantProducts, compliantCost } = this.calculateCompliantCost(
      layerProducts, 
      creditType
    );

    // Calculate percentage
    const percentage = totalCost > 0 ? (compliantCost / totalCost) * 100 : 0;

    // Get threshold for this credit
    const threshold = this.getThreshold(buildingLayer, creditType);

    // Determine achievement level
    const achievementLevel = this.determineAchievementLevel(percentage, threshold);
    const achieved = achievementLevel !== AchievementLevel.NONE;
    const pointsAwarded = this.calculatePoints(achievementLevel);

    // Identify non-compliant products
    const nonCompliantProducts = layerProducts.filter(product => 
      !compliantProducts.includes(product)
    );

    return {
      buildingLayer,
      creditType,
      totalCost,
      compliantCost,
      percentage,
      threshold: threshold.goodPracticeThreshold,
      achieved,
      achievementLevel,
      pointsAwarded,
      compliantProducts,
      nonCompliantProducts
    };
  }

  /**
   * Calculates total cost for a set of products
   */
  private calculateTotalCost(products: Product[]): number {
    return products.reduce((sum, product) => sum + product.cost, 0);
  }

  /**
   * Calculates compliant cost and identifies compliant products
   */
  private calculateCompliantCost(
    products: Product[],
    creditType: CreditType
  ): { compliantProducts: Product[]; compliantCost: number } {
    const compliantProducts: Product[] = [];
    let compliantCost = 0;

    products.forEach(product => {
      if (this.hasValidCertification(product, creditType)) {
        compliantProducts.push(product);
        compliantCost += product.cost;
      }
    });

    return { compliantProducts, compliantCost };
  }

  /**
   * Checks if a product has valid certification for a specific credit type
   */
  private hasValidCertification(product: Product, creditType: CreditType): boolean {
    return product.certifications.some(cert => {
      // Check if certification is valid
      const certValidation = this.validator.validateCertification(cert);
      if (!certValidation.isValid) {
        return false;
      }

      // Check if the certification covers the required credit
      return cert.rpv.categories.some(category => 
        category.credits.some(credit => 
          credit.creditName === creditType && credit.achieved
        )
      );
    });
  }

  /**
   * Gets the threshold for a specific building layer and credit type
   */
  private getThreshold(buildingLayer: BuildingLayer, creditType: CreditType): CreditThreshold {
    const key = `${buildingLayer}-${creditType}`;
    const threshold = this.thresholds.get(key);
    
    if (!threshold) {
      // Return default threshold if specific one not found
      return {
        creditName: creditType,
        buildingLayer,
        goodPracticeThreshold: 50,
        bestPracticeThreshold: 75,
        minimumRPV: 10,
        description: 'Default threshold'
      };
    }
    
    return threshold;
  }

  /**
   * Determines achievement level based on percentage and thresholds
   */
  private determineAchievementLevel(
    percentage: number, 
    threshold: CreditThreshold
  ): AchievementLevel {
    if (percentage >= threshold.bestPracticeThreshold) {
      return AchievementLevel.BEST_PRACTICE;
    } else if (percentage >= threshold.goodPracticeThreshold) {
      return AchievementLevel.GOOD_PRACTICE;
    } else {
      return AchievementLevel.NONE;
    }
  }

  /**
   * Calculates points awarded based on achievement level
   */
  private calculatePoints(level: AchievementLevel): number {
    switch (level) {
      case AchievementLevel.BEST_PRACTICE:
        return 3;
      case AchievementLevel.GOOD_PRACTICE:
        return 1;
      default:
        return 0;
    }
  }

  /**
   * Calculates overall project compliance across all building layers and credits
   */
  calculateProjectCompliance(projectData: ProjectData): CalculationSummary {
    // Validate project data
    const validation = this.validator.validateProjectData(projectData);
    if (!validation.isValid) {
      throw new Error(`Invalid project data: ${validation.errors.join(', ')}`);
    }

    const complianceResults: ComplianceResult[] = [];
    let totalPoints = 0;
    let totalPossiblePoints = 0;

    // Calculate compliance for each building layer and applicable credits
    Object.values(BuildingLayer).forEach(layer => {
      const layerProducts = projectData.products.filter(product => 
        product.buildingLayers.includes(layer)
      );

      if (layerProducts.length > 0) {
        // Get applicable credits for this layer
        const applicableCredits = this.getApplicableCredits(layer);
        
        applicableCredits.forEach(creditType => {
          const result = this.calculateCompliance(
            projectData.products,
            layer,
            creditType
          );
          
          complianceResults.push(result);
          totalPoints += result.pointsAwarded;
          totalPossiblePoints += 3; // Maximum points per credit
        });
      }
    });

    // Calculate overall score
    const overallScore = totalPossiblePoints > 0 ? (totalPoints / totalPossiblePoints) * 100 : 0;
    const achievedCredits = complianceResults.filter(result => result.achieved).length;

    // Determine overall achievement level
    let overallAchievementLevel: AchievementLevel;
    if (overallScore >= 75) {
      overallAchievementLevel = AchievementLevel.BEST_PRACTICE;
    } else if (overallScore >= 50) {
      overallAchievementLevel = AchievementLevel.GOOD_PRACTICE;
    } else {
      overallAchievementLevel = AchievementLevel.NONE;
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(complianceResults);

    return {
      projectId: projectData.projectId,
      totalCompliance: complianceResults,
      overallScore,
      achievedCredits,
      totalPossibleCredits: complianceResults.length,
      achievementLevel: overallAchievementLevel,
      recommendations
    };
  }

  /**
   * Gets applicable credits for a building layer
   */
  private getApplicableCredits(layer: BuildingLayer): CreditType[] {
    const applicableCredits: CreditType[] = [];
    
    this.thresholds.forEach((threshold, key) => {
      if (threshold.buildingLayer === layer) {
        applicableCredits.push(threshold.creditName);
      }
    });

    return applicableCredits;
  }

  /**
   * Generates recommendations based on compliance results
   */
  private generateRecommendations(results: ComplianceResult[]): string[] {
    const recommendations: string[] = [];

    results.forEach(result => {
      if (!result.achieved) {
        const shortfall = result.threshold - result.percentage;
        recommendations.push(
          `${result.buildingLayer} - ${result.creditType}: Increase compliant products by ${shortfall.toFixed(1)}% to achieve Good Practice (currently ${result.percentage.toFixed(1)}%)`
        );
      } else if (result.achievementLevel === AchievementLevel.GOOD_PRACTICE) {
        const threshold = this.getThreshold(result.buildingLayer, result.creditType);
        const shortfall = threshold.bestPracticeThreshold - result.percentage;
        recommendations.push(
          `${result.buildingLayer} - ${result.creditType}: Increase compliant products by ${shortfall.toFixed(1)}% to achieve Best Practice (currently ${result.percentage.toFixed(1)}%)`
        );
      }
    });

    // Add general recommendations
    if (recommendations.length === 0) {
      recommendations.push('Excellent! All credits have been achieved. Consider pursuing additional sustainability initiatives.');
    } else if (recommendations.length > 5) {
      recommendations.unshift('Consider focusing on the credits with the smallest shortfalls first for maximum impact.');
    }

    return recommendations;
  }

  /**
   * Exports calculation results to CSV format
   */
  exportToCSV(summary: CalculationSummary): string {
    const headers = [
      'Building Layer',
      'Credit Type',
      'Total Cost',
      'Compliant Cost',
      'Percentage',
      'Threshold',
      'Achievement Level',
      'Points Awarded',
      'Achieved'
    ];

    const rows = summary.totalCompliance.map(result => [
      result.buildingLayer,
      result.creditType,
      result.totalCost.toFixed(2),
      result.compliantCost.toFixed(2),
      result.percentage.toFixed(2),
      result.threshold.toFixed(2),
      result.achievementLevel,
      result.pointsAwarded.toString(),
      result.achieved ? 'Yes' : 'No'
    ]);

    // Add summary row
    rows.push([
      'SUMMARY',
      'Overall Project',
      '',
      '',
      summary.overallScore.toFixed(2),
      '',
      summary.achievementLevel,
      summary.achievedCredits.toString(),
      `${summary.achievedCredits}/${summary.totalPossibleCredits}`
    ]);

    // Convert to CSV format
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

// ============================================================================
// Utility Functions and Helpers
// ============================================================================

/**
 * Creates a sample RPV for testing purposes
 */
export function createSampleRPV(
  initiativeId: string,
  initiativeName: string,
  score: number
): ResponsibleProductValue {
  return {
    initiativeId,
    initiativeName,
    rpvScore: score,
    categories: [
      {
        categoryName: CategoryType.RESPONSIBLE,
        credits: [
          {
            creditName: CreditType.CORPORATE_COMMITMENT_CLIMATE,
            achieved: true,
            score: 3,
            requirements: ['Climate commitment by 2050', 'Science-based targets'],
            description: 'Corporate commitment to climate action'
          },
          {
            creditName: CreditType.ENVIRONMENTAL_MANAGEMENT,
            achieved: true,
            score: 2,
            requirements: ['ISO 14001 certification', 'Environmental policy'],
            description: 'Environmental management system'
          }
        ],
        categoryWeight: 0.3,
        totalPossibleScore: 15,
        achievedScore: 12
      }
    ],
    recognitionDate: new Date('2024-01-01'),
    isActive: true,
    description: `Sample RPV for ${initiativeName}`
  };
}

/**
 * Creates a sample product for testing purposes
 */
export function createSampleProduct(
  productId: string,
  productName: string,
  cost: number,
  buildingLayers: BuildingLayer[],
  certifications: Certification[] = []
): Product {
  return {
    productId,
    productName,
    manufacturer: 'Sample Manufacturer',
    description: `Sample product: ${productName}`,
    certifications,
    buildingLayers,
    cost,
    quantity: 1,
    unit: 'each',
    category: 'Building Materials',
    subcategory: 'Structural'
  };
}

/**
 * Formats currency values for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
}

/**
 * Formats percentage values for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Gets color coding for achievement levels
 */
export function getAchievementColor(level: AchievementLevel): string {
  switch (level) {
    case AchievementLevel.BEST_PRACTICE:
      return '#22c55e'; // Green
    case AchievementLevel.GOOD_PRACTICE:
      return '#f59e0b'; // Amber
    default:
      return '#ef4444'; // Red
  }
}

// ============================================================================
// Export Default Calculator Instance
// ============================================================================

export default ResponsibleProductsCalculator;

