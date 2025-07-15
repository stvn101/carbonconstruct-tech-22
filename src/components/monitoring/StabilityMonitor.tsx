import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { createDbConnection } from '@/services/database/ConnectionStabilizer';
import { criticalFlowHandler } from '@/utils/errorHandling/CriticalFlowHandler';

interface StabilityMetrics {
  authStable: boolean;
  dbConnected: boolean;
  lastDbCheck: number;
  activeFlows: number;
  errors: string[];
}

export const StabilityMonitor: React.FC = () => {
  const { loading, isLoading, user } = useAuth();
  const [dbConnection, setDbConnection] = useState<ReturnType<typeof createDbConnection> | null>(null);
  const [metrics, setMetrics] = useState<StabilityMetrics>({
    authStable: false,
    dbConnected: false,
    lastDbCheck: 0,
    activeFlows: 0,
    errors: []
  });

  // Create and start health checking only when auth is ready
  useEffect(() => {
    if (!loading && !isLoading && user && !dbConnection) {
      const connection = createDbConnection();
      setDbConnection(connection);
      connection.startHealthChecking();
    }
    
    return () => {
      if (dbConnection) {
        dbConnection.cleanup();
      }
    };
  }, [loading, isLoading, user, dbConnection]);

  useEffect(() => {
    const checkStability = () => {
      const authStable = !loading && !isLoading;
      
      // Only check DB status if connection exists
      let dbStatus = 'disconnected';
      let lastDbCheck = 0;
      
      if (dbConnection) {
        dbStatus = dbConnection.getStatus();
        lastDbCheck = dbConnection.getLastSuccessfulConnection();
      }
      
      setMetrics(prev => ({
        ...prev,
        authStable,
        dbConnected: dbStatus === 'connected',
        lastDbCheck,
        // Note: We can't easily track active flows without exposing more methods
        activeFlows: 0
      }));
    };

    // Check immediately
    checkStability();

    // Check every 30 seconds
    const interval = setInterval(checkStability, 30000);

    return () => clearInterval(interval);
  }, [loading, isLoading, user, dbConnection]);

  // Only show in development or when there are issues
  if (process.env.NODE_ENV === 'production' && 
      metrics.authStable && 
      metrics.dbConnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
        <div className="font-medium mb-2 text-foreground">System Status</div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Auth:</span>
            <div className={`w-2 h-2 rounded-full ${
              metrics.authStable ? 'bg-success' : 'bg-warning'
            }`} />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Database:</span>
            <div className={`w-2 h-2 rounded-full ${
              metrics.dbConnected ? 'bg-success' : 'bg-destructive'
            }`} />
          </div>
          
          {metrics.lastDbCheck > 0 && (
            <div className="text-muted-foreground">
              Last DB check: {new Date(metrics.lastDbCheck).toLocaleTimeString()}
            </div>
          )}
          
          {!metrics.authStable && (
            <div className="text-warning text-xs">
              Auth loading...
            </div>
          )}
          
          {!metrics.dbConnected && (
            <div className="text-destructive text-xs">
              DB disconnected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StabilityMonitor;