// Advanced Performance Optimizer for CarbonConstruct
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  domLoadTime: number;
  resourceLoadTime: number;
}

export interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCodeSplitting: boolean;
  enableCaching: boolean;
  enablePreloading: boolean;
  bundleAnalysis: boolean;
}

class PerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    domLoadTime: 0,
    resourceLoadTime: 0
  };

  private config: OptimizationConfig;
  private observer?: PerformanceObserver;
  private intersectionObserver?: IntersectionObserver;

  constructor(config: OptimizationConfig = {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCodeSplitting: true,
    enableCaching: true,
    enablePreloading: true,
    bundleAnalysis: true
  }) {
    this.config = config;
    this.initialize();
  }

  /**
   * Initialize performance optimizations
   */
  private initialize() {
    this.setupPerformanceMonitoring();
    
    if (this.config.enableLazyLoading) {
      this.setupLazyLoading();
    }
    
    if (this.config.enableImageOptimization) {
      this.setupImageOptimization();
    }
    
    if (this.config.enablePreloading) {
      this.setupResourcePreloading();
    }
    
    if (this.config.enableCaching) {
      this.setupIntelligentCaching();
    }

    console.log('⚡ Performance Optimizer initialized');
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      this.observeMetric('first-contentful-paint', (entry) => {
        this.metrics.fcp = entry.startTime;
      });

      // Largest Contentful Paint
      this.observeMetric('largest-contentful-paint', (entry) => {
        this.metrics.lcp = entry.startTime;
      });

      // First Input Delay
      this.observeMetric('first-input', (entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
      });

      // Cumulative Layout Shift
      this.observeMetric('layout-shift', (entry) => {
        if (!entry.hadRecentInput) {
          this.metrics.cls += entry.value;
        }
      });

      // Navigation timing
      this.observeMetric('navigation', (entry) => {
        this.metrics.ttfb = entry.responseStart - entry.requestStart;
        this.metrics.domLoadTime = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
        this.metrics.resourceLoadTime = entry.loadEventEnd - entry.loadEventStart;
      });
    }

    // Report metrics periodically
    setInterval(() => {
      this.reportMetrics();
    }, 30000); // Report every 30 seconds
  }

  /**
   * Observe specific performance metrics
   */
  private observeMetric(entryType: string, callback: (entry: any) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      
      observer.observe({ entryTypes: [entryType] });
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  /**
   * Setup lazy loading for images and components
   */
  private setupLazyLoading() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            
            // Lazy load images
            if (target.tagName === 'IMG') {
              const img = target as HTMLImageElement;
              const dataSrc = img.getAttribute('data-src');
              if (dataSrc) {
                img.src = dataSrc;
                img.removeAttribute('data-src');
                this.intersectionObserver?.unobserve(img);
              }
            }
            
            // Lazy load components
            if (target.hasAttribute('data-lazy-component')) {
              this.loadLazyComponent(target);
            }
          }
        });
      },
      { 
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    // Observe existing lazy elements
    this.observeLazyElements();

    // Observer for dynamically added elements
    const mutationObserver = new MutationObserver(() => {
      this.observeLazyElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Observe lazy loading elements
   */
  private observeLazyElements() {
    // Images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.intersectionObserver?.observe(img));

    // Lazy components
    const lazyComponents = document.querySelectorAll('[data-lazy-component]');
    lazyComponents.forEach(component => this.intersectionObserver?.observe(component));
  }

  /**
   * Load lazy component
   */
  private async loadLazyComponent(element: HTMLElement) {
    const componentName = element.getAttribute('data-lazy-component');
    if (!componentName) return;

    try {
      // Dynamic import for code splitting
      const module = await import(`@/components/${componentName}`);
      const Component = module.default || module[componentName];
      
      // Render component (this would need React integration)
      console.log(`Lazy loaded component: ${componentName}`);
      
      this.intersectionObserver?.unobserve(element);
    } catch (error) {
      console.error(`Failed to lazy load component ${componentName}:`, error);
    }
  }

  /**
   * Setup image optimization
   */
  private setupImageOptimization() {
    // Convert images to WebP when supported
    if (this.supportsWebP()) {
      this.convertImagesToWebP();
    }

    // Implement responsive images
    this.setupResponsiveImages();

    // Optimize image loading
    this.optimizeImageLoading();
  }

  /**
   * Check WebP support
   */
  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Convert images to WebP
   */
  private convertImagesToWebP() {
    const images = document.querySelectorAll('img');
    images.forEach((img: HTMLImageElement) => {
      const src = img.src;
      if (src && !src.includes('.webp')) {
        img.setAttribute('data-original-src', src);
      }
    });
  }

  /**
   * Setup responsive images
   */
  private setupResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.hasAttribute('sizes') && !img.hasAttribute('srcset')) {
        // Add responsive attributes based on container size
        const containerWidth = img.parentElement?.offsetWidth || window.innerWidth;
        
        if (containerWidth > 1200) {
          img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
        } else if (containerWidth > 768) {
          img.sizes = '(max-width: 768px) 100vw, 50vw';
        } else {
          img.sizes = '100vw';
        }
      }
    });
  }

  /**
   * Optimize image loading
   */
  private optimizeImageLoading() {
    // Add loading="lazy" to images below the fold
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (index > 2 && !img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
    });

    // Preload critical images
    const criticalImages = document.querySelectorAll('img[data-priority="high"]');
    criticalImages.forEach((img: HTMLImageElement) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    });
  }

  /**
   * Setup resource preloading
   */
  private setupResourcePreloading() {
    // Preload critical CSS
    this.preloadCriticalCSS();
    
    // Preload important scripts
    this.preloadCriticalScripts();
    
    // DNS prefetch for external domains
    this.setupDNSPrefetch();
    
    // Preconnect to critical origins
    this.setupPreconnect();
  }

  /**
   * Preload critical CSS
   */
  private preloadCriticalCSS() {
    const criticalCSS = [
      '/src/index.css',
      '/src/styles/components.css'
    ];

    criticalCSS.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  /**
   * Preload critical scripts
   */
  private preloadCriticalScripts() {
    const criticalScripts = [
      '/src/main.tsx'
    ];

    criticalScripts.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  /**
   * Setup DNS prefetch
   */
  private setupDNSPrefetch() {
    const domains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'supabase.co',
      'stripe.com'
    ];

    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }

  /**
   * Setup preconnect
   */
  private setupPreconnect() {
    const origins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    origins.forEach((origin) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * Setup intelligent caching
   */
  private setupIntelligentCaching() {
    // Service Worker caching strategies
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Cache API responses based on freshness requirements
        this.setupAPIResponseCaching();
        
        // Cache static assets with versioning
        this.setupStaticAssetCaching();
      });
    }

    // Memory caching for frequently accessed data
    this.setupMemoryCache();
  }

  /**
   * Setup API response caching
   */
  private setupAPIResponseCaching() {
    const originalFetch = window.fetch;
    const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

    window.fetch = async (...args) => {
      const [resource, config] = args;
      const url = typeof resource === 'string' ? resource : (resource as Request).url;
      
      // Only cache GET requests
      if (!config?.method || config.method === 'GET') {
        const cacheKey = url;
        const cached = cache.get(cacheKey);
        
        // Return cached response if still valid
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          return new Response(JSON.stringify(cached.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      const response = await originalFetch.apply(this, args);
      
      // Cache successful GET responses
      if (response.ok && (!config?.method || config.method === 'GET')) {
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        
        // Determine TTL based on endpoint
        let ttl = 5 * 60 * 1000; // 5 minutes default
        if (url.includes('/materials')) ttl = 30 * 60 * 1000; // 30 minutes for materials
        if (url.includes('/projects')) ttl = 2 * 60 * 1000; // 2 minutes for projects
        
        cache.set(url, { data, timestamp: Date.now(), ttl });
      }
      
      return response;
    };
  }

  /**
   * Setup static asset caching
   */
  private setupStaticAssetCaching() {
    // This would typically be handled by the service worker
    // Implementation depends on build system and deployment
  }

  /**
   * Setup memory cache
   */
  private setupMemoryCache() {
    const memoryCache = new Map<string, any>();
    
    // Cache calculation results
    window.addEventListener('calculation-complete', (event: any) => {
      const { input, result } = event.detail;
      const cacheKey = JSON.stringify(input);
      memoryCache.set(cacheKey, result);
    });
    
    // Provide cached calculations
    window.addEventListener('calculation-request', (event: any) => {
      const { input } = event.detail;
      const cacheKey = JSON.stringify(input);
      const cached = memoryCache.get(cacheKey);
      
      if (cached) {
        window.dispatchEvent(new CustomEvent('calculation-cached', {
          detail: { input, result: cached }
        }));
      }
    });
  }

  /**
   * Report performance metrics
   */
  private reportMetrics() {
    const report = {
      ...this.metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo()
    };

    // Send to analytics service
    if (import.meta.env.PROD) {
      this.sendMetricsToService(report);
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log('📊 Performance Metrics:', report);
    }

    return report;
  }

  /**
   * Get connection information
   */
  private getConnectionInfo() {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    
    return null;
  }

  /**
   * Send metrics to monitoring service
   */
  private async sendMetricsToService(metrics: any) {
    try {
      await fetch('/api/performance/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      });
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
    }
  }

  /**
   * Get current performance score
   */
  public getPerformanceScore(): number {
    // Calculate score based on Core Web Vitals
    let score = 100;
    
    // FCP penalty (good: <1.8s, poor: >3s)
    if (this.metrics.fcp > 3000) score -= 20;
    else if (this.metrics.fcp > 1800) score -= 10;
    
    // LCP penalty (good: <2.5s, poor: >4s)
    if (this.metrics.lcp > 4000) score -= 25;
    else if (this.metrics.lcp > 2500) score -= 15;
    
    // FID penalty (good: <100ms, poor: >300ms)
    if (this.metrics.fid > 300) score -= 20;
    else if (this.metrics.fid > 100) score -= 10;
    
    // CLS penalty (good: <0.1, poor: >0.25)
    if (this.metrics.cls > 0.25) score -= 15;
    else if (this.metrics.cls > 0.1) score -= 8;
    
    return Math.max(0, score);
  }

  /**
   * Get optimization recommendations
   */
  public getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.fcp > 2500) {
      recommendations.push('Optimize critical render path to improve First Contentful Paint');
    }
    
    if (this.metrics.lcp > 3000) {
      recommendations.push('Optimize largest content element (images, text blocks) loading');
    }
    
    if (this.metrics.fid > 200) {
      recommendations.push('Reduce JavaScript execution time and break up long tasks');
    }
    
    if (this.metrics.cls > 0.15) {
      recommendations.push('Stabilize layout by setting dimensions on images and ads');
    }
    
    if (this.metrics.ttfb > 800) {
      recommendations.push('Optimize server response time and consider CDN usage');
    }
    
    return recommendations;
  }

  /**
   * Singleton instance
   */
  private static _instance: PerformanceOptimizer;
  
  public static get instance(): PerformanceOptimizer {
    if (!PerformanceOptimizer._instance) {
      PerformanceOptimizer._instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer._instance;
  }
}

export default PerformanceOptimizer;