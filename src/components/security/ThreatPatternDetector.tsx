import { SecurityEvent } from './SecurityEventLogger';
import { toast } from '@/hooks/use-toast';

export interface ThreatPattern {
  name: string;
  description: string;
  indicators: ((events: SecurityEvent[]) => boolean)[];
  severity: SecurityEvent['severity'];
  action: 'log' | 'alert' | 'block';
}

export class ThreatPatternDetector {
  private threatPatterns: ThreatPattern[] = [];
  private isBlocked: boolean = false;
  
  constructor() {
    this.initializeThreatPatterns();
  }
  
  private initializeThreatPatterns() {
    this.threatPatterns = [
      {
        name: 'Brute Force Attack',
        description: 'Multiple failed authentication attempts from same source',
        indicators: [
          (events) => {
            const last10Minutes = Date.now() - 10 * 60 * 1000;
            const recentFailures = events.filter(
              e => e.type === 'auth_failure' && 
              e.timestamp.getTime() > last10Minutes
            );
            return recentFailures.length > 10;
          }
        ],
        severity: 'high',
        action: 'block'
      },
      {
        name: 'Account Enumeration',
        description: 'Systematic testing of user accounts',
        indicators: [
          (events) => {
            const last5Minutes = Date.now() - 5 * 60 * 1000;
            const recentEvents = events.filter(e => e.timestamp.getTime() > last5Minutes);
            const uniqueUserAttempts = new Set(
              recentEvents
                .filter(e => e.type === 'auth_failure')
                .map(e => e.details.email || e.details.username)
            );
            return uniqueUserAttempts.size > 20;
          }
        ],
        severity: 'medium',
        action: 'alert'
      },
      {
        name: 'XSS Attack Pattern',
        description: 'Potential cross-site scripting attempts',
        indicators: [
          (events) => events.some(e => 
            e.type === 'xss_attempt' && 
            (Date.now() - e.timestamp.getTime()) < 60000
          )
        ],
        severity: 'critical',
        action: 'block'
      },
      {
        name: 'Data Exfiltration',
        description: 'Unusual data access patterns',
        indicators: [
          (events) => {
            const last30Minutes = Date.now() - 30 * 60 * 1000;
            const dataAccess = events.filter(
              e => e.type === 'suspicious_activity' && 
              e.details.activity === 'bulk_data_access' &&
              e.timestamp.getTime() > last30Minutes
            );
            return dataAccess.length > 5;
          }
        ],
        severity: 'critical',
        action: 'alert'
      },
      {
        name: 'Rate Limit Exceeded',
        description: 'Excessive API requests indicating bot activity',
        indicators: [
          (events) => {
            const last1Minute = Date.now() - 60 * 1000;
            const rateLimitEvents = events.filter(
              e => e.type === 'rate_limit' && 
              e.timestamp.getTime() > last1Minute
            );
            return rateLimitEvents.length > 3;
          }
        ],
        severity: 'medium',
        action: 'log'
      }
    ];
  }
  
  analyzeThreatPatterns(events: SecurityEvent[]) {
    this.threatPatterns.forEach(pattern => {
      const isTriggered = pattern.indicators.every(indicator => 
        indicator(events)
      );
      
      if (isTriggered) {
        this.handleThreatDetection(pattern);
      }
    });
  }
  
  private handleThreatDetection(pattern: ThreatPattern) {
    const threatEvent: SecurityEvent = {
      type: 'suspicious_activity',
      severity: pattern.severity,
      details: {
        threatPattern: pattern.name,
        description: pattern.description,
        action: pattern.action,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date(),
      userAgent: navigator.userAgent
    };
    
    switch (pattern.action) {
      case 'block':
        this.blockUser();
        toast({
          title: "Security Alert",
          description: `Suspicious activity detected: ${pattern.name}. Access temporarily restricted.`,
          variant: "destructive",
        });
        break;
        
      case 'alert':
        toast({
          title: "Security Warning",
          description: `Potential security threat detected: ${pattern.name}`,
          variant: "destructive",
        });
        break;
        
      case 'log':
        console.warn(`🔍 Threat pattern detected: ${pattern.name}`);
        break;
    }
  }
  
  private blockUser() {
    this.isBlocked = true;
    
    // Clear sensitive data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    // Redirect to security page
    setTimeout(() => {
      try {
        window.history.pushState({}, '', '/security-notice');
        window.location.reload();
      } catch (error) {
        console.warn('Navigation failed, reloading page');
        window.location.reload();
      }
    }, 2000);
  }
  
  isUserBlocked(): boolean {
    return this.isBlocked;
  }
}

export const threatPatternDetector = new ThreatPatternDetector();