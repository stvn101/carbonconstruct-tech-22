// Centralized Error Handling Service
export interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  context?: any;
  userId?: string;
  url?: string;
  userAgent?: string;
}

export class ErrorService {
  private static instance: ErrorService;
  private errors: ErrorLog[] = [];
  private maxErrors = 1000;

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  logError(message: string, context?: any, level: 'error' | 'warning' | 'info' = 'error'): void {
    const error: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level,
      message,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.unshift(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Console logging for development
    if (level === 'error') {
      console.error('[ErrorService]', message, context);
    } else if (level === 'warning') {
      console.warn('[ErrorService]', message, context);
    } else {
      console.info('[ErrorService]', message, context);
    }
  }

  getErrors(limit = 50): ErrorLog[] {
    return this.errors.slice(0, limit);
  }

  clearErrors(): void {
    this.errors = [];
  }

  getErrorStats(): { errors: number; warnings: number; info: number } {
    return {
      errors: this.errors.filter(e => e.level === 'error').length,
      warnings: this.errors.filter(e => e.level === 'warning').length,
      info: this.errors.filter(e => e.level === 'info').length
    };
  }
}

export const errorService = ErrorService.getInstance();