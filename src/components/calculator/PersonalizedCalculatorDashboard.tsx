import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalculatorTemplateSelector } from './templates/CalculatorTemplateSelector';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Calculator,
  Star,
  Activity
} from 'lucide-react';

interface PersonalizedCalculatorDashboardProps {
  totalEmissions: number;
  complianceScore: number;
  insights: any;
  complianceCheck: any;
  recommendedMaterials: string[];
  onApplyDefaults: (calculatorType: string) => void;
  calculationHistory: any[];
  isApplyingDefaults: boolean;
  onTemplateSelect: (template: any) => void;
  userFocusAreas?: string[];
}

export const PersonalizedCalculatorDashboard: React.FC<PersonalizedCalculatorDashboardProps> = ({
  totalEmissions,
  complianceScore,
  insights,
  complianceCheck,
  recommendedMaterials,
  onApplyDefaults,
  calculationHistory,
  isApplyingDefaults,
  onTemplateSelect,
  userFocusAreas = []
}) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Emissions</p>
                <p className="text-2xl font-bold">
                  {(totalEmissions / 1000).toFixed(1)} t CO₂-e
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold">{complianceScore}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Calculations</p>
                <p className="text-2xl font-bold">{calculationHistory.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">
                    {insights?.improvement?.toFixed(1) || '0'}%
                  </p>
                  {insights?.isImprovement ? (
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              <Star className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Your Average Emissions</span>
                <span className="font-medium">
                  {(insights.averageEmissions / 1000).toFixed(1)} t CO₂-e
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Calculation</span>
                <span className="font-medium">
                  {(insights.currentEmissions / 1000).toFixed(1)} t CO₂-e
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Improvement from Average</span>
                  <Badge variant={insights.isImprovement ? "default" : "destructive"}>
                    {insights.isImprovement ? '-' : '+'}{Math.abs(insights.improvement).toFixed(1)}%
                  </Badge>
                </div>
                <Progress 
                  value={Math.min(Math.abs(insights.improvement), 100)} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Alerts */}
      {complianceCheck && complianceCheck.exceeded && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Compliance Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Your calculation exceeds the threshold by{' '}
                <span className="font-medium">
                  {(complianceCheck.exceedance / 1000).toFixed(1)} t CO₂-e
                </span>
                ({complianceCheck.percentage.toFixed(1)}% over limit)
              </p>
              <p className="text-xs text-muted-foreground">
                Target: {(complianceCheck.threshold / 1000).toFixed(1)} t CO₂-e
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Access Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Quick Access Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['lca', 'scope', 'green_star', 'nabers'].map((calculatorType) => (
              <Button
                key={calculatorType}
                variant="outline"
                size="sm"
                onClick={() => onApplyDefaults(calculatorType)}
                disabled={isApplyingDefaults}
                className="justify-start"
              >
                Apply {calculatorType.toUpperCase()} Defaults
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Materials */}
      {recommendedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recommendedMaterials.map((material, index) => (
                <Badge key={index} variant="secondary">
                  {material.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on your focus areas and sustainability preferences
            </p>
          </CardContent>
        </Card>
      )}

      {/* Calculator Templates */}
      <CalculatorTemplateSelector
        onSelectTemplate={onTemplateSelect}
        userFocusAreas={userFocusAreas}
        recentTemplates={[]}
      />

      {/* Recent Calculation Trends */}
      {calculationHistory.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Calculation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calculationHistory.slice(0, 3).map((calc) => (
                <div key={calc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">
                      {calc.calculator_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(calc.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {calc.carbon_footprint ? (calc.carbon_footprint / 1000).toFixed(1) : 'N/A'} t CO₂-e
                    </div>
                    <Badge 
                      variant={calc.compliance_status === 'compliant' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {calc.compliance_status || 'unknown'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};