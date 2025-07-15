// Legacy ProductionMonitor - Refactored into separate files
// This file now imports from the new modular structure

import { useEffect } from 'react';
import { ProductionMonitor } from '@/services/monitoring/ProductionMonitorService';

export { ProductionMonitor as productionMonitor };

// React component for production monitoring
const ProductionMonitorComponent = () => {
  useEffect(() => {
    const monitor = ProductionMonitor.getInstance();
    
    // Track initial page view
    monitor.trackPageView(window.location.pathname);
    
    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        monitor.trackUserAction('page_hidden');
      } else {
        monitor.trackUserAction('page_visible');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Track beforeunload for session cleanup
    const handleBeforeUnload = () => {
      monitor.destroy();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    console.log('📊 Production monitoring initialized');
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return null;
};

export default ProductionMonitorComponent;
