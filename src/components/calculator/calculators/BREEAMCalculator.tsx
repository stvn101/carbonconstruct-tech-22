import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { EnhancedCalculatorResults } from '../enhanced';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import ScopeBadge from '@/components/ui/scope-badge';
import ComplianceFlag from '@/components/ui/compliance-flag';
import EmbodiedCarbonClassifier from '@/components/ui/embodied-carbon-classifier';

interface BREEAMCalculatorProps {
  onCalculationUpdate: (data: BREEAMData) => void;
}

interface BREEAMData {
  totalScore: number;
  rating: string;
  carbonReduction: number;
  improvementAreas: number;
  categoryScores: Record<string, number>;
  weightedScore: number;
  materialEmissions?: number;
  transportEmissions?: number;
  energyEmissions?: number;
}

interface BREEAMCategory {
  id: string;
  name: string;
  weight: number;
  description: string;
  score: number;
}

export const BREEAMCalculator: React.FC<BREEAMCalculatorProps> = ({ onCalculationUpdate }) => {
  const [categories, setCategories] = useState<BREEAMCategory[]>([
    { id: 'management', name: 'Management', weight: 0.12, description: 'Project management and commissioning', score: 50 },
    { id: 'health', name: 'Health & Wellbeing', weight: 0.15, description: 'Indoor environment and occupant comfort', score: 50 },
    { id: 'energy', name: 'Energy', weight: 0.19, description: 'Energy efficiency and carbon emissions', score: 50 },
    { id: 'transport', name: 'Transport', weight: 0.08, description: 'Transport accessibility and impact', score: 50 },
    { id: 'water', name: 'Water', weight: 0.06, description: 'Water consumption and efficiency', score: 50 },
    { id: 'materials', name: 'Materials', weight: 0.125, description: 'Material sustainability and lifecycle', score: 50 },
    { id: 'waste', name: 'Waste', weight: 0.075, description: 'Waste management and reduction', score: 50 },
    { id: 'land', name: 'Land Use & Ecology', weight: 0.10, description: 'Biodiversity and land impact', score: 50 },
    { id: 'pollution', name: 'Pollution', weight: 0.10, description: 'Air and water pollution prevention', score: 50 },
    { id: 'innovation', name: 'Innovation', weight: 0.10, description: 'Innovation and exemplary performance', score: 50 }
  ]);

  const [results, setResults] = useState<BREEAMData | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<ExtendedMaterialData[]>([]);

  const calculateBREEAM = () => {
    // Calculate weighted score (BREEAM weightings)
    const weightedScore = categories.reduce((sum, category) => 
      sum + (category.score * category.weight), 0
    );

    // Determine BREEAM rating
    let rating = 'Unclassified';
    if (weightedScore >= 85) {
      rating = 'Outstanding';
    } else if (weightedScore >= 70) {
      rating = 'Excellent';
    } else if (weightedScore >= 55) {
      rating = 'Very Good';
    } else if (weightedScore >= 45) {
      rating = 'Good';
    } else if (weightedScore >= 30) {
      rating = 'Pass';
    }

    const carbonReduction = weightedScore * 0.8; // Estimated % reduction
    const improvementAreas = Math.max(0, 3 - Math.floor(weightedScore / 30));

    // Category scores
    const categoryScores: Record<string, number> = {};
    categories.forEach(category => {
      categoryScores[category.name] = category.score;
    });

    const calculationResults: BREEAMData = {
      totalScore: weightedScore,
      rating,
      carbonReduction,
      improvementAreas,
      categoryScores,
      weightedScore,
      materialEmissions: weightedScore * 12.5, // Materials category weight
      transportEmissions: weightedScore * 8, // Transport category weight
      energyEmissions: weightedScore * 19 // Energy category weight
    };

    setResults(calculationResults);
    onCalculationUpdate(calculationResults);
  };

  const handleCategoryScoreChange = (categoryId: string, value: number[]) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, score: value[0] } : category
    ));
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Outstanding': return 'text-purple-700 dark:text-purple-400';
      case 'Excellent': return 'text-green-700 dark:text-green-400';
      case 'Very Good': return 'text-blue-700 dark:text-blue-400';
      case 'Good': return 'text-yellow-700 dark:text-yellow-400';
      case 'Pass': return 'text-orange-700 dark:text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case 'Outstanding': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-300';
      case 'Excellent': return 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-300';
      case 'Very Good': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300';
      case 'Good': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300';
      case 'Pass': return 'bg-orange-100 text-orange-800 dark:bg-orange-950/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            BREEAM International Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Label className="text-base font-semibold">
                    {category.name} ({(category.weight * 100).toFixed(1)}% weighting)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-primary">{category.score}%</div>
                </div>
              </div>
              <Slider
                value={[category.score]}
                onValueChange={(value) => handleCategoryScoreChange(category.id, value)}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          ))}

          <Button onClick={calculateBREEAM} className="w-full">
            Calculate BREEAM Rating
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* BREEAM Results with Enhanced Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                BREEAM Assessment Results
                <div className="flex items-center gap-2">
                  <ComplianceFlag 
                    standard="greenstar" 
                    status={results.weightedScore >= 70 ? 'compliant' : results.weightedScore >= 55 ? 'warning' : 'breach'}
                  />
                  <EmbodiedCarbonClassifier 
                    carbonIntensity={results.carbonReduction}
                    size="sm"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                  <div className="text-2xl font-bold text-primary">
                    {results.weightedScore.toFixed(1)}%
                  </div>
                  <ScopeBadge scope="combined" size="sm" showTooltip={false} />
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">BREEAM Rating</div>
                  <div className={`text-2xl font-bold ${getRatingColor(results.rating)}`}>
                    {results.rating}
                  </div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${getRatingBadgeColor(results.rating)}`}>
                    {results.rating}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Carbon Reduction</div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.carbonReduction.toFixed(1)}%
                  </div>
                  <div className="text-xs text-green-600">Estimated impact</div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Improvement Areas</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {results.improvementAreas}
                  </div>
                  <div className="text-xs text-orange-600">Categories to focus on</div>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Calculator Results */}
          <EnhancedCalculatorResults
            result={{
              totalEmissions: results.carbonReduction * 1000, // Convert % to kg for display
              materialEmissions: results.materialEmissions || 0,
              transportEmissions: results.transportEmissions || 0,
              energyEmissions: results.energyEmissions || 0,
              breakdown: {
                materials: results.materialEmissions || 0,
                transport: results.transportEmissions || 0,
                energy: results.energyEmissions || 0,
              },
              breakdownByMaterial: {},
              breakdownByTransport: {},
              breakdownByEnergy: { efficiency: results.energyEmissions || 0 }
            }}
            materials={selectedMaterials}
            onMaterialSelect={(material) => {
              console.log('Selected BREEAM material for optimization:', material);
            }}
          />

          <Card className="p-4">
            <h4 className="font-semibold mb-4">Category Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm font-bold text-primary">{category.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Weight: {(category.weight * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">BREEAM Rating Scales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">Rating Thresholds:</h5>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Outstanding:</span>
                    <span className="font-medium">≥85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excellent:</span>
                    <span className="font-medium">70-84%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Very Good:</span>
                    <span className="font-medium">55-69%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Good:</span>
                    <span className="font-medium">45-54%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pass:</span>
                    <span className="font-medium">30-44%</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-medium mb-2">Key Focus Areas:</h5>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Energy (19% weighting) - highest impact category</li>
                  <li>• Health & Wellbeing (15%) - occupant comfort</li>
                  <li>• Materials (12.5%) - sustainable sourcing</li>
                  <li>• Management (12%) - project delivery quality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};