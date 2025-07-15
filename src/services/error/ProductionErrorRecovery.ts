import { logger } from '@/services/logging/EnhancedLoggingService';
import centralizedErrorReporting from '@/services/error/CentralizedErrorReporting';

interface RecoveryStrategy {
  name: string;
  condition: (error: Error) => boolean;
  action: () => Promise<boolean>;
  priority: number;
}

interface RecoveryAttempt {
  strategy: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

/**
 * Production Error Recovery System - Phase 4 Production Resilience
 * Implements automatic error recovery strategies
 */
class ProductionErrorRecovery {
  private recoveryStrategies: RecoveryStrategy[] = [];
  private recoveryHistory: RecoveryAttempt[] = [];
  private isRecovering = false;
  private maxRecoveryAttempts = 3;
  
  constructor() {
    this.setupRecoveryStrategies();
    this.setupGlobalErrorHandlers();
  }

  private setupRecoveryStrategies() {
    this.recoveryStrategies = [
      {
        name: 'memory_cleanup',
        condition: (error) => error.message.includes('memory') || error.name === 'RangeError',
        action: this.performMemoryCleanup.bind(this),
        priority: 1
      },
      {
        name: 'cache_clear',
        condition: (error) => error.message.includes('cache') || error.message.includes('quota'),
        action: this.clearCaches.bind(this),
        priority: 2
      },
      {
        name: 'service_worker_refresh',
        condition: (error) => error.message.includes('network') || error.message.includes('fetch'),
        action: this.refreshServiceWorker.bind(this),
        priority: 3
      },
      {
        name: 'component_reset',
        condition: (error) => error.message.includes('render') || error.message.includes('component'),
        action: this.resetComponentState.bind(this),
        priority: 4
      },
      {
        name: 'storage_cleanup',
        condition: (error) => error.message.includes('storage') || error.message.includes('localStorage'),
        action: this.cleanupStorage.bind(this),
        priority: 5
      },
      {
        name: 'graceful_reload',
        condition: () => true, // Fallback strategy
        action: this.performGracefulReload.bind(this),
        priority: 10
      }
    ];
  }

  private setupGlobalErrorHandlers() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection', 'ErrorRecovery', event.reason);
      this.attemptRecovery(new Error(`Unhandled Promise: ${event.reason}`));
    });

    // Global error handler
    window.addEventListener('error', (event) => {
      logger.error('Global error caught', 'ErrorRecovery', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
      
      if (event.error) {
        this.attemptRecovery(event.error);
      }
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window && event.target instanceof HTMLElement) {
        const element = event.target;
        logger.warn('Resource loading error', 'ErrorRecovery', {
          tagName: element.tagName,
          src: element.getAttribute('src') || element.getAttribute('href'),
          type: 'resource_error'
        });
        
        // Attempt to reload failed resources
        this.retryResourceLoad(element);
      }
    }, true);
  }

  async attemptRecovery(error: Error): Promise<boolean> {
    if (this.isRecovering) {
      logger.warn('Recovery already in progress', 'ErrorRecovery');
      return false;
    }

    // Check if we've exceeded max attempts recently
    const recentAttempts = this.recoveryHistory.filter(
      attempt => Date.now() - attempt.timestamp.getTime() < 60000 // Last minute
    );

    if (recentAttempts.length >= this.maxRecoveryAttempts) {
      logger.error('Max recovery attempts exceeded', 'ErrorRecovery');
      centralizedErrorReporting.reportError(error, {
        feature: 'Error Recovery',
        action: 'max_attempts_exceeded',
        additionalData: { recentAttempts: recentAttempts.length }
      });
      return false;
    }

    this.isRecovering = true;
    logger.info('Starting error recovery', 'ErrorRecovery', { error: error.message });

    try {
      // Find applicable recovery strategies
      const applicableStrategies = this.recoveryStrategies
        .filter(strategy => strategy.condition(error))
        .sort((a, b) => a.priority - b.priority);

      for (const strategy of applicableStrategies) {
        logger.info(`Attempting recovery strategy: ${strategy.name}`, 'ErrorRecovery');
        
        try {
          const success = await strategy.action();
          
          this.recordRecoveryAttempt(strategy.name, success);
          
          if (success) {
            logger.info(`Recovery strategy successful: ${strategy.name}`, 'ErrorRecovery');
            return true;
          }
        } catch (recoveryError) {
          logger.error(`Recovery strategy failed: ${strategy.name}`, 'ErrorRecovery', recoveryError);
          this.recordRecoveryAttempt(strategy.name, false, recoveryError.message);
        }
      }

      return false;
    } finally {
      this.isRecovering = false;
    }
  }

  private recordRecoveryAttempt(strategy: string, success: boolean, error?: string) {
    this.recoveryHistory.push({
      strategy,
      timestamp: new Date(),
      success,
      error
    });

    // Keep only last 50 attempts
    if (this.recoveryHistory.length > 50) {
      this.recoveryHistory.shift();
    }
  }

  private async performMemoryCleanup(): Promise<boolean> {
    try {
      // Force garbage collection if available
      if ('gc' in window) {
        (window as any).gc();
      }

      // Clear large objects from memory
      if ('performance' in window && 'memory' in performance) {
        const memory = (performance as any).memory;
        logger.info('Memory before cleanup', 'ErrorRecovery', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize
        });
      }

      // Clear interval and timeout references
      for (let i = 1; i < 10000; i++) {
        clearInterval(i);
        clearTimeout(i);
      }

      return true;
    } catch (error) {
      logger.error('Memory cleanup failed', 'ErrorRecovery', error);
      return false;
    }
  }

  private async clearCaches(): Promise<boolean> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
        logger.info('Browser caches cleared', 'ErrorRecovery');
      }

      // Clear application caches
      sessionStorage.clear();
      
      // Selectively clear localStorage (keep essential data)
      const essentialKeys = ['auth-token', 'user-preferences', 'theme'];
      const keysToRemove = Object.keys(localStorage).filter(
        key => !essentialKeys.some(essential => key.includes(essential))
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      return true;
    } catch (error) {
      logger.error('Cache cleanup failed', 'ErrorRecovery', error);
      return false;
    }
  }

  private async refreshServiceWorker(): Promise<boolean> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          logger.info('Service worker refreshed', 'ErrorRecovery');
          return true;
        }
      }
      return false;
    } catch (error) {
      logger.error('Service worker refresh failed', 'ErrorRecovery', error);
      return false;
    }
  }

  private async resetComponentState(): Promise<boolean> {
    try {
      // Clear React component state by dispatching a custom event
      window.dispatchEvent(new CustomEvent('reset-component-state'));
      
      // Clear any cached component data
      const componentCacheKeys = Object.keys(sessionStorage).filter(
        key => key.includes('component-') || key.includes('react-')
      );
      
      componentCacheKeys.forEach(key => sessionStorage.removeItem(key));
      
      logger.info('Component state reset', 'ErrorRecovery');
      return true;
    } catch (error) {
      logger.error('Component state reset failed', 'ErrorRecovery', error);
      return false;
    }
  }

  private async cleanupStorage(): Promise<boolean> {
    try {
      // Clear IndexedDB if available
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            if (db.name && !db.name.includes('essential')) {
              return new Promise<void>((resolve, reject) => {
                const deleteReq = indexedDB.deleteDatabase(db.name!);
                deleteReq.onsuccess = () => resolve();
                deleteReq.onerror = () => reject(deleteReq.error);
              });
            }
          })
        );
      }

      logger.info('Storage cleanup completed', 'ErrorRecovery');
      return true;
    } catch (error) {
      logger.error('Storage cleanup failed', 'ErrorRecovery', error);
      return false;
    }
  }

  private async performGracefulReload(): Promise<boolean> {
    try {
      // Save critical state before reload
      const criticalState = {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      sessionStorage.setItem('recovery-state', JSON.stringify(criticalState));
      
      // Show user notification
      const shouldReload = confirm(
        'The application has encountered an error and needs to restart. Any unsaved changes may be lost. Continue?'
      );
      
      if (shouldReload) {
        logger.info('Performing graceful reload', 'ErrorRecovery');
        window.location.reload();
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Graceful reload failed', 'ErrorRecovery', error);
      return false;
    }
  }

  private async retryResourceLoad(element: HTMLElement): Promise<void> {
    const maxRetries = 3;
    let retries = 0;

    const retry = () => {
      retries++;
      
      if (retries > maxRetries) {
        logger.error('Resource retry limit exceeded', 'ErrorRecovery', {
          element: element.tagName,
          src: element.getAttribute('src')
        });
        return;
      }

      setTimeout(() => {
        if (element.tagName === 'IMG') {
          const img = element as HTMLImageElement;
          const originalSrc = img.src;
          img.src = '';
          img.src = `${originalSrc + (originalSrc.includes('?') ? '&' : '?')  }retry=${retries}`;
        } else if (element.tagName === 'SCRIPT') {
          const script = element as HTMLScriptElement;
          const newScript = document.createElement('script');
          newScript.src = `${script.src + (script.src.includes('?') ? '&' : '?')  }retry=${retries}`;
          newScript.onerror = retry;
          script.parentNode?.replaceChild(newScript, script);
        }
      }, 1000 * retries);
    };

    element.addEventListener('error', retry, { once: true });
  }

  getRecoveryReport() {
    return {
      isRecovering: this.isRecovering,
      totalAttempts: this.recoveryHistory.length,
      successfulAttempts: this.recoveryHistory.filter(a => a.success).length,
      recentAttempts: this.recoveryHistory.slice(-10),
      strategies: this.recoveryStrategies.map(s => ({
        name: s.name,
        priority: s.priority,
        attempts: this.recoveryHistory.filter(a => a.strategy === s.name).length,
        successRate: this.calculateSuccessRate(s.name)
      }))
    };
  }

  private calculateSuccessRate(strategyName: string): number {
    const attempts = this.recoveryHistory.filter(a => a.strategy === strategyName);
    if (attempts.length === 0) return 0;
    
    const successful = attempts.filter(a => a.success).length;
    return (successful / attempts.length) * 100;
  }
}

export const productionErrorRecovery = new ProductionErrorRecovery();
export default productionErrorRecovery;
