import React, { Suspense } from 'react';
import { StreamlinedErrorBoundary } from '@/components/error/StreamlinedErrorBoundary';
import { ProgressiveLoadingState } from '@/components/loading/ProgressiveLoadingState';
import { useLazyComponent } from '@/hooks/useLazyComponent';

// Split MaterialDatabase into smaller chunks
const MaterialDatabaseCore = React.lazy(() => 
  import('@/components/materials/MaterialDatabase').then(m => ({ default: m.default }))
);

const MaterialFilters = React.lazy(() => 
  import('@/components/materials/MaterialFilters').then(m => ({ default: m.default }))
);

const MaterialTable = React.lazy(() => 
  import('@/components/materials/MaterialTable').then(m => ({ default: m.default }))
);

/**
 * Lazy Material Database - Phase 2 Code Splitting
 * Intelligently loads material database components based on user interaction
 */
export const LazyMaterialDatabase: React.FC = () => {
  const { observerRef, preload } = useLazyComponent(
    () => import('@/components/materials/SimplifiedMaterialDatabase'),
    { preloadDelay: 1500 }
  );

  return (
    <div ref={observerRef} onMouseEnter={preload}>
      <StreamlinedErrorBoundary feature="Material Database">
        <Suspense fallback={
          <ProgressiveLoadingState 
            type="skeleton" 
            message="Loading materials database..."
          />
        }>
          <MaterialDatabaseCore />
        </Suspense>
      </StreamlinedErrorBoundary>
    </div>
  );
};

/**
 * Lazy Material Components for granular loading
 */
export const LazyMaterialFilters: React.FC<any> = (props) => (
  <StreamlinedErrorBoundary feature="Material Filters">
    <Suspense fallback={<ProgressiveLoadingState type="card" size="sm" />}>
      <MaterialFilters {...props} />
    </Suspense>
  </StreamlinedErrorBoundary>
);

export const LazyMaterialTable: React.FC<any> = (props) => (
  <StreamlinedErrorBoundary feature="Material Table">
    <Suspense fallback={<ProgressiveLoadingState type="skeleton" />}>
      <MaterialTable {...props} />
    </Suspense>
  </StreamlinedErrorBoundary>
);