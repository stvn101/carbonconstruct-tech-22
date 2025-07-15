
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  feature?: string;
  className?: string;
  isChecking?: boolean;
  retryCount?: number;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  feature = 'Unknown',
  className = '',
  isChecking = false,
  retryCount = 0
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[200px] p-4 ${className}`}>
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium">Feature: {feature}</p>
            <p className="break-words">Error: {error.message}</p>
            {retryCount > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Retry attempts: {retryCount}
              </p>
            )}
          </div>
          <Button 
            onClick={resetErrorBoundary}
            disabled={isChecking}
            className="w-full"
            variant="outline"
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              'Try again'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
