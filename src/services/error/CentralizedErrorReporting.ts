import errorTrackingService from '../errorTrackingService';

interface ErrorContext {
  feature: string;
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
  url?: string;
  userAgent?: string;
  additionalData?: Record<string, any>;
}

interface PerformanceMetrics {
  loadTime?: number;
  renderTime?: number;
  bundleSize?: number;
  memoryUsage?: number;
}

/**
 * Centralized Error Reporting Service - Phase 2 Enhancement
 * Unified error reporting with context enrichment and performance tracking
 */
class CentralizedErrorReporting {
  private sessionId: string;
  private errorQueue: Array<{ error: Error; context: ErrorContext }> = [];
  private isOnline: boolean = navigator.onLine;
  private performanceMetrics: Map<string, PerformanceMetrics> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
  }

  /**
   * Report error with enriched context
   */
  reportError(error: Error, context: Partial<ErrorContext> = {}) {
    const enrichedContext: ErrorContext = {
      feature: context.feature || 'Unknown',
      component: context.component,
      action: context.action,
      userId: this.getUserId(),
      sessionId: this.sessionId,
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      additionalData: {
        ...context.additionalData,
        isOnline: this.isOnline,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        performance: this.getPerformanceSnapshot()
      }
    };

    if (this.isOnline) {
      this.sendError(error, enrichedContext);
    } else {
      this.queueError(error, enrichedContext);
    }
  }

  /**
   * Track performance metrics for features
   */
  trackPerformanceMetrics(feature: string, metrics: PerformanceMetrics) {
    this.performanceMetrics.set(feature, {
      ...this.performanceMetrics.get(feature),
      ...metrics
    });
  }

  /**
   * Report bundle loading errors
   */
  reportBundleError(bundleName: string, error: Error) {
    this.reportError(error, {
      feature: 'Bundle Loading',
      component: bundleName,
      action: 'lazy_load_failed',
      additionalData: {
        bundleName,
        errorType: 'ChunkLoadError'
      }
    });
  }

  /**
   * Report component mounting errors
   */
  reportComponentError(componentName: string, error: Error, props?: any) {
    this.reportError(error, {
      feature: 'Component Mounting',
      component: componentName,
      action: 'mount_failed',
      additionalData: {
        props: this.sanitizeProps(props),
        componentStack: error.stack
      }
    });
  }

  /**
   * Track user journey for context
   */
  trackUserJourney(action: string, feature: string, additionalData?: any) {
    // Store user journey for error context
    const journeyEntry = {
      action,
      feature,
      timestamp: Date.now(),
      url: window.location.href,
      additionalData
    };

    // Keep only last 10 journey entries
    const existingJourney = JSON.parse(
      sessionStorage.getItem('user_journey') || '[]'
    );
    existingJourney.push(journeyEntry);
    
    if (existingJourney.length > 10) {
      existingJourney.shift();
    }
    
    sessionStorage.setItem('user_journey', JSON.stringify(existingJourney));
  }

  private sendError(error: Error, context: ErrorContext) {
    try {
      // Use existing error tracking service
      errorTrackingService.captureException(error, {
        feature: context.feature,
        component: context.component,
        action: context.action,
        source: 'CentralizedErrorReporting',
        context: {
          ...context,
          userJourney: this.getUserJourney()
        }
      });
    } catch (reportingError) {
      console.error('Failed to send error report:', reportingError);
      this.queueError(error, context);
    }
  }

  private queueError(error: Error, context: ErrorContext) {
    this.errorQueue.push({ error, context });
    
    // Limit queue size
    if (this.errorQueue.length > 50) {
      this.errorQueue.shift();
    }
  }

  private flushErrorQueue() {
    if (this.isOnline && this.errorQueue.length > 0) {
      const errors = [...this.errorQueue];
      this.errorQueue = [];
      
      errors.forEach(({ error, context }) => {
        this.sendError(error, context);
      });
    }
  }

  private setupEventListeners() {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          feature: 'Promise Rejection',
          action: 'unhandled_rejection',
          additionalData: { reason: event.reason }
        }
      );
    });

    // Global error handler
    window.addEventListener('error', (event) => {
      this.reportError(event.error || new Error(event.message), {
        feature: 'Global Error',
        action: 'global_error',
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    // Get user ID from auth context or local storage
    try {
      const authData = localStorage.getItem('supabase.auth.token');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.user?.id;
      }
    } catch (error) {
      // Silently fail
    }
    return undefined;
  }

  private getUserJourney(): any[] {
    try {
      return JSON.parse(sessionStorage.getItem('user_journey') || '[]');
    } catch (error) {
      return [];
    }
  }

  private getPerformanceSnapshot() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation?.loadEventEnd - navigation?.loadEventStart,
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        memoryUsage: this.getMemoryUsage()
      };
    }
    return {};
  }

  private getFirstPaint(): number | undefined {
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint?.startTime;
    } catch (error) {
      return undefined;
    }
  }

  private getMemoryUsage(): any {
    try {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : undefined;
    } catch (error) {
      return undefined;
    }
  }

  private sanitizeProps(props: any): any {
    if (!props) return undefined;
    
    try {
      // Remove functions and complex objects to avoid circular references
      const sanitized: any = {};
      Object.keys(props).forEach(key => {
        const value = props[key];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          sanitized[key] = value;
        } else if (Array.isArray(value)) {
          sanitized[key] = `Array(${value.length})`;
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = Object.prototype.toString.call(value);
        }
      });
      return sanitized;
    } catch (error) {
      return { error: 'Failed to sanitize props' };
    }
  }
}

export const centralizedErrorReporting = new CentralizedErrorReporting();
export default centralizedErrorReporting;
