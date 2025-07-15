
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  metadata?: Record<string, any>;
}

class LoggingService {
  private static instance: LoggingService;
  private logs: LogEntry[] = [];
  private isDevelopment = import.meta.env.MODE === 'development';
  private maxLogs = 1000;

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private addLog(level: LogLevel, message: string, context: string = '', metadata: Record<string, any> = {}) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: context || undefined,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined
    };

    // Keep logs within limit
    if (this.logs.length >= this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs + 100);
    }

    this.logs.push(entry);

    // In development, also log to console for immediate visibility
    if (this.isDevelopment) {
      const contextStr = context ? `[${context}]` : '';
      const metadataStr = metadata && Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : '';
      
      switch (level) {
        case 'debug':
          console.debug(`${contextStr} ${message}`, metadataStr);
          break;
        case 'info':
          console.info(`${contextStr} ${message}`, metadataStr);
          break;
        case 'warn':
          console.warn(`${contextStr} ${message}`, metadataStr);
          break;
        case 'error':
          console.error(`${contextStr} ${message}`, metadataStr);
          break;
      }
    }
  }

  public debug(message: string, context: string = '', metadata: Record<string, any> = {}) {
    this.addLog('debug', message, context, metadata);
  }

  public info(message: string, context: string = '', metadata: Record<string, any> = {}) {
    this.addLog('info', message, context, metadata);
  }

  public warn(message: string, context: string = '', metadata: Record<string, any> = {}) {
    this.addLog('warn', message, context, metadata);
  }

  public error(message: string, context: string = '', metadata: Record<string, any> = {}) {
    this.addLog('error', message, context, metadata);
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return [...this.logs];
    return this.logs.filter(log => log.level === level);
  }

  public clearLogs() {
    this.logs = [];
  }

  // Export logs for debugging
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = LoggingService.getInstance();
export default logger;
