
import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, Link, Brain } from 'lucide-react';
import { LCAGuide, ScopeGuide, LEEDGuide, BREEAMGuide, GreenStarGuide } from './help';
import { EnhancedNCCGuide } from './help/guides/EnhancedNCCGuide';
import { EnhancedNABERSGuide } from './help/guides/EnhancedNABERSGuide';
import { RealTimeMetrics } from './dashboard/RealTimeMetrics';
import { ExportManager } from './export/ExportManager';
import { AIAssistant } from './ai/AIAssistant';
import { usePersonalizedCalculatorState } from './hooks/usePersonalizedCalculatorState';
import { PersonalizedCalculatorDashboard } from './PersonalizedCalculatorDashboard';
import { CalculatorTemplateSelector } from './templates/CalculatorTemplateSelector';
import { useAuth } from '@/contexts/auth';
import { StreamlinedErrorBoundary } from '@/components/error/StreamlinedErrorBoundary';
import { ProgressiveLoadingState } from '@/components/loading/ProgressiveLoadingState';
import { useLazyComponent } from '@/hooks/useLazyComponent';
import centralizedErrorReporting from '@/services/error/CentralizedErrorReporting';
import { CalculatorHeader } from './CalculatorHeader';
import { CalculatorTabs } from './CalculatorTabs';
import { useCalculatorActions } from './hooks/useCalculatorActions';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Phase 2: Enhanced lazy loading with intelligent preloading
const NCCCalculator = React.lazy(() => import('./calculators/NCCCalculator').then(m => ({ default: m.NCCCalculator })));
const NABERSCalculator = React.lazy(() => import('./calculators/NABERSCalculator').then(m => ({ default: m.NABERSCalculator })));
const LCACalculator = React.lazy(() => import('./calculators/LCACalculator').then(m => ({ default: m.LCACalculator })));
const ScopeCalculator = React.lazy(() => import('./calculators/ScopeCalculator').then(m => ({ default: m.ScopeCalculator })));
const LEEDCalculator = React.lazy(() => import('./calculators/LEEDCalculator').then(m => ({ default: m.LEEDCalculator })));
const BREEAMCalculator = React.lazy(() => import('./calculators/BREEAMCalculator').then(m => ({ default: m.BREEAMCalculator })));
const GreenStarCalculator = React.lazy(() => import('./calculators/GreenStarCalculator').then(m => ({ default: m.GreenStarCalculator })));
const ConstructionIntegrations = React.lazy(() => import('./integrations/ConstructionIntegrations').then(m => ({ default: m.ConstructionIntegrations })));

// Phase 2: Lazy admin components - separate bundle
const LazyAdminStatusChecker = React.lazy(() => import('@/components/lazy/LazyAdminComponents').then(m => ({ default: m.LazyAdminStatusChecker })));

interface NewCalculatorProps {
  demoMode?: boolean;
}

interface CalculatorData {
  ncc: any;
  nabers: any;
  lca: any;
  scope: any;
  leed: any;
  breeam: any;
  greenStar: any;
}

const NewCalculator: React.FC<NewCalculatorProps> = ({ demoMode = false }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [helpModals, setHelpModals] = useState({
    ncc: false, nabers: false, lca: false, scope: false,
    leed: false, breeam: false, greenstar: false
  });
  const { user, profile } = useAuth();

  // Phase 2: Intelligent preloading based on user behavior
  const { preload: preloadNCC } = useLazyComponent(() => import('./calculators/NCCCalculator').then(m => ({ default: m.NCCCalculator })));
  const { preload: preloadNABERS } = useLazyComponent(() => import('./calculators/NABERSCalculator').then(m => ({ default: m.NABERSCalculator })));
  const { preload: preloadLCA } = useLazyComponent(() => import('./calculators/LCACalculator').then(m => ({ default: m.LCACalculator })));

  // Track user journey for error context
  React.useEffect(() => {
    centralizedErrorReporting.trackUserJourney('calculator_loaded', 'NewCalculator', {
      activeTab,
      userAuthenticated: !!user,
      demoMode
    });
  }, [activeTab, user, demoMode]);
  
  const {
    calculatorData,
    savedCalculations,
    isLoading,
    isSaving,
    totalEmissions,
    complianceScore,
    updateHandlers,
    saveCalculation,
    loadCalculation,
    applyPersonalizedDefaults,
    applyTemplateDefaults,
    getRecommendedMaterials,
    checkPersonalizedCompliance,
    getCalculationInsights,
    isApplyingDefaults,
    calculationHistory
  } = usePersonalizedCalculatorState();

  // Calculator actions (reset, template, export)
  const actions = useCalculatorActions(calculatorData, updateHandlers, totalEmissions);

  // Template handling with proper integration
  const handleTemplateSelect = (template: any) => {
    applyTemplateDefaults(template);
    
    // Switch to the primary calculator tab
    if (template.calculatorTypes.length > 0) {
      setActiveTab(template.calculatorTypes[0]);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      {/* Header */}
      <CalculatorHeader
        totalEmissions={totalEmissions}
        complianceScore={complianceScore}
        isSaving={isSaving}
        user={user}
        actions={actions}
        onSave={saveCalculation}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <CalculatorTabs
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              // Phase 2: Intelligent preloading based on tab hover/selection
              if (tab === 'ncc') preloadNCC();
              else if (tab === 'nabers') preloadNABERS();
              else if (tab === 'lca') preloadLCA();
              
              centralizedErrorReporting.trackUserJourney('tab_changed', 'Calculator', { tab });
            }}
            onHelpModalOpen={(modal) => setHelpModals(prev => ({ ...prev, [modal]: true }))}
            actions={actions}
          />

          <TabsContent value="dashboard" className="space-y-6">
            {/* Personalized Calculator Dashboard */}
            {user ? (
              <PersonalizedCalculatorDashboard
                totalEmissions={totalEmissions}
                complianceScore={complianceScore}
                insights={getCalculationInsights()}
                complianceCheck={checkPersonalizedCompliance('overall')}
                recommendedMaterials={getRecommendedMaterials()}
                onApplyDefaults={applyPersonalizedDefaults}
                calculationHistory={calculationHistory}
                isApplyingDefaults={isApplyingDefaults}
                onTemplateSelect={handleTemplateSelect}
                userFocusAreas={profile?.focus_areas || []}
              />
            ) : (
              <>
                {/* Calculator Templates for non-authenticated users */}
                <CalculatorTemplateSelector
                  onSelectTemplate={handleTemplateSelect}
                  userFocusAreas={[]}
                  recentTemplates={[]}
                />

                {/* Real-time Metrics for non-authenticated users */}
                <RealTimeMetrics calculatorData={calculatorData} totalEmissions={totalEmissions} />
                
                {/* Export Manager */}
                <ExportManager calculatorData={calculatorData} totalEmissions={totalEmissions} />

                {/* Default Dashboard for non-authenticated users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Carbon Footprint Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-red-50 dark:bg-red-950/20">
                        <CardContent className="p-4">
                          <div className="text-sm text-red-600 dark:text-red-400">Total Emissions</div>
                          <div className="text-2xl font-bold text-red-700 dark:text-red-300">{(totalEmissions / 1000).toFixed(1)} t</div>
                          <div className="text-xs text-red-500">CO₂ equivalent</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-green-50 dark:bg-green-950/20">
                        <CardContent className="p-4">
                          <div className="text-sm text-green-600 dark:text-green-400">Standards Compliance</div>
                          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{complianceScore}%</div>
                          <div className="text-xs text-green-500">Compliance score</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50 dark:bg-blue-950/20">
                        <CardContent className="p-4">
                          <div className="text-sm text-blue-600 dark:text-blue-400">Sign In</div>
                          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">Required</div>
                          <div className="text-xs text-blue-500">For personalization</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-50 dark:bg-purple-950/20">
                        <CardContent className="p-4">
                          <div className="text-sm text-purple-600 dark:text-purple-400">AI Analysis</div>
                          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">Ready</div>
                          <div className="text-xs text-purple-500">Claude Sonnet 4</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Construction Management Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'Procore', 'Autodesk ACC', 'Buildertrend', 'PlanGrid',
                    'Fieldwire', 'Smartsheet', 'Custom API', 'Real-time Sync'
                  ].map((platform) => (
                    <Card key={platform} className="p-3 text-center">
                      <div className="text-sm font-medium">{platform}</div>
                      <div className="text-xs text-green-600">Available</div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Claude Sonnet 4 AI Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium text-card-foreground">AI Analysis</h4>
                    <p className="text-sm text-muted-foreground mt-1">Comprehensive carbon footprint analysis with 92%+ confidence</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium text-card-foreground">Smart Recommendations</h4>
                    <p className="text-sm text-muted-foreground mt-1">Prioritized action plans with ROI calculations</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium text-card-foreground">Interactive Assistant</h4>
                    <p className="text-sm text-muted-foreground mt-1">Real-time consultation for carbon optimization</p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ncc">
            <StreamlinedErrorBoundary feature="NCC Calculator">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading NCC Calculator..." />}>
                <NCCCalculator 
                  onCalculationUpdate={updateHandlers.ncc} 
                  defaultValues={calculatorData.ncc} 
                />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>

          <TabsContent value="nabers">
            <StreamlinedErrorBoundary feature="NABERS Calculator">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading NABERS Calculator..." />}>
                <NABERSCalculator onCalculationUpdate={updateHandlers.nabers} />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>

          <TabsContent value="lca">
            <StreamlinedErrorBoundary feature="LCA Calculator">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading LCA Calculator..." />}>
                <LCACalculator onCalculationUpdate={updateHandlers.lca} />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>

          <TabsContent value="scope">
            <StreamlinedErrorBoundary feature="Scope Calculator">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading Scope Calculator..." />}>
                <ScopeCalculator onCalculationUpdate={updateHandlers.scope} />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>

          <TabsContent value="leed">
            <StreamlinedErrorBoundary feature="LEED Calculator">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading LEED Calculator..." />}>
                <LEEDCalculator onCalculationUpdate={updateHandlers.leed} />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>

          <TabsContent value="breeam">
            <StreamlinedErrorBoundary feature="BREEAM Calculator">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading BREEAM Calculator..." />}>
                <BREEAMCalculator onCalculationUpdate={updateHandlers.breeam} />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>

          <TabsContent value="greenstar">
            <StreamlinedErrorBoundary feature="Green Star Calculator">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading Green Star Calculator..." />}>
                <GreenStarCalculator onCalculationUpdate={updateHandlers.greenStar} />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>

          <TabsContent value="construction">
            <StreamlinedErrorBoundary feature="Construction Integrations">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading construction integrations..." />}>
                <ConstructionIntegrations />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>

          <TabsContent value="ai">
            <StreamlinedErrorBoundary feature="AI Assistant">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading AI Assistant..." />}>
                <AIAssistant calculatorData={calculatorData} totalEmissions={totalEmissions} />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>

          <TabsContent value="admin">
            <StreamlinedErrorBoundary feature="Admin Status">
              <Suspense fallback={<ProgressiveLoadingState type="card" size="lg" message="Loading admin panel..." />}>
                <LazyAdminStatusChecker />
              </Suspense>
            </StreamlinedErrorBoundary>
          </TabsContent>
        </Tabs>

        {/* Enhanced Help Modals */}
        <EnhancedNCCGuide 
          open={helpModals.ncc} 
          onOpenChange={(open) => setHelpModals(prev => ({ ...prev, ncc: open }))} 
        />
        <EnhancedNABERSGuide 
          open={helpModals.nabers} 
          onOpenChange={(open) => setHelpModals(prev => ({ ...prev, nabers: open }))} 
        />
        <LCAGuide 
          open={helpModals.lca} 
          onOpenChange={(open) => setHelpModals(prev => ({ ...prev, lca: open }))} 
        />
        <ScopeGuide 
          open={helpModals.scope} 
          onOpenChange={(open) => setHelpModals(prev => ({ ...prev, scope: open }))} 
        />
        <LEEDGuide 
          open={helpModals.leed} 
          onOpenChange={(open) => setHelpModals(prev => ({ ...prev, leed: open }))} 
        />
        <BREEAMGuide 
          open={helpModals.breeam} 
          onOpenChange={(open) => setHelpModals(prev => ({ ...prev, breeam: open }))} 
        />
        <GreenStarGuide 
          open={helpModals.greenstar} 
          onOpenChange={(open) => setHelpModals(prev => ({ ...prev, greenstar: open }))} 
        />
      </div>
    </div>
  );
};

export default NewCalculator;
