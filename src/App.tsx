import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { SafeRouter } from "@/components/routing/SafeRouter";
import { PerformanceOptimizer } from "@/components/performance/PerformanceOptimizer";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/auth";
import { CriticalErrorBoundary } from "@/components/error/CriticalErrorBoundary";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { GrokProvider } from "@/contexts/GrokContext";
import { ClaudeProvider } from "@/contexts/ClaudeContext";
import { authRoutes } from "@/routes/authRoutes";
import { marketingRoutes } from "@/routes/marketingRoutes";
import { protectedRoutes } from "@/routes/protectedRoutes";
import { projectRoutes } from "@/routes/projectRoutes";
import Index from "./pages/Index";
import EPDGeneratorPage from "./pages/EPDGenerator";
import EPDCreatePage from "./pages/EPDCreate";
import EPDDetailPage from "./pages/EPDDetail";
import EPDExportPage from "./pages/EPDExport";
import VerifierDashboard from "./pages/VerifierDashboard";
import VerifierReview from "./pages/VerifierReview";
import EPDAnalyticsDashboard from "./pages/EPDAnalyticsDashboard";
import MaterialsExportPage from "@/pages/admin/MaterialsExport";

// Phase 1 Implementation: Critical Legal & Compliance Foundation
import SecurityHeaders from "@/components/security/SecurityHeaders";
import EnhancedSecurityMonitorComponent from "@/components/security/EnhancedSecurityMonitor";
import AccessibilityEnhancer from "@/components/accessibility/AccessibilityEnhancer";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import ProductionMonitorComponent from "@/components/monitoring/ProductionMonitor";
import StabilityMonitor from "@/components/monitoring/StabilityMonitor";
import { DevelopmentTools } from "@/components/dev/DevelopmentTools";

// Phase 4: Production Optimizations
import advancedPerformanceMonitor from "@/services/performance/AdvancedPerformanceMonitor";
import enhancedSecurityMonitor from "@/services/security/EnhancedSecurityComplianceMonitor";
import productionErrorRecovery from "@/services/error/ProductionErrorRecovery";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors  
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});


function App() {
  // Phase 4: Initialize production systems
  React.useEffect(() => {
    if (import.meta.env.PROD) {
      // Initialize performance monitoring
      advancedPerformanceMonitor;
      // Initialize security monitoring  
      enhancedSecurityMonitor;
      // Initialize error recovery
      productionErrorRecovery;
      
      // Register service worker for production
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
      }
    }
  }, []);

  // Add error logging to catch any initialization issues
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="carbonconstruct-theme">
        <TooltipProvider>
          <PerformanceOptimizer>
          {/* Phase 1: Security Headers Implementation */}
          <SecurityHeaders 
            enableCSP={true}
            enableHSTS={true}
            enableFrameOptions={true}
            enableContentTypeOptions={true}
            enableReferrerPolicy={true}
          />
          
          {/* Phase 1: Enhanced Security Monitoring */}
          <EnhancedSecurityMonitorComponent />
          
          {/* Phase 1: WCAG 2.1 AA Accessibility Compliance */}
          <AccessibilityEnhancer 
            enableKeyboardNavigation={true}
            enableScreenReaderSupport={true}
            enableHighContrast={true}
            enableFocusManagement={true}
            enableAriaLiveRegions={true}
            skipToContentEnabled={true}
          />
          
          {/* Phase 1: PWA Installation Support */}
          <PWAInstaller 
            showBanner={true}
            position="bottom"
            theme="auto"
          />
          
          {/* Phase 1: Production Monitoring & Error Tracking */}
          <ProductionMonitorComponent />
          
           <Toaster />
           <Sonner />
             <SafeRouter>
              <CriticalErrorBoundary>
                <AuthProvider>
                  <GrokProvider>
                    <ClaudeProvider>
                      <ProjectProvider>
                        <div className="min-h-screen bg-background">
                            <Routes>
                              <Route path="/" element={<Index />} />
                              {authRoutes}
                              {marketingRoutes}
                              {protectedRoutes}
                              {projectRoutes}
                              {/* EPD Generator routes */}
                              <Route path="/epd-generator" element={<EPDGeneratorPage />} />
                               <Route path="/epd/create" element={<EPDCreatePage />} />
                               <Route path="/epd/:id" element={<EPDDetailPage />} />
                               <Route path="/epd/export/:id" element={<EPDExportPage />} />
                               <Route path="/verifier/dashboard" element={<VerifierDashboard />} />
                               <Route path="/verifier/review/:id" element={<VerifierReview />} />
                               <Route path="/dashboard/epds" element={<EPDAnalyticsDashboard />} />
                               {/* Admin route for materials export */}
                               <Route path="/admin/materials-export" element={<MaterialsExportPage />} />
                            </Routes>
                            
                            {/* Phase 3: Stability Monitoring - Only render after auth is ready */}
                            <StabilityMonitor />
                            
                            {/* Phase 3: Development Tools (dev only) */}
                            <DevelopmentTools />
                         </div>
                      </ProjectProvider>
                    </ClaudeProvider>
                  </GrokProvider>
                </AuthProvider>
              </CriticalErrorBoundary>
              </SafeRouter>
          </PerformanceOptimizer>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
