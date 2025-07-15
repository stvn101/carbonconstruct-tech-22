/**
 * Green Star Materials Calculator - Usage Examples and Sample Data
 * Demonstrates how to use the calculator with realistic data
 * Author: Manus AI
 * Date: June 26, 2025
 */

import {
  ResponsibleProductsCalculator,
  BuildingLayer,
  CategoryType,
  CreditType,
  AchievementLevel,
  Product,
  ProjectData,
  ResponsibleProductValue,
  Certification,
  createSampleRPV,
  createSampleProduct,
  formatCurrency,
  formatPercentage
} from './green-star-calculator';

// ============================================================================
// Sample Initiative Data
// ============================================================================

export const sampleInitiatives: ResponsibleProductValue[] = [
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
  },
  {
    initiativeId: 'CRADLE-002',
    initiativeName: 'Cradle to Cradle Certified',
    rpvScore: 92,
    categories: [
      {
        categoryName: CategoryType.CIRCULAR,
        credits: [
          {
            creditName: CreditType.MATERIAL_EXTRACTION_IMPACT_REDUCTION,
            achieved: true,
            score: 3,
            requirements: ['Renewable material content >50%', 'Responsible sourcing'],
            description: 'Significant reduction in material extraction impacts'
          },
          {
            creditName: CreditType.WASTE_GENERATION_REDUCTION,
            achieved: true,
            score: 3,
            requirements: ['Zero waste to landfill', 'Circular design principles'],
            description: 'Comprehensive waste reduction and circular design'
          }
        ],
        categoryWeight: 0.3,
        totalPossibleScore: 12,
        achievedScore: 11
      }
    ],
    recognitionDate: new Date('2024-02-01'),
    isActive: true,
    description: 'Leading circular economy certification for building products'
  },
  {
    initiativeId: 'ENERGY-003',
    initiativeName: 'Energy Efficient Products Initiative',
    rpvScore: 78,
    categories: [
      {
        categoryName: CategoryType.POSITIVE,
        credits: [
          {
            creditName: CreditType.ENERGY_USE_REDUCTION,
            achieved: true,
            score: 3,
            requirements: ['30% energy reduction vs baseline', 'Energy monitoring'],
            description: 'Significant energy efficiency improvements'
          },
          {
            creditName: CreditType.ENERGY_SOURCE,
            achieved: true,
            score: 2,
            requirements: ['100% renewable energy in manufacturing', 'Green energy certificates'],
            description: 'Manufacturing powered by renewable energy'
          }
        ],
        categoryWeight: 0.2,
        totalPossibleScore: 8,
        achievedScore: 7
      }
    ],
    recognitionDate: new Date('2024-03-10'),
    isActive: true,
    description: 'Certification for energy-efficient building products and systems'
  }
];

// ============================================================================
// Sample Product Data
// ============================================================================

export function createSampleProducts(): Product[] {
  const products: Product[] = [];

  // Structure products
  products.push({
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
  });

  products.push({
    productId: 'STR-002',
    productName: 'Low Carbon Concrete',
    manufacturer: 'EcoConcrete Solutions',
    description: 'High-performance concrete with 40% reduced carbon footprint',
    certifications: [
      {
        initiativeId: 'GBCA-001',
        certificateNumber: 'GBCA-CON-2024-002',
        issueDate: new Date('2024-02-15'),
        expiryDate: new Date('2027-02-15'),
        rpv: sampleInitiatives[0],
        verificationStatus: 'Valid'
      },
      {
        initiativeId: 'CRADLE-002',
        certificateNumber: 'C2C-CON-2024-001',
        issueDate: new Date('2024-02-20'),
        expiryDate: new Date('2026-02-20'),
        rpv: sampleInitiatives[1],
        verificationStatus: 'Valid'
      }
    ],
    buildingLayers: [BuildingLayer.STRUCTURE],
    cost: 85000,
    quantity: 200,
    unit: 'cubic metres',
    category: 'Concrete',
    subcategory: 'Ready Mix'
  });

  // Envelope products
  products.push({
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
  });

  products.push({
    productId: 'ENV-002',
    productName: 'Insulated Wall Panels',
    manufacturer: 'ThermalShield Products',
    description: 'High R-value wall panels with natural fiber insulation',
    certifications: [
      {
        initiativeId: 'GBCA-001',
        certificateNumber: 'GBCA-INS-2024-004',
        issueDate: new Date('2024-01-25'),
        expiryDate: new Date('2027-01-25'),
        rpv: sampleInitiatives[0],
        verificationStatus: 'Valid'
      }
    ],
    buildingLayers: [BuildingLayer.ENVELOPE],
    cost: 32000,
    quantity: 500,
    unit: 'square metres',
    category: 'Insulation',
    subcategory: 'Wall Systems'
  });

  // Systems products
  products.push({
    productId: 'SYS-001',
    productName: 'High Efficiency HVAC System',
    manufacturer: 'ClimateControl Technologies',
    description: 'Variable refrigerant flow system with heat recovery',
    certifications: [
      {
        initiativeId: 'ENERGY-003',
        certificateNumber: 'ENE-HVAC-2024-001',
        issueDate: new Date('2024-02-10'),
        expiryDate: new Date('2027-02-10'),
        rpv: sampleInitiatives[2],
        verificationStatus: 'Valid'
      }
    ],
    buildingLayers: [BuildingLayer.SYSTEMS],
    cost: 95000,
    quantity: 1,
    unit: 'system',
    category: 'HVAC',
    subcategory: 'Air Conditioning'
  });

  products.push({
    productId: 'SYS-002',
    productName: 'LED Lighting System',
    manufacturer: 'BrightGreen Lighting',
    description: 'Smart LED lighting with daylight sensors and occupancy controls',
    certifications: [
      {
        initiativeId: 'ENERGY-003',
        certificateNumber: 'ENE-LED-2024-002',
        issueDate: new Date('2024-03-05'),
        expiryDate: new Date('2027-03-05'),
        rpv: sampleInitiatives[2],
        verificationStatus: 'Valid'
      }
    ],
    buildingLayers: [BuildingLayer.SYSTEMS],
    cost: 28000,
    quantity: 200,
    unit: 'fixtures',
    category: 'Lighting',
    subcategory: 'LED'
  });

  // Finishes products
  products.push({
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
      },
      {
        initiativeId: 'CRADLE-002',
        certificateNumber: 'C2C-FLR-2024-002',
        issueDate: new Date('2024-02-05'),
        expiryDate: new Date('2026-02-05'),
        rpv: sampleInitiatives[1],
        verificationStatus: 'Valid'
      }
    ],
    buildingLayers: [BuildingLayer.FINISHES],
    cost: 18000,
    quantity: 300,
    unit: 'square metres',
    category: 'Flooring',
    subcategory: 'Timber'
  });

  products.push({
    productId: 'FIN-002',
    productName: 'Low-VOC Paint',
    manufacturer: 'EcoPaint Solutions',
    description: 'Zero-VOC interior paint with natural pigments',
    certifications: [
      {
        initiativeId: 'GBCA-001',
        certificateNumber: 'GBCA-PNT-2024-006',
        issueDate: new Date('2024-02-25'),
        expiryDate: new Date('2027-02-25'),
        rpv: sampleInitiatives[0],
        verificationStatus: 'Valid'
      }
    ],
    buildingLayers: [BuildingLayer.FINISHES],
    cost: 8500,
    quantity: 500,
    unit: 'litres',
    category: 'Coatings',
    subcategory: 'Interior Paint'
  });

  // Non-compliant products for comparison
  products.push({
    productId: 'STR-003',
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
  });

  products.push({
    productId: 'FIN-003',
    productName: 'Standard Carpet',
    manufacturer: 'FloorCorp',
    description: 'Standard commercial carpet without sustainability features',
    certifications: [],
    buildingLayers: [BuildingLayer.FINISHES],
    cost: 12000,
    quantity: 200,
    unit: 'square metres',
    category: 'Flooring',
    subcategory: 'Carpet'
  });

  return products;
}

// ============================================================================
// Sample Project Data
// ============================================================================

export function createSampleProject(): ProjectData {
  const products = createSampleProducts();
  
  // Calculate building layer costs
  const buildingLayerCosts = new Map<BuildingLayer, number>();
  
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

// ============================================================================
// Usage Examples
// ============================================================================

export function demonstrateBasicUsage(): void {
  console.log('=== Green Star Materials Calculator - Basic Usage Example ===\n');

  // Create calculator instance
  const calculator = new ResponsibleProductsCalculator();

  // Create sample project
  const project = createSampleProject();

  console.log(`Project: ${project.projectName}`);
  console.log(`Total Project Cost: ${formatCurrency(project.totalProjectCost)}`);
  console.log(`Number of Products: ${project.products.length}\n`);

  // Calculate compliance for each building layer
  Object.values(BuildingLayer).forEach(layer => {
    console.log(`--- ${layer} Layer ---`);
    
    const layerProducts = project.products.filter(product => 
      product.buildingLayers.includes(layer)
    );
    
    if (layerProducts.length === 0) {
      console.log('No products in this layer\n');
      return;
    }

    const layerCost = layerProducts.reduce((sum, product) => sum + product.cost, 0);
    console.log(`Layer Cost: ${formatCurrency(layerCost)}`);
    console.log(`Products: ${layerProducts.length}`);

    // Calculate compliance for key credits
    const keyCredits = getKeyCreditsForLayer(layer);
    keyCredits.forEach(creditType => {
      const result = calculator.calculateCompliance(project.products, layer, creditType);
      
      console.log(`\n${creditType}:`);
      console.log(`  Compliant Cost: ${formatCurrency(result.compliantCost)}`);
      console.log(`  Compliance: ${formatPercentage(result.percentage)}`);
      console.log(`  Achievement: ${result.achievementLevel}`);
      console.log(`  Points: ${result.pointsAwarded}`);
    });

    console.log('\n');
  });

  // Calculate overall project compliance
  console.log('=== Overall Project Compliance ===');
  const summary = calculator.calculateProjectCompliance(project);
  
  console.log(`Overall Score: ${formatPercentage(summary.overallScore)}`);
  console.log(`Achievement Level: ${summary.achievementLevel}`);
  console.log(`Credits Achieved: ${summary.achievedCredits}/${summary.totalPossibleCredits}`);
  
  if (summary.recommendations.length > 0) {
    console.log('\nRecommendations:');
    summary.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  // Export to CSV
  console.log('\n=== CSV Export ===');
  const csvData = calculator.exportToCSV(summary);
  console.log('CSV data generated successfully');
  console.log(`CSV length: ${csvData.length} characters`);
}

export function demonstrateAdvancedUsage(): void {
  console.log('=== Green Star Materials Calculator - Advanced Usage Example ===\n');

  // Create calculator with custom thresholds
  const customThresholds = [
    {
      creditName: CreditType.CORPORATE_COMMITMENT_CLIMATE,
      buildingLayer: BuildingLayer.STRUCTURE,
      goodPracticeThreshold: 60, // Higher than default
      bestPracticeThreshold: 85,
      minimumRPV: 15,
      description: 'Stricter climate commitment requirements for structure'
    }
  ];

  const calculator = new ResponsibleProductsCalculator(customThresholds);
  const project = createSampleProject();

  // Demonstrate validation
  console.log('--- Data Validation ---');
  project.products.forEach((product, index) => {
    const validation = calculator['validator'].validateProduct(product);
    if (!validation.isValid || validation.warnings.length > 0) {
      console.log(`Product ${index + 1} (${product.productName}):`);
      if (validation.errors.length > 0) {
        console.log(`  Errors: ${validation.errors.join(', ')}`);
      }
      if (validation.warnings.length > 0) {
        console.log(`  Warnings: ${validation.warnings.join(', ')}`);
      }
    }
  });

  // Demonstrate detailed analysis
  console.log('\n--- Detailed Compliance Analysis ---');
  const summary = calculator.calculateProjectCompliance(project);
  
  summary.totalCompliance.forEach(result => {
    console.log(`\n${result.buildingLayer} - ${result.creditType}:`);
    console.log(`  Total Products: ${result.compliantProducts.length + result.nonCompliantProducts.length}`);
    console.log(`  Compliant Products: ${result.compliantProducts.length}`);
    console.log(`  Non-Compliant Products: ${result.nonCompliantProducts.length}`);
    console.log(`  Compliance Rate: ${formatPercentage(result.percentage)}`);
    console.log(`  Status: ${result.achieved ? 'ACHIEVED' : 'NOT ACHIEVED'}`);
    
    if (result.nonCompliantProducts.length > 0) {
      console.log('  Non-Compliant Products:');
      result.nonCompliantProducts.forEach(product => {
        console.log(`    - ${product.productName} (${formatCurrency(product.cost)})`);
      });
    }
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

function getKeyCreditsForLayer(layer: BuildingLayer): CreditType[] {
  switch (layer) {
    case BuildingLayer.STRUCTURE:
      return [
        CreditType.CORPORATE_COMMITMENT_CLIMATE,
        CreditType.ENVIRONMENTAL_MANAGEMENT,
        CreditType.CARBON_EMISSIONS_DISCLOSURE
      ];
    case BuildingLayer.ENVELOPE:
      return [
        CreditType.OCCUPANT_HEALTH_SAFETY,
        CreditType.TRANSPARENT_CHAIN_CUSTODY,
        CreditType.ENVIRONMENTAL_IMPACT_DISCLOSURE
      ];
    case BuildingLayer.SYSTEMS:
      return [
        CreditType.ENERGY_USE_REDUCTION,
        CreditType.CARBON_EMISSIONS_REDUCTION,
        CreditType.ENERGY_SOURCE
      ];
    case BuildingLayer.FINISHES:
      return [
        CreditType.INGREDIENT_DISCLOSURE,
        CreditType.OCCUPANT_HEALTH_SAFETY,
        CreditType.WASTE_GENERATION_REDUCTION
      ];
    default:
      return [];
  }
}

// ============================================================================
// Export Functions for Testing
// ============================================================================

export {
  demonstrateBasicUsage,
  demonstrateAdvancedUsage,
  createSampleProject,
  createSampleProducts,
  sampleInitiatives
};

// Run examples if this file is executed directly
if (require.main === module) {
  demonstrateBasicUsage();
  console.log(`\n${  '='.repeat(80)  }\n`);
  demonstrateAdvancedUsage();
}

