import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Bug, Zap, Monitor } from 'lucide-react';
import { logger } from '@/services/logging/EnhancedLoggingService';
import { useNavigationService } from '@/hooks/useNavigationService';
import centralizedErrorReporting from '@/services/error/CentralizedErrorReporting';
import bundleOptimizer from '@/services/performance/BundleOptimizer';

/**
 * Development Tools - Phase 3 Developer Experience Enhancement
 * Provides debugging tools and insights for development
 */
export const DevelopmentTools: React.FC = () => {
  const [logs, setLogs] = useState(logger.getLogs());
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const { getCurrentPath, getCurrentUrl } = useNavigationService();

  useEffect(() => {
    if (import.meta.env.DEV) {
      const interval = setInterval(() => {
        setLogs(logger.getLogs());
        setPerformanceMetrics(bundleOptimizer.getPerformanceSummary());
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  const clearAllLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const exportDebugData = () => {
    const debugData = {
      logs: logger.getLogs(),
      performance: performanceMetrics,
      currentPath: getCurrentPath(),
      currentUrl: getCurrentUrl(),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 z-50 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Code className="h-4 w-4" />
          Dev Tools
          <Badge variant="outline" className="text-xs">DEV</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs defaultValue="logs" className="space-y-2">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
            <TabsTrigger value="perf" className="text-xs">Performance</TabsTrigger>
            <TabsTrigger value="nav" className="text-xs">Navigation</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-2 max-h-48 overflow-y-auto">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {logs.length} entries
              </span>
              <Button size="sm" variant="ghost" onClick={clearAllLogs} className="h-6 text-xs">
                Clear
              </Button>
            </div>
            <div className="space-y-1">
              {logs.slice(-10).map((log, i) => (
                <div key={i} className="text-xs p-1 rounded bg-muted/50">
                  <div className="flex justify-between">
                    <Badge variant={log.level === 'error' ? 'destructive' : 'outline'} className="text-xs h-4">
                      {log.level}
                    </Badge>
                    <span className="text-muted-foreground">{log.context}</span>
                  </div>
                  <div className="mt-1">{log.message}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="perf" className="space-y-2">
            {performanceMetrics && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Bundles:</span>
                  <span>{performanceMetrics.totalBundles}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Size:</span>
                  <span>{(performanceMetrics.totalSize / 1024).toFixed(1)}KB</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Load Time:</span>
                  <span>{performanceMetrics.averageLoadTime?.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hit Rate:</span>
                  <span>{performanceMetrics.cacheHitRate?.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nav" className="space-y-2 text-xs">
            <div>
              <strong>Current Path:</strong> {getCurrentPath()}
            </div>
            <div className="space-y-1">
              <Button size="sm" variant="outline" onClick={exportDebugData} className="w-full h-6 text-xs">
                Export Debug Data
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};