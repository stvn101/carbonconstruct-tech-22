import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { EnhancedCalculatorResults } from '../enhanced';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import ComplianceFlag from '@/components/ui/compliance-flag';
import EmbodiedCarbonClassifier from '@/components/ui/embodied-carbon-classifier';
import MaterialComparisonToggle from '@/components/ui/material-comparison-toggle';

interface LEEDCalculatorProps {
  onCalculationUpdate: (data: LEEDData) => void;
}

interface LEEDData {
  totalPoints: number;
  certificationLevel: string;
  pointsToGold: number;
  carbonImpact: number;
  categoryBreakdown: Record<string, number>;
  materialEmissions?: number;
  transportEmissions?: number;
  energyEmissions?: number;
}

interface LEEDItem {
  id: string;
  name: string;
  points: number;
  category: string;
  checked: boolean;
}

export const LEEDCalculator: React.FC<LEEDCalculatorProps> = ({ onCalculationUpdate }) => {
  const [leedItems, setLeedItems] = useState<LEEDItem[]>([
    { id: 'site-selection', name: 'Sustainable Site Selection', points: 1, category: 'Sustainable Sites', checked: false },
    { id: 'brownfield', name: 'Brownfield Redevelopment', points: 1, category: 'Sustainable Sites', checked: false },
    { id: 'public-transport', name: 'Public Transportation Access', points: 5, category: 'Location & Transportation', checked: false },
    { id: 'water-reduction', name: 'Water Use Reduction', points: 4, category: 'Water Efficiency', checked: false },
    { id: 'rainwater', name: 'Rainwater Management', points: 3, category: 'Water Efficiency', checked: false },
    { id: 'commissioning', name: 'Enhanced Commissioning', points: 6, category: 'Energy & Atmosphere', checked: false },
    { id: 'energy-performance', name: 'Optimize Energy Performance', points: 18, category: 'Energy & Atmosphere', checked: false },
    { id: 'renewable', name: 'Renewable Energy Production', points: 3, category: 'Energy & Atmosphere', checked: false },
    { id: 'recycled-content', name: 'Recycled Content Materials', points: 2, category: 'Materials & Resources', checked: false },
    { id: 'regional-materials', name: 'Regional Materials', points: 2, category: 'Materials & Resources', checked: false },
    { id: 'indoor-air', name: 'Enhanced Indoor Air Quality', points: 2, category: 'Indoor Environmental Quality', checked: false },
    { id: 'daylight', name: 'Daylight and Quality Views', points: 3, category: 'Indoor Environmental Quality', checked: false },
    { id: 'acoustic-performance', name: 'Acoustic Performance', points: 1, category: 'Indoor Environmental Quality', checked: false },
    { id: 'green-power', name: 'Green Power and Carbon Offsets', points: 2, category: 'Energy & Atmosphere', checked: false },
    { id: 'innovation', name: 'Innovation in Design', points: 5, category: 'Innovation', checked: false },
    { id: 'leed-professional', name: 'LEED Accredited Professional', points: 1, category: 'Innovation', checked: false }
  ]);

  const [results, setResults] = useState<LEEDData | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<ExtendedMaterialData[]>([]);
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  const calculateLEED = () => {
    const totalPoints = leedItems.filter(item => item.checked).reduce((sum, item) => sum + item.points, 0);

    // Determine certification level
    let certificationLevel = 'Not Certified';
    let levelColor = 'text-gray-700';
    if (totalPoints >= 80) {
      certificationLevel = 'Platinum';
      levelColor = 'text-gray-800';
    } else if (totalPoints >= 60) {
      certificationLevel = 'Gold';
      levelColor = 'text-yellow-700';
    } else if (totalPoints >= 50) {
      certificationLevel = 'Silver';
      levelColor = 'text-gray-600';
    } else if (totalPoints >= 40) {
      certificationLevel = 'Certified';
      levelColor = 'text-green-700';
    }

    const pointsToGold = Math.max(0, 60 - totalPoints);
    const carbonImpact = totalPoints * 2.5; // Estimated % reduction

    // Calculate category breakdown
    const categoryBreakdown: Record<string, number> = {};
    leedItems.filter(item => item.checked).forEach(item => {
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + item.points;
    });

    const calculationResults: LEEDData = {
      totalPoints,
      certificationLevel,
      pointsToGold,
      carbonImpact,
      categoryBreakdown,
      materialEmissions: totalPoints * 15, // Estimated from materials category
      transportEmissions: totalPoints * 5, // Estimated from transport category
      energyEmissions: totalPoints * 20 // Estimated from energy category
    };

    setResults(calculationResults);
    onCalculationUpdate(calculationResults);
  };

  const handleItemToggle = (itemId: string) => {
    setLeedItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const getCertificationColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'text-gray-800 dark:text-gray-200';
      case 'Gold': return 'text-yellow-700 dark:text-yellow-400';
      case 'Silver': return 'text-gray-600 dark:text-gray-400';
      case 'Certified': return 'text-green-700 dark:text-green-400';
      default: return 'text-muted-foreground';
    }
  };

  // Group items by category
  const categories = leedItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, LEEDItem[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            LEED v4.1 Certification Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold mb-3 text-primary">{category}</h4>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={() => handleItemToggle(item.id)}
                      />
                      <Label htmlFor={item.id} className="flex-1 cursor-pointer">
                        {item.name}
                      </Label>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {item.points} {item.points === 1 ? 'point' : 'points'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button onClick={calculateLEED} className="w-full">
            Calculate LEED Score
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* LEED Results with Enhanced Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                LEED Certification Results
                <div className="flex items-center gap-2">
                  <ComplianceFlag 
                    standard="greenstar" 
                    status={results.totalPoints >= 60 ? 'compliant' : results.totalPoints >= 40 ? 'warning' : 'breach'}
                  />
                  <EmbodiedCarbonClassifier 
                    carbonIntensity={results.carbonImpact}
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
                    {results.totalPoints}/110
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Certification Level</div>
                  <div className={`text-2xl font-bold ${getCertificationColor(results.certificationLevel)}`}>
                    {results.certificationLevel}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Points to Gold</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {results.pointsToGold}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Carbon Impact</div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.carbonImpact.toFixed(1)}%
                  </div>
                  <div className="text-xs text-green-600">Estimated reduction</div>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Material Comparison for LEED */}
          <MaterialComparisonToggle
            baseMaterial={{
              name: 'LEED Materials Selection',
              carbon_footprint_kgco2e_kg: results.carbonImpact / 10
            }}
            alternatives={[]}
            onToggleComparison={setComparisonEnabled}
            comparisonEnabled={comparisonEnabled}
            onSelectAlternative={(material) => {
              console.log('Selected LEED material alternative:', material);
            }}
          />

          {/* Enhanced Calculator Results */}
          <EnhancedCalculatorResults
            result={{
              totalEmissions: results.carbonImpact * 1000, // Convert % to kg for display
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
              console.log('Selected LEED material for optimization:', material);
            }}
          />

          {Object.keys(results.categoryBreakdown).length > 0 && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Points by Category</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(results.categoryBreakdown).map(([category, points]) => (
                  <div key={category} className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">{category}</div>
                    <div className="text-lg font-bold text-primary">{points} points</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">LEED Certification Levels</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Certified:</span>
                <span className="font-medium">40-49 points</span>
              </div>
              <div className="flex justify-between">
                <span>Silver:</span>
                <span className="font-medium">50-59 points</span>
              </div>
              <div className="flex justify-between">
                <span>Gold:</span>
                <span className="font-medium">60-79 points</span>
              </div>
              <div className="flex justify-between">
                <span>Platinum:</span>
                <span className="font-medium">80+ points</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};