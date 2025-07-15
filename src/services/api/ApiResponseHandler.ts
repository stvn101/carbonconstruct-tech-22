// Standardized API response handler for consistent error handling
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  timestamp: string;
  code?: number;
}

export interface ApiOptions {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
}

class ApiResponseHandler {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  async handleRequest<T>(
    requestFn: () => Promise<T>,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = 30000,
      retries = 2,
      cache = false,
      cacheKey,
      cacheTTL = 300000 // 5 minutes
    } = options;

    // Check cache first
    if (cache && cacheKey) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          data: cached,
          success: true,
          timestamp: new Date().toISOString()
        };
      }
    }

    let lastError: any;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });
        
        const result = await Promise.race([requestFn(), timeoutPromise]);
        
        // Cache successful result
        if (cache && cacheKey && result) {
          this.setCache(cacheKey, result, cacheTTL);
        }
        
        return {
          data: result,
          success: true,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        lastError = error;
        
        if (attempt < retries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    return {
      error: lastError?.message || 'Request failed',
      success: false,
      timestamp: new Date().toISOString(),
      code: lastError?.status || 500
    };
  }
  
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }
  
  private setCache(key: string, data: any, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  clearCache(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  // Utility methods for common response patterns
  success<T>(data: T): ApiResponse<T> {
    return {
      data,
      success: true,
      timestamp: new Date().toISOString()
    };
  }
  
  error(message: string, code?: number): ApiResponse {
    return {
      error: message,
      success: false,
      timestamp: new Date().toISOString(),
      code
    };
  }
}

export const apiResponseHandler = new ApiResponseHandler();