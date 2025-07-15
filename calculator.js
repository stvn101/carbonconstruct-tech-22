/**
 * Green Star Materials Calculator - JavaScript Implementation
 * Based on the Responsible Products Guidelines Version A
 * Author: Manus AI
 * Date: June 26, 2025
 */

// ============================================================================
// Enums and Constants
// ============================================================================

export const BuildingLayer = {
  STRUCTURE: 'Structure',
  ENVELOPE: 'Envelope',
  SYSTEMS: 'Systems',
  FINISHES: 'Finishes'
};

export const CategoryType = {
  RESPONSIBLE: 'Responsible',
  HEALTHY: 'Healthy',
  POSITIVE: 'Positive',
  CIRCULAR: 'Circular',
  LEADERSHIP: 'Leadership'
};

export const CreditType = {
  // Responsible Category
  CORPORATE_COMMITMENT_CLIMATE: 'Corporate Commitment on Climate',
  ENVIRONMENTAL_MANAGEMENT: 'Environmental Management',
  CARBON_EMISSIONS_DISCLOSURE: 'Carbon Emissions Disclosure',
  SOCIALLY_RESPONSIBLE_EXTRACTION: 'Socially Responsible Extraction of Resources',
  TRANSPARENT_CHAIN_CUSTODY: 'Transparent Chain of Custody',
  ENVIRONMENTAL_IMPACT_DISCLOSURE: 'Environmental Impact Disclosure',
  
  // Healthy Category
  OCCUPANT_HEALTH_SAFETY: 'Occupant Health and Safety',
  MANUFACTURING_HEALTH_SAFETY: 'Manufacturing Health and Safety',
  CHEMICALS_OF_CONCERN: 'Chemicals of Concern',
  HEALTH_IMPACTS_DISCLOSURE: 'Health Impacts Disclosure',
  INGREDIENT_DISCLOSURE: 'Ingredient Disclosure',
  
  // Positive Category
  ENERGY_USE_REDUCTION: 'Energy Use Reduction',
  ENERGY_SOURCE: 'Energy Source',
  IMPACTS_TO_NATURE: 'Impacts to Nature',
  
  // Circular Category
  MATERIAL_EXTRACTION_IMPACT_REDUCTION: 'Material Extraction Impact Reduction',
  CARBON_EMISSIONS_REDUCTION: 'Carbon Emissions Reduction',
  WATER_USE_REDUCTION: 'Water Use Reduction',
  WASTE_GENERATION_REDUCTION: 'Waste Generation Reduction',
  PACKAGING: 'Packaging',
  
  // Leadership Category
  LEADERSHIP: 'Leadership'
};

export const AchievementLevel = {
  NONE: 'None',
  GOOD_PRACTICE: 'Good Practice',
  BEST_PRACTICE: 'Best Practice'
};

// ============================================================================
// Default Thresholds and Configuration
// ============================================================================

export const DEFAULT_CREDIT_THRESHOLDS = [
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
// Data Validation Class
// ============================================================================

export class DataValidator {
  validateProduct(product) {
    const errors = [];
    const warnings = [];

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

        if (cert.expiryDate && new Date(cert.expiryDate) < new Date()) {
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

  validateCertification(certification) {
    const errors = [];
    const warnings = [];

    if (certification.expiryDate && new Date(certification.expiryDate) < new Date()) {
      errors.push('Certification has expired');
    }

    if (!certification.rpv.isActive) {
      errors.push('Initiative is no longer active');
    }

    if (certification.rpv.expiryDate && new Date(certification.rpv.expiryDate) < new Date()) {
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
  constructor(customThresholds = null) {
    this.validator = new DataValidator();
    this.thresholds = new Map();
    
    // Load default or custom thresholds
    const thresholdsToUse = customThresholds || DEFAULT_CREDIT_THRESHOLDS;
    thresholdsToUse.forEach(threshold => {
      const key = `${threshold.buildingLayer}-${threshold.creditName}`;
      this.thresholds.set(key, threshold);
    });
  }

  calculateCompliance(products, buildingLayer, creditType) {
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

  calculateTotalCost(products) {
    return products.reduce((sum, product) => sum + product.cost, 0);
  }

  calculateCompliantCost(products, creditType) {
    const compliantProducts = [];
    let compliantCost = 0;

    products.forEach(product => {
      if (this.hasValidCertification(product, creditType)) {
        compliantProducts.push(product);
        compliantCost += product.cost;
      }
    });

    return { compliantProducts, compliantCost };
  }

  hasValidCertification(product, creditType) {
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

  getThreshold(buildingLayer, creditType) {
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

  determineAchievementLevel(percentage, threshold) {
    if (percentage >= threshold.bestPracticeThreshold) {
      return AchievementLevel.BEST_PRACTICE;
    } else if (percentage >= threshold.goodPracticeThreshold) {
      return AchievementLevel.GOOD_PRACTICE;
    } else {
      return AchievementLevel.NONE;
    }
  }

  calculatePoints(level) {
    switch (level) {
      case AchievementLevel.BEST_PRACTICE:
        return 3;
      case AchievementLevel.GOOD_PRACTICE:
        return 1;
      default:
        return 0;
    }
  }

  calculateProjectCompliance(projectData) {
    const complianceResults = [];
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
    let overallAchievementLevel;
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
      recommendations,
      calculationDate: new Date(),
      calculatorVersion: '1.0'
    };
  }

  getApplicableCredits(layer) {
    const applicableCredits = [];
    
    this.thresholds.forEach((threshold, key) => {
      if (threshold.buildingLayer === layer) {
        applicableCredits.push(threshold.creditName);
      }
    });

    return applicableCredits;
  }

  generateRecommendations(results) {
    const recommendations = [];

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

  exportToCSV(summary) {
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
// Utility Functions
// ============================================================================

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
}

export function formatPercentage(value) {
  return `${value.toFixed(1)}%`;
}

export function getAchievementColor(level) {
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
// Sample Data
// ============================================================================

export const sampleInitiatives = [
  {
    initiativeId: 'GBCA-001',
    initiativeName: 'Green Building Materials Certification',
    rpvScore: 85,
    categories: [
      {
        categoryName: CategoryType.RESPONSIBLE,
        credits: [
          {
            creditName: CreditType.CORPORATE_COMMITMENT_CLIMATE,
            achieved: true,
            score: 3,
            requirements: ['Net zero commitment by 2050', 'Science-based targets approved'],
            description: 'Corporate climate commitment with verified targets'
          },
          {
            creditName: CreditType.ENVIRONMENTAL_MANAGEMENT,
            achieved: true,
            score: 3,
            requirements: ['ISO 14001 certified', 'Annual environmental reporting'],
            description: 'Comprehensive environmental management system'
          },
          {
            creditName: CreditType.TRANSPARENT_CHAIN_CUSTODY,
            achieved: true,
            score: 2,
            requirements: ['Third-party verified supply chain', 'Public disclosure'],
            description: 'Transparent and traceable supply chain'
          }
        ],
        categoryWeight: 0.25,
        totalPossibleScore: 15,
        achievedScore: 12
      },
      {
        categoryName: CategoryType.HEALTHY,
        credits: [
          {
            creditName: CreditType.OCCUPANT_HEALTH_SAFETY,
            achieved: true,
            score: 3,
            requirements: ['Low VOC emissions', 'Health impact assessment'],
            description: 'Products meet strict health and safety standards'
          },
          {
            creditName: CreditType.INGREDIENT_DISCLOSURE,
            achieved: true,
            score: 2,
            requirements: ['100% ingredient disclosure', 'Health hazard assessment'],
            description: 'Complete transparency of product ingredients'
          }
        ],
        categoryWeight: 0.25,
        totalPossibleScore: 10,
        achievedScore: 8
      }
    ],
    recognitionDate: new Date('2024-01-15'),
    isActive: true,
    description: 'Comprehensive green building materials certification program'
  }
];

export function createSampleProducts() {
  return [
    {
      productId: 'STR-001',
      productName: 'Sustainable Steel Beams',
      manufacturer: 'GreenSteel Industries',
      description: 'High-strength steel beams made from 90% recycled content',
      certifications: [
        {
          initiativeId: 'GBCA-001',
          certificateNumber: 'GBCA-STR-2024-001',
          issueDate: new Date('2024-01-20'),
          expiryDate: new Date('2027-01-20'),
          rpv: sampleInitiatives[0],
          verificationStatus: 'Valid'
        }
      ],
      buildingLayers: [BuildingLayer.STRUCTURE],
      cost: 125000,
      quantity: 50,
      unit: 'tonnes',
      category: 'Structural Steel',
      subcategory: 'Beams'
    },
    {
      productId: 'ENV-001',
      productName: 'Triple Glazed Windows',
      manufacturer: 'ClearView Sustainable Windows',
      description: 'High-performance triple glazed windows with recycled aluminum frames',
      certifications: [
        {
          initiativeId: 'GBCA-001',
          certificateNumber: 'GBCA-WIN-2024-003',
          issueDate: new Date('2024-03-01'),
          expiryDate: new Date('2027-03-01'),
          rpv: sampleInitiatives[0],
          verificationStatus: 'Valid'
        }
      ],
      buildingLayers: [BuildingLayer.ENVELOPE],
      cost: 45000,
      quantity: 120,
      unit: 'square metres',
      category: 'Windows',
      subcategory: 'Glazed'
    },
    {
      productId: 'FIN-001',
      productName: 'Bamboo Flooring',
      manufacturer: 'Sustainable Surfaces',
      description: 'FSC certified bamboo flooring with low-VOC finish',
      certifications: [
        {
          initiativeId: 'GBCA-001',
          certificateNumber: 'GBCA-FLR-2024-005',
          issueDate: new Date('2024-01-30'),
          expiryDate: new Date('2027-01-30'),
          rpv: sampleInitiatives[0],
          verificationStatus: 'Valid'
        }
      ],
      buildingLayers: [BuildingLayer.FINISHES],
      cost: 18000,
      quantity: 300,
      unit: 'square metres',
      category: 'Flooring',
      subcategory: 'Timber'
    },
    {
      productId: 'STR-002',
      productName: 'Standard Steel Beams',
      manufacturer: 'Traditional Steel Co',
      description: 'Standard steel beams without sustainability certification',
      certifications: [],
      buildingLayers: [BuildingLayer.STRUCTURE],
      cost: 75000,
      quantity: 30,
      unit: 'tonnes',
      category: 'Structural Steel',
      subcategory: 'Beams'
    }
  ];
}

export function createSampleProject() {
  const products = createSampleProducts();
  
  // Calculate building layer costs
  const buildingLayerCosts = new Map();
  
  Object.values(BuildingLayer).forEach(layer => {
    const layerCost = products
      .filter(product => product.buildingLayers.includes(layer))
      .reduce((sum, product) => sum + product.cost, 0);
    buildingLayerCosts.set(layer, layerCost);
  });

  const totalProjectCost = Array.from(buildingLayerCosts.values())
    .reduce((sum, cost) => sum + cost, 0);

  return {
    projectId: 'PROJ-2024-001',
    projectName: 'Green Office Building - Sydney CBD',
    products,
    buildingLayerCosts,
    totalProjectCost,
    submissionDate: new Date()
  };
}

