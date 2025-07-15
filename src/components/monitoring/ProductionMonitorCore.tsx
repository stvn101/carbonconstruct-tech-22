import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ProductionMonitor } from '@/services/monitoring/ProductionMonitorService';

// React component for production monitoring
const ProductionMonitorCore = () => {
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

export default ProductionMonitorCore;