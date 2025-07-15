interface SecurityEvent {
  id?: string;
  type:
    | "xss_attempt"
    | "csrf_attempt"
    | "injection_attempt"
    | "suspicious_activity";
  severity: "low" | "medium" | "high" | "critical";
  details: Record<string, unknown>;
  timestamp: Date;
  userAgent: string;
  ip?: string;
  userId?: string;
}

interface ComplianceCheck {
  standard: "GDPR" | "WCAG" | "SOC2" | "ISO27001";
  status: "compliant" | "non_compliant" | "needs_review";
  details: string[];
  lastChecked: Date;
}

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

/**
 * Enhanced Security & Compliance Monitor
 * Monitors security threats and compliance standards with ISO security best practices
 */
class EnhancedSecurityComplianceMonitor {
  private readonly securityEvents: SecurityEvent[] = [];
  private readonly complianceStatus: Map<string, ComplianceCheck> = new Map();
  private isMonitoring = false;
  private readonly MAX_EVENTS = 100;
  private readonly RAPID_CLICK_THRESHOLD = 10;
  private readonly CLICK_TIME_WINDOW = 100; // ms
  private readonly CONSOLE_ACCESS_THRESHOLD = 50;

  constructor() {
    this.initializeSecurityMonitoring();
    this.runComplianceChecks();
  }

  /**
   * Initialize security monitoring only in browser environment
   */
  private initializeSecurityMonitoring(): void {
    if (typeof window === "undefined") {
      return;
    }

    this.setupXSSDetection();
    this.setupCSRFProtection();
    this.setupInjectionDetection();
    this.setupSuspiciousActivityDetection();
    this.isMonitoring = true;
  }

  /**
   * Monitor for XSS attempts by intercepting dangerous DOM operations
   */
  private setupXSSDetection(): void {
    // Early return if document.write is not available
    if (typeof document.write !== "function") {
      return;
    }

    const originalWrite = document.write;
    document.write = (...args: unknown[]) => {
      const content = args.join(" ");
      
      if (this.detectXSSPattern(content)) {
        this.reportSecurityEvent({
          type: "xss_attempt",
          severity: "high",
          details: { content, method: "document.write" },
          timestamp: new Date(),
          userAgent: navigator.userAgent,
        });
      }
      
      return originalWrite.apply(document, args);
    };

    this.setupInnerHTMLMonitoring();
  }

  /**
   * Monitor innerHTML assignments for XSS attempts
   */
  private setupInnerHTMLMonitoring(): void {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      Element.prototype,
      "innerHTML"
    );

    if (!originalDescriptor) {
      return;
    }

    Object.defineProperty(Element.prototype, "innerHTML", {
      set(value: string) {
        // Early return for non-string values
        if (typeof value !== "string") {
          if (originalDescriptor.set) {
            originalDescriptor.set.call(this, value);
          }
          return;
        }

        // Check for XSS patterns before setting
        if (this.detectXSSPattern && this.detectXSSPattern(value)) {
          if (this.reportSecurityEvent) {
            this.reportSecurityEvent({
              type: "xss_attempt",
              severity: "medium",
              details: { content: value, element: this.tagName },
              timestamp: new Date(),
              userAgent: navigator.userAgent,
            });
          }
        }

        if (originalDescriptor.set) {
          originalDescriptor.set.call(this, value);
        }
      },
      get() {
        return originalDescriptor.get ? originalDescriptor.get.call(this) : "";
      },
    });
  }

  /**
   * Monitor for CSRF attempts by intercepting fetch requests
   */
  private setupCSRFProtection(): void {
    const originalFetch = window.fetch;
    const dangerousMethods = ["POST", "PUT", "DELETE", "PATCH"];

    window.fetch = async (...args: unknown[]) => {
      const [resource, options] = args;
      const fetchOptions = options as FetchOptions;

      // Early return for safe methods
      if (!fetchOptions?.method || !dangerousMethods.includes(fetchOptions.method.toUpperCase())) {
        return originalFetch.apply(window, args);
      }

      // Check for CSRF protection
      if (!this.hasValidCSRFToken(fetchOptions)) {
        this.reportSecurityEvent({
          type: "csrf_attempt",
          severity: "medium",
          details: { url: resource, method: fetchOptions.method },
          timestamp: new Date(),
          userAgent: navigator.userAgent,
        });
      }

      return originalFetch.apply(window, args);
    };
  }

  /**
   * Monitor form submissions for injection attempts
   */
  private setupInjectionDetection(): void {
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;
      if (!form) {
        return;
      }

      const formData = new FormData(form);
      
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string" && this.detectInjectionPattern(value)) {
          this.reportSecurityEvent({
            type: "injection_attempt",
            severity: "high",
            details: { field: key, value: value.substring(0, 100) },
            timestamp: new Date(),
            userAgent: navigator.userAgent,
          });

          event.preventDefault();
          alert("Suspicious input detected. Please review your data.");
          return;
        }
      }
    });
  }

  /**
   * Monitor for suspicious user activity patterns
   */
  private setupSuspiciousActivityDetection(): void {
    let rapidClicks = 0;
    let lastClickTime = 0;

    document.addEventListener("click", () => {
      const now = Date.now();
      
      if (now - lastClickTime < this.CLICK_TIME_WINDOW) {
        rapidClicks++;
        
        if (rapidClicks > this.RAPID_CLICK_THRESHOLD) {
          this.reportSecurityEvent({
            type: "suspicious_activity",
            severity: "low",
            details: { activity: "rapid_clicking", count: rapidClicks },
            timestamp: new Date(),
            userAgent: navigator.userAgent,
          });
          rapidClicks = 0;
        }
      } else {
        rapidClicks = 0;
      }
      
      lastClickTime = now;
    });

    this.setupConsoleMonitoring();
  }

  /**
   * Monitor console access for potential debugging attempts
   */
  private setupConsoleMonitoring(): void {
    let consoleAccessCount = 0;
    const originalLog = console.log;

    console.log = (...args: unknown[]) => {
      consoleAccessCount++;
      
      if (consoleAccessCount > this.CONSOLE_ACCESS_THRESHOLD) {
        this.reportSecurityEvent({
          type: "suspicious_activity",
          severity: "low",
          details: {
            activity: "excessive_console_access",
            count: consoleAccessCount,
          },
          timestamp: new Date(),
          userAgent: navigator.userAgent,
        });
      }
      
      return originalLog.apply(console, args);
    };
  }

  /**
   * Detect XSS patterns in content
   */
  private detectXSSPattern(content: string): boolean {
    if (!content || typeof content !== "string") {
      return false;
    }

    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Detect SQL injection and other injection patterns
   */
  private detectInjectionPattern(content: string): boolean {
    if (!content || typeof content !== "string") {
      return false;
    }

    const injectionPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b)/gi,
      /(UNION|OR|AND)\s+(SELECT|INSERT|UPDATE|DELETE)/gi,
      /['";]\s*(OR|AND)\s*['"]?\d+['"]?\s*=\s*['"]?\d+/gi,
      /<script|javascript:|data:text\/html/gi,
      /\b(eval|setTimeout|setInterval)\s*\(/gi,
    ];

    return injectionPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Check if request has valid CSRF protection
   */
  private hasValidCSRFToken(options: FetchOptions): boolean {
    const headers = options.headers || {};
    
    return !!(
      headers["X-CSRF-Token"] ||
      headers["x-csrf-token"] ||
      headers.Authorization ||
      options.credentials === "include"
    );
  }

  /**
   * Report security event and maintain event log
   */
  private reportSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);

    // Maintain maximum event count
    if (this.securityEvents.length > this.MAX_EVENTS) {
      this.securityEvents.shift();
    }

    // Send high-severity events to monitoring service in production
    if (import.meta.env.PROD && event.severity === "high") {
      this.sendToSecurityService(event);
    }
  }

  /**
   * Send security event to monitoring service
   */
  private async sendToSecurityService(event: SecurityEvent): Promise<void> {
    try {
      const response = await fetch("/api/security/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        // Log failed security reporting (in production, this would go to monitoring)
        if (process.env.NODE_ENV !== 'production') {
          console.warn("Failed to report security event:", response.status);
        }
      }
    } catch (error) {
      // Log security reporting error (in production, this would go to monitoring)
      if (process.env.NODE_ENV !== 'production') {
        console.warn("Security reporting error:", error);
      }
    }
  }

  /**
   * Initialize and schedule compliance checks
   */
  private runComplianceChecks(): void {
    // Run initial checks
    this.checkGDPRCompliance();
    this.checkWCAGCompliance();
    this.checkDataProtection();

    // Schedule periodic checks (every hour)
    setInterval(() => {
      this.checkGDPRCompliance();
      this.checkWCAGCompliance();
      this.checkDataProtection();
    }, 60 * 60 * 1000);
  }

  /**
   * Check GDPR compliance requirements
   */
  private checkGDPRCompliance(): void {
    const checks: string[] = [];

    // Check cookie consent
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      checks.push("Missing cookie consent implementation");
    }

    // Check privacy policy link
    const privacyLink = document.querySelector('a[href*="privacy"]');
    if (!privacyLink) {
      checks.push("Missing privacy policy link");
    }

    // Check data processing notices on forms
    const forms = document.querySelectorAll("form");
    forms.forEach((form, index) => {
      const dataNotice = form.querySelector(
        "[data-privacy], .privacy-notice, .data-processing"
      );
      if (!dataNotice) {
        checks.push(`Form ${index + 1} missing data processing notice`);
      }
    });

    this.complianceStatus.set("GDPR", {
      standard: "GDPR",
      status: checks.length === 0 ? "compliant" : "needs_review",
      details: checks,
      lastChecked: new Date(),
    });
  }

  /**
   * Check WCAG accessibility compliance
   */
  private checkWCAGCompliance(): void {
    const checks: string[] = [];

    // Check alt text on images
    const images = document.querySelectorAll("img:not([alt])");
    if (images.length > 0) {
      checks.push(`${images.length} images missing alt text`);
    }

    // Check skip links
    const skipLink = document.querySelector('a[href="#main"], a[href="#content"]');
    if (!skipLink) {
      checks.push("Missing skip to content link");
    }

    // Check heading hierarchy
    this.checkHeadingHierarchy(checks);

    // Check form labels
    this.checkFormLabels(checks);

    this.complianceStatus.set("WCAG", {
      standard: "WCAG",
      status: checks.length === 0 ? "compliant" : "needs_review",
      details: checks,
      lastChecked: new Date(),
    });
  }

  /**
   * Check heading hierarchy for proper structure
   */
  private checkHeadingHierarchy(checks: string[]): void {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    
    if (headings.length === 0) {
      return;
    }

    const levels = Array.from(headings).map((h) =>
      parseInt(h.tagName.substring(1))
    );
    
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        checks.push("Heading hierarchy violation detected");
        break;
      }
    }
  }

  /**
   * Check form inputs for proper labeling
   */
  private checkFormLabels(checks: string[]): void {
    const inputs = document.querySelectorAll(
      'input:not([type="hidden"]), textarea, select'
    );
    
    inputs.forEach((input, index) => {
      const label =
        document.querySelector(`label[for="${input.id}"]`) ||
        input.closest("label") ||
        input.getAttribute("aria-label") ||
        input.getAttribute("aria-labelledby");
        
      if (!label) {
        checks.push(`Form input ${index + 1} missing label`);
      }
    });
  }

  /**
   * Check data protection and security practices
   */
  private checkDataProtection(): void {
    const checks: string[] = [];

    // Check for sensitive data in localStorage
    this.checkLocalStorageSecurity(checks);

    // Check HTTPS usage
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      checks.push("Site not served over HTTPS");
    }

    // Check cookie security
    this.checkCookieSecurity(checks);

    this.complianceStatus.set("DataProtection", {
      standard: "SOC2",
      status: checks.length === 0 ? "compliant" : "needs_review",
      details: checks,
      lastChecked: new Date(),
    });
  }

  /**
   * Check localStorage for sensitive data
   */
  private checkLocalStorageSecurity(checks: string[]): void {
    const localStorageKeys = Object.keys(localStorage);
    const sensitiveKeys = localStorageKeys.filter((key) =>
      key.includes("password") ||
      key.includes("token") ||
      key.includes("secret")
    );

    if (sensitiveKeys.length > 0) {
      checks.push(
        `Potentially sensitive data in localStorage: ${sensitiveKeys.join(", ")}`
      );
    }
  }

  /**
   * Check cookie security settings
   */
  private checkCookieSecurity(checks: string[]): void {
    const cookies = document.cookie.split(";");
    
    cookies.forEach((cookie) => {
      if (!cookie.includes("Secure") || !cookie.includes("SameSite")) {
        checks.push("Insecure cookie configuration detected");
      }
    });
  }

  /**
   * Get comprehensive security report
   */
  getSecurityReport() {
    return {
      events: this.securityEvents.slice(-20), // Last 20 events
      compliance: Object.fromEntries(this.complianceStatus),
      monitoring: this.isMonitoring,
      summary: {
        totalEvents: this.securityEvents.length,
        criticalEvents: this.securityEvents.filter((e) => e.severity === "critical").length,
        highEvents: this.securityEvents.filter((e) => e.severity === "high").length,
        complianceIssues: Array.from(this.complianceStatus.values()).filter((c) => c.status !== "compliant").length,
      },
    };
  }

  /**
   * Clear security events log
   */
  clearSecurityEvents(): void {
    this.securityEvents.length = 0;
  }
}

export const enhancedSecurityMonitor = new EnhancedSecurityComplianceMonitor();
export default enhancedSecurityMonitor;
