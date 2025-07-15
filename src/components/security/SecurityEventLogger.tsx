import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit' | 'suspicious_activity' | 'data_breach' | 'xss_attempt' | 'csrf_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: Date;
  userAgent: string;
  ip?: string;
  userId?: string;
  sessionId?: string;
}

export class SecurityEventLogger {
  private events: SecurityEvent[] = [];
  private alertQueue: SecurityEvent[] = [];
  
  logEvent(
    type: SecurityEvent['type'], 
    details: Record<string, any>, 
    severity: SecurityEvent['severity'] = 'low'
  ) {
    const event: SecurityEvent = {
      type,
      severity,
      details,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      userId: details.userId,
      sessionId: this.generateSessionId()
    };
    
    this.events.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
    
    // Store in localStorage for persistence
    this.persistEvents();
    
    // Log based on severity
    if (severity === 'critical' || severity === 'high') {
      console.error('🚨 SECURITY ALERT:', event);
      this.alertQueue.push(event);
    } else if (severity === 'medium') {
      console.warn('⚠️ Security Warning:', event);
    } else {
      console.log('🔍 Security Event:', event);
    }
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(event);
    }
  }
  
  private generateSessionId(): string {
    return `session_${  Math.random().toString(36).substr(2, 9)  }${Date.now()}`;
  }
  
  private persistEvents() {
    try {
      const recentEvents = this.events.slice(-50); // Keep last 50 events
      localStorage.setItem('security_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to persist security events:', error);
    }
  }
  
  private async sendToMonitoringService(event: SecurityEvent) {
    try {
      const { error } = await supabase.functions.invoke('security-monitor', {
        body: { event }
      });
      
      if (error) {
        console.warn('Failed to send security event to monitoring service:', error);
      }
    } catch (error) {
      console.warn('Security monitoring service unavailable:', error);
    }
  }
  
  getRecentEvents(): SecurityEvent[] {
    return this.events.slice(-20);
  }
  
  clearEvents() {
    this.events = [];
    this.alertQueue = [];
    localStorage.removeItem('security_events');
  }
}

export const securityEventLogger = new SecurityEventLogger();
