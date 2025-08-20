import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';

interface DiagnosticsOverlayProps {
  forceShow?: boolean;
}

export const DiagnosticsOverlay: React.FC<DiagnosticsOverlayProps> = ({ forceShow = false }) => {
  const env = import.meta.env;
  const isDev = env.MODE === 'development';
  
  // Environment variables check
  const hasSupabaseUrl = !!env.VITE_SUPABASE_URL;
  const hasSupabaseKey = !!(env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY);
  const hasAllKeys = hasSupabaseUrl && hasSupabaseKey;
  
  // React module check
  const reactLoaded = !!(React && React.useState);
  const reactDomLoaded = !!document.querySelector('#root') && !!(window as any).React;
  
  // HMR status check (dev only)
  const hmrConnected = isDev && !!(window as any).__vite_plugin_react_preamble_installed__;
  
  // Module loading issues check
  const hasModuleErrors = !reactLoaded;
  
  // Only show in dev mode OR if there are configuration/loading issues
  const shouldShow = forceShow || isDev || !hasAllKeys || hasModuleErrors;
  
  if (!shouldShow) return null;

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const maskString = (str?: string, showLength = 20) => {
    if (!str) return 'MISSING';
    return `${str.slice(0, showLength)}...`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className={`border-2 ${hasModuleErrors ? 'border-red-500' : !hasAllKeys ? 'border-yellow-500' : 'border-blue-500'} bg-background/95 backdrop-blur`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className={`h-4 w-4 ${hasModuleErrors ? 'text-red-500' : !hasAllKeys ? 'text-yellow-500' : 'text-blue-500'}`} />
            System Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* React Module Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>React:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(reactLoaded)}
                <Badge variant={reactLoaded ? "secondary" : "destructive"} className="text-xs">
                  {reactLoaded ? "Loaded" : "Failed"}
                </Badge>
              </div>
            </div>
            
            {isDev && (
              <div className="flex items-center justify-between">
                <span>HMR:</span>
                <div className="flex items-center gap-2">
                  {hmrConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                  <Badge variant={hmrConnected ? "secondary" : "destructive"} className="text-xs">
                    {hmrConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Backend Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Backend URL:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(hasSupabaseUrl)}
                <Badge variant={hasSupabaseUrl ? "secondary" : "destructive"} className="text-xs">
                  {hasSupabaseUrl ? "Connected" : "Missing"}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Auth Key:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(hasSupabaseKey)}
                <Badge variant={hasSupabaseKey ? "secondary" : "destructive"} className="text-xs">
                  {hasSupabaseKey ? "Present" : "Missing"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Configuration Details */}
          {hasSupabaseUrl && (
            <div className="text-xs text-muted-foreground">
              <div>URL: {maskString(env.VITE_SUPABASE_URL)}</div>
            </div>
          )}

          {hasSupabaseKey && (
            <div className="text-xs text-muted-foreground">
              <div>Key: {maskString(env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY)}</div>
            </div>
          )}

          {/* Build Info */}
          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between">
              <span>Mode:</span>
              <Badge variant="outline" className="text-xs">
                {env.MODE}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>DEV:</span>
              <Badge variant={env.DEV ? "secondary" : "outline"} className="text-xs">
                {env.DEV ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Critical Issues */}
          {hasModuleErrors && (
            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs">
              <div className="font-medium text-red-600 dark:text-red-400">
                Critical: React not loaded
              </div>
              <div className="text-red-500 dark:text-red-300 mt-1">
                JavaScript modules failed to load properly. Hard refresh required.
              </div>
            </div>
          )}

          {/* Backend Issues */}
          {!hasAllKeys && !hasModuleErrors && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-xs">
              <div className="font-medium text-yellow-600 dark:text-yellow-400">
                Backend not configured
              </div>
              <div className="text-yellow-500 dark:text-yellow-300 mt-1">
                Missing Supabase environment variables. Check backend configuration.
              </div>
            </div>
          )}

          {/* HMR Issues */}
          {isDev && !hmrConnected && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-xs">
              <div className="font-medium text-orange-600 dark:text-orange-400">
                Development: HMR disconnected
              </div>
              <div className="text-orange-500 dark:text-orange-300 mt-1">
                Hot module reloading not working. Refresh may be needed for changes.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};