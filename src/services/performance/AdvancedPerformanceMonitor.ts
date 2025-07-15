interface WebVital {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface PerformanceBudget {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

/**
 * Advanced Performance Monitor - Phase 4 Production Enhancement
 * Tracks Core Web Vitals and performance budgets
 */
class AdvancedPerformanceMonitor {
  private vitals: Map<string, WebVital> = new Map();
  private budget: PerformanceBudget = {
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    fcp: 1800, // 1.8s
    ttfb: 800  // 800ms
  };
  private alertThreshold = 0.8; // Alert when 80% of budget is used

  constructor() {
    this.initializeWebVitals();
    this.setupPerformanceObserver();
    this.monitorResourceTiming();
  }

  private initializeWebVitals() {
    if (typeof window === 'undefined') return;

    // Use fallback implementation for better compatibility
    this.setupFallbackVitals();
  }

  private onVitalUpdate(vital: WebVital) {
    this.vitals.set(vital.name, vital);
    
    // Check performance budget
    this.checkPerformanceBudget(vital);
    
    // Send to analytics if in production
    if (import.meta.env.PROD) {
      this.sendVitalToAnalytics(vital);
    }
  }

  private checkPerformanceBudget(vital: WebVital) {
    const budgetValue = this.budget[vital.name.toLowerCase() as keyof PerformanceBudget];
    if (!budgetValue) return;

    const utilization = vital.value / budgetValue;
    
    if (utilization > 1) {
      console.warn(`🚨 Performance Budget Exceeded: ${vital.name} = ${vital.value} (budget: ${budgetValue})`);
      this.alertPerformanceIssue(vital, 'exceeded');
    } else if (utilization > this.alertThreshold) {
      console.warn(`⚠️ Performance Budget Warning: ${vital.name} = ${vital.value} (${Math.round(utilization * 100)}% of budget)`);
      this.alertPerformanceIssue(vital, 'warning');
    }
  }

  private setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;

    // Monitor navigation timing
    const navObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          this.processNavigationEntry(entry as PerformanceNavigationTiming);
        }
      });
    });
    navObserver.observe({ entryTypes: ['navigation'] });

    // Monitor paint timing
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'paint') {
          this.processPaintEntry(entry);
        }
      });
    });
    paintObserver.observe({ entryTypes: ['paint'] });

    // Monitor layout shifts
    const layoutObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          this.processLayoutShift(entry);
        }
      });
    });
    layoutObserver.observe({ entryTypes: ['layout-shift'] });
  }

  private monitorResourceTiming() {
    if (!('performance' in window)) return;

    setInterval(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      resources.forEach((resource) => {
        // Monitor slow resources
        if (resource.duration > 3000) {
          console.warn(`Slow resource detected: ${resource.name} (${resource.duration}ms)`);
        }
        
        // Monitor large resources
        if (resource.transferSize > 1024 * 1024) { // 1MB
          console.warn(`Large resource detected: ${resource.name} (${(resource.transferSize / 1024 / 1024).toFixed(2)}MB)`);
        }
      });
    }, 30000); // Check every 30 seconds
  }

  private setupFallbackVitals() {
    // Fallback implementation for basic performance monitoring
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;
      
      // Calculate basic metrics
      const lcp = timing.loadEventEnd - timing.navigationStart;
      const fcp = timing.responseStart - timing.navigationStart;
      const ttfb = timing.responseStart - timing.requestStart;
      
      // Mock vital objects
      const mockVitals: Partial<WebVital>[] = [
        { name: 'LCP', value: lcp, rating: lcp > 2500 ? 'poor' : lcp > 1200 ? 'needs-improvement' : 'good' },
        { name: 'FCP', value: fcp, rating: fcp > 3000 ? 'poor' : fcp > 1800 ? 'needs-improvement' : 'good' },
        { name: 'TTFB', value: ttfb, rating: ttfb > 1500 ? 'poor' : ttfb > 800 ? 'needs-improvement' : 'good' }
      ];
      
      mockVitals.forEach((vital) => {
        if (vital.name && vital.value !== undefined) {
          this.vitals.set(vital.name, vital as WebVital);
        }
      });
    }
  }

  private processNavigationEntry(entry: PerformanceNavigationTiming) {
    const metrics = {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      connection: entry.connectEnd - entry.connectStart,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart,
      dom: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      load: entry.loadEventEnd - entry.loadEventStart
    };

    // Log slow phases
    Object.entries(metrics).forEach(([phase, duration]) => {
      if (duration > 1000) {
        console.warn(`Slow ${phase} phase: ${duration}ms`);
      }
    });
  }

  private processPaintEntry(entry: PerformanceEntry) {
    if (entry.name === 'first-contentful-paint') {
      const fcp = entry.startTime;
      if (fcp > this.budget.fcp) {
        console.warn(`FCP budget exceeded: ${fcp}ms`);
      }
    }
  }

  private processLayoutShift(entry: PerformanceEntry) {
    const shift = (entry as any).value;
    if (shift > 0.1) {
      console.warn(`Large layout shift detected: ${shift}`);
    }
  }

  private alertPerformanceIssue(vital: WebVital, severity: 'warning' | 'exceeded') {
    // In production, send to error tracking
    if (import.meta.env.PROD) {
      // Send to centralized error reporting
      try {
        import('@/services/error/CentralizedErrorReporting').then(({ default: errorReporting }) => {
          errorReporting.reportError(
            new Error(`Performance ${severity}: ${vital.name}`),
            {
              feature: 'Performance Monitoring',
              action: 'performance_budget_violation',
              additionalData: {
                vital,
                severity,
                budget: this.budget
              }
            }
          );
        });
      } catch (error) {
        console.error('Failed to report performance issue:', error);
      }
    }
  }

  private sendVitalToAnalytics(vital: WebVital) {
    // Send to analytics service (Google Analytics 4, etc.)
    if ('gtag' in window) {
      (window as any).gtag('event', vital.name, {
        event_category: 'Web Vitals',
        value: Math.round(vital.value),
        metric_rating: vital.rating,
        custom_map: { metric_id: vital.id }
      });
    }
  }

  getPerformanceReport() {
    const report = {
      vitals: Object.fromEntries(this.vitals),
      budget: this.budget,
      budgetUtilization: {} as Record<string, number>,
      overall: 'good' as 'good' | 'needs-improvement' | 'poor'
    };

    // Calculate budget utilization
    this.vitals.forEach((vital, name) => {
      const budgetValue = this.budget[name.toLowerCase() as keyof PerformanceBudget];
      if (budgetValue) {
        report.budgetUtilization[name] = vital.value / budgetValue;
      }
    });

    // Determine overall performance rating
    const ratings = Array.from(this.vitals.values()).map(v => v.rating);
    if (ratings.some(r => r === 'poor')) {
      report.overall = 'poor';
    } else if (ratings.some(r => r === 'needs-improvement')) {
      report.overall = 'needs-improvement';
    }

    return report;
  }

  updateBudget(newBudget: Partial<PerformanceBudget>) {
    this.budget = { ...this.budget, ...newBudget };
  }
}

export const advancedPerformanceMonitor = new AdvancedPerformanceMonitor();
export default advancedPerformanceMonitor;