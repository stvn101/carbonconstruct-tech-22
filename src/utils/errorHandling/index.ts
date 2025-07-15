
// Export all error handling utilities from this central file
export * from './toastHelpers';
export * from './networkErrorHandler';
export * from './connectionRecovery';
export { triggerConnectionRecovery } from './networkListeners';
export { addNetworkListeners, isNetworkError, isOffline } from './networkChecker';

// Export specific functions from timeoutHelper, excluding isNetworkError to avoid conflict
export { timeoutPromise, withTimeout, retryWithBackoff } from './timeoutHelper';

// Utility to combine errors with timeout handling
export const withNetworkErrorHandling = async <T>(
  promise: Promise<T>, 
  timeoutMs: number = 15000,
  maxRetries: number = 2
): Promise<T> => {
  const { withTimeout } = await import('./timeoutHelper');
  const { isNetworkError } = await import('./networkChecker');
  
  try {
    return await withTimeout(promise, timeoutMs);
  } catch (error) {
    if (isNetworkError(error)) {
      const { retryWithBackoff } = await import('./timeoutHelper');
      return retryWithBackoff(() => promise, maxRetries);
    }
    throw error;
  }
};
