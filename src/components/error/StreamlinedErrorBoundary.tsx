import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallbackCard from './ErrorFallbackCard';
import { useErrorBoundaryState } from '@/hooks/useErrorBoundaryState';
import { isNetworkError } from '@/utils/errorHandling/networkChecker';

interface StreamlinedErrorBoundaryProps {
  children: React.ReactNode;
  feature: string;
  fallbackComponent?: React.ComponentType<{ 
    error: Error; 
    resetErrorBoundary: () => void;
    feature?: string;
  }>;
  className?: string;
  onReset?: () => void;
}

/**
 * Streamlined Error Boundary - Phase 2 Optimization
 * Simplified error handling without complex ignoreErrors logic
 * Focuses on core error handling and performance
 */
export const StreamlinedErrorBoundary: React.FC<StreamlinedErrorBoundaryProps> = ({ 
  children, 
  feature,
  fallbackComponent,
  className,
  onReset
}) => {
  const {
    key,
    isChecking,
    handleReset,
    handleError
  } = useErrorBoundaryState(feature, onReset);

  const DefaultFallback = React.useCallback(({ error, resetErrorBoundary }) => (
    <ErrorFallbackCard
      error={error}
      isNetworkError={isNetworkError(error)}
      isChecking={isChecking}
      onReset={resetErrorBoundary}
    />
  ), [isChecking]);

  const FallbackComponent = fallbackComponent || DefaultFallback;

  return (
    <div className={className}>
      <ErrorBoundary
        key={`streamlined-${feature}-${key}`}
        FallbackComponent={FallbackComponent}
        onError={handleError}
        onReset={handleReset}
      >
        {children}
      </ErrorBoundary>
    </div>
  );
};