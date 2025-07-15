
interface FeatureFlags {
  optimizedCalculatorContent: boolean;
  memoizedResultsSection: boolean;
  performanceMonitoring: boolean;
}

const defaultFlags: FeatureFlags = {
  optimizedCalculatorContent: true,
  memoizedResultsSection: true,
  performanceMonitoring: true
};

// In production, these could be loaded from environment variables or a config service
const getFeatureFlags = (): FeatureFlags => {
  const isDevelopment = import.meta.env.MODE === 'development';
  
  // Enable all optimizations in development by default
  if (isDevelopment) {
    return defaultFlags;
  }
  
  // In production, you could load from environment variables
  return {
    optimizedCalculatorContent: import.meta.env.VITE_ENABLE_OPTIMIZED_CALCULATOR === 'true' || true,
    memoizedResultsSection: import.meta.env.VITE_ENABLE_MEMOIZED_RESULTS === 'true' || true,
    performanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true' || true
  };
};

export const featureFlags = getFeatureFlags();

export const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
  return featureFlags[flag];
};
