
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Leaf, 
  Target, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { MaterialInput } from '@/lib/carbonExports';
import { useGrok } from '@/contexts/GrokContext';
import { materialOptimizationService, ProjectOptimizationReport } from '@/services/sustainability/MaterialOptimizationService';
import { toast } from 'sonner';

interface MaterialOptimizationPanelProps {
  materials: MaterialInput[];
  onOptimizationComplete?: (report: ProjectOptimizationReport) => void;
  className?: string;
}

const MaterialOptimizationPanel: React.FC<MaterialOptimizationPanelProps> = ({
  materials,
  onOptimizationComplete,
  className
}) => {
  const { isConfigured, isProcessing } = useGrok();
  const [optimizationReport, setOptimizationReport] = useState<ProjectOptimizationReport | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grokContext = useGrok();

  const runOptimization = async () => {
    if (!isConfigured) {
      toast.error("Grok AI is not configured", {
        description: "Please configure the AI assistant in settings"
      });
      return;
    }

    if (!materials || materials.length === 0) {
      toast.error("No materials to optimize", {
        description: "Please add materials to your project first"
      });
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      // Set the Grok context in the service
      materialOptimizationService.setGrokContext(grokContext);

      const report = await materialOptimizationService.optimizeProjectMaterials(materials, {
        projectType: 'Commercial Construction',
        sustainabilityTargets: ['Net Zero Carbon', 'NABERS 5-Star'],
        complianceRequirements: ['NCC 2025', 'NABERS']
      });

      setOptimizationReport(report);
      
      if (onOptimizationComplete) {
        onOptimizationComplete(report);
      }

      toast.success("Optimization complete", {
        description: `Found ${report.recommendations.length} recommendations for improvement`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to optimize materials";
      setError(errorMessage);
      toast.error("Optimization failed", {
        description: errorMessage
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'carbon_reduction': return <Leaf className="h-4 w-4" />;
      case 'cost_optimization': return <TrendingUp className="h-4 w-4" />;
      case 'compliance': return <CheckCircle className="h-4 w-4" />;
      case 'sustainability': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-carbon-600" />
              AI Material Optimization
            </CardTitle>
            <CardDescription>
              Advanced AI analysis to optimize your materials for sustainability and compliance
            </CardDescription>
          </div>
          <Badge variant={isConfigured ? "outline" : "destructive"}>
            {isConfigured ? "AI Ready" : "Not Configured"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setError(null)}
                className="ml-2"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!optimizationReport ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-carbon-100 dark:bg-carbon-800 flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-carbon-500" />
            </div>
            <h3 className="font-medium mb-2">Ready for Optimization</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze your materials with AI to discover optimization opportunities
            </p>
            <Button 
              onClick={runOptimization}
              disabled={isOptimizing || isProcessing || !materials || materials.length === 0 || !isConfigured}
              size="lg"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Start AI Optimization
                </>
              )}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>
              <Button 
                variant="outline" 
                size="sm"
                onClick={runOptimization}
                disabled={isOptimizing || isProcessing}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-optimize
              </Button>
            </div>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                        <p className="text-2xl font-bold">{optimizationReport.overallScore}/100</p>
                      </div>
                      <Target className="h-8 w-8 text-carbon-600" />
                    </div>
                    <Progress value={optimizationReport.overallScore} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">CO₂ Reduction</p>
                        <p className="text-2xl font-bold">{optimizationReport.potentialCO2Reduction}</p>
                        <p className="text-xs text-muted-foreground">kg CO₂e potential</p>
                      </div>
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Recommendations</p>
                        <p className="text-2xl font-bold">{optimizationReport.recommendations.length}</p>
                        <p className="text-xs text-muted-foreground">optimization opportunities</p>
                      </div>
                      <Lightbulb className="h-8 w-8 text-amber-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Optimization Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {optimizationReport.summary}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {optimizationReport.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(rec.category)}
                        <h3 className="font-medium">{rec.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getPriorityColor(rec.priority)}>
                          {rec.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {rec.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Impact:</h4>
                        <p className="text-sm text-muted-foreground">{rec.impact}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Timeframe:</h4>
                        <p className="text-sm text-muted-foreground">{rec.timeframe}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Implementation Steps:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.implementationSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">High Impact Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {optimizationReport.materialAnalysis.highImpactMaterials.map((material, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">{material}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sustainable Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {optimizationReport.materialAnalysis.sustainableMaterials.map((material, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{material}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Improvement Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimizationReport.materialAnalysis.improvementAreas.map((area, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-carbon-600" />
                        <span className="text-sm">{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">NCC 2025 Gaps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {optimizationReport.complianceImprovement.nccGaps.map((gap, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">NABERS Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {optimizationReport.complianceImprovement.nabersOpportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialOptimizationPanel;
