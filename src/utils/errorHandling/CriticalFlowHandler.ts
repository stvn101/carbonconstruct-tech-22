import { toast } from 'sonner';
import { createDbConnection } from '@/services/database/ConnectionStabilizer';
import { LOADING_TIMEOUTS } from '@/utils/loadingTimeout';

export type CriticalFlow = 
  | 'auth-login'
  | 'auth-logout' 
  | 'auth-register'
  | 'project-load'
  | 'project-save'
  | 'material-fetch'
  | 'calculation-run'
  | 'profile-update';

export type FlowResult<T = any> = {
  success: boolean;
  data?: T;
  error?: Error;
  recoverable: boolean;
};

/**
 * Critical flow handler with comprehensive error handling and recovery
 */
export class CriticalFlowHandler {
  private static instance: CriticalFlowHandler;
  private activeFlows: Map<string, AbortController> = new Map();

  public static getInstance(): CriticalFlowHandler {
    if (!CriticalFlowHandler.instance) {
      CriticalFlowHandler.instance = new CriticalFlowHandler();
    }
    return CriticalFlowHandler.instance;
  }

  /**
   * Execute a critical flow with comprehensive error handling
   */
  async executeCriticalFlow<T>(
    flowType: CriticalFlow,
    flowId: string,
    operation: (signal: AbortSignal) => Promise<T>,
    options: {
      timeout?: number;
      retries?: number;
      fallback?: () => T | Promise<T>;
      onRetry?: (attempt: number, error: Error) => void;
      requiresConnection?: boolean;
    } = {}
  ): Promise<FlowResult<T>> {
    const {
      timeout = LOADING_TIMEOUTS.API,
      retries = 2,
      fallback,
      onRetry,
      requiresConnection = true
    } = options;

    // Check database connection if required
    if (requiresConnection) {
      const dbConn = createDbConnection();
      const isConnected = await dbConn.ensureConnection();
      if (!isConnected && !fallback) {
        return {
          success: false,
          error: new Error('Database connection unavailable'),
          recoverable: true
        };
      }
    }

    // Create abort controller for this flow
    const abortController = new AbortController();
    this.activeFlows.set(flowId, abortController);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            abortController.abort();
            reject(new Error(`${flowType} operation timed out after ${timeout}ms`));
          }, timeout);
        });

        // Execute operation with timeout
        const result = await Promise.race([
          operation(abortController.signal),
          timeoutPromise
        ]);

        // Success - cleanup and return
        this.activeFlows.delete(flowId);
        return {
          success: true,
          data: result,
          recoverable: true
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        console.warn(`${flowType} attempt ${attempt + 1} failed:`, lastError.message);

        // Check if error is recoverable
        const isRecoverable = this.isRecoverableError(lastError);
        
        if (!isRecoverable || attempt === retries) {
          break;
        }

        // Call retry callback
        onRetry?.(attempt + 1, lastError);

        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    // All retries failed - try fallback
    if (fallback) {
      try {
        const fallbackResult = await fallback();
        this.activeFlows.delete(flowId);
        
        // Show warning about fallback usage
        toast.warning(`${flowType} using offline mode`, {
          description: 'Some features may be limited'
        });

        return {
          success: true,
          data: fallbackResult,
          recoverable: true
        };
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }

    // Complete failure
    this.activeFlows.delete(flowId);
    
    // Show user-friendly error
    this.showUserError(flowType, lastError);

    return {
      success: false,
      error: lastError!,
      recoverable: this.isRecoverableError(lastError!)
    };
  }

  /**
   * Cancel a specific flow
   */
  cancelFlow(flowId: string): void {
    const controller = this.activeFlows.get(flowId);
    if (controller) {
      controller.abort();
      this.activeFlows.delete(flowId);
    }
  }

  /**
   * Cancel all active flows
   */
  cancelAllFlows(): void {
    this.activeFlows.forEach(controller => controller.abort());
    this.activeFlows.clear();
  }

  /**
   * Check if an error is recoverable
   */
  private isRecoverableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    
    // Network related errors are usually recoverable
    if (message.includes('network') || 
        message.includes('timeout') || 
        message.includes('connection') ||
        message.includes('503') ||
        message.includes('502') ||
        message.includes('500')) {
      return true;
    }

    // Auth errors might be recoverable
    if (message.includes('session') || 
        message.includes('expired') ||
        message.includes('unauthorized')) {
      return true;
    }

    // Client errors are usually not recoverable
    if (message.includes('400') || 
        message.includes('404') ||
        message.includes('403')) {
      return false;
    }

    return true; // Default to recoverable
  }

  /**
   * Show user-friendly error messages
   */
  private showUserError(flowType: CriticalFlow, error: Error | null): void {
    const errorMessages: Record<CriticalFlow, string> = {
      'auth-login': 'Failed to sign in. Please check your credentials and try again.',
      'auth-logout': 'Failed to sign out. Please refresh the page.',
      'auth-register': 'Failed to create account. Please try again.',
      'project-load': 'Failed to load project. Please try again.',
      'project-save': 'Failed to save project. Your work may not be saved.',
      'material-fetch': 'Failed to load materials. Some data may be unavailable.',
      'calculation-run': 'Failed to run calculation. Please try again.',
      'profile-update': 'Failed to update profile. Please try again.'
    };

    const message = errorMessages[flowType] || 'An unexpected error occurred.';
    
    toast.error(message, {
      description: error?.message.includes('network') ? 'Check your internet connection.' : undefined,
      duration: 5000
    });
  }
}

// Export singleton instance
export const criticalFlowHandler = CriticalFlowHandler.getInstance();

/**
 * React hook for critical flow execution
 */
export const useCriticalFlow = () => {
  return {
    executeCriticalFlow: criticalFlowHandler.executeCriticalFlow.bind(criticalFlowHandler),
    cancelFlow: criticalFlowHandler.cancelFlow.bind(criticalFlowHandler),
    cancelAllFlows: criticalFlowHandler.cancelAllFlows.bind(criticalFlowHandler),
  };
};