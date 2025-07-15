
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { MaterialInput } from '@/lib/carbonExports';
import { useGrok } from '@/contexts/GrokContext';
import { materialOptimizationService, MaterialAlternative } from '@/services/sustainability/MaterialOptimizationService';
import { toast } from 'sonner';

interface MaterialAlternativesProps {
  material: MaterialInput;
  onAlternativeSelect?: (alternative: MaterialAlternative) => void;
  className?: string;
}

const MaterialAlternatives: React.FC<MaterialAlternativesProps> = ({
  material,
  onAlternativeSelect,
  className
}) => {
  const { isConfigured, isProcessing } = useGrok();
  const [alternatives, setAlternatives] = useState<MaterialAlternative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grokContext = useGrok();

  const loadAlternatives = async (criteria?: {
    prioritizeCarbonReduction?: boolean;
    prioritizeCost?: boolean;
    maintainPerformance?: boolean;
    localAvailability?: boolean;
  }) => {
    if (!isConfigured) {
      toast.error("Grok AI is not configured", {
        description: "Please configure the AI assistant in settings"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      materialOptimizationService.setGrokContext(grokContext);
      
      const alternativesList = await materialOptimizationService.getMaterialAlternatives(
        material,
        criteria || { prioritizeCarbonReduction: true }
      );

      setAlternatives(alternativesList);
      
      toast.success(`Found ${alternativesList.length} alternatives`, {
        description: "AI analysis complete"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load alternatives";
      setError(errorMessage);
      toast.error("Failed to load alternatives", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCostIcon = (costImpact: string) => {
    switch (costImpact) {
      case 'lower': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'higher': return <TrendingUp className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      case 'Low': return 'destructive';
      default: return 'outline';
    }
  };

  const getComplianceIcon = (compliant: boolean) => {
    return compliant ? 
      <CheckCircle className="h-3 w-3 text-green-500" /> : 
      <AlertTriangle className="h-3 w-3 text-amber-500" />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Material Alternatives</CardTitle>
            <CardDescription>
              AI-powered sustainable alternatives for {material.name || material.type}
            </CardDescription>
          </div>
          <Badge variant={isConfigured ? "outline" : "destructive"}>
            {isConfigured ? "AI Ready" : "Not Configured"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 rounded-md mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="mt-2"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Current Material Summary */}
        <Card className="mb-4 bg-muted/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">Current Material</h3>
              <Badge variant="outline">
                {material.carbonFootprint?.toFixed(2)} kg CO₂e
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {material.name || material.type} - {material.quantity} {material.unit}
            </p>
          </CardContent>
        </Card>

        {/* Search Criteria Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadAlternatives({ prioritizeCarbonReduction: true })}
            disabled={isLoading || isProcessing || !isConfigured}
          >
            Carbon Focus
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadAlternatives({ prioritizeCost: true })}
            disabled={isLoading || isProcessing || !isConfigured}
          >
            Cost Focus
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadAlternatives({ maintainPerformance: true })}
            disabled={isLoading || isProcessing || !isConfigured}
          >
            Performance Focus
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadAlternatives({ localAvailability: true })}
            disabled={isLoading || isProcessing || !isConfigured}
          >
            Local Focus
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-carbon-500" />
            <p className="text-sm text-muted-foreground">
              Analyzing alternatives with AI...
            </p>
          </div>
        )}

        {/* No Alternatives State */}
        {!isLoading && alternatives.length === 0 && !error && (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Alternatives Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click one of the focus buttons above to search for sustainable alternatives
            </p>
          </div>
        )}

        {/* Alternatives List */}
        {alternatives.length > 0 && (
          <div className="space-y-4">
            {alternatives.map((alternative, index) => (
              <Card key={alternative.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{alternative.name}</h3>
                      <p className="text-sm text-muted-foreground">{alternative.type}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      -{alternative.carbonReduction}% CO₂
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      {getCostIcon(alternative.costImpact)}
                      <span className="text-sm">Cost {alternative.costImpact}</span>
                    </div>
                    
                    <div>
                      <Badge variant={getAvailabilityColor(alternative.availability)} className="text-xs">
                        {alternative.availability} availability
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {getComplianceIcon(alternative.complianceStatus.ncc)}
                      <span className="text-xs">NCC</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {getComplianceIcon(alternative.complianceStatus.nabers)}
                      <span className="text-xs">NABERS</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Benefits</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {alternative.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {alternative.considerations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Considerations</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {alternative.considerations.map((consideration, considerationIndex) => (
                            <li key={considerationIndex} className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                              {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-muted-foreground">
                        Est. savings: {alternative.estimatedSavings.co2.toFixed(2)} kg CO₂e
                      </div>
                      {onAlternativeSelect && (
                        <Button 
                          size="sm" 
                          onClick={() => onAlternativeSelect(alternative)}
                          className="h-8"
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Select
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialAlternatives;
