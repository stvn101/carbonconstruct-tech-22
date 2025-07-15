
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit' | 'suspicious_activity';
  details: Record<string, any>;
  timestamp: Date;
  userAgent: string;
  ip?: string;
}

class SecurityMonitor {
  private static instance: SecurityMonitor;
  private events: SecurityEvent[] = [];
  
  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }
  
  logEvent(type: SecurityEvent['type'], details: Record<string, any>) {
    const event: SecurityEvent = {
      type,
      details,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    };
    
    this.events.push(event);
    
    // In production, send to security monitoring service
    console.warn('Security Event:', event);
    
    // Store recent events in localStorage for debugging
    const recentEvents = this.events.slice(-10);
    localStorage.setItem('security_events', JSON.stringify(recentEvents));
    
    // Check for patterns that might indicate attacks
    this.analyzePatterns();
  }
  
  private analyzePatterns() {
    const recentEvents = this.events.slice(-20);
    const last5Minutes = Date.now() - 5 * 60 * 1000;
    
    const recentFailures = recentEvents.filter(
      event => event.type === 'auth_failure' && 
      event.timestamp.getTime() > last5Minutes
    );
    
    // If more than 5 auth failures in 5 minutes, log as suspicious
    if (recentFailures.length > 5) {
      this.logEvent('suspicious_activity', {
        pattern: 'high_auth_failure_rate',
        count: recentFailures.length,
        timeframe: '5_minutes'
      });
    }
  }
  
  getRecentEvents(): SecurityEvent[] {
    return this.events.slice(-10);
  }
  
  clearEvents() {
    this.events = [];
    localStorage.removeItem('security_events');
  }
}

export const securityMonitor = SecurityMonitor.getInstance();

// React component for monitoring (invisible)
const SecurityMonitorComponent = () => {
  useEffect(() => {
    // Monitor auth state changes for security events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        securityMonitor.logEvent('auth_failure', {
          event: 'successful_login',
          userId: session?.user?.id
        });
      } else if (event === 'SIGNED_OUT') {
        securityMonitor.logEvent('auth_failure', {
          event: 'logout'
        });
      }
    });
    
    // Monitor for potential XSS attempts
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('script') || message.includes('eval') || message.includes('innerHTML')) {
        securityMonitor.logEvent('suspicious_activity', {
          type: 'potential_xss',
          message: message.substring(0, 200) // Limit message length
        });
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      subscription.unsubscribe();
      console.error = originalConsoleError;
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default SecurityMonitorComponent;
