import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

// Enhanced data generators for sustainability performance metrics
// Provides comprehensive test data for material analysis and reporting

export interface SustainabilityMetrics {
  carbonFootprint: number;
  recyclabilityScore: number;
  sustainabilityScore: number;
  environmentalImpact: number;
  localAvailability: boolean;
  certificationLevel: 'none' | 'basic' | 'advanced' | 'premium';
}

export interface MaterialPerformanceData {
  materialId: string;
  materialName: string;
  category: string;
  metrics: SustainabilityMetrics;
  trends: {
    carbonReduction: number;
    recyclabilityImprovement: number;
    sustainabilityGrowth: number;
  };
  benchmarks: {
    industryAverage: number;
    bestInClass: number;
    regulatoryMinimum: number;
  };
}

export interface RegionalPerformanceData {
  region: string;
  materialCount: number;
  averageMetrics: SustainabilityMetrics;
  topPerformers: string[];
  improvementAreas: string[];
}

export interface TimeSeriesData {
  date: string;
  carbonFootprint: number;
  recyclabilityScore: number;
  sustainabilityScore: number;
  materialCount: number;
}

// Generate comprehensive material performance data
export const generateMaterialPerformanceData = (count: number = 50): MaterialPerformanceData[] => {
  const categories = [
    'Concrete', 'Steel', 'Timber', 'Glass', 'Brick', 
    'Insulation', 'Aluminum', 'Plastic', 'Copper', 'Gypsum'
  ];
  
  const certificationLevels: Array<'none' | 'basic' | 'advanced' | 'premium'> = 
    ['none', 'basic', 'advanced', 'premium'];

  return Array.from({ length: count }, (_, index) => {
    const category = categories[index % categories.length];
    const baseScore = Math.random() * 100;
    
    return {
      materialId: `mat_${index + 1}`,
      materialName: `${category} Material ${index + 1}`,
      category,
      metrics: {
        carbonFootprint: Math.round((Math.random() * 500 + 50) * 100) / 100,
        recyclabilityScore: Math.round(baseScore),
        sustainabilityScore: Math.round((baseScore + Math.random() * 20 - 10)),
        environmentalImpact: Math.round((100 - baseScore + Math.random() * 20)),
        localAvailability: Math.random() > 0.3,
        certificationLevel: certificationLevels[Math.floor(Math.random() * certificationLevels.length)]
      },
      trends: {
        carbonReduction: Math.round((Math.random() * 20 - 5) * 100) / 100,
        recyclabilityImprovement: Math.round((Math.random() * 15 - 2) * 100) / 100,
        sustainabilityGrowth: Math.round((Math.random() * 25 - 5) * 100) / 100
      },
      benchmarks: {
        industryAverage: Math.round((baseScore + Math.random() * 10 - 5)),
        bestInClass: Math.round((Math.min(100, baseScore + 20 + Math.random() * 10))),
        regulatoryMinimum: Math.round((Math.max(0, baseScore - 30 + Math.random() * 10)))
      }
    };
  });
};

// Generate regional performance comparison data
export const generateRegionalPerformanceData = (): RegionalPerformanceData[] => {
  const regions = [
    'New South Wales', 'Victoria', 'Queensland', 'Western Australia',
    'South Australia', 'Tasmania', 'Northern Territory', 'ACT'
  ];

  return regions.map(region => {
    const materialCount = Math.floor(Math.random() * 500 + 100);
    const baseMetrics = Math.random() * 100;
    
    return {
      region,
      materialCount,
      averageMetrics: {
        carbonFootprint: Math.round((Math.random() * 300 + 100) * 100) / 100,
        recyclabilityScore: Math.round(baseMetrics),
        sustainabilityScore: Math.round(baseMetrics + Math.random() * 20 - 10),
        environmentalImpact: Math.round(100 - baseMetrics + Math.random() * 15),
        localAvailability: Math.random() > 0.4,
        certificationLevel: Math.random() > 0.6 ? 'advanced' : 'basic'
      },
      topPerformers: [
        `Top Material ${region} 1`,
        `Top Material ${region} 2`,
        `Top Material ${region} 3`
      ],
      improvementAreas: [
        'Carbon footprint reduction',
        'Recyclability enhancement',
        'Local sourcing increase'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  });
};

// Generate time series data for trend analysis
export const generateTimeSeriesData = (months: number = 12): TimeSeriesData[] => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + index);
    
    const trend = index / months; // Gradual improvement over time
    const noise = (Math.random() - 0.5) * 10; // Random variation
    
    return {
      date: date.toISOString().split('T')[0],
      carbonFootprint: Math.round((200 - trend * 50 + noise) * 100) / 100,
      recyclabilityScore: Math.round((60 + trend * 30 + noise)),
      sustainabilityScore: Math.round((55 + trend * 35 + noise)),
      materialCount: Math.floor(1000 + trend * 500 + noise * 10)
    };
  });
};

// Generate certification distribution data
export const generateCertificationDistribution = () => {
  return {
    none: Math.floor(Math.random() * 200 + 100),
    basic: Math.floor(Math.random() * 300 + 150),
    advanced: Math.floor(Math.random() * 200 + 100),
    premium: Math.floor(Math.random() * 100 + 50)
  };
};

// Generate category performance comparison
export const generateCategoryPerformance = () => {
  const categories = [
    'Concrete', 'Steel', 'Timber', 'Glass', 'Brick', 
    'Insulation', 'Aluminum', 'Plastic', 'Copper', 'Gypsum'
  ];

  return categories.map(category => ({
    category,
    averageCarbonFootprint: Math.round((Math.random() * 400 + 50) * 100) / 100,
    averageRecyclability: Math.round(Math.random() * 100),
    averageSustainability: Math.round(Math.random() * 100),
    materialCount: Math.floor(Math.random() * 100 + 20),
    topRated: Math.floor(Math.random() * 20 + 5),
    needsImprovement: Math.floor(Math.random() * 15 + 2)
  }));
};

// Generate compliance and regulatory data
export const generateComplianceData = () => {
  return {
    greenStarCompliant: Math.floor(Math.random() * 400 + 200),
    nccCompliant: Math.floor(Math.random() * 500 + 300),
    epdVerified: Math.floor(Math.random() * 300 + 150),
    locallySourced: Math.floor(Math.random() * 350 + 200),
    totalMaterials: 800
  };
};

// Generate sustainability recommendations
export const generateSustainabilityRecommendations = () => {
  const recommendations = [
    {
      category: 'Carbon Reduction',
      priority: 'High',
      impact: 'Significant',
      description: 'Switch to low-carbon concrete alternatives with supplementary cementitious materials',
      potentialSavings: '25-40% CO2 reduction',
      implementationCost: 'Medium',
      timeframe: '3-6 months'
    },
    {
      category: 'Recyclability',
      priority: 'Medium',
      impact: 'Moderate',
      description: 'Increase use of materials with high recyclability scores',
      potentialSavings: '15-25% waste reduction',
      implementationCost: 'Low',
      timeframe: '1-3 months'
    },
    {
      category: 'Local Sourcing',
      priority: 'Medium',
      impact: 'Moderate',
      description: 'Prioritize locally available materials to reduce transport emissions',
      potentialSavings: '10-20% transport emissions',
      implementationCost: 'Low',
      timeframe: '1-2 months'
    },
    {
      category: 'Certification',
      priority: 'High',
      impact: 'Significant',
      description: 'Increase proportion of certified sustainable materials',
      potentialSavings: 'Improved compliance rating',
      implementationCost: 'Medium',
      timeframe: '2-4 months'
    }
  ];

  return recommendations.slice(0, Math.floor(Math.random() * 4) + 2);
};

// Add the missing exports that are referenced by materialPerformanceService
export const generateSampleTrendData = (months: number = 12) => {
  return generateTimeSeriesData(months);
};

export const findAlternativeMaterials = (materialName: string) => {
  // Simple mock implementation
  return [
    {
      name: `Low-carbon alternative to ${materialName}`,
      carbonReduction: '20-30%',
      cost: 'Similar',
      availability: 'Good'
    }
  ];
};

export const generateSampleRecommendations = () => {
  return generateSustainabilityRecommendations();
};

// Remove the problematic import and replace with a simple fallback
const getMaterialsFromDatabase = async (): Promise<any[]> => {
  // Temporary fallback until new calculator materials service is built
  console.log('Material service temporarily unavailable - using fallback data');
  return [];
};

// Generate mock EPD (Environmental Product Declaration) data
export const generateEPDData = () => {
  return {
    totalEPDs: Math.floor(Math.random() * 200 + 100),
    verifiedEPDs: Math.floor(Math.random() * 150 + 80),
    expiringSoon: Math.floor(Math.random() * 20 + 5),
    recentlyAdded: Math.floor(Math.random() * 30 + 10),
    byPublisher: {
      'EPD Australasia': Math.floor(Math.random() * 80 + 40),
      'Global EPD': Math.floor(Math.random() * 60 + 30),
      'Regional Bodies': Math.floor(Math.random() * 40 + 20),
      'Manufacturer Direct': Math.floor(Math.random() * 30 + 15)
    }
  };
};

// Generate performance benchmarking data
export const generateBenchmarkingData = () => {
  return {
    industryBenchmarks: {
      carbonFootprint: {
        excellent: 50,
        good: 100,
        average: 200,
        poor: 400
      },
      recyclability: {
        excellent: 90,
        good: 70,
        average: 50,
        poor: 30
      },
      sustainability: {
        excellent: 85,
        good: 65,
        average: 45,
        poor: 25
      }
    },
    projectPerformance: {
      carbonFootprint: Math.round((Math.random() * 300 + 50) * 100) / 100,
      recyclability: Math.round(Math.random() * 100),
      sustainability: Math.round(Math.random() * 100)
    }
  };
};

// Export all generators as a collection
export const dataGenerators = {
  materialPerformance: generateMaterialPerformanceData,
  regionalPerformance: generateRegionalPerformanceData,
  timeSeries: generateTimeSeriesData,
  certificationDistribution: generateCertificationDistribution,
  categoryPerformance: generateCategoryPerformance,
  compliance: generateComplianceData,
  recommendations: generateSustainabilityRecommendations,
  epd: generateEPDData,
  benchmarking: generateBenchmarkingData
};

// Utility function to generate a complete dataset
export const generateCompleteDataset = () => {
  return {
    materials: generateMaterialPerformanceData(100),
    regions: generateRegionalPerformanceData(),
    timeSeries: generateTimeSeriesData(12),
    certifications: generateCertificationDistribution(),
    categories: generateCategoryPerformance(),
    compliance: generateComplianceData(),
    recommendations: generateSustainabilityRecommendations(),
    epd: generateEPDData(),
    benchmarks: generateBenchmarkingData()
  };
};
