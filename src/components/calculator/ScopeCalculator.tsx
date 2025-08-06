import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Factory, Truck } from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';

interface ScopeCalculatorProps {
  calculator: CalculatorState;
  actions: any;
}

export const ScopeCalculator: React.FC<ScopeCalculatorProps> = ({
  calculator,
  actions
}) => {
  const result = calculator.result;

  if (!result) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Add data to see GHG Protocol Scope 1, 2, and 3 emissions breakdown.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScopePercentage = (value: number) => {
    return (value / result.totalEmissions) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            GHG Protocol Scope Emissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Emissions Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-2">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {(result.totalEmissions / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total t CO₂-e</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <Factory className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <div className="text-xl font-bold text-red-600">
                    {(result.scope1 / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Scope 1</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                  <div className="text-xl font-bold text-yellow-600">
                    {(result.scope2 / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Scope 2</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-xl font-bold text-blue-600">
                    {(result.scope3 / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Scope 3</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Scope Breakdown */}
          <div className="space-y-6">
            {/* Scope 1: Direct Emissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Factory className="h-5 w-5" />
                  Scope 1: Direct Emissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>On-site fuel combustion, company vehicles</span>
                  <Badge variant="destructive">
                    {getScopePercentage(result.scope1).toFixed(1)}% of total
                  </Badge>
                </div>
                <Progress value={getScopePercentage(result.scope1)} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  Includes natural gas, LPG, diesel, and petrol consumption directly by your organization.
                </div>
              </CardContent>
            </Card>

            {/* Scope 2: Indirect Energy Emissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Zap className="h-5 w-5" />
                  Scope 2: Indirect Energy Emissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Purchased electricity, heating, cooling</span>
                  <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                    {getScopePercentage(result.scope2).toFixed(1)}% of total
                  </Badge>
                </div>
                <Progress value={getScopePercentage(result.scope2)} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  Emissions from purchased electricity consumed by your organization.
                </div>
              </CardContent>
            </Card>

            {/* Scope 3: Other Indirect Emissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Truck className="h-5 w-5" />
                  Scope 3: Other Indirect Emissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Supply chain, materials, transport</span>
                  <Badge variant="outline" className="border-blue-600 text-blue-600">
                    {getScopePercentage(result.scope3).toFixed(1)}% of total
                  </Badge>
                </div>
                <Progress value={getScopePercentage(result.scope3)} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  All other indirect emissions including purchased goods and services, transportation.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scope 3 Categories Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scope 3 Categories Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">1. Purchased Goods & Services (Materials)</span>
                  <span className="font-medium">
                    {(result.materialEmissions / 1000).toFixed(1)} t CO₂-e
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">4. Upstream Transportation</span>
                  <span className="font-medium">
                    {(result.transportEmissions / 1000).toFixed(1)} t CO₂-e
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">Total Scope 3</span>
                  <span className="font-bold text-blue-600">
                    {(result.scope3 / 1000).toFixed(1)} t CO₂-e
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Information */}
          <Card className="bg-green-50 dark:bg-green-950/30">
            <CardContent className="pt-4">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                GHG Protocol Compliance
              </h4>
              <p className="text-sm text-green-700 dark:text-green-200">
                This calculation follows the GHG Protocol Corporate Accounting and Reporting Standard. 
                Scope 1 and 2 emissions are typically required for mandatory reporting, while Scope 3 
                emissions are increasingly important for comprehensive sustainability reporting.
              </p>
            </CardContent>
          </Card>

          {/* Reduction Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emission Reduction Priorities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.scope3 > result.scope1 + result.scope2 && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium">Focus on Supply Chain (Scope 3)</h5>
                      <p className="text-sm text-muted-foreground">
                        Scope 3 represents the largest portion. Engage suppliers for sustainable materials and optimized logistics.
                      </p>
                    </div>
                  </div>
                )}
                
                {result.scope2 > result.scope1 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium">Switch to Renewable Energy (Scope 2)</h5>
                      <p className="text-sm text-muted-foreground">
                        Consider solar panels, wind energy, or green electricity contracts to reduce Scope 2 emissions.
                      </p>
                    </div>
                  </div>
                )}
                
                {result.scope1 > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium">Improve Energy Efficiency (Scope 1)</h5>
                      <p className="text-sm text-muted-foreground">
                        Upgrade equipment, improve insulation, or switch to electric alternatives for direct fuel use.
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