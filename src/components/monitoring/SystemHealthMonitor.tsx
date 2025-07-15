import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { errorService } from '@/services/error/ErrorService';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export const SystemHealthMonitor: React.FC = () => {
  const [errorStats, setErrorStats] = useState({ errors: 0, warnings: 0, info: 0 });
  const [recentErrors, setRecentErrors] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = () => {
    setErrorStats(errorService.getErrorStats());
    setRecentErrors(errorService.getErrors(10));
    setLastUpdate(new Date());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getHealthStatus = () => {
    if (errorStats.errors > 5) return { status: 'critical', color: 'destructive', icon: XCircle };
    if (errorStats.errors > 0 || errorStats.warnings > 10) return { status: 'warning', color: 'warning', icon: AlertTriangle };
    return { status: 'healthy', color: 'success', icon: CheckCircle };
  };

  const health = getHealthStatus();
  const StatusIcon = health.icon;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">System Health</CardTitle>
            <CardDescription>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${health.color === 'destructive' ? 'text-red-500' : health.color === 'warning' ? 'text-yellow-500' : 'text-green-500'}`} />
            <Badge variant={health.color === 'destructive' ? 'destructive' : health.color === 'warning' ? 'secondary' : 'default'}>
              {health.status}
            </Badge>
            <Button variant="ghost" size="sm" onClick={refreshData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-500">{errorStats.errors}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{errorStats.warnings}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{errorStats.info}</div>
              <div className="text-sm text-muted-foreground">Info</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {recentErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Issues</CardTitle>
            <CardDescription>Last 10 errors and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recentErrors.map((error) => (
                <div key={error.id} className="p-2 rounded-md bg-muted/50 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={error.level === 'error' ? 'destructive' : error.level === 'warning' ? 'secondary' : 'default'}>
                      {error.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="font-medium">{error.message}</div>
                  {error.context && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                        Show details
                      </summary>
                      <pre className="mt-1 text-xs bg-background p-2 rounded overflow-x-auto">
                        {JSON.stringify(error.context, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => errorService.clearErrors()}>
                Clear All
              </Button>
              <Badge variant="outline">{recentErrors.length} total issues</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};