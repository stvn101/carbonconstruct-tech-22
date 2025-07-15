import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { securityEventLogger, SecurityEvent } from './SecurityEventLogger';
import { threatPatternDetector } from './ThreatPatternDetector';

// Simplified and refactored EnhancedSecurityMonitor
const EnhancedSecurityMonitorComponent = () => {
  const handleAuthStateChange = useCallback((event: string, session: any) => {
    switch (event) {
      case 'SIGNED_IN':
        securityEventLogger.logEvent('auth_failure', {
          event: 'successful_login',
          userId: session?.user?.id,
          method: session?.user?.app_metadata?.provider || 'email'
        }, 'low');
        break;
        
      case 'SIGNED_OUT':
        securityEventLogger.logEvent('auth_failure', {
          event: 'logout',
          userId: session?.user?.id
        }, 'low');
        break;
        
      case 'TOKEN_REFRESHED':
        securityEventLogger.logEvent('auth_failure', {
          event: 'token_refresh',
          userId: session?.user?.id
        }, 'low');
        break;
    }
  }, []);

  useEffect(() => {
    // Monitor auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    
    // Monitor for XSS attempts
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set(value) {
        if (typeof value === 'string') {
          const suspiciousPatterns = [
            /<script[^>]*>/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe[^>]*>/i,
            /eval\s*\(/i
          ];
          
          const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(value));
          
          if (isSuspicious) {
            securityEventLogger.logEvent('xss_attempt', {
              content: value.substring(0, 200),
              element: this.tagName,
              location: window.location.href
            }, 'critical');
            
            console.warn('🚨 Blocked potentially malicious innerHTML:', value);
            return;
          }
        }
        
        originalInnerHTML?.set?.call(this, value);
      },
      get: originalInnerHTML?.get || function() { return ''; }
    });
    
    // Monitor network requests for suspicious activity
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const [url, options] = args;
      const startTime = Date.now();
      
      try {
        const response = await originalFetch.apply(this, args);
        
        const requestTime = Date.now() - startTime;
        if (requestTime > 10000) {
          securityEventLogger.logEvent('suspicious_activity', {
            activity: 'slow_request',
            url: typeof url === 'string' ? url : url.toString(),
            duration: requestTime
          }, 'medium');
        }
        
        return response;
      } catch (error) {
        securityEventLogger.logEvent('suspicious_activity', {
          activity: 'failed_request',
          url: typeof url === 'string' ? url : url.toString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }, 'low');
        
        throw error;
      }
    };
    
    // Monitor for rapid-fire events
    let eventCount = 0;
    const eventCountReset = setInterval(() => {
      if (eventCount > 100) {
        securityEventLogger.logEvent('rate_limit', {
          eventsPerSecond: eventCount,
          timestamp: new Date().toISOString()
        }, 'high');
      }
      eventCount = 0;
    }, 1000);
    
    const eventListener = () => {
      eventCount++;
    };
    
    ['click', 'keydown', 'mousemove', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, eventListener, { passive: true });
    });
    
    // Analyze threat patterns periodically
    const threatAnalysisInterval = setInterval(() => {
      const recentEvents = securityEventLogger.getRecentEvents();
      threatPatternDetector.analyzeThreatPatterns(recentEvents);
    }, 30000); // Every 30 seconds
    
    console.log('🔒 Enhanced security monitoring initialized');
    
    return () => {
      subscription.unsubscribe();
      clearInterval(eventCountReset);
      clearInterval(threatAnalysisInterval);
      
      ['click', 'keydown', 'mousemove', 'scroll'].forEach(eventType => {
        document.removeEventListener(eventType, eventListener);
      });
      
      // Restore original functions
      window.fetch = originalFetch;
      if (originalInnerHTML) {
        Object.defineProperty(Element.prototype, 'innerHTML', originalInnerHTML);
      }
    };
  }, [handleAuthStateChange]);
  
  return null;
};

export default EnhancedSecurityMonitorComponent;
