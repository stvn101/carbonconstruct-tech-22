import React from 'react';

/**
 * Loading timeout utilities to prevent infinite loading states
 */

export const LOADING_TIMEOUTS = {
  AUTH: 15000,        // 15 seconds for auth operations
  DATABASE: 10000,    // 10 seconds for database queries
  API: 8000,          // 8 seconds for API calls
  QUICK: 5000,        // 5 seconds for quick operations
  REALTIME: 30000,    // 30 seconds for realtime connections
} as const;

export class LoadingTimeoutManager {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Set a loading timeout that automatically resolves loading state
   */
  setLoadingTimeout(
    key: string,
    duration: number,
    onTimeout: () => void,
    onCleanup?: () => void
  ): void {
    // Clear existing timeout for this key
    this.clearTimeout(key);

    const timeoutId = setTimeout(() => {
      console.warn(`Loading timeout reached for: ${key}`);
      onTimeout();
      this.timeouts.delete(key);
      onCleanup?.();
    }, duration);

    this.timeouts.set(key, timeoutId);
  }

  /**
   * Clear a specific timeout
   */
  clearTimeout(key: string): void {
    const timeoutId = this.timeouts.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(key);
    }
  }

  /**
   * Clear all timeouts
   */
  clearAll(): void {
    this.timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timeouts.clear();
  }

  /**
   * Check if a timeout is active
   */
  hasTimeout(key: string): boolean {
    return this.timeouts.has(key);
  }
}

/**
 * Hook for managing loading timeouts
 */
export const useLoadingTimeout = () => {
  const manager = new LoadingTimeoutManager();

  return {
    setLoadingTimeout: manager.setLoadingTimeout.bind(manager),
    clearTimeout: manager.clearTimeout.bind(manager),
    clearAll: manager.clearAll.bind(manager),
    hasTimeout: manager.hasTimeout.bind(manager),
  };
};

/**
 * Enhanced loading state hook with automatic timeout
 */
export const useLoadingWithTimeout = (
  initialLoading = false,
  timeoutDuration = LOADING_TIMEOUTS.QUICK
) => {
  const [loading, setLoading] = React.useState(initialLoading);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const setLoadingWithTimeout = React.useCallback((isLoading: boolean) => {
    setLoading(isLoading);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout if loading is true
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        console.warn('Loading timeout reached, automatically resolving loading state');
        setLoading(false);
      }, timeoutDuration);
    }
  }, [timeoutDuration]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [loading, setLoadingWithTimeout] as const;
};