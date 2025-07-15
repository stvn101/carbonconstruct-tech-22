
/**
 * Utility functions for error handling and filtering
 */

// List of error messages/types that should be ignored
const IGNORED_ERROR_PATTERNS = [
  'ResizeObserver loop limit exceeded',
  'Script error',
  'Non-Error promise rejection captured',
  'Loading chunk',
  'ChunkLoadError',
  'Network request failed'
];

/**
 * Determines if an error should be ignored based on its message or type
 */
export const shouldIgnoreError = (error: Error): boolean => {
  if (!error || !error.message) {
    return false;
  }

  const message = error.message.toLowerCase();
  const name = error.name?.toLowerCase() || '';

  return IGNORED_ERROR_PATTERNS.some(pattern => 
    message.includes(pattern.toLowerCase()) || 
    name.includes(pattern.toLowerCase())
  );
};

/**
 * Extracts meaningful error information for logging
 */
export const extractErrorInfo = (error: Error) => {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    // Use optional property access to avoid TypeScript error
    cause: (error as any).cause
  };
};

/**
 * Checks if an error is a network-related error
 */
export const isNetworkError = (error: Error): boolean => {
  if (!error) return false;
  
  const message = error.message.toLowerCase();
  const networkPatterns = [
    'fetch',
    'network',
    'timeout',
    'connection',
    'offline',
    'failed to fetch'
  ];
  
  return networkPatterns.some(pattern => message.includes(pattern));
};
