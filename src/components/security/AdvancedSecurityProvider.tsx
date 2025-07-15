import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { securityService } from '@/services/security/SecurityService';
import PerformanceOptimizer from '@/services/performance/PerformanceOptimizer';

interface SecurityContextType {
  securityService: any;
  performanceOptimizer: any;
  securityStatus: {
    isSecure: boolean;
    threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    activeThreats: number;
    lastScan: Date | null;
  };
  performanceStatus: {
    score: number;
    recommendations: string[];
    metrics: any;
  };
  refreshSecurityStatus: () => void;
  refreshPerformanceStatus: () => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

interface AdvancedSecurityProviderProps {
  children: ReactNode;
}

export const AdvancedSecurityProvider: React.FC<AdvancedSecurityProviderProps> = ({ children }) => {
  const [securityServiceInstance] = useState(() => securityService);
  const [performanceOptimizer] = useState(() => new PerformanceOptimizer());
  
  const [securityStatus, setSecurityStatus] = useState({
    isSecure: true,
    threatLevel: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    activeThreats: 0,
    lastScan: null as Date | null,
  });
  
  const [performanceStatus, setPerformanceStatus] = useState({
    score: 100,
    recommendations: [] as string[],
    metrics: {},
  });

  useEffect(() => {
    // Initialize security and performance monitoring
    refreshSecurityStatus();
    refreshPerformanceStatus();
    
    // Set up periodic updates
    const securityInterval = setInterval(refreshSecurityStatus, 30000); // Every 30 seconds
    const performanceInterval = setInterval(refreshPerformanceStatus, 60000); // Every minute
    
    return () => {
      clearInterval(securityInterval);
      clearInterval(performanceInterval);
    };
  }, []);

  const refreshSecurityStatus = () => {
    const summary = securityServiceInstance.getSecuritySummary();
    
    // Determine threat level based on recent events
    let threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    
    if (summary.criticalEvents > 0) {
      threatLevel = 'CRITICAL';
    } else if (summary.highEvents > 2) {
      threatLevel = 'HIGH';
    } else if (summary.eventsLast24Hours > 10) {
      threatLevel = 'MEDIUM';
    }
    
    setSecurityStatus({
      isSecure: threatLevel === 'LOW' || threatLevel === 'MEDIUM',
      threatLevel,
      activeThreats: summary.criticalEvents + summary.highEvents,
      lastScan: new Date(),
    });
  };

  const refreshPerformanceStatus = () => {
    const score = performanceOptimizer.getPerformanceScore();
    const recommendations = performanceOptimizer.getOptimizationRecommendations();
    const metrics = (performanceOptimizer as any).reportMetrics();
    
    setPerformanceStatus({
      score,
      recommendations,
      metrics,
    });
  };

  const contextValue: SecurityContextType = {
    securityService: securityServiceInstance,
    performanceOptimizer,
    securityStatus,
    performanceStatus,
    refreshSecurityStatus,
    refreshPerformanceStatus,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useAdvancedSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useAdvancedSecurity must be used within an AdvancedSecurityProvider');
  }
  return context;
};

export default AdvancedSecurityProvider;