import { useState, useEffect, useCallback } from 'react';
import { queryOptimizer } from '@/services/db/QueryOptimizer';

export interface PerformanceMetrics {
  queryTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
}

export const usePerformanceOptimizer = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    queryTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0
  });

  const measureQuery = useCallback(async <T>(
    queryFn: () => Promise<T[]>,
    cacheKey: string
  ): Promise<T[]> => {
    const startTime = performance.now();
    
    try {
      const result = await queryOptimizer.optimizedQuery(
        queryFn(),
        cacheKey,
        { enableCache: true, cacheTTL: 300000 }
      );
      
      const endTime = performance.now();
      setMetrics(prev => ({
        ...prev,
        queryTime: endTime - startTime
      }));
      
      if (result.success && result.data !== undefined) {
        return result.data as T[];
      } else {
        throw new Error(result.error || 'Query failed');
      }
    } catch (error) {
      console.error('Query optimization failed:', error);
      throw error;
    }
  }, []);

  const optimizeComponent = useCallback(() => {
    // Force garbage collection if available
    if ('gc' in window && typeof window.gc === 'function') {
      window.gc();
    }
    
    // Clear unused cache entries
    queryOptimizer.clearCache();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if ('memory' in performance) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: (performance as any).memory.usedJSHeapSize / 1024 / 1024
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    measureQuery,
    optimizeComponent
  };
};