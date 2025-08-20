import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

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
  
  // Only show in dev mode OR if there are configuration issues
  const shouldShow = forceShow || isDev || !hasAllKeys;
  
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
      <Card className="border-2 border-yellow-500 bg-background/95 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Environment Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
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

          {/* Status Summary */}
          {!hasAllKeys && (
            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs">
              <div className="font-medium text-red-600 dark:text-red-400">
                Backend not configured
              </div>
              <div className="text-red-500 dark:text-red-300 mt-1">
                Missing Supabase environment variables. Check backend configuration.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};