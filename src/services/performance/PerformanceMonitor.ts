

import { logger } from '../logging/EnhancedLoggingService';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  category: 'render' | 'network' | 'user' | 'system';
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isDevelopment = import.meta.env.MODE === 'development';

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    try {
      // Observe Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Handle different types of performance entries with proper type assertions
          let value = 0;
          
          // Check for duration property (most common)
          if ('duration' in entry && typeof entry.duration === 'number') {
            value = entry.duration;
          } 
          // Check for processing start (for some timing entries)
          else if ('processingStart' in entry && 'startTime' in entry) {
            const processingStart = (entry as any).processingStart;
            const startTime = (entry as any).startTime;
            if (typeof processingStart === 'number' && typeof startTime === 'number') {
              value = processingStart - startTime;
            }
          } 
          // Fallback to startTime if available
          else if ('startTime' in entry) {
            const startTime = (entry as any).startTime;
            if (typeof startTime === 'number') {
              value = startTime;
            }
          }
          
          this.recordMetric(entry.name, value, 'system');
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to initialize performance observers', 'PerformanceMonitor', { error });
    }
  }

  public recordMetric(name: string, value: number, category: PerformanceMetric['category'] = 'system') {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      category
    };

    this.metrics.push(metric);

    // Keep only last 500 metrics to prevent memory leaks
    if (this.metrics.length > 500) {
      this.metrics = this.metrics.slice(-400);
    }

    if (this.isDevelopment) {
      logger.debug(`Performance: ${name} = ${value}ms`, 'PerformanceMonitor');
    }
  }

  public startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration, 'render');
    };
  }

  public getMetrics(category?: PerformanceMetric['category']): PerformanceMetric[] {
    if (!category) return [...this.metrics];
    return this.metrics.filter(m => m.category === category);
  }

  public getAverageMetric(name: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return 0;
    
    const sum = relevantMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / relevantMetrics.length;
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
export default performanceMonitor;

