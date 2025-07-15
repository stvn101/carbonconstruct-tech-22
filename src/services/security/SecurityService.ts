// Advanced Security Service for CarbonConstruct
import { toast } from '@/hooks/use-toast';

export interface SecurityEvent {
  type: 'XSS_ATTEMPT' | 'CSRF_ATTEMPT' | 'INJECTION_ATTEMPT' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  userId?: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: unknown) => string;
}

class SecurityService {
  private readonly eventLog: SecurityEvent[] = [];
  private readonly rateLimitStore = new Map<string, { count: number; resetTime: number }>();
  private readonly suspiciousIPs = new Set<string>();
  private readonly blacklistedTokens = new Set<string>();
  private static _instance: SecurityService;

  constructor() {
    this.initializeSecurityMonitoring();
  }

  /**
   * Initialize security monitoring and event listeners
   */
  private initializeSecurityMonitoring(): void {
    // Early return if not in browser environment
    if (typeof window === "undefined") {
      return;
    }

    this.setupXSSProtection();
    this.setupCSRFProtection();
    this.setupDOMProtection();
    this.setupNetworkMonitoring();
  }

  /**
   * XSS Protection - Monitor and sanitize inputs
   */
  private setupXSSProtection(): void {
    const originalDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    
    if (!originalDescriptor?.set) {
      return;
    }

    Object.defineProperty(Element.prototype, 'innerHTML', {
      set(value: string) {
        if (typeof value === 'string' && SecurityService.instance.isXSSSuspicious(value)) {
          SecurityService.instance.logSecurityEvent({
            type: 'XSS_ATTEMPT',
            severity: 'HIGH',
            details: `Potential XSS attempt blocked: ${value.substring(0, 100)}...`,
            timestamp: new Date()
          });
          return;
        }
        originalDescriptor.set!.call(this, value);
      },
      get: originalDescriptor.get,
      configurable: true
    });

    // Monitor form inputs
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (!target || !this.isXSSSuspicious(target.value)) {
        return;
      }

      this.logSecurityEvent({
        type: 'XSS_ATTEMPT',
        severity: 'MEDIUM',
        details: `Suspicious input detected in form field`,
        timestamp: new Date()
      });
      
      // Sanitize the input
      target.value = this.sanitizeInput(target.value);
    });
  }

  /**
   * CSRF Protection - Validate requests and tokens
   */
  private setupCSRFProtection(): void {
    // Generate and validate CSRF tokens
    const csrfToken = this.generateCSRFToken();
    sessionStorage.setItem('csrf_token', csrfToken);

    // Add CSRF token to all forms
    document.addEventListener('DOMContentLoaded', () => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        if (!form.querySelector('input[name="csrf_token"]')) {
          const csrfInput = document.createElement('input');
          csrfInput.type = 'hidden';
          csrfInput.name = 'csrf_token';
          csrfInput.value = csrfToken;
          form.appendChild(csrfInput);
        }
      });
    });
  }

  /**
   * DOM Protection - Monitor for suspicious DOM changes
   */
  private setupDOMProtection(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== 'childList') {
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
          }

          const element = node as Element;
          
          // Check for suspicious script injections
          if (element.tagName === 'SCRIPT') {
            this.logSecurityEvent({
              type: 'XSS_ATTEMPT',
              severity: 'CRITICAL',
              details: `Unauthorized script injection detected`,
              timestamp: new Date()
            });
            element.remove();
            return;
          }
          
          // Check for suspicious iframes
          if (element.tagName === 'IFRAME') {
            const src = element.getAttribute('src');
            if (src && !this.isAllowedDomain(src)) {
              this.logSecurityEvent({
                type: 'SUSPICIOUS_ACTIVITY',
                severity: 'HIGH',
                details: `Unauthorized iframe detected: ${src}`,
                timestamp: new Date()
              });
              element.remove();
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Network Monitoring - Monitor API requests for suspicious patterns
   */
  private setupNetworkMonitoring(): void {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const url = typeof resource === 'string' ? resource : (resource as Request).url;
      
      // Check for suspicious request patterns
      if (this.isSuspiciousRequest(url, config)) {
        this.logSecurityEvent({
          type: 'SUSPICIOUS_ACTIVITY',
          severity: 'MEDIUM',
          details: `Suspicious API request: ${url}`,
          timestamp: new Date()
        });
      }
      
      // Apply rate limiting
      if (!this.checkRateLimit(url)) {
        this.logSecurityEvent({
          type: 'RATE_LIMIT_EXCEEDED',
          severity: 'MEDIUM',
          details: `Rate limit exceeded for: ${url}`,
          timestamp: new Date()
        });
        throw new Error('Rate limit exceeded');
      }
      
      return originalFetch.apply(this, args);
    };
  }

  /**
   * Rate Limiting Implementation
   */
  private checkRateLimit(url: string, config: RateLimitConfig = { windowMs: 60000, maxRequests: 100 }): boolean {
    const key = this.generateRateLimitKey(url);
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    const current = this.rateLimitStore.get(key);
    
    if (!current || current.resetTime < now) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
      return true;
    }
    
    if (current.count >= config.maxRequests) {
      return false;
    }
    
    current.count++;
    return true;
  }

  /**
   * Input sanitization to prevent XSS
   */
  private sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Check if input contains suspicious XSS patterns
   */
  public isXSSSuspicious(input: string): boolean {
    if (!input || typeof input !== 'string') {
      return false;
    }

    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /data:text\/html/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check if domain is allowed for iframe embedding
   */
  private isAllowedDomain(url: string): boolean {
    const allowedDomains = [
      'youtube.com',
      'vimeo.com',
      'maps.google.com',
      'docs.google.com'
    ];
    
    try {
      const hostname = new URL(url).hostname;
      return allowedDomains.some(domain => hostname.includes(domain));
    } catch {
      return false;
    }
  }

  /**
   * Check if request is suspicious
   */
  private isSuspiciousRequest(url: string, config?: RequestInit): boolean {
    const suspiciousPatterns = [
      /\.\.\//, // Directory traversal
      /<script/i, // Script tags
      /javascript:/i, // JavaScript protocol
      /data:text\/html/i // Data URLs
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      return true;
    }

    // Check for suspicious headers
    if (config?.headers) {
      const headers = config.headers as Record<string, string>;
      if (headers['X-Forwarded-For'] && !this.isValidIP(headers['X-Forwarded-For'])) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validate IP address format
   */
  private isValidIP(ip: string): boolean {
    const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip);
  }

  /**
   * Generate CSRF token
   */
  private generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate rate limit key
   */
  private generateRateLimitKey(url: string): string {
    return `${this.getUserIdentifier()}:${url}`;
  }

  /**
   * Get user identifier for rate limiting
   */
  private getUserIdentifier(): string {
    return navigator.userAgent + (sessionStorage.getItem('user_id') || 'anonymous');
  }

  /**
   * Log security event
   */
  public logSecurityEvent(event: SecurityEvent): void {
    // Add user context
    event.userAgent = navigator.userAgent;
    event.userId = sessionStorage.getItem('user_id') || undefined;
    
    this.eventLog.push(event);

    // Keep only last 100 events
    if (this.eventLog.length > 100) {
      this.eventLog.shift();
    }

    // Send high-severity events to monitoring service
    if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
      this.sendToMonitoringService(event);
    }

    // Show toast for critical events
    if (event.severity === 'CRITICAL') {
      toast({
        title: "Security Alert",
        description: event.details,
        variant: "destructive"
      });
    }
  }

  /**
   * Send event to monitoring service
   */
  private async sendToMonitoringService(event: SecurityEvent): Promise<void> {
    try {
      const response = await fetch('/api/security/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to send security event to monitoring service');
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Error sending security event:', error);
      }
    }
  }

  /**
   * Get security summary
   */
  public getSecuritySummary() {
    const now = Date.now();
    const last24Hours = this.eventLog.filter(event => 
      now - event.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    return {
      totalEvents: this.eventLog.length,
      eventsLast24Hours: last24Hours.length,
      criticalEvents: this.eventLog.filter(e => e.severity === 'CRITICAL').length,
      highEvents: this.eventLog.filter(e => e.severity === 'HIGH').length,
      suspiciousIPs: this.suspiciousIPs.size,
      blacklistedTokens: this.blacklistedTokens.size,
      rateLimitEntries: this.rateLimitStore.size
    };
  }

  /**
   * Clear rate limits
   */
  public clearRateLimits(): void {
    this.rateLimitStore.clear();
  }

  /**
   * Singleton instance
   */
  public static get instance(): SecurityService {
    if (!SecurityService._instance) {
      SecurityService._instance = new SecurityService();
    }
    return SecurityService._instance;
  }
}

export const securityService = SecurityService.instance;
export default securityService;

