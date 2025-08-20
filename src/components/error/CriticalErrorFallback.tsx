import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CriticalErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  feature?: string;
}

export const CriticalErrorFallback: React.FC<CriticalErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  feature = 'Application'
}) => {
  return (
    <Card className="max-w-lg mx-auto mt-8 border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          {feature} Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Something went wrong</p>
          <p className="mt-1">{error.message}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={resetErrorBoundary}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            variant="destructive"
            size="sm"
          >
            Reload Page
          </Button>
        </div>
        
        {import.meta.env.DEV && (
          <details className="mt-4">
            <summary className="text-sm font-medium cursor-pointer">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
};