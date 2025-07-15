import React, { Suspense } from 'react';
import { StreamlinedErrorBoundary } from '@/components/error/StreamlinedErrorBoundary';
import { ProgressiveLoadingState } from '@/components/loading/ProgressiveLoadingState';
import { useLazyComponent } from '@/hooks/useLazyComponent';

// Admin components - separate bundle for administrative features
const AdminStatusChecker = React.lazy(() => 
  import('@/components/admin/AdminStatusChecker').then(m => ({ default: m.AdminStatusChecker }))
);

const MaterialsExportManager = React.lazy(() => 
  import('@/components/admin/MaterialsExportManager')
);

/**
 * Lazy Admin Components - Phase 2 Administrative Bundle
 * Separate loading for admin-only features to reduce main bundle size
 */
export const LazyAdminStatusChecker: React.FC = () => {
  const { observerRef, preload } = useLazyComponent(
    () => import('@/components/admin/AdminStatusChecker').then(m => ({ default: m.AdminStatusChecker })),
    { preloadDelay: 3000, enableIntersectionObserver: false } // Admin features load on demand only
  );

  return (
    <div ref={observerRef} onFocus={preload}>
      <StreamlinedErrorBoundary feature="Admin Status Checker">
        <Suspense fallback={
          <ProgressiveLoadingState 
            type="card" 
            size="md"
            message="Loading admin panel..."
          />
        }>
          <AdminStatusChecker />
        </Suspense>
      </StreamlinedErrorBoundary>
    </div>
  );
};

export const LazyMaterialsExportManager: React.FC<any> = (props) => {
  const { observerRef, preload } = useLazyComponent(
    () => import('@/components/admin/MaterialsExportManager'),
    { preloadDelay: 3000, enableIntersectionObserver: false }
  );

  return (
    <div ref={observerRef} onFocus={preload}>
      <StreamlinedErrorBoundary feature="Materials Export Manager">
        <Suspense fallback={
          <ProgressiveLoadingState 
            type="card" 
            size="lg"
            message="Loading export manager..."
          />
        }>
          <MaterialsExportManager {...props} />
        </Suspense>
      </StreamlinedErrorBoundary>
    </div>
  );
};