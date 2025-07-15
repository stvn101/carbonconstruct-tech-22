import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LOADING_TIMEOUTS } from '@/utils/loadingTimeout';

export class DatabaseConnectionStabilizer {
  private static instance: DatabaseConnectionStabilizer;
  private connectionStatus: 'connected' | 'disconnected' | 'checking' = 'checking';
  private retryCount = 0;
  private maxRetries = 5; // Increased retry limit
  private lastSuccessfulConnection: number = Date.now();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isHealthCheckingStarted = false;

  private constructor() {
    // Private constructor - no auto initialization
  }

  public static getInstance(): DatabaseConnectionStabilizer {
    if (!DatabaseConnectionStabilizer.instance) {
      DatabaseConnectionStabilizer.instance = new DatabaseConnectionStabilizer();
    }
    return DatabaseConnectionStabilizer.instance;
  }

  public async startHealthChecking(): Promise<void> {
    if (this.isHealthCheckingStarted) {
      return; // Already started
    }

    // Check if user is authenticated before starting health checks
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.warn('Health check skipped: no user authenticated');
      return;
    }

    this.isHealthCheckingStarted = true;
    
    // Check connection every 2 minutes
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 120000);
    
    // Perform initial check
    await this.performHealthCheck();
  }

  public stopHealthChecking(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    this.isHealthCheckingStarted = false;
  }

  private async performHealthCheck(): Promise<void> {
    const timeSinceLastSuccess = Date.now() - this.lastSuccessfulConnection;
    
    // Only check if it's been more than 5 minutes since last success
    if (timeSinceLastSuccess > 300000) {
      await this.checkConnection();
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      this.connectionStatus = 'checking';
      
      // Check if we have an authenticated user for database queries
      const { data: { user } } = await supabase.auth.getUser();
      
      let connectionPromise;
      if (user) {
        // Use authenticated query when user is logged in
        connectionPromise = supabase
          .from('unified_materials')
          .select('id', { count: 'exact', head: true })
          .limit(1);
      } else {
        // Use a simple health check without authentication
        connectionPromise = supabase.from('unified_materials').select('id').limit(1);
      }

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), LOADING_TIMEOUTS.DATABASE);
      });

      const result = await Promise.race([connectionPromise, timeoutPromise]);

      if (result.error && result.error.code !== 'PGRST301') { // Ignore auth errors for public access
        throw result.error;
      }

      this.connectionStatus = 'connected';
      this.retryCount = 0;
      this.lastSuccessfulConnection = Date.now();
      return true;
    } catch (error) {
      console.error('Database connection check failed:', error);
      this.connectionStatus = 'disconnected';
      return false;
    }
  }

  public async ensureConnection(): Promise<boolean> {
    if (this.connectionStatus === 'connected') {
      return true;
    }

    const isConnected = await this.checkConnection();
    
    if (!isConnected && this.retryCount < this.maxRetries) {
      this.retryCount++;
      
      // Show user-friendly message
      if (this.retryCount === 1) {
        toast.warning('Database connection unstable, retrying...', {
          id: 'db-connection-retry'
        });
      }
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
      return this.ensureConnection();
    }

    if (!isConnected && this.retryCount >= this.maxRetries) {
      toast.error('Database connection failed. Some features may be limited.', {
        id: 'db-connection-failed',
        duration: 10000
      });
    }

    return isConnected;
  }

  public getStatus(): 'connected' | 'disconnected' | 'checking' {
    return this.connectionStatus;
  }

  public getLastSuccessfulConnection(): number {
    return this.lastSuccessfulConnection;
  }

  public cleanup(): void {
    this.stopHealthChecking();
  }

  public async withConnection<T>(
    operation: () => Promise<T>,
    fallback?: () => T
  ): Promise<T | null> {
    try {
      const isConnected = await this.ensureConnection();
      
      if (!isConnected) {
        if (fallback) {
          return fallback();
        }
        throw new Error('Database connection unavailable');
      }

      return await operation();
    } catch (error) {
      console.error('Database operation failed:', error);
      
      if (fallback) {
        return fallback();
      }
      
      return null;
    }
  }
}

// Factory function that creates instance without auto-starting health checks
export const createDbConnection = (): DatabaseConnectionStabilizer => {
  return DatabaseConnectionStabilizer.getInstance();
};

// Legacy export for backwards compatibility
export const dbConnection = DatabaseConnectionStabilizer.getInstance();