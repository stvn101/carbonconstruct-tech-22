import { toast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

interface ErrorEvent {
  message: string;
  filename: string;
  lineno: number;
  colno: number;
  error: Error;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
}

interface UserSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  pageViews: number;
  errors: number;
  userId?: string;
  deviceInfo: {
    userAgent: string;
    screen: string;
    language: string;
    timezone: string;
  };
}

class ProductionMonitor {
  private static instance: ProductionMonitor;
  private performanceMetrics: PerformanceMetrics[] = [];
  private errors: ErrorEvent[] = [];
  private currentSession: UserSession;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  
  static getInstance(): ProductionMonitor {
    if (!ProductionMonitor.instance) {
      ProductionMonitor.instance = new ProductionMonitor();
    }
    return ProductionMonitor.instance;
  }
  
  constructor() {
    this.currentSession = this.initializeSession();
    this.setupErrorHandling();
    this.setupPerformanceMonitoring();
    this.startHeartbeat();
  }
  
  private initializeSession(): UserSession {
    const sessionId = `session_${  Math.random().toString(36).substr(2, 9)  }${Date.now()}`;
    
    return {
      sessionId,
      startTime: new Date(),
      pageViews: 1,
      errors: 0,
      deviceInfo: {
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };
  }
  
  private setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      const errorEvent: ErrorEvent = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      this.logError(errorEvent);
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const errorEvent: ErrorEvent = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        filename: 'unknown',
        lineno: 0,
        colno: 0,
        error: new Error(event.reason),
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      this.logError(errorEvent);
    });
  }
  
  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('largestContentfulPaint', lastEntry.startTime);
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }
    }
    
    // Page Load Performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics: PerformanceMetrics = {
            pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
            firstContentfulPaint: this.getFirstContentfulPaint(),
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0,
            timeToInteractive: this.calculateTimeToInteractive(navigation)
          };
          
          this.performanceMetrics.push(metrics);
          this.analyzePerformance(metrics);
        }
      }, 1000);
    });
  }
  
  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }
  
  private calculateTimeToInteractive(navigation: PerformanceNavigationTiming): number {
    return navigation.domInteractive - navigation.fetchStart;
  }
  
  private recordMetric(type: keyof PerformanceMetrics, value: number) {
    if (this.performanceMetrics.length > 0) {
      const lastMetrics = this.performanceMetrics[this.performanceMetrics.length - 1];
      lastMetrics[type] = value;
    }
  }
  
  private analyzePerformance(metrics: PerformanceMetrics) {
    const issues: string[] = [];
    
    if (metrics.largestContentfulPaint > 2500) {
      issues.push('Poor LCP (>2.5s)');
    }
    
    if (metrics.pageLoadTime > 3000) {
      issues.push('Slow page load (>3s)');
    }
    
    if (issues.length > 0) {
      console.warn('📊 Performance issues detected:', issues);
      
      if (process.env.NODE_ENV === 'production') {
        this.sendPerformanceReport(metrics, issues);
      }
    }
  }
  
  private logError(errorEvent: ErrorEvent) {
    this.errors.push(errorEvent);
    this.currentSession.errors++;
    
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }
    
    console.error('🚨 Production Error:', errorEvent);
    
    // Send critical errors immediately
    if (this.isCriticalError(errorEvent)) {
      this.sendErrorReport(errorEvent, 'critical');
      
      toast({
        title: "Application Error",
        description: "An unexpected error occurred. Our team has been notified.",
        variant: "destructive",
      });
    }
  }
  
  private isCriticalError(errorEvent: ErrorEvent): boolean {
    const criticalPatterns = [
      /auth/i, /payment/i, /database/i, /supabase/i, /calculation/i, 
      /failed to fetch/i, /network error/i
    ];
    
    return criticalPatterns.some(pattern => 
      pattern.test(errorEvent.message) || pattern.test(errorEvent.filename)
    );
  }
  
  private async sendErrorReport(errorEvent: ErrorEvent, severity: 'critical') {
    if (process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost') {
      try {
        await fetch('/api/monitor/error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'error',
            severity,
            error: errorEvent,
            session: this.currentSession,
            environment: process.env.NODE_ENV
          })
        }).catch(() => null);
      } catch (error) {
        console.warn('Failed to send error report:', error);
      }
    }
  }
  
  private async sendPerformanceReport(metrics: PerformanceMetrics, issues: string[]) {
    if (process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost') {
      try {
        await fetch('/api/monitor/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'performance',
            metrics,
            issues,
            session: this.currentSession,
            timestamp: new Date().toISOString()
          })
        }).catch(() => null);
      } catch (error) {
        console.warn('Failed to send performance report:', error);
      }
    }
  }
  
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 60000);
  }
  
  private async sendHeartbeat() {
    if (process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost') {
      try {
        await fetch('/api/monitor/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: this.currentSession.sessionId,
            timestamp: new Date().toISOString(),
            pageViews: this.currentSession.pageViews,
            errors: this.currentSession.errors,
            url: window.location.href,
            performance: this.getAveragePerformance()
          })
        }).catch(() => null);
      } catch (error) {
        // Fail silently for heartbeat
      }
    }
  }
  
  private getAveragePerformance(): Partial<PerformanceMetrics> {
    if (this.performanceMetrics.length === 0) return {};
    
    const totals = this.performanceMetrics.reduce((acc, metrics) => ({
      pageLoadTime: acc.pageLoadTime + metrics.pageLoadTime,
      firstContentfulPaint: acc.firstContentfulPaint + metrics.firstContentfulPaint,
      largestContentfulPaint: acc.largestContentfulPaint + metrics.largestContentfulPaint
    }), { pageLoadTime: 0, firstContentfulPaint: 0, largestContentfulPaint: 0 });
    
    const count = this.performanceMetrics.length;
    
    return {
      pageLoadTime: totals.pageLoadTime / count,
      firstContentfulPaint: totals.firstContentfulPaint / count,
      largestContentfulPaint: totals.largestContentfulPaint / count
    };
  }
  
  // Public methods
  public trackPageView(path: string) {
    this.currentSession.pageViews++;
    console.log(`📄 Page view tracked: ${path}`);
  }
  
  public trackUserAction(action: string, details?: Record<string, any>) {
    console.log(`👆 User action tracked: ${action}`, details);
  }
  
  public getSessionSummary() {
    return {
      ...this.currentSession,
      duration: Date.now() - this.currentSession.startTime.getTime(),
      recentErrors: this.errors.slice(-5),
      averagePerformance: this.getAveragePerformance()
    };
  }
  
  public destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.currentSession.endTime = new Date();
    this.sendSessionReport();
  }
  
  private async sendSessionReport() {
    if (process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost') {
      try {
        await fetch('/api/monitor/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'session_end',
            session: this.currentSession,
            totalErrors: this.errors.length,
            performanceMetrics: this.performanceMetrics
          })
        }).catch(() => null);
      } catch (error) {
        // Fail silently
      }
    }
  }
}

// Export the class and create a default instance
export { ProductionMonitor };
export const productionMonitor = ProductionMonitor.getInstance();
