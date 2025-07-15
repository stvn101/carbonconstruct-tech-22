// Enhanced error tracking service with production optimizations and retry mechanisms
import { logger } from "./logging/EnhancedLoggingService";

type ErrorMetadata = Record<string, any>;
type ErrorCallback = (error: Error) => void;

interface PerformanceEntryWithTiming extends PerformanceEntry {
  processingStart?: number;
  startTime: number;
  value?: number;
  hadRecentInput?: boolean;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private isInitialized = false;
  private environment: string;
  private errorCount: Record<string, number> = {};
  private readonly MAX_ERRORS_PER_TYPE = 10;
  private errorCallbacks: ErrorCallback[] = [];
  private offlineErrors: { error: Error; metadata: ErrorMetadata }[] = [];
  private lastErrorSent: number = 0;
  private readonly ERROR_THROTTLE_MS = 2000; // 2 second throttle for repeated errors

  private constructor() {
    this.environment = import.meta.env.MODE || "development";
  }

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Add global error handler
    window.addEventListener("error", (event) => {
      this.captureException(event.error || new Error(event.message), {
        source: "window.onerror",
        lineno: event.lineno,
        colno: event.colno,
        filename: event.filename,
      });

      // Prevent default error handling in production to improve UX
      if (this.environment === "production") {
        event.preventDefault();
      }
    });

    // Add unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.captureException(
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason)),
        {
          source: "unhandledrejection",
        },
      );

      // Prevent default handling in production
      if (this.environment === "production") {
        event.preventDefault();
      }
    });

    // Check online status changes to send stored offline errors
    window.addEventListener("online", () => {
      this.sendOfflineErrors();
    });

    // Try to establish connection if network is already available
    if (navigator.onLine) {
      this.sendOfflineErrors();
    }

    this.isInitialized = true;
    logger.info("Error tracking service initialized", "ErrorTrackingService");
  }

  public registerErrorCallback(callback: ErrorCallback): () => void {
    this.errorCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
    };
  }

  private sendOfflineErrors(): void {
    if (this.offlineErrors.length === 0) return;

    const errorsToSend = [...this.offlineErrors];
    this.offlineErrors = [];

    errorsToSend.forEach(({ error, metadata }) => {
      this.captureException(error, { ...metadata, wasOffline: true });
    });
  }

  public captureException(error: Error, metadata: ErrorMetadata = {}): void {
    if (!error) return;

    const errorKey = `${error.name}:${error.message}`;
    this.errorCount[errorKey] = (this.errorCount[errorKey] || 0) + 1;

    // Avoid logging the same error too many times
    if (this.errorCount[errorKey] > this.MAX_ERRORS_PER_TYPE) {
      if (this.errorCount[errorKey] === this.MAX_ERRORS_PER_TYPE + 1) {
        logger.warn(
          `Error "${errorKey}" occurred too many times. Suppressing future logs.`,
          "ErrorTrackingService",
        );
      }
      return;
    }

    // Throttle frequent identical errors
    const now = Date.now();
    if (
      errorKey === Object.keys(this.errorCount).slice(-1)[0] &&
      now - this.lastErrorSent < this.ERROR_THROTTLE_MS
    ) {
      return;
    }
    this.lastErrorSent = now;

    // Handle offline mode
    if (!navigator.onLine) {
      this.offlineErrors.push({ error, metadata });
      return;
    }

    // Use logger instead of console
    logger.error(
      `Error tracked: ${error.name} - ${error.message}`,
      "ErrorTrackingService",
      {
        stack: error.stack,
        metadata: {
          ...metadata,
          url: window.location.href,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          sessionDuration: this.getSessionDuration(),
        },
        count: this.errorCount[errorKey],
      },
    );

    // Call error callbacks
    this.errorCallbacks.forEach((callback) => {
      try {
        callback(error);
      } catch (callbackError) {
        logger.error("Error in error callback", "ErrorTrackingService", {
          callbackError,
        });
      }
    });
  }

  public captureMessage(message: string, metadata: ErrorMetadata = {}): void {
    logger.warn(
      `Message captured: ${message}`,
      "ErrorTrackingService",
      metadata,
    );
  }

  public setUser(userId: string, email?: string): void {
    logger.info("Set user context", "ErrorTrackingService", { userId, email });
  }

  public clearUser(): void {
    logger.info("User context cleared", "ErrorTrackingService");
  }

  // Add accessibility error reporting
  public captureAccessibilityIssue(element: HTMLElement, issue: string): void {
    const elementPath = this.getElementPath(element);
    this.captureMessage(`Accessibility issue: ${issue}`, {
      elementPath,
      elementType: element.tagName,
      elementId: element.id,
      elementClasses: element.className,
    });
  }

  // Helper to get DOM path for element
  private getElementPath(element: HTMLElement): string {
    const path: string[] = [];
    let currentElem: HTMLElement | null = element;

    while (currentElem && currentElem !== document.body) {
      let selector = currentElem.tagName.toLowerCase();

      if (currentElem.id) {
        selector += `#${currentElem.id}`;
      } else if (currentElem.className) {
        selector += `.${currentElem.className.split(" ")[0]}`;
      }

      path.unshift(selector);
      currentElem = currentElem.parentElement;

      // Limit path length
      if (path.length > 5) break;
    }

    return path.join(" > ");
  }

  // Get session duration
  private getSessionDuration(): number {
    const navigationStart = performance?.timing?.navigationStart || 0;
    if (navigationStart === 0) return 0;
    return Date.now() - navigationStart;
  }

  // Flush all errors - useful before app unmounts
  public flush(): void {
    if (this.offlineErrors.length > 0) {
      logger.info(
        `Flushing ${this.offlineErrors.length} stored offline errors`,
        "ErrorTrackingService",
      );
      if (navigator.onLine) {
        this.sendOfflineErrors();
      }
    }
  }
}

export default ErrorTrackingService.getInstance();
