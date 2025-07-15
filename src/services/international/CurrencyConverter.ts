// Currency Conversion Service for International Markets
export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: Date;
  source: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  country: string;
  decimalPlaces: number;
}

export class CurrencyConverterService {
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private currencies: Map<string, CurrencyInfo> = new Map();
  private lastUpdate: Date = new Date();
  private updateInterval: number = 3600000; // 1 hour

  constructor() {
    this.initializeCurrencies();
    this.initializeExchangeRates();
  }

  /**
   * Initialize supported currencies
   */
  private initializeCurrencies() {
    const currencyData: CurrencyInfo[] = [
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia', decimalPlaces: 2 },
      { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', decimalPlaces: 2 },
      { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union', decimalPlaces: 2 },
      { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom', decimalPlaces: 2 },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan', decimalPlaces: 0 },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada', decimalPlaces: 2 },
      { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore', decimalPlaces: 2 },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China', decimalPlaces: 2 },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India', decimalPlaces: 2 },
      { code: 'KRW', name: 'South Korean Won', symbol: '₩', country: 'South Korea', decimalPlaces: 0 },
      { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', country: 'New Zealand', decimalPlaces: 2 },
      { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland', decimalPlaces: 2 },
      { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden', decimalPlaces: 2 },
      { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway', decimalPlaces: 2 },
      { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'Denmark', decimalPlaces: 2 }
    ];

    currencyData.forEach(currency => {
      this.currencies.set(currency.code, currency);
    });

    console.log('💱 Currency database initialized with', this.currencies.size, 'currencies');
  }

  /**
   * Initialize exchange rates (mock data - in production would fetch from API)
   */
  private initializeExchangeRates() {
    // Base rates against USD (mock data for demonstration)
    const baseRates = {
      'AUD': 1.52,
      'USD': 1.00,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 148.50,
      'CAD': 1.36,
      'SGD': 1.35,
      'CNY': 7.24,
      'INR': 83.12,
      'KRW': 1315.50,
      'NZD': 1.64,
      'CHF': 0.88,
      'SEK': 10.87,
      'NOK': 10.92,
      'DKK': 6.85
    };

    // Generate cross rates
    Object.entries(baseRates).forEach(([fromCurrency, fromRate]) => {
      Object.entries(baseRates).forEach(([toCurrency, toRate]) => {
        if (fromCurrency !== toCurrency) {
          const rate = toRate / fromRate;
          const key = `${fromCurrency}-${toCurrency}`;
          
          this.exchangeRates.set(key, {
            fromCurrency,
            toCurrency,
            rate,
            timestamp: new Date(),
            source: 'mock_data'
          });
        }
      });
    });

    this.lastUpdate = new Date();
    console.log('💱 Exchange rates initialized for', this.exchangeRates.size, 'currency pairs');
  }

  /**
   * Convert amount from one currency to another
   */
  public convert(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): ConversionResult {
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        convertedAmount: amount,
        fromCurrency,
        toCurrency,
        exchangeRate: 1,
        timestamp: new Date(),
        success: true
      };
    }

    const key = `${fromCurrency}-${toCurrency}`;
    const exchangeRate = this.exchangeRates.get(key);

    if (!exchangeRate) {
      return {
        originalAmount: amount,
        convertedAmount: amount,
        fromCurrency,
        toCurrency,
        exchangeRate: 1,
        timestamp: new Date(),
        success: false,
        error: `Exchange rate not found for ${fromCurrency} to ${toCurrency}`
      };
    }

    const convertedAmount = amount * exchangeRate.rate;

    return {
      originalAmount: amount,
      convertedAmount: this.roundToCurrencyPrecision(convertedAmount, toCurrency),
      fromCurrency,
      toCurrency,
      exchangeRate: exchangeRate.rate,
      timestamp: exchangeRate.timestamp,
      success: true
    };
  }

  /**
   * Convert project costs to different currencies
   */
  public convertProjectCosts(
    projectCosts: ProjectCosts, 
    fromCurrency: string, 
    toCurrency: string
  ): ConvertedProjectCosts {
    const materialsCost = this.convert(projectCosts.materials, fromCurrency, toCurrency);
    const laborCost = this.convert(projectCosts.labor, fromCurrency, toCurrency);
    const equipmentCost = this.convert(projectCosts.equipment, fromCurrency, toCurrency);
    const otherCost = this.convert(projectCosts.other || 0, fromCurrency, toCurrency);

    const total = materialsCost.convertedAmount + 
                  laborCost.convertedAmount + 
                  equipmentCost.convertedAmount + 
                  otherCost.convertedAmount;

    return {
      original: projectCosts,
      converted: {
        materials: materialsCost.convertedAmount,
        labor: laborCost.convertedAmount,
        equipment: equipmentCost.convertedAmount,
        other: otherCost.convertedAmount,
        total: this.roundToCurrencyPrecision(total, toCurrency)
      },
      fromCurrency,
      toCurrency,
      exchangeRate: materialsCost.exchangeRate,
      timestamp: new Date(),
      success: materialsCost.success && laborCost.success && equipmentCost.success
    };
  }

  /**
   * Get exchange rate between two currencies
   */
  public getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1;
    
    const key = `${fromCurrency}-${toCurrency}`;
    const exchangeRate = this.exchangeRates.get(key);
    
    return exchangeRate?.rate || 1;
  }

  /**
   * Get currency information
   */
  public getCurrencyInfo(currencyCode: string): CurrencyInfo | undefined {
    return this.currencies.get(currencyCode);
  }

  /**
   * Get all supported currencies
   */
  public getSupportedCurrencies(): CurrencyInfo[] {
    return Array.from(this.currencies.values());
  }

  /**
   * Format amount according to currency conventions
   */
  public formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.getCurrencyInfo(currencyCode);
    if (!currency) return amount.toString();

    const roundedAmount = this.roundToCurrencyPrecision(amount, currencyCode);
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currency.decimalPlaces,
        maximumFractionDigits: currency.decimalPlaces
      }).format(roundedAmount);
    } catch {
      // Fallback formatting
      return `${currency.symbol}${roundedAmount.toFixed(currency.decimalPlaces)}`;
    }
  }

  /**
   * Round amount to currency precision
   */
  private roundToCurrencyPrecision(amount: number, currencyCode: string): number {
    const currency = this.getCurrencyInfo(currencyCode);
    if (!currency) return amount;

    const factor = Math.pow(10, currency.decimalPlaces);
    return Math.round(amount * factor) / factor;
  }

  /**
   * Get historical rates (mock implementation)
   */
  public getHistoricalRates(
    fromCurrency: string,
    toCurrency: string,
    days: number = 30
  ): HistoricalRate[] {
    const rates: HistoricalRate[] = [];
    const currentRate = this.getExchangeRate(fromCurrency, toCurrency);
    
    // Generate mock historical data
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some variance to the current rate
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      const historicalRate = currentRate * (1 + variance);
      
      rates.push({
        date,
        rate: historicalRate,
        fromCurrency,
        toCurrency
      });
    }
    
    return rates;
  }

  /**
   * Get currency trends
   */
  public getCurrencyTrend(
    fromCurrency: string,
    toCurrency: string,
    days: number = 30
  ): CurrencyTrend {
    const historicalRates = this.getHistoricalRates(fromCurrency, toCurrency, days);
    
    if (historicalRates.length < 2) {
      return {
        trend: 'stable',
        changePercent: 0,
        currentRate: this.getExchangeRate(fromCurrency, toCurrency),
        historicalRates
      };
    }

    const oldestRate = historicalRates[0].rate;
    const currentRate = historicalRates[historicalRates.length - 1].rate;
    const changePercent = ((currentRate - oldestRate) / oldestRate) * 100;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 1) {
      trend = changePercent > 0 ? 'up' : 'down';
    }

    return {
      trend,
      changePercent,
      currentRate,
      historicalRates
    };
  }

  /**
   * Check if exchange rates need updating
   */
  public needsUpdate(): boolean {
    const timeSinceUpdate = Date.now() - this.lastUpdate.getTime();
    return timeSinceUpdate > this.updateInterval;
  }

  /**
   * Update exchange rates (would fetch from API in production)
   */
  public async updateExchangeRates(): Promise<boolean> {
    try {
      // In production, this would fetch from a currency API
      // For now, just update the timestamp
      this.lastUpdate = new Date();
      console.log('💱 Exchange rates updated at', this.lastUpdate.toISOString());
      return true;
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      return false;
    }
  }

  /**
   * Get popular currency pairs for a base currency
   */
  public getPopularPairs(baseCurrency: string): string[] {
    const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
    return popularCurrencies.filter(currency => currency !== baseCurrency);
  }
}

// Interfaces
export interface ConversionResult {
  originalAmount: number;
  convertedAmount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export interface ProjectCosts {
  materials: number;
  labor: number;
  equipment: number;
  other?: number;
  total?: number;
}

export interface ConvertedProjectCosts {
  original: ProjectCosts;
  converted: ProjectCosts & { total: number };
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  timestamp: Date;
  success: boolean;
}

export interface HistoricalRate {
  date: Date;
  rate: number;
  fromCurrency: string;
  toCurrency: string;
}

export interface CurrencyTrend {
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  currentRate: number;
  historicalRates: HistoricalRate[];
}

export default CurrencyConverterService;