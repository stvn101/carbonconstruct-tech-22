# Green Star Materials Calculator - TypeScript Implementation

This package contains a complete TypeScript implementation of the Green Star Materials Calculator logic, based on the Responsible Products Guidelines Version A from the Green Building Council of Australia (GBCA).

## Files Included

### Core Implementation
- **`green-star-calculator.ts`** - Main calculator engine with all core logic
- **`green-star-types.ts`** - Extended type definitions and interfaces
- **`green-star-examples.ts`** - Usage examples and sample data

### Documentation and Data
- **`green_star_calculator_documentation.md`** - Comprehensive documentation of the calculator logic
- **`responsible_products_logic.md`** - Extracted logic from GBCA guidelines
- **`sample-products.csv`** - Sample product data for testing
- **`README.md`** - This implementation guide

## Quick Start

### 1. Installation

```typescript
// Import the calculator
import { 
  ResponsibleProductsCalculator,
  BuildingLayer,
  CreditType,
  createSampleProject 
} from './green-star-calculator';
```

### 2. Basic Usage

```typescript
// Create calculator instance
const calculator = new ResponsibleProductsCalculator();

// Create or load project data
const project = createSampleProject(); // Use sample data
// OR load your own project data

// Calculate compliance for a specific building layer and credit
const result = calculator.calculateCompliance(
  project.products,
  BuildingLayer.STRUCTURE,
  CreditType.CORPORATE_COMMITMENT_CLIMATE
);

console.log(`Compliance: ${result.percentage.toFixed(1)}%`);
console.log(`Achievement: ${result.achievementLevel}`);
console.log(`Points: ${result.pointsAwarded}`);
```

### 3. Full Project Analysis

```typescript
// Calculate overall project compliance
const summary = calculator.calculateProjectCompliance(project);

console.log(`Overall Score: ${summary.overallScore.toFixed(1)}%`);
console.log(`Credits Achieved: ${summary.achievedCredits}/${summary.totalPossibleCredits}`);
console.log(`Achievement Level: ${summary.achievementLevel}`);

// Export results to CSV
const csvData = calculator.exportToCSV(summary);
```

## Key Features

### 1. Comprehensive Type Safety
- Full TypeScript interfaces for all data structures
- Enum definitions for building layers, credit types, and achievement levels
- Strict type checking for data validation

### 2. Flexible Configuration
- Custom threshold configuration
- Support for multiple certification initiatives
- Extensible plugin architecture

### 3. Robust Validation
- Input data validation with detailed error reporting
- Certification expiry checking
- Data integrity verification

### 4. Multiple Export Formats
- CSV export for spreadsheet analysis
- JSON export for API integration
- Detailed reporting with recommendations

## Data Structure

### Product Definition
```typescript
interface Product {
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
```

### Certification Definition
```typescript
interface Certification {
  initiativeId: string;
  certificateNumber: string;
  issueDate: Date;
  expiryDate?: Date;
  rpv: ResponsibleProductValue;
  verificationStatus: 'Valid' | 'Expired' | 'Pending' | 'Invalid';
}
```

## Building Layers

The calculator evaluates products across four building layers:

1. **Structure** - Foundations, columns, beams, load-bearing walls
2. **Envelope** - Walls, roofs, windows, doors
3. **Systems** - HVAC, electrical, plumbing, other services
4. **Finishes** - Flooring, wall coverings, ceiling systems

## Credit Categories

Products are evaluated against five main categories:

1. **Responsible** - Corporate climate commitments, environmental management, supply chain transparency
2. **Healthy** - Occupant health and safety, ingredient disclosure, chemical management
3. **Positive** - Energy efficiency, renewable energy, nature impact reduction
4. **Circular** - Material extraction reduction, waste minimization, packaging optimization
5. **Leadership** - Innovation and industry leadership initiatives

## Calculation Logic

### 1. Cost-Weighted Percentage
The calculator uses a cost-weighted approach:
```
Compliance % = (Compliant Product Cost / Total Product Cost) × 100
```

### 2. Achievement Thresholds
- **Good Practice**: Typically 50-70% compliance
- **Best Practice**: Typically 75-90% compliance
- Thresholds vary by building layer and credit type

### 3. Points System
- **Best Practice**: 3 points
- **Good Practice**: 1 point
- **Not Achieved**: 0 points

## Advanced Features

### Custom Thresholds
```typescript
const customThresholds = [
  {
    creditName: CreditType.CORPORATE_COMMITMENT_CLIMATE,
    buildingLayer: BuildingLayer.STRUCTURE,
    goodPracticeThreshold: 60,
    bestPracticeThreshold: 85,
    minimumRPV: 15,
    description: 'Custom threshold for climate commitments'
  }
];

const calculator = new ResponsibleProductsCalculator(customThresholds);
```

### Data Validation
```typescript
const validator = new DataValidator();
const validation = validator.validateProduct(product);

if (!validation.isValid) {
  console.log('Errors:', validation.errors);
}
if (validation.warnings.length > 0) {
  console.log('Warnings:', validation.warnings);
}
```

### CSV Import/Export
The calculator supports CSV import/export for easy integration with spreadsheet tools. Use the provided `sample-products.csv` as a template for your data format.

## Integration with GBCA Systems

### Initiative Score Checker
The calculator is designed to integrate with the GBCA Initiative Score Checker API:

```typescript
interface DataService {
  getInitiativeRPV(initiativeId: string): Promise<ResponsibleProductValue>;
  searchProducts(criteria: SearchCriteria): Promise<Product[]>;
  validateCertification(certificateNumber: string): Promise<boolean>;
}
```

### Real-time Updates
Support for real-time data synchronization with GBCA databases:

```typescript
interface RealTimeDataService {
  subscribeToInitiativeUpdates(callback: (update: InitiativeUpdate) => void): void;
  subscribeToProductUpdates(callback: (update: ProductUpdate) => void): void;
}
```

## Testing and Validation

### Sample Data
Use the provided sample data for testing:

```typescript
import { createSampleProject, demonstrateBasicUsage } from './green-star-examples';

// Run basic demonstration
demonstrateBasicUsage();

// Create sample project for testing
const testProject = createSampleProject();
```

### Unit Testing
The calculator includes comprehensive validation and error handling. Implement unit tests for:

- Product validation
- Calculation accuracy
- Threshold compliance
- Data integrity

## Performance Considerations

### Caching
Implement caching for frequently accessed data:

```typescript
class CacheManager {
  async getCachedOrFetch<T>(key: string, fetchFunction: () => Promise<T>): Promise<T> {
    // Implementation details in green-star-types.ts
  }
}
```

### Batch Processing
For large projects, consider batch processing:

```typescript
// Process products in batches for better performance
const batchSize = 100;
const batches = chunkArray(project.products, batchSize);
```

## Compliance with GBCA Standards

This implementation is based on:
- Responsible Products Guidelines Version A (November 2024)
- Green Star rating system requirements
- GBCA governance and assessment processes

## Support and Updates

### Version Management
The calculator supports multiple versions of the guidelines:

```typescript
interface GuidelinesVersion {
  version: string;
  effectiveDate: Date;
  categories: Category[];
  thresholds: CreditThreshold[];
}
```

### Future Enhancements
Planned features include:
- Web-based user interface
- API integration with GBCA systems
- Advanced reporting and analytics
- Mobile application support

## License and Usage

This implementation is provided for educational and development purposes. For production use with official Green Star projects, ensure compliance with GBCA licensing requirements and consider official GBCA calculator tools.

## Contact and Support

For questions about this implementation or the underlying Green Star system, refer to:
- Green Building Council of Australia: https://www.gbca.org.au
- Responsible Products Program: https://new.gbca.org.au/green-star/the-responsible-products-program/

---

**Note**: This implementation is based on publicly available GBCA documentation and represents the logic as understood from the Responsible Products Guidelines Version A. For official calculations and submissions, always use the official GBCA Responsible Products Calculator.

