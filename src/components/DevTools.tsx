
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bug, Activity, TestTube, ExternalLink } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { logger } from '@/services/logging/EnhancedLoggingService';
import { performanceMonitor } from '@/services/performance/PerformanceMonitor';

const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const location = useLocation();
  const isDevelopment = import.meta.env.MODE === 'development';

  // Only show in development mode
  if (!isDevelopment) return null;

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(logger.getLogs().slice(-10));
      setMetrics(performanceMonitor.getMetrics().slice(-10));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          size="sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Dev Tools
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-hidden">
      <Card className="bg-white dark:bg-gray-800 shadow-xl border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Development Tools
            </CardTitle>
            <div className="flex items-center gap-2">
              <Link to="/dev-tools">
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                  <TestTube className="h-3 w-3 mr-1" />
                  Test Suite
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
              <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">Route:</span>
                  <Badge variant="outline" className="ml-1 text-xs">
                    {location.pathname}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Mode:</span>
                  <Badge variant="outline" className="ml-1 text-xs">
                    {import.meta.env.MODE}
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-secondary rounded text-xs">
                <div className="flex items-center gap-1 mb-1">
                  <TestTube className="h-3 w-3" />
                  <span className="font-medium">Integration Testing</span>
                </div>
                <p className="text-secondary-foreground">
                  Access the full test suite and performance tools at{' '}
                  <Link to="/dev-tools" className="underline">
                    /dev-tools
                  </Link>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="logs" className="mt-2">
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="text-xs p-1 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-1">
                      <Badge variant={log.level === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                        {log.level}
                      </Badge>
                      <span className="truncate">{log.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="mt-2">
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {metrics.map((metric, i) => (
                  <div key={i} className="text-xs p-1 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex justify-between">
                      <span className="truncate">{metric.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {metric.value}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevTools;
