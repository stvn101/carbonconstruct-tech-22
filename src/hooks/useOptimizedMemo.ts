import { useMemo, useRef, useState, useEffect } from 'react';

/**
 * Performance-optimized memoization hook that only recalculates when dependencies actually change
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  isEqual?: (prev: React.DependencyList, next: React.DependencyList) => boolean
): T {
  const prevDeps = useRef<React.DependencyList>();
  const memoizedValue = useRef<T>();

  const depsChanged = useMemo(() => {
    if (!prevDeps.current) return true;
    
    if (isEqual) {
      return !isEqual(prevDeps.current, deps);
    }
    
    // Default shallow comparison
    return prevDeps.current.length !== deps.length || 
           prevDeps.current.some((dep, index) => dep !== deps[index]);
  }, deps);

  if (depsChanged) {
    memoizedValue.current = factory();
    prevDeps.current = deps;
  }

  return memoizedValue.current!;
}

/**
 * Debounced memo hook for expensive calculations
 */
export function useDebouncedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [debouncedDeps, setDebouncedDeps] = useState(deps);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedDeps(deps);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);

  return useMemo(factory, debouncedDeps);
}