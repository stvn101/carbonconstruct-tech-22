import React, { useState, Suspense, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';

// Import the actual calculator with error handling
const LazyNewCalculator = React.lazy(() => 
  import('./NewCalculator').catch(error => {
    console.error('[SafeNewCalculator] Failed to load NewCalculator:', error);
    // Return a fallback component
    return {
      default: () => (
        <Card className="max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Calculator Loading Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The calculator module failed to load. This may be due to a network issue or module error.
            </p>
            <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
          </CardContent>
        </Card>
      )
    };
  })
);

interface SafeNewCalculatorProps {
  demoMode?: boolean;
}

const LoadingFallback: React.FC = () => (
  <Card className="max-w-4xl mx-auto mt-8">
    <CardContent className="flex items-center justify-center py-16">
      <div className="text-center space-y-4">
        <Calculator className="h-12 w-12 mx-auto animate-pulse text-primary" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-48 mx-auto" />
          <div className="h-3 bg-muted rounded animate-pulse w-32 mx-auto" />
        </div>
        <p className="text-sm text-muted-foreground">Loading Carbon Calculator...</p>
      </div>
    </CardContent>
  </Card>
);

const CalculatorErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const handleReload = useCallback(() => {
    // Clear any potential module cache issues
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    window.location.reload();
  }, []);

  return (
    <Card className="max-w-4xl mx-auto mt-8 border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Calculator Runtime Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <p className="font-medium">Something went wrong with the calculator</p>
          <p className="text-muted-foreground mt-1">{error.message}</p>
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
            onClick={handleReload}
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

const SafeNewCalculator: React.FC<SafeNewCalculatorProps> = ({ demoMode = false }) => {
  // Verify React is available
  if (!React || typeof React.useState !== 'function') {
    return (
      <Card className="max-w-4xl mx-auto mt-8 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            React Module Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            React framework is not properly loaded. Please refresh the page.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary 
      FallbackComponent={CalculatorErrorFallback}
      onError={(error, errorInfo) => {
        console.error('[SafeNewCalculator] Calculator error:', error, errorInfo);
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <LazyNewCalculator demoMode={demoMode} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SafeNewCalculator;