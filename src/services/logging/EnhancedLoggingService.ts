type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context: string;
  timestamp: Date;
  data?: any;
}

/**
 * Centralized Logging Service - Phase 3 Console Noise Reduction
 * Environment-aware logging with proper categorization
 */
class LoggingService {
  private isDevelopment = import.meta.env.DEV;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  debug(message: string, context: string = 'App', data?: any) {
    if (this.isDevelopment) {
      this.log('debug', message, context, data);
    }
  }

  info(message: string, context: string = 'App', data?: any) {
    this.log('info', message, context, data);
  }

  warn(message: string, context: string = 'App', data?: any) {
    this.log('warn', message, context, data);
  }

  error(message: string, context: string = 'App', data?: any) {
    this.log('error', message, context, data);
  }

  private log(level: LogLevel, message: string, context: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date(),
      data
    };

    this.addToBuffer(entry);

    // Only log to console in development or for errors
    if (this.isDevelopment || level === 'error') {
      const prefix = `[${context}] ${entry.timestamp.toISOString()}`;
      
      switch (level) {
        case 'debug':
          console.debug(prefix, message, data);
          break;
        case 'info':
          console.info(prefix, message, data);
          break;
        case 'warn':
          console.warn(prefix, message, data);
          break;
        case 'error':
          console.error(prefix, message, data);
          break;
      }
    }
  }

  private addToBuffer(entry: LogEntry) {
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logBuffer.filter(entry => entry.level === level);
    }
    return [...this.logBuffer];
  }

  clearLogs() {
    this.logBuffer = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }
}

export const logger = new LoggingService();
export default logger;