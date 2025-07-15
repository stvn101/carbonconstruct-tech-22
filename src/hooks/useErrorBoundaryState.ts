import { useState, useCallback } from 'react';
import errorTrackingService from '@/services/errorTrackingService';

export const useErrorBoundaryState = (feature: string, onReset?: () => void) => {
  const [key, setKey] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleReset = useCallback(() => {
    setKey(prev => prev + 1);
    setHasError(false);
    setIsChecking(false);
    
    if (onReset) {
      try {
        onReset();
      } catch (error) {
        console.error('Error in reset handler:', error);
      }
    }
  }, [onReset]);

  const handleError = useCallback((error: Error, errorInfo: any) => {
    setHasError(true);
    setIsChecking(false);
    
    // Track the error
    errorTrackingService.captureException(error, {
      feature,
      componentStack: errorInfo?.componentStack,
      source: 'ErrorBoundary'
    });
  }, [feature]);

  return {
    key,
    hasError,
    isChecking,
    handleReset,
    handleError
  };
};