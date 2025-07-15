
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';
import { logger } from '@/services/logging/EnhancedLoggingService';
import errorTrackingService from '@/services/errorTrackingService';

interface EnhancedErrorBoundaryProps {
  children: React.ReactNode;
  feature: string;
  fallbackComponent?: React.ComponentType<any>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const EnhancedErrorBoundary: React.FC<EnhancedErrorBoundaryProps> = ({
  children,
  feature,
  fallbackComponent: CustomFallback,
  onError
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log the error with context
    logger.error(
      `Error in ${feature}: ${error.message}`,
      'ErrorBoundary',
      {
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        feature
      }
    );

    // Track the error
    errorTrackingService.captureException(error, {
      feature,
      componentStack: errorInfo.componentStack,
      source: 'ErrorBoundary'
    });

    // Call custom error handler if provided
    if (onError) {
      try {
        onError(error, errorInfo);
      } catch (handlerError) {
        logger.error(
          `Error in custom error handler for ${feature}`,
          'ErrorBoundary',
          { handlerError }
        );
      }
    }
  };

  const handleReset = () => {
    logger.info(`Error boundary reset for ${feature}`, 'ErrorBoundary');
  };

  const FallbackComponent = CustomFallback || ErrorFallback;

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
};

export default EnhancedErrorBoundary;
