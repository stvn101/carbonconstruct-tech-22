
import React, { useState, useMemo, Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { MaterialInput, TransportInput, EnergyInput, CalculationInput, CalculationResult } from '@/lib/carbonExports';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import MobileSustainabilityTabs from './mobile/MobileSustainabilityTabs';

// Lazy load heavy components for better performance
const ComplianceTabContent = lazy(() => import('./tabs/ComplianceTabContent'));
const SuggestionsTabContent = lazy(() => import('./tabs/SuggestionsTabContent'));
const OptimizationTabContent = lazy(() => import('./tabs/OptimizationTabContent'));

interface SustainabilityAnalyzerProps {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  calculationResult?: CalculationResult;
  calculationInput?: CalculationInput;
}

const SustainabilityAnalyzer: React.FC<SustainabilityAnalyzerProps> = ({
  materials,
  transport,
  energy,
  calculationResult,
  calculationInput
}) => {
  const [activeTab, setActiveTab] = useState("compliance");
  const { isMobile } = useIsMobile();
  const { isOfflineMode } = useOfflineMode();

  // Memoize data calculations to prevent unnecessary re-renders
  const hasData = useMemo(() => 
    materials.length > 0 || transport.length > 0 || energy.length > 0, 
    [materials.length, transport.length, energy.length]
  );

  const totalInputs = useMemo(() => 
    materials.length + transport.length + energy.length,
    [materials.length, transport.length, energy.length]
  );

  // Tab configuration for mobile navigation
  const tabs = useMemo(() => [
    { id: "compliance", label: "Compliance", icon: "📋" },
    { id: "optimization", label: "AI Optimization", icon: "🤖" },
    { id: "suggestions", label: "Suggestions", icon: "💡" }
  ], []);

  if (!hasData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Sustainability Analysis</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Add materials, transport, or energy data to see sustainability insights
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6 sm:py-8">
          <p className="text-muted-foreground text-sm sm:text-base">
            No data available for analysis. Please add some materials, transport, or energy inputs to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const LoadingFallback = () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-carbon-600" />
      <span className="ml-2 text-sm text-muted-foreground">Loading analysis...</span>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl">Sustainability Analysis</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Comprehensive analysis of your project's environmental impact and compliance
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs sm:text-sm">
              {totalInputs} inputs
            </Badge>
            {isOfflineMode && (
              <Badge variant="secondary" className="text-xs">
                Offline
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {isMobile && (
          <MobileSustainabilityTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {!isMobile && (
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="compliance" className="text-xs sm:text-sm">
                📋 Compliance
              </TabsTrigger>
              <TabsTrigger value="optimization" className="text-xs sm:text-sm">
                🤖 AI Optimization
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="text-xs sm:text-sm">
                💡 Suggestions
              </TabsTrigger>
            </TabsList>
          )}
          
          <TabsContent value="compliance" className="mt-4 sm:mt-6">
            <Suspense fallback={<LoadingFallback />}>
              <ComplianceTabContent 
                materials={materials}
                transport={transport}
                energy={energy}
                onRunCheck={() => {}}
                isLoading={false}
              />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="optimization" className="mt-4 sm:mt-6">
            <Suspense fallback={<LoadingFallback />}>
              <OptimizationTabContent 
                materials={materials}
                onOptimizationComplete={(report) => {
                  console.log('Optimization completed:', report);
                }}
              />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="suggestions" className="mt-4 sm:mt-6">
            <Suspense fallback={<LoadingFallback />}>
              <SuggestionsTabContent 
                materials={materials}
                transport={transport}
                energy={energy}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SustainabilityAnalyzer;
