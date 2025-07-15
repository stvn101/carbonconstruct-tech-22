import React from 'react';
import { Route } from 'react-router-dom';
import { lazyLoad } from '@/utils/lazyLoad';
import { ProgressiveLoadingState } from '@/components/loading/ProgressiveLoadingState';

// Phase 2: Route-based code splitting with optimized loading
const LazyCalculatorPage = lazyLoad(
  () => import('@/pages/Calculator'),
  <ProgressiveLoadingState type="card" size="lg" message="Loading Calculator..." />
);

const LazyMaterialDatabase = lazyLoad(
  () => import('@/components/lazy/LazyMaterialDatabase').then(m => ({ default: m.LazyMaterialDatabase })),
  <ProgressiveLoadingState type="skeleton" message="Loading Materials Database..." />
);

const LazyEPDGenerator = lazyLoad(
  () => import('@/components/lazy/LazyEPDComponents').then(m => ({ default: m.LazyEPDGenerator })),
  <ProgressiveLoadingState type="card" size="lg" message="Loading EPD Generator..." />
);

const LazySustainability = lazyLoad(
  () => import('@/pages/Sustainability'),
  <ProgressiveLoadingState type="card" size="lg" message="Loading Sustainability Dashboard..." />
);

const LazyAnalytics = lazyLoad(
  () => import('@/pages/Analytics'),
  <ProgressiveLoadingState type="card" size="lg" message="Loading Analytics..." />
);

const LazyProjects = lazyLoad(
  () => import('@/pages/UserProjects'),
  <ProgressiveLoadingState type="card" size="lg" message="Loading Projects..." />
);

const LazyBenchmarking = lazyLoad(
  () => import('@/pages/Benchmarking'),
  <ProgressiveLoadingState type="card" size="lg" message="Loading Benchmarking..." />
);

// Admin routes - separate bundle
const LazyAdminMaterialsExport = lazyLoad(
  () => import('@/components/lazy/LazyAdminComponents').then(m => ({ default: m.LazyMaterialsExportManager })),
  <ProgressiveLoadingState type="card" size="lg" message="Loading Admin Tools..." />
);

/**
 * Optimized Routes - Phase 2 Implementation
 * Features intelligent code splitting and progressive loading
 */
export const optimizedRoutes = [
  <Route key="calculator" path="/calculator" element={<LazyCalculatorPage />} />,
  <Route key="materials" path="/materials" element={<LazyMaterialDatabase />} />,
  <Route key="epd-generator" path="/epd-generator" element={<LazyEPDGenerator />} />,
  <Route key="sustainability" path="/sustainability" element={<LazySustainability />} />,
  <Route key="analytics" path="/analytics" element={<LazyAnalytics />} />,
  <Route key="benchmarking" path="/benchmarking" element={<LazyBenchmarking />} />,
  <Route key="projects" path="/projects" element={<LazyProjects />} />,
  <Route key="admin-materials-export" path="/admin/materials-export" element={<LazyAdminMaterialsExport />} />
];