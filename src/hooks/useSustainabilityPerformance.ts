
import { useEffect, useRef, useCallback } from 'react';
import { trackMetric } from '@/contexts/performance/metrics';

interface PerformanceMetrics {
  renderTime: number;
  dataProcessingTime: number;
  apiCallTime: number;
  cacheHitRate: number;
}

export const useSustainabilityPerformance = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const apiCallStartTime = useRef<number>(0);
  const cacheHits = useRef<number>(0);
  const totalRequests = useRef<number>(0);

  // Track component render performance
  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      trackMetric({
        metric: 'sustainability_render_time',
        value: renderTime,
        tags: { component: componentName }
      });
    };
  }, [componentName]);

  // Track API call performance
  const trackApiCall = useCallback((apiName: string) => {
    apiCallStartTime.current = performance.now();
    totalRequests.current++;
    
    return () => {
      const apiTime = performance.now() - apiCallStartTime.current;
      trackMetric({
        metric: 'sustainability_api_time',
        value: apiTime,
        tags: { api: apiName, component: componentName }
      });
    };
  }, [componentName]);

  // Track cache performance
  const trackCacheHit = useCallback(() => {
    cacheHits.current++;
    const hitRate = (cacheHits.current / totalRequests.current) * 100;
    
    trackMetric({
      metric: 'sustainability_cache_hit_rate',
      value: hitRate,
      tags: { component: componentName }
    });
  }, [componentName]);

  // Track data processing performance
  const trackDataProcessing = useCallback((dataSize: number) => {
    const startTime = performance.now();
    
    return () => {
      const processingTime = performance.now() - startTime;
      trackMetric({
        metric: 'sustainability_data_processing_time',
        value: processingTime,
        tags: { 
          component: componentName,
          dataSize: dataSize.toString()
        }
      });
    };
  }, [componentName]);

  return {
    trackApiCall,
    trackCacheHit,
    trackDataProcessing
  };
};
