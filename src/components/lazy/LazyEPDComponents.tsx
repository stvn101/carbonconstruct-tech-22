import React, { Suspense } from 'react';
import { StreamlinedErrorBoundary } from '@/components/error/StreamlinedErrorBoundary';
import { ProgressiveLoadingState } from '@/components/loading/ProgressiveLoadingState';
import { useLazyComponent } from '@/hooks/useLazyComponent';

// Split EPD components for better code splitting
const EPDGenerator = React.lazy(() => 
  import('@/components/epd/EPDGenerator').then(m => ({ default: m.EPDGenerator }))
);

const EPDList = React.lazy(() => 
  import('@/components/epd/EPDList').then(m => ({ default: m.EPDList }))
);

const EPDWizard = React.lazy(() => 
  import('@/components/epd/EPDWizard').then(m => ({ default: m.EPDWizard }))
);

/**
 * Lazy EPD Components - Phase 2 Code Splitting
 * Optimized loading for EPD-related functionality
 */
export const LazyEPDGenerator: React.FC = () => {
  const { observerRef, preload } = useLazyComponent(
    () => import('@/components/epd/EPDGenerator').then(m => ({ default: m.EPDGenerator })),
    { preloadDelay: 2000 }
  );

  return (
    <div ref={observerRef} onMouseEnter={preload}>
      <StreamlinedErrorBoundary feature="EPD Generator">
        <Suspense fallback={
          <ProgressiveLoadingState 
            type="card" 
            size="lg"
            message="Loading EPD Generator..."
          />
        }>
          <EPDGenerator />
        </Suspense>
      </StreamlinedErrorBoundary>
    </div>
  );
};

export const LazyEPDList: React.FC<any> = (props) => (
  <StreamlinedErrorBoundary feature="EPD List">
    <Suspense fallback={<ProgressiveLoadingState type="skeleton" />}>
      <EPDList {...props} />
    </Suspense>
  </StreamlinedErrorBoundary>
);

export const LazyEPDWizard: React.FC<any> = (props) => (
  <StreamlinedErrorBoundary feature="EPD Wizard">
    <Suspense fallback={
      <ProgressiveLoadingState 
        type="card" 
        size="lg" 
        message="Loading EPD creation wizard..." 
      />
    }>
      <EPDWizard {...props} />
    </Suspense>
  </StreamlinedErrorBoundary>
);