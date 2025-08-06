import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Factory, 
  Truck, 
  Zap, 
  Leaf, 
  Target,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';
import type { CalculatorActions } from './hooks/useCalculatorActions';

interface CalculatorDashboardProps {
  calculator: CalculatorState;
  actions: CalculatorActions;
}

export const CalculatorDashboard: React.FC<CalculatorDashboardProps> = ({
  calculator,
  actions
}) => {
  const { materials, transport, energy, result, complianceScore } = calculator;

  const getComplianceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'bg-green-500', icon: CheckCircle };
    if (score >= 70) return { level: 'Good', color: 'bg-blue-500', icon: CheckCircle };
    if (score >= 50) return { level: 'Fair', color: 'bg-yellow-500', icon: AlertTriangle };
    return { level: 'Poor', color: 'bg-red-500', icon: AlertTriangle };
  };

  const compliance = getComplianceLevel(complianceScore);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {result ? (result.totalEmissions / 1000).toFixed(1) : '0.0'} t CO₂-e
            </div>
            <p className="text-xs text-muted-foreground">
              Carbon footprint assessment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {result ? (result.materialEmissions / 1000).toFixed(1) : '0.0'} t CO₂-e
            </div>
            <p className="text-xs text-muted-foreground">
              {materials.length} material{materials.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transport</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {result ? (result.transportEmissions / 1000).toFixed(1) : '0.0'} t CO₂-e
            </div>
            <p className="text-xs text-muted-foreground">
              {transport.length} route{transport.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {result ? (result.energyEmissions / 1000).toFixed(1) : '0.0'} t CO₂-e
            </div>
            <p className="text-xs text-muted-foreground">
              {energy.length} source{energy.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <compliance.icon className={`h-6 w-6 text-white`} />
              <div>
                <div className="text-2xl font-bold">{complianceScore}%</div>
                <Badge variant="outline" className={`${compliance.color} text-white`}>
                  {compliance.level}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Target: 80%</div>
              <div className="text-sm text-muted-foreground">NCC 2025 Compliant</div>
            </div>
          </div>
          <Progress value={complianceScore} className="w-full" />
        </CardContent>
      </Card>

      {/* Scope Breakdown */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Emission Scopes Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Scope 1 (Direct)</span>
                  <span className="text-sm">{(result.scope1 / 1000).toFixed(1)} t CO₂-e</span>
                </div>
                <Progress 
                  value={(result.scope1 / result.totalEmissions) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Scope 2 (Electricity)</span>
                  <span className="text-sm">{(result.scope2 / 1000).toFixed(1)} t CO₂-e</span>
                </div>
                <Progress 
                  value={(result.scope2 / result.totalEmissions) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Scope 3 (Indirect)</span>
                  <span className="text-sm">{(result.scope3 / 1000).toFixed(1)} t CO₂-e</span>
                </div>
                <Progress 
                  value={(result.scope3 / result.totalEmissions) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>Add Materials</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>Add Transport</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>Add Energy</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Switch to Low-Carbon Materials</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider recycled concrete and sustainable timber alternatives
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Optimize Transport Routes</h4>
                  <p className="text-sm text-muted-foreground">
                    Consolidate deliveries and choose local suppliers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Increase Renewable Energy</h4>
                  <p className="text-sm text-muted-foreground">
                    Solar panels could reduce Scope 2 emissions by 40%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};