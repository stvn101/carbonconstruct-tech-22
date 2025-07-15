import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import EmbodiedCarbonClassifier from './embodied-carbon-classifier';

interface MaterialComparisonData {
  material: ExtendedMaterialData;
  isSelected?: boolean;
  isAlternative?: boolean;
  potentialSaving?: number; // percentage reduction
  availabilityScore?: number; // 0-100
}

interface MaterialComparisonToggleProps {
  baseMaterial: ExtendedMaterialData;
  alternatives?: ExtendedMaterialData[];
  industryBenchmark?: {
    averageCarbon: number;
    percentileBetter: number;
  };
  onToggleComparison: (enabled: boolean) => void;
  onSelectAlternative?: (material: ExtendedMaterialData) => void;
  comparisonEnabled?: boolean;
  className?: string;
}

const MaterialComparisonToggle: React.FC<MaterialComparisonToggleProps> = ({
  baseMaterial,
  alternatives = [],
  industryBenchmark,
  onToggleComparison,
  onSelectAlternative,
  comparisonEnabled = false,
  className
}) => {
  const [selectedAlternatives, setSelectedAlternatives] = useState<string[]>([]);

  const baseCarbon = baseMaterial.carbon_footprint_kgco2e_kg || baseMaterial.factor || 0;
  
  const calculateSaving = (altCarbon: number) => {
    if (baseCarbon === 0) return 0;
    return Math.max(0, ((baseCarbon - altCarbon) / baseCarbon) * 100);
  };

  const toggleAlternativeSelection = (materialId: string) => {
    setSelectedAlternatives(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Material Comparison</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Compare alternatives</span>
            <Switch
              checked={comparisonEnabled}
              onCheckedChange={onToggleComparison}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Base Material */}
        <div className="p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-sm">Current Selection</div>
            <EmbodiedCarbonClassifier 
              carbonIntensity={baseCarbon}
              size="sm"
            />
          </div>
          <div className="text-lg font-semibold">{baseMaterial.name}</div>
          <div className="text-sm text-muted-foreground">
            {baseCarbon.toFixed(2)} kg CO₂e/kg
          </div>
        </div>

        {comparisonEnabled && (
          <>
            {/* Industry Benchmark */}
            {industryBenchmark && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Industry Benchmark</div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <div className="text-sm font-medium">Industry Average</div>
                    <div className="text-xs text-muted-foreground">
                      {industryBenchmark.averageCarbon.toFixed(2)} kg CO₂e/kg
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {baseCarbon < industryBenchmark.averageCarbon ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      )}
                      <Badge 
                        variant="secondary"
                        className={baseCarbon < industryBenchmark.averageCarbon ? 'text-green-700' : 'text-red-700'}
                      >
                        {industryBenchmark.percentileBetter}% better
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Alternative Materials */}
            {alternatives.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Alternative Materials</div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alternatives.map((alt) => {
                    const altCarbon = alt.carbon_footprint_kgco2e_kg || alt.factor || 0;
                    const saving = calculateSaving(altCarbon);
                    const isSelected = selectedAlternatives.includes(alt.id || '');
                    
                    return (
                      <div
                        key={alt.id}
                        className={cn(
                          'p-3 rounded-lg border transition-all cursor-pointer',
                          isSelected 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-card hover:bg-muted/50'
                        )}
                        onClick={() => alt.id && toggleAlternativeSelection(alt.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">{alt.name}</div>
                          <div className="flex items-center gap-2">
                            <EmbodiedCarbonClassifier 
                              carbonIntensity={altCarbon}
                              size="sm"
                            />
                            {saving > 0 && (
                              <Badge variant="outline" className="text-green-700 border-green-300">
                                -{saving.toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{altCarbon.toFixed(2)} kg CO₂e/kg</span>
                          {saving > 0 && (
                            <span className="text-green-600 font-medium">
                              Save {(baseCarbon - altCarbon).toFixed(2)} kg CO₂e/kg
                            </span>
                          )}
                        </div>

                        {/* Potential Impact Bar */}
                        {saving > 0 && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Carbon Reduction</span>
                              <span>{saving.toFixed(0)}%</span>
                            </div>
                            <Progress value={Math.min(saving, 100)} className="h-1" />
                          </div>
                        )}

                        {/* Action Buttons */}
                        {isSelected && (
                          <div className="mt-3 flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectAlternative?.(alt);
                              }}
                              className="flex-1"
                            >
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Select This Material
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Could open detailed comparison modal
                              }}
                            >
                              <BarChart3 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {alternatives.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No alternatives available</div>
                <div className="text-xs">Check the material database for similar options</div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialComparisonToggle;