import React from 'react';

/**
 * Code optimization utilities for better performance and maintainability
 */

// Lazy loading helper for heavy components
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFunc);
  
  // Return a simplified wrapper without complex forwardRef typing
  const WrappedComponent = (props: any) => (
    React.createElement(React.Suspense, {
      fallback: fallback ? React.createElement(fallback) : React.createElement('div', null, 'Loading...')
    }, React.createElement(LazyComponent, props))
  );
  
  return WrappedComponent;
};

// Memory-efficient array operations
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Debounced function factory
export const createDebounced = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

// Throttled function factory
export const createThrottled = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

// Memoization with WeakMap for object keys
export const createWeakMemo = <K extends object, V>() => {
  const cache = new WeakMap<K, V>();
  
  return {
    get: (key: K): V | undefined => cache.get(key),
    set: (key: K, value: V): WeakMap<K, V> => cache.set(key, value),
    has: (key: K): boolean => cache.has(key),
    delete: (key: K): boolean => cache.delete(key)
  };
};

// Performance measurement utility
export const measurePerformance = <T>(
  name: string,
  fn: () => T
): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
};

// Bundle size optimization - conditional imports
export const conditionalImport = async <T>(
  condition: boolean,
  importFunc: () => Promise<T>
): Promise<T | null> => {
  return condition ? await importFunc() : null;
};