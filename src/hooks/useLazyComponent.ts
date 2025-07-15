import { useState, useEffect, useCallback } from 'react';
import { preloadComponent } from '@/utils/lazyLoad';

interface UseLazyComponentOptions {
  preloadDelay?: number;
  enableIntersectionObserver?: boolean;
  threshold?: number;
}

/**
 * Custom hook for intelligent lazy component loading - Phase 2 Enhancement
 * Provides preloading based on user behavior and viewport intersection
 */
export const useLazyComponent = (
  importFunc: () => Promise<{ default: any }>,
  options: UseLazyComponentOptions = {}
) => {
  const {
    preloadDelay = 2000,
    enableIntersectionObserver = true,
    threshold = 0.1
  } = options;

  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Preload component after delay
  useEffect(() => {
    if (!isPreloaded) {
      const timer = setTimeout(() => {
        preloadComponent(importFunc);
        setIsPreloaded(true);
      }, preloadDelay);

      return () => clearTimeout(timer);
    }
  }, [importFunc, preloadDelay, isPreloaded]);

  // Intersection observer for viewport-based loading
  const observerRef = useCallback((node: HTMLElement | null) => {
    if (!enableIntersectionObserver || !node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPreloaded) {
          preloadComponent(importFunc);
          setIsPreloaded(true);
          setIsIntersecting(true);
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [importFunc, enableIntersectionObserver, threshold, isPreloaded]);

  // Manual preload function
  const preload = useCallback(() => {
    if (!isPreloaded) {
      preloadComponent(importFunc);
      setIsPreloaded(true);
    }
  }, [importFunc, isPreloaded]);

  return {
    isPreloaded,
    isIntersecting,
    observerRef,
    preload
  };
};