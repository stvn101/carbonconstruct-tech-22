
import { logger } from './logging/EnhancedLoggingService';
import { performanceMonitor } from './performance/PerformanceMonitor';

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private isInitialized = false;
  private metricsInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      // Start periodic metrics collection
      this.metricsInterval = setInterval(() => {
        this.collectMetrics();
      }, 30000); // Every 30 seconds

      logger.info('Performance monitoring service initialized', 'PerformanceMonitoring');
      this.isInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize performance monitoring', 'PerformanceMonitoring', { error });
    }
  }

  private collectMetrics(): void {
    try {
      const metrics = performanceMonitor.getMetrics();
      
      if (metrics.length > 0) {
        const recentMetrics = metrics.slice(-10); // Get last 10 metrics
        logger.debug('Performance metrics collected', 'PerformanceMonitoring', {
          count: recentMetrics.length,
          categories: [...new Set(recentMetrics.map(m => m.category))]
        });
      }
    } catch (error) {
      logger.warn('Failed to collect performance metrics', 'PerformanceMonitoring', { error });
    }
  }

  public trackRouteChange(path: string): void {
    try {
      const loadTime = performance.now();
      this.recordMetric('route_change', loadTime, 'system');
      logger.debug(`Route change tracked: ${path}`, 'PerformanceMonitoring', { path, loadTime });
    } catch (error) {
      logger.warn('Failed to track route change', 'PerformanceMonitoring', { error, path });
    }
  }

  public cleanup(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    
    performanceMonitor.cleanup();
    logger.info('Performance monitoring service cleaned up', 'PerformanceMonitoring');
  }

  public getMetrics() {
    return performanceMonitor.getMetrics();
  }

  public recordMetric(name: string, value: number, category: 'render' | 'network' | 'user' | 'system' = 'system') {
    performanceMonitor.recordMetric(name, value, category);
  }
}

export default PerformanceMonitoringService.getInstance();
