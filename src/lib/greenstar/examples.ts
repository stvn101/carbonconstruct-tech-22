
/**
 * Green Star Materials Calculator - Usage Examples and Sample Data
 * Demonstrates how to use the calculator with realistic data
 * Author: Manus AI
 * Date: June 29, 2025
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
} from './calculator';

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
          }
        ],
        categoryWeight: 0.25,
        totalPossibleScore: 15,
        achievedScore: 12
      }
    ],
    recognitionDate: new Date('2024-01-15'),
    isActive: true,
    description: 'Comprehensive green building materials certification program'
  }
];

// ============================================================================
// Sample Product Data
// ============================================================================

export function createSampleProducts(): Product[] {
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
    }
  ];
}

// ============================================================================
// Sample Project Data
// ============================================================================

export function createSampleProject(): ProjectData {
  const products = createSampleProducts();
  
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

  const calculator = new ResponsibleProductsCalculator();
  const project = createSampleProject();

  console.log(`Project: ${project.projectName}`);
  console.log(`Total Project Cost: ${formatCurrency(project.totalProjectCost)}`);
  console.log(`Number of Products: ${project.products.length}\n`);

  const summary = calculator.calculateProjectCompliance(project);
  
  console.log(`Overall Score: ${formatPercentage(summary.overallScore)}`);
  console.log(`Achievement Level: ${summary.achievementLevel}`);
  console.log(`Credits Achieved: ${summary.achievedCredits}/${summary.totalPossibleCredits}`);
}

export function demonstrateAdvancedUsage(): void {
  console.log('=== Green Star Materials Calculator - Advanced Usage Example ===\n');

  const calculator = new ResponsibleProductsCalculator();
  const project = createSampleProject();
  const summary = calculator.calculateProjectCompliance(project);
  
  summary.totalCompliance.forEach(result => {
    console.log(`\n${result.buildingLayer} - ${result.creditType}:`);
    console.log(`  Compliance Rate: ${formatPercentage(result.percentage)}`);
    console.log(`  Status: ${result.achieved ? 'ACHIEVED' : 'NOT ACHIEVED'}`);
  });
}
