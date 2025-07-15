import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculationResult } from '@/lib/carbonCalculations';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

import SummaryCard from '@/components/results/SummaryCard';
import LifecyclePhaseFilter, { LifecyclePhase } from '@/components/ui/lifecycle-phase-filter';
import MaterialComparisonToggle from '@/components/ui/material-comparison-toggle';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';

interface EnhancedCalculatorResultsProps {
  result: CalculationResult;
  materials: ExtendedMaterialData[];
  onMaterialSelect?: (material: ExtendedMaterialData) => void;
}

const EnhancedCalculatorResults: React.FC<EnhancedCalculatorResultsProps> = ({
  result,
  materials,
  onMaterialSelect
}) => {
  const [activeLifecyclePhase, setActiveLifecyclePhase] = useState<LifecyclePhase>('all');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [selectedMaterialForComparison, setSelectedMaterialForComparison] = useState<ExtendedMaterialData | null>(null);

  // Calculate scope breakdown from materials
  const calculateScopeBreakdown = () => {
    let scope1 = 0, scope2 = 0, scope3 = 0;
    
    materials.forEach(material => {
      const carbonValue = material.carbon_footprint_kgco2e_kg || material.factor || 0;
      const scopeEmissions = {
        scope1: material.scope1_emissions || 0,
        scope2: material.scope2_emissions || 0,
        scope3: material.scope3_emissions || 0
      };
      
      // If no specific scope data, distribute based on typical patterns
      if (!scopeEmissions.scope1 && !scopeEmissions.scope2 && !scopeEmissions.scope3) {
        scope1 += carbonValue * 0.1; // ~10% direct
        scope2 += carbonValue * 0.2; // ~20% energy
        scope3 += carbonValue * 0.7; // ~70% value chain
      } else {
        scope1 += scopeEmissions.scope1;
        scope2 += scopeEmissions.scope2;
        scope3 += scopeEmissions.scope3;
      }
    });
    
    return { scope1, scope2, scope3 };
  };

  // Calculate lifecycle phase emissions
  const calculateLifecycleEmissions = () => {
    const embodiedTotal = materials.reduce((sum, material) => {
      const carbon = material.carbon_footprint_kgco2e_kg || material.factor || 0;
      return sum + (material.lifecycle_stage === 'cradle-to-gate' ? carbon : carbon * 0.7);
    }, 0);
    
    const transportTotal = result.transportEmissions || 0;
    const endOfLifeTotal = materials.reduce((sum, material) => {
      const carbon = material.carbon_footprint_kgco2e_kg || material.factor || 0;
      return sum + carbon * 0.1; // Estimate 10% for end-of-life
    }, 0);
    
    return {
      embodied: embodiedTotal,
      transport: transportTotal,
      endOfLife: endOfLifeTotal
    };
  };

  // Mock compliance status - in real app this would come from compliance service
  const mockComplianceStatus = {
    ncc2025: result.totalEmissions < 1000 ? 'compliant' as const : 'warning' as const,
    nabers: result.totalEmissions < 800 ? 'compliant' as const : 'breach' as const,
    greenstar: result.totalEmissions < 600 ? 'compliant' as const : 'warning' as const
  };

  const scopeBreakdown = calculateScopeBreakdown();
  const lifecycleEmissions = calculateLifecycleEmissions();

  // Filter results based on lifecycle phase
  const getFilteredResults = () => {
    if (activeLifecyclePhase === 'all') return result;
    
    const filtered = { ...result };
    switch (activeLifecyclePhase) {
      case 'embodied':
        filtered.totalEmissions = lifecycleEmissions.embodied;
        break;
      case 'transport':
        filtered.totalEmissions = lifecycleEmissions.transport;
        break;
      case 'end-of-life':
        filtered.totalEmissions = lifecycleEmissions.endOfLife;
        break;
    }
    return filtered;
  };

  const filteredResults = getFilteredResults();

  // Get high-impact materials for comparison
  const getHighImpactMaterials = () => {
    return materials
      .filter(m => (m.carbon_footprint_kgco2e_kg || m.factor || 0) > 50)
      .sort((a, b) => (b.carbon_footprint_kgco2e_kg || b.factor || 0) - (a.carbon_footprint_kgco2e_kg || a.factor || 0))
      .slice(0, 5);
  };

  const highImpactMaterials = getHighImpactMaterials();

  return (
    <div className="space-y-6">
      {/* Lifecycle Phase Filter */}
      <LifecyclePhaseFilter
        activePhase={activeLifecyclePhase}
        onPhaseChange={setActiveLifecyclePhase}
        emissionsByPhase={lifecycleEmissions}
      />

      {/* Enhanced Summary Card */}
      <SummaryCard 
        result={filteredResults}
        scopeBreakdown={scopeBreakdown}
        complianceStatus={mockComplianceStatus}
      />

      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          {/* Detailed Breakdown Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Emissions by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Materials</span>
                    <span>{result.materialEmissions?.toFixed(1) || 0} kg CO₂e</span>
                  </div>
                  <Progress value={(result.materialEmissions / result.totalEmissions) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Transport</span>
                    <span>{result.transportEmissions?.toFixed(1) || 0} kg CO₂e</span>
                  </div>
                  <Progress value={(result.transportEmissions / result.totalEmissions) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Energy</span>
                    <span>{result.energyEmissions?.toFixed(1) || 0} kg CO₂e</span>
                  </div>
                  <Progress value={(result.energyEmissions / result.totalEmissions) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lifecycle Phases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Embodied Carbon</span>
                    <span>{lifecycleEmissions.embodied.toFixed(1)} kg CO₂e</span>
                  </div>
                  <Progress value={(lifecycleEmissions.embodied / result.totalEmissions) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Transport</span>
                    <span>{lifecycleEmissions.transport.toFixed(1)} kg CO₂e</span>
                  </div>
                  <Progress value={(lifecycleEmissions.transport / result.totalEmissions) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>End-of-Life</span>
                    <span>{lifecycleEmissions.endOfLife.toFixed(1)} kg CO₂e</span>
                  </div>
                  <Progress value={(lifecycleEmissions.endOfLife / result.totalEmissions) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          {/* High-Impact Materials */}
          <Card>
            <CardHeader>
              <CardTitle>High-Impact Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {highImpactMaterials.map((material, index) => (
                  <div key={material.id || index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{material.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(material.carbon_footprint_kgco2e_kg || material.factor || 0).toFixed(2)} kg CO₂e/kg
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {index === 0 ? 'Highest' : `#${index + 1}`}
                      </Badge>
                      {(material.carbon_footprint_kgco2e_kg || material.factor || 0) > 100 && (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {/* Material Comparison */}
          {selectedMaterialForComparison ? (
            <MaterialComparisonToggle
              baseMaterial={selectedMaterialForComparison}
              alternatives={materials.filter(m => 
                m.category === selectedMaterialForComparison.category && 
                m.id !== selectedMaterialForComparison.id
              )}
              industryBenchmark={{
                averageCarbon: 75,
                percentileBetter: 25
              }}
              onToggleComparison={setComparisonEnabled}
              onSelectAlternative={onMaterialSelect}
              comparisonEnabled={comparisonEnabled}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Material Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <div>Select a material from the Materials tab to compare alternatives</div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {/* AI-powered insights */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Potential 15% Reduction</span>
                </div>
                <p className="text-sm text-green-700">
                  Replace high-carbon concrete with recycled aggregate mix to reduce embodied carbon.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Transport Optimization</span>
                </div>
                <p className="text-sm text-blue-700">
                  Source materials locally to reduce transport emissions by up to 8%.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCalculatorResults;