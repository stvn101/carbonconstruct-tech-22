import { preloadComponents } from '@/utils/lazyLoad';
import centralizedErrorReporting from '@/services/error/CentralizedErrorReporting';

interface BundleMetrics {
  bundleName: string;
  size: number;
  loadTime: number;
  cacheHit: boolean;
}

/**
 * Bundle Optimizer - Phase 2 Performance Enhancement
 * Manages code splitting, preloading, and bundle size monitoring
 */
class BundleOptimizer {
  private bundleMetrics: Map<string, BundleMetrics> = new Map();
  private preloadQueue: Array<() => Promise<any>> = [];
  private isOptimizing: boolean = false;

  /**
   * Initialize bundle optimization strategies
   */
  initialize() {
    this.setupPerformanceObserver();
    this.scheduleIntelligentPreloading();
    this.monitorBundleSizes();
  }

  /**
   * Preload critical components based on user behavior
   */
  preloadCriticalComponents(userRole?: string, currentPage?: string) {
    const criticalComponents = this.getCriticalComponentsForContext(userRole, currentPage);
    
    if (criticalComponents.length > 0) {
      preloadComponents(criticalComponents);
      
      centralizedErrorReporting.trackPerformanceMetrics('BundleOptimizer', {
        loadTime: performance.now(),
        bundleSize: criticalComponents.length
      });
    }
  }

  /**
   * Get critical components based on user context
   */
  private getCriticalComponentsForContext(userRole?: string, currentPage?: string): Array<() => Promise<any>> {
    const components: Array<() => Promise<any>> = [];

    // Always preload calculator components for any user
    if (currentPage === '/' || currentPage === '/calculator') {
      components.push(
        () => import('@/components/calculator/calculators/NCCCalculator'),
        () => import('@/components/calculator/calculators/NABERSCalculator')
      );
    }

    // Preload materials database for authenticated users
    if (userRole && currentPage !== '/materials') {
      components.push(
        () => import('@/components/materials/SimplifiedMaterialDatabase')
      );
    }

    // Admin components only for admin users
    if (userRole === 'admin') {
      components.push(
        () => import('@/components/admin/AdminStatusChecker'),
        () => import('@/components/admin/MaterialsExportManager')
      );
    }

    // Premium features for authenticated users
    if (userRole) {
      components.push(
        () => import('@/pages/Sustainability'),
        () => import('@/pages/Analytics')
      );
    }

    return components;
  }

  /**
   * Monitor bundle loading performance
   */
  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation' || entry.entryType === 'resource') {
            this.trackBundleMetrics(entry);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'resource'] });
    }
  }

  /**
   * Track individual bundle metrics
   */
  private trackBundleMetrics(entry: PerformanceEntry) {
    if (entry.name.includes('.js') || entry.name.includes('.css')) {
      const bundleName = this.extractBundleName(entry.name);
      const resourceEntry = entry as PerformanceResourceTiming;
      
      const metrics: BundleMetrics = {
        bundleName,
        size: resourceEntry.transferSize || 0,
        loadTime: resourceEntry.duration || 0,
        cacheHit: resourceEntry.transferSize === 0 && resourceEntry.duration > 0
      };

      this.bundleMetrics.set(bundleName, metrics);
      
      // Report slow loading bundles
      if (metrics.loadTime > 2000) {
        centralizedErrorReporting.reportError(
          new Error(`Slow bundle loading: ${bundleName}`),
          {
            feature: 'Bundle Performance',
            action: 'slow_bundle_load',
            additionalData: metrics
          }
        );
      }
    }
  }

  /**
   * Schedule intelligent preloading based on idle time
   */
  private scheduleIntelligentPreloading() {
    if ('requestIdleCallback' in window) {
      const schedulePreload = () => {
        (window as any).requestIdleCallback(() => {
          if (this.preloadQueue.length > 0 && !this.isOptimizing) {
            this.isOptimizing = true;
            const component = this.preloadQueue.shift();
            
            if (component) {
              component().then(() => {
                this.isOptimizing = false;
                // Schedule next preload
                schedulePreload();
              }).catch((error) => {
                centralizedErrorReporting.reportBundleError(
                  'preload_component',
                  error
                );
                this.isOptimizing = false;
                schedulePreload();
              });
            }
          }
        }, { timeout: 5000 });
      };

      schedulePreload();
    }
  }

  /**
   * Monitor overall bundle sizes and alert on size increases
   */
  private monitorBundleSizes() {
    const totalSize = Array.from(this.bundleMetrics.values())
      .reduce((sum, metrics) => sum + metrics.size, 0);

    // Alert if total bundle size exceeds 2MB
    if (totalSize > 2 * 1024 * 1024) {
      centralizedErrorReporting.reportError(
        new Error('Bundle size threshold exceeded'),
        {
          feature: 'Bundle Size Monitoring',
          action: 'size_threshold_exceeded',
          additionalData: {
            totalSize,
            bundleCount: this.bundleMetrics.size,
            largestBundles: this.getLargestBundles(5)
          }
        }
      );
    }
  }

  /**
   * Get performance summary for debugging
   */
  getPerformanceSummary() {
    return {
      totalBundles: this.bundleMetrics.size,
      totalSize: Array.from(this.bundleMetrics.values()).reduce((sum, m) => sum + m.size, 0),
      averageLoadTime: Array.from(this.bundleMetrics.values()).reduce((sum, m) => sum + m.loadTime, 0) / this.bundleMetrics.size,
      cacheHitRate: (Array.from(this.bundleMetrics.values()).filter(m => m.cacheHit).length / this.bundleMetrics.size) * 100,
      largestBundles: this.getLargestBundles(3)
    };
  }

  private extractBundleName(url: string): string {
    const match = url.match(/\/([^\/]+\.(js|css))$/);
    return match ? match[1] : 'unknown';
  }

  private getLargestBundles(count: number): BundleMetrics[] {
    return Array.from(this.bundleMetrics.values())
      .sort((a, b) => b.size - a.size)
      .slice(0, count);
  }

  /**
   * Add component to preload queue
   */
  queueForPreload(importFunc: () => Promise<any>) {
    this.preloadQueue.push(importFunc);
  }
}

export const bundleOptimizer = new BundleOptimizer();
export default bundleOptimizer;