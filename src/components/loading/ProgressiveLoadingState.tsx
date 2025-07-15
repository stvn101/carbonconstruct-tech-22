import React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressiveLoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'card';
  message?: string;
  progress?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Progressive Loading State - Phase 2 Enhancement
 * Provides different loading states based on component type and context
 */
export const ProgressiveLoadingState: React.FC<ProgressiveLoadingStateProps> = ({
  type = 'spinner',
  message = 'Loading...',
  progress,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64'
  };

  if (type === 'skeleton') {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <Card className={`${sizeClasses[size]} ${className}`}>
        <CardContent className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size={size === 'sm' ? 'small' : size === 'md' ? 'medium' : 'large'} />
          <p className="mt-4 text-muted-foreground">{message}</p>
          {typeof progress === 'number' && (
            <div className="w-full max-w-xs mt-4">
              <div className="bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <p className="text-xs text-center mt-2">{Math.round(progress)}%</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} ${className}`}>
      <LoadingSpinner size={size === 'sm' ? 'small' : size === 'md' ? 'medium' : 'large'} />
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
};