import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { EnhancedCalculatorResults } from '../enhanced';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import ComplianceFlag from '@/components/ui/compliance-flag';
import EmbodiedCarbonClassifier from '@/components/ui/embodied-carbon-classifier';
import MaterialComparisonToggle from '@/components/ui/material-comparison-toggle';
import ErrorBoundaryWrapper from '@/components/error/ErrorBoundaryWrapper';

interface GreenStarCalculatorProps {
  onCalculationUpdate: (data: GreenStarData) => void;
}

interface GreenStarData {
  totalPoints: number;
  starRating: number;
  certificationLevel: string;
  carbonPerformance: number;
  percentage: number;
  categoryBreakdown: Record<string, number>;
  materialEmissions?: number;
  transportEmissions?: number;
  energyEmissions?: number;
}

export const GreenStarCalculator: React.FC<GreenStarCalculatorProps> = ({ onCalculationUpdate }) => {
  const [inputs, setInputs] = useState({
    management: 0,
    ieq: 0,        // Indoor Environment Quality
    energy: 0,
    transport: 0,
    water: 0,
    materials: 0,
    land: 0,
    emissions: 0
  });

  const [results, setResults] = useState<GreenStarData | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<ExtendedMaterialData[]>([]);
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  const categoryDetails = {
    management: { name: 'Management', maxPoints: 12, description: 'Project management and commissioning' },
    ieq: { name: 'Indoor Environment Quality', maxPoints: 17, description: 'Indoor air quality, lighting, and comfort' },
    energy: { name: 'Energy', maxPoints: 25, description: 'Energy efficiency and renewable energy' },
    transport: { name: 'Transport', maxPoints: 8, description: 'Public transport and sustainable transport' },
    water: { name: 'Water', maxPoints: 12, description: 'Water efficiency and management' },
    materials: { name: 'Materials', maxPoints: 15, description: 'Sustainable and recycled materials' },
    land: { name: 'Land Use & Ecology', maxPoints: 6, description: 'Biodiversity and ecological value' },
    emissions: { name: 'Emissions', maxPoints: 5, description: 'Greenhouse gas emissions reduction' }
  };

  const calculateGreenStar = () => {
    const { management, ieq, energy, transport, water, materials, land, emissions } = inputs;

    const totalPoints = management + ieq + energy + transport + water + materials + land + emissions;
    const maxPoints = 100; // Total possible points
    const percentage = (totalPoints / maxPoints) * 100;

    // Determine star rating
    let starRating = 0;
    let certificationLevel = 'Not Certified';

    if (percentage >= 75) {
      starRating = 6;
      certificationLevel = '6 Star Green Star';
    } else if (percentage >= 60) {
      starRating = 5;
      certificationLevel = '5 Star Green Star';
    } else if (percentage >= 45) {
      starRating = 4;
      certificationLevel = '4 Star Green Star';
    } else if (percentage >= 30) {
      starRating = 3;
      certificationLevel = '3 Star Green Star';
    } else if (percentage >= 15) {
      starRating = 2;
      certificationLevel = '2 Star Green Star';
    } else if (percentage >= 10) {
      starRating = 1;
      certificationLevel = '1 Star Green Star';
    }

    const carbonPerformance = energy + emissions; // Carbon-related points

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {
      'Management': management,
      'Indoor Environment Quality': ieq,
      'Energy': energy,
      'Transport': transport,
      'Water': water,
      'Materials': materials,
      'Land Use & Ecology': land,
      'Emissions': emissions
    };

    const calculationResults: GreenStarData = {
      totalPoints,
      starRating,
      certificationLevel,
      carbonPerformance,
      percentage,
      categoryBreakdown,
      materialEmissions: materials * 50, // 15 points max * factor
      transportEmissions: transport * 30, // 8 points max * factor
      energyEmissions: energy * 25 // 25 points max
    };

    setResults(calculationResults);
    onCalculationUpdate(calculationResults);
  };

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    const maxValue = categoryDetails[field].maxPoints;
    
    setInputs(prev => ({
      ...prev,
      [field]: Math.min(numValue, maxValue) // Cap at maximum points for category
    }));
  };

  const getStarColor = (rating: number) => {
    if (rating >= 5) return 'text-green-600';
    if (rating >= 4) return 'text-blue-600';
    if (rating >= 3) return 'text-warning';
    if (rating >= 2) return 'text-orange-600';
    if (rating >= 1) return 'text-red-600';
    return 'text-gray-400';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(6)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating
                ? `fill-current ${getStarColor(rating)}`
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating} star{rating !== 1 ? 's' : ''}</span>
      </div>
    );
  };

  return (
    <ErrorBoundaryWrapper feature="Green Star Calculator">
      <div className="space-y-6">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Green Building Council of Australia (GBCA) Green Star
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(categoryDetails).map(([key, details]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`greenstar-${key}`} className="text-sm font-medium">
                    {details.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Max: {details.maxPoints} points
                  </span>
                </div>
                <Input
                  id={`greenstar-${key}`}
                  type="number"
                  value={inputs[key as keyof typeof inputs] || ''}
                  onChange={(e) => handleInputChange(key as keyof typeof inputs, e.target.value)}
                  placeholder={`Enter points (0-${details.maxPoints})`}
                  min="0"
                  max={details.maxPoints}
                />
                <p className="text-xs text-muted-foreground">{details.description}</p>
              </div>
            ))}
          </div>

          <Button onClick={calculateGreenStar} className="w-full">
            Calculate Green Star Rating
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* Green Star Results with Enhanced Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Green Star Results
                <div className="flex items-center gap-2">
                  <ComplianceFlag 
                    standard="greenstar" 
                    status={results.starRating >= 5 ? 'compliant' : results.starRating >= 4 ? 'warning' : 'breach'}
                  />
                  <EmbodiedCarbonClassifier 
                    carbonIntensity={results.carbonPerformance}
                    size="sm"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Total Points</div>
                  <div className="text-2xl font-bold text-primary">
                    {results.totalPoints}/100
                  </div>
                  <div className="text-xs text-muted-foreground">{results.percentage.toFixed(1)}%</div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">Star Rating</div>
                  {renderStars(results.starRating)}
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Certification Level</div>
                  <div className={`text-lg font-bold ${getStarColor(results.starRating)}`}>
                    {results.certificationLevel}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Carbon Performance</div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.carbonPerformance}/30
                  </div>
                  <div className="text-xs text-green-600">Energy + Emissions points</div>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Green Star Material Comparison */}
          <MaterialComparisonToggle
            baseMaterial={{
              name: 'Green Star Materials Selection',
              carbon_footprint_kgco2e_kg: results.carbonPerformance / 5
            }}
            alternatives={[]}
            onToggleComparison={setComparisonEnabled}
            comparisonEnabled={comparisonEnabled}
            onSelectAlternative={(material) => {
              console.log('Selected Green Star material alternative:', material);
            }}
          />

          {/* Enhanced Calculator Results */}
          <EnhancedCalculatorResults
            result={{
              totalEmissions: results.carbonPerformance * 1000, // Convert to kg for display
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
              breakdownByEnergy: { renewable: results.energyEmissions || 0 }
            }}
            materials={selectedMaterials}
            onMaterialSelect={(material) => {
              console.log('Selected Green Star material for optimization:', material);
            }}
          />

          <Card className="p-4">
            <h4 className="font-semibold mb-4">Category Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(results.categoryBreakdown).map(([category, points]) => {
                const categoryKey = Object.keys(categoryDetails).find(key => 
                  categoryDetails[key as keyof typeof categoryDetails].name === category
                ) as keyof typeof categoryDetails;
                const maxPoints = categoryKey ? categoryDetails[categoryKey].maxPoints : 1;
                const percentage = (points / maxPoints) * 100;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm font-bold text-primary">{points}/{maxPoints}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(0)}% of category maximum
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Green Star Rating System</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">Star Rating Thresholds:</h5>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>6 Star - World Leadership:</span>
                    <span className="font-medium">75%+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5 Star - Australian Excellence:</span>
                    <span className="font-medium">60-74%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4 Star - Best Practice:</span>
                    <span className="font-medium">45-59%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1-3 Star - Good Practice:</span>
                    <span className="font-medium">10-44%</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-medium mb-2">High Impact Categories:</h5>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Energy (25 points) - largest impact category</li>
                  <li>• Indoor Environment Quality (17 points)</li>
                  <li>• Materials (15 points) - sustainable sourcing</li>
                  <li>• Water (12 points) - efficiency and conservation</li>
                  <li>• Management (12 points) - project delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundaryWrapper>
  );
};