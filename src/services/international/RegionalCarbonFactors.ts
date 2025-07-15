// Regional Carbon Emission Factors for International Markets
export interface RegionalCarbonFactor {
  region: string;
  country: string;
  factor: number;
  unit: string;
  source: string;
  year: number;
  scope: 'scope1' | 'scope2' | 'scope3' | 'combined';
  category: string;
  subcategory?: string;
  notes?: string;
  uncertainty?: number;
}

export interface RegionalConfig {
  region: string;
  country: string;
  currency: string;
  electricityFactor: number; // kg CO2e/kWh
  fuelFactors: Record<string, number>;
  materialFactors: Record<string, number>;
  transportFactors: Record<string, number>;
  climateFactor: number;
  renewablePercentage: number;
  buildingStandards: string[];
  units: {
    area: string;
    volume: string;
    weight: string;
    energy: string;
    temperature: string;
  };
}

export class RegionalCarbonFactorsService {
  private regionalConfigs: Map<string, RegionalConfig> = new Map();
  private carbonFactors: RegionalCarbonFactor[] = [];

  constructor() {
    this.initializeRegionalData();
  }

  /**
   * Initialize regional carbon factors and configurations
   */
  private initializeRegionalData() {
    // Australia (baseline from existing system)
    this.addRegionalConfig({
      region: 'Oceania',
      country: 'Australia',
      currency: 'AUD',
      electricityFactor: 0.81, // kg CO2e/kWh (Australian grid average)
      fuelFactors: {
        'natural_gas': 2.04, // kg CO2e/m3
        'diesel': 2.68, // kg CO2e/L
        'petrol': 2.31, // kg CO2e/L
        'lpg': 1.51, // kg CO2e/L
      },
      materialFactors: {
        'concrete': 0.83, // kg CO2e/kg
        'steel': 1.85, // kg CO2e/kg
        'aluminium': 8.24, // kg CO2e/kg
        'timber': -0.35, // kg CO2e/kg (carbon sequestration)
      },
      transportFactors: {
        'truck': 0.12, // kg CO2e/tonne-km
        'rail': 0.027, // kg CO2e/tonne-km
        'ship': 0.011, // kg CO2e/tonne-km
      },
      climateFactor: 1.0,
      renewablePercentage: 32.5,
      buildingStandards: ['NCC', 'NABERS', 'Green Star'],
      units: {
        area: 'm²',
        volume: 'm³',
        weight: 'kg',
        energy: 'kWh',
        temperature: '°C'
      }
    });

    // United States
    this.addRegionalConfig({
      region: 'North America',
      country: 'United States',
      currency: 'USD',
      electricityFactor: 0.42, // kg CO2e/kWh (US grid average)
      fuelFactors: {
        'natural_gas': 1.93, // kg CO2e/m3
        'diesel': 2.66, // kg CO2e/L
        'gasoline': 2.29, // kg CO2e/L
        'heating_oil': 2.53, // kg CO2e/L
      },
      materialFactors: {
        'concrete': 0.93, // kg CO2e/kg
        'steel': 1.95, // kg CO2e/kg
        'aluminum': 8.67, // kg CO2e/kg
        'lumber': -0.42, // kg CO2e/kg
      },
      transportFactors: {
        'truck': 0.16, // kg CO2e/tonne-km
        'rail': 0.033, // kg CO2e/tonne-km
        'barge': 0.033, // kg CO2e/tonne-km
      },
      climateFactor: 0.95,
      renewablePercentage: 21.0,
      buildingStandards: ['LEED', 'Energy Star', 'ASHRAE 90.1'],
      units: {
        area: 'ft²',
        volume: 'ft³',
        weight: 'lbs',
        energy: 'kWh',
        temperature: '°F'
      }
    });

    // United Kingdom
    this.addRegionalConfig({
      region: 'Europe',
      country: 'United Kingdom',
      currency: 'GBP',
      electricityFactor: 0.23, // kg CO2e/kWh (UK grid - high renewable)
      fuelFactors: {
        'natural_gas': 2.04, // kg CO2e/m3
        'diesel': 2.51, // kg CO2e/L
        'petrol': 2.18, // kg CO2e/L
        'heating_oil': 2.52, // kg CO2e/L
      },
      materialFactors: {
        'concrete': 0.89, // kg CO2e/kg
        'steel': 1.77, // kg CO2e/kg
        'aluminium': 7.89, // kg CO2e/kg
        'timber': -0.38, // kg CO2e/kg
      },
      transportFactors: {
        'truck': 0.11, // kg CO2e/tonne-km
        'rail': 0.022, // kg CO2e/tonne-km
        'ship': 0.009, // kg CO2e/tonne-km
      },
      climateFactor: 0.85,
      renewablePercentage: 43.1,
      buildingStandards: ['BREEAM', 'Passivhaus', 'SAP'],
      units: {
        area: 'm²',
        volume: 'm³',
        weight: 'kg',
        energy: 'kWh',
        temperature: '°C'
      }
    });

    // Germany
    this.addRegionalConfig({
      region: 'Europe',
      country: 'Germany',
      currency: 'EUR',
      electricityFactor: 0.33, // kg CO2e/kWh
      fuelFactors: {
        'natural_gas': 2.04, // kg CO2e/m3
        'diesel': 2.51, // kg CO2e/L
        'gasoline': 2.18, // kg CO2e/L
        'heating_oil': 2.52, // kg CO2e/L
      },
      materialFactors: {
        'concrete': 0.85, // kg CO2e/kg
        'steel': 1.72, // kg CO2e/kg
        'aluminium': 7.45, // kg CO2e/kg
        'timber': -0.41, // kg CO2e/kg
      },
      transportFactors: {
        'truck': 0.09, // kg CO2e/tonne-km
        'rail': 0.019, // kg CO2e/tonne-km
        'ship': 0.008, // kg CO2e/tonne-km
      },
      climateFactor: 0.9,
      renewablePercentage: 46.2,
      buildingStandards: ['DGNB', 'BNB', 'Passivhaus'],
      units: {
        area: 'm²',
        volume: 'm³',
        weight: 'kg',
        energy: 'kWh',
        temperature: '°C'
      }
    });

    // Japan
    this.addRegionalConfig({
      region: 'Asia Pacific',
      country: 'Japan',
      currency: 'JPY',
      electricityFactor: 0.52, // kg CO2e/kWh
      fuelFactors: {
        'city_gas': 2.23, // kg CO2e/m3
        'diesel': 2.58, // kg CO2e/L
        'gasoline': 2.32, // kg CO2e/L
        'kerosene': 2.49, // kg CO2e/L
      },
      materialFactors: {
        'concrete': 0.88, // kg CO2e/kg
        'steel': 1.89, // kg CO2e/kg
        'aluminium': 8.15, // kg CO2e/kg
        'timber': -0.33, // kg CO2e/kg
      },
      transportFactors: {
        'truck': 0.13, // kg CO2e/tonne-km
        'rail': 0.025, // kg CO2e/tonne-km
        'ship': 0.012, // kg CO2e/tonne-km
      },
      climateFactor: 1.1,
      renewablePercentage: 22.4,
      buildingStandards: ['CASBEE', 'BELS'],
      units: {
        area: 'm²',
        volume: 'm³',
        weight: 'kg',
        energy: 'kWh',
        temperature: '°C'
      }
    });

    // Singapore
    this.addRegionalConfig({
      region: 'Asia Pacific',
      country: 'Singapore',
      currency: 'SGD',
      electricityFactor: 0.41, // kg CO2e/kWh
      fuelFactors: {
        'natural_gas': 2.04, // kg CO2e/m3
        'diesel': 2.68, // kg CO2e/L
        'petrol': 2.31, // kg CO2e/L
      },
      materialFactors: {
        'concrete': 0.91, // kg CO2e/kg (imported materials)
        'steel': 2.05, // kg CO2e/kg (imported)
        'aluminium': 8.89, // kg CO2e/kg (imported)
        'timber': 0.12, // kg CO2e/kg (tropical timber)
      },
      transportFactors: {
        'truck': 0.14, // kg CO2e/tonne-km
        'ship': 0.010, // kg CO2e/tonne-km
      },
      climateFactor: 1.2, // High cooling demand
      renewablePercentage: 3.0,
      buildingStandards: ['Green Mark', 'SS 564'],
      units: {
        area: 'm²',
        volume: 'm³',
        weight: 'kg',
        energy: 'kWh',
        temperature: '°C'
      }
    });

    // Canada
    this.addRegionalConfig({
      region: 'North America',
      country: 'Canada',
      currency: 'CAD',
      electricityFactor: 0.13, // kg CO2e/kWh (High hydro/nuclear)
      fuelFactors: {
        'natural_gas': 1.91, // kg CO2e/m3
        'diesel': 2.66, // kg CO2e/L
        'gasoline': 2.29, // kg CO2e/L
        'heating_oil': 2.78, // kg CO2e/L
      },
      materialFactors: {
        'concrete': 0.87, // kg CO2e/kg
        'steel': 1.83, // kg CO2e/kg
        'aluminum': 1.89, // kg CO2e/kg (hydro-powered smelting)
        'lumber': -0.58, // kg CO2e/kg (significant sequestration)
      },
      transportFactors: {
        'truck': 0.15, // kg CO2e/tonne-km
        'rail': 0.031, // kg CO2e/tonne-km
        'ship': 0.034, // kg CO2e/tonne-km
      },
      climateFactor: 0.8, // Cold climate efficiency
      renewablePercentage: 68.0,
      buildingStandards: ['LEED Canada', 'R-2000', 'ENERGY STAR'],
      units: {
        area: 'ft²',
        volume: 'ft³',
        weight: 'lbs',
        energy: 'kWh',
        temperature: '°C'
      }
    });

    console.log('🌍 Regional carbon factors initialized for', this.regionalConfigs.size, 'countries');
  }

  /**
   * Add regional configuration
   */
  public addRegionalConfig(config: RegionalConfig) {
    this.regionalConfigs.set(config.country, config);
  }

  /**
   * Get regional configuration
   */
  public getRegionalConfig(country: string): RegionalConfig | undefined {
    return this.regionalConfigs.get(country);
  }

  /**
   * Get all available regions
   */
  public getAvailableRegions(): string[] {
    return Array.from(new Set(
      Array.from(this.regionalConfigs.values()).map(config => config.region)
    ));
  }

  /**
   * Get countries by region
   */
  public getCountriesByRegion(region: string): string[] {
    return Array.from(this.regionalConfigs.values())
      .filter(config => config.region === region)
      .map(config => config.country);
  }

  /**
   * Get carbon factor for specific material and region
   */
  public getCarbonFactor(
    country: string, 
    category: string, 
    subcategory?: string
  ): number {
    const config = this.getRegionalConfig(country);
    if (!config) return 0;

    switch (category.toLowerCase()) {
      case 'electricity':
        return config.electricityFactor;
      case 'fuel':
        return config.fuelFactors[subcategory || 'natural_gas'] || 0;
      case 'material':
        return config.materialFactors[subcategory || 'concrete'] || 0;
      case 'transport':
        return config.transportFactors[subcategory || 'truck'] || 0;
      default:
        return 0;
    }
  }

  /**
   * Calculate regional adjustment for emissions
   */
  public calculateRegionalAdjustment(
    baseEmissions: number, 
    fromCountry: string, 
    toCountry: string
  ): number {
    const fromConfig = this.getRegionalConfig(fromCountry);
    const toConfig = this.getRegionalConfig(toCountry);
    
    if (!fromConfig || !toConfig) return baseEmissions;

    // Apply climate factor adjustment
    const climateFactor = toConfig.climateFactor / fromConfig.climateFactor;
    
    // Apply electricity grid factor adjustment
    const gridFactor = toConfig.electricityFactor / fromConfig.electricityFactor;
    
    // Weighted adjustment (60% climate, 40% grid)
    const adjustmentFactor = (climateFactor * 0.6) + (gridFactor * 0.4);
    
    return baseEmissions * adjustmentFactor;
  }

  /**
   * Get renewable energy percentage for country
   */
  public getRenewablePercentage(country: string): number {
    const config = this.getRegionalConfig(country);
    return config?.renewablePercentage || 0;
  }

  /**
   * Get applicable building standards for country
   */
  public getBuildingStandards(country: string): string[] {
    const config = this.getRegionalConfig(country);
    return config?.buildingStandards || [];
  }

  /**
   * Convert units between regions
   */
  public convertUnits(
    value: number, 
    unitType: keyof RegionalConfig['units'], 
    fromCountry: string, 
    toCountry: string
  ): number {
    const fromConfig = this.getRegionalConfig(fromCountry);
    const toConfig = this.getRegionalConfig(toCountry);
    
    if (!fromConfig || !toConfig) return value;

    const fromUnit = fromConfig.units[unitType];
    const toUnit = toConfig.units[unitType];

    // Unit conversion factors
    const conversions: Record<string, Record<string, number>> = {
      'm²': { 'ft²': 10.764 },
      'ft²': { 'm²': 0.0929 },
      'm³': { 'ft³': 35.315 },
      'ft³': { 'm³': 0.0283 },
      'kg': { 'lbs': 2.205 },
      'lbs': { 'kg': 0.4536 }
    };

    if (fromUnit === toUnit) return value;

    // Handle temperature conversions separately
    if (unitType === 'temperature') {
      if (fromUnit === '°C' && toUnit === '°F') {
        return (value * 9/5) + 32;
      } else if (fromUnit === '°F' && toUnit === '°C') {
        return (value - 32) * 5/9;
      }
    }

    const conversionFactor = conversions[fromUnit]?.[toUnit];
    if (typeof conversionFactor === 'number') {
      return value * conversionFactor;
    }

    return value;
  }

  /**
   * Get currency for country
   */
  public getCurrency(country: string): string {
    const config = this.getRegionalConfig(country);
    return config?.currency || 'USD';
  }

  /**
   * Get comprehensive regional comparison
   */
  public getRegionalComparison(countries: string[]): RegionalComparison {
    const comparison: RegionalComparison = {
      countries,
      electricityFactors: {},
      renewablePercentages: {},
      climatFactors: {},
      currencies: {},
      buildingStandards: {}
    };

    countries.forEach(country => {
      const config = this.getRegionalConfig(country);
      if (config) {
        comparison.electricityFactors[country] = config.electricityFactor;
        comparison.renewablePercentages[country] = config.renewablePercentage;
        comparison.climatFactors[country] = config.climateFactor;
        comparison.currencies[country] = config.currency;
        comparison.buildingStandards[country] = config.buildingStandards;
      }
    });

    return comparison;
  }
}

export interface RegionalComparison {
  countries: string[];
  electricityFactors: Record<string, number>;
  renewablePercentages: Record<string, number>;
  climatFactors: Record<string, number>;
  currencies: Record<string, string>;
  buildingStandards: Record<string, string[]>;
}

export default RegionalCarbonFactorsService;