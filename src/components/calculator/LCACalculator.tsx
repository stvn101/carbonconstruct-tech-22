import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Leaf, Info } from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';

interface LCACalculatorProps {
  calculator: CalculatorState;
  actions: any;
}

export const LCACalculator: React.FC<LCACalculatorProps> = ({
  calculator,
  actions
}) => {
  const result = calculator.result;

  if (!result) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Add materials, transport, or energy data to see LCA results.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStagePercentage = (value: number) => {
    return (value / result.totalEmissions) * 100;
  };

  const getImpactLevel = (percentage: number) => {
    if (percentage > 50) return { level: 'High', color: 'bg-red-500' };
    if (percentage > 25) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-green-500' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Life Cycle Assessment (LCA)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* LCA Stages Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">LCA Stages (ISO 14040/14044)</h3>
            
            {/* A1-A3: Product Stage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">A1-A3: Product Stage (Materials)</span>
                <span className="text-sm font-bold">
                  {(result.materialEmissions / 1000).toFixed(2)} t CO₂-e
                </span>
              </div>
              <Progress value={getStagePercentage(result.materialEmissions)} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Raw material supply, transport, manufacturing</span>
                <span>{getStagePercentage(result.materialEmissions).toFixed(1)}%</span>
              </div>
            </div>

            {/* A4-A5: Construction Process Stage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">A4-A5: Construction Process (Transport)</span>
                <span className="text-sm font-bold">
                  {(result.transportEmissions / 1000).toFixed(2)} t CO₂-e
                </span>
              </div>
              <Progress value={getStagePercentage(result.transportEmissions)} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Transport to site, construction installation</span>
                <span>{getStagePercentage(result.transportEmissions).toFixed(1)}%</span>
              </div>
            </div>

            {/* B6: Operational Energy Use */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">B6: Operational Energy Use</span>
                <span className="text-sm font-bold">
                  {(result.energyEmissions / 1000).toFixed(2)} t CO₂-e
                </span>
              </div>
              <Progress value={getStagePercentage(result.energyEmissions)} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Energy consumption during operation</span>
                <span>{getStagePercentage(result.energyEmissions).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Impact Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(result.materialEmissions / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">t CO₂-e Materials</div>
                  <Badge className={getImpactLevel(getStagePercentage(result.materialEmissions)).color}>
                    {getImpactLevel(getStagePercentage(result.materialEmissions)).level} Impact
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(result.transportEmissions / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">t CO₂-e Transport</div>
                  <Badge className={getImpactLevel(getStagePercentage(result.transportEmissions)).color}>
                    {getImpactLevel(getStagePercentage(result.transportEmissions)).level} Impact
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(result.energyEmissions / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">t CO₂-e Energy</div>
                  <Badge className={getImpactLevel(getStagePercentage(result.energyEmissions)).color}>
                    {getImpactLevel(getStagePercentage(result.energyEmissions)).level} Impact
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LCA Methodology Info */}
          <Card className="bg-blue-50 dark:bg-blue-950/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    LCA Methodology
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                    This assessment follows ISO 14040 and ISO 14044 standards for Life Cycle Assessment. 
                    The system boundary includes A1-A3 (product stage), A4-A5 (construction), and B6 (operational energy). 
                    End-of-life stages (C1-C4) and benefits beyond the system boundary (D) are not included in this calculation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">LCA Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getStagePercentage(result.materialEmissions) > 50 && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium">High Material Impact Detected</h5>
                      <p className="text-sm text-muted-foreground">
                        Consider low-carbon alternatives, recycled content, or local sourcing to reduce A1-A3 emissions.
                      </p>
                    </div>
                  </div>
                )}
                
                {getStagePercentage(result.transportEmissions) > 25 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium">Transport Optimization Needed</h5>
                      <p className="text-sm text-muted-foreground">
                        Optimize delivery routes, consolidate shipments, or source materials locally to reduce A4 emissions.
                      </p>
                    </div>
                  </div>
                )}
                
                {getStagePercentage(result.energyEmissions) > 30 && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium">Energy Efficiency Opportunity</h5>
                      <p className="text-sm text-muted-foreground">
                        Implement renewable energy sources or improve building efficiency to reduce B6 operational emissions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};