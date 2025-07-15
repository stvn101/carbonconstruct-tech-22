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

interface NABERSCalculatorProps {
  onCalculationUpdate: (data: NABERSData) => void;
}

interface NABERSData {
  totalEmissions: number;
  energyRating: number;
  waterRating: number;
  overallRating: number;
  electricityIntensity: number;
  gasIntensity: number;
  waterIntensity: number;
  materialEmissions?: number;
  transportEmissions?: number;
  energyEmissions?: number;
}

export const NABERSCalculator: React.FC<NABERSCalculatorProps> = ({ onCalculationUpdate }) => {
  const [inputs, setInputs] = useState({
    area: 0,
    electricity: 0,
    gas: 0,
    water: 0,
    hours: 0
  });

  const [results, setResults] = useState<NABERSData | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<ExtendedMaterialData[]>([]);

  const calculateNABERS = () => {
    const { area, electricity, gas, water, hours } = inputs;

    // NABERS calculation logic
    const electricityIntensity = area > 0 ? electricity / area : 0; // kWh/m²
    const gasIntensity = area > 0 ? gas / area : 0; // MJ/m²
    const waterIntensity = area > 0 ? water / area : 0; // kL/m²

    // Energy rating (0.5-6 stars)
    let energyRating = 6;
    if (electricityIntensity > 300) {
      energyRating = Math.max(0.5, 6 - Math.floor((electricityIntensity - 300) / 100) * 0.5);
    } else if (electricityIntensity > 150) {
      energyRating = Math.max(3, 6 - Math.floor((electricityIntensity - 150) / 50) * 0.5);
    }

    // Water rating (0.5-6 stars)
    let waterRating = 6;
    if (waterIntensity > 1.5) {
      waterRating = Math.max(0.5, 6 - Math.floor((waterIntensity - 1.5) / 0.5) * 0.5);
    } else if (waterIntensity > 0.8) {
      waterRating = Math.max(3, 6 - Math.floor((waterIntensity - 0.8) / 0.2) * 0.5);
    }

    // Carbon emissions
    const electricityEmissions = electricity * 0.82; // kg CO2-e
    const gasEmissions = gas * 0.0513; // kg CO2-e per MJ
    const totalEmissions = electricityEmissions + gasEmissions;

    // Overall rating
    const overallRating = (energyRating + waterRating) / 2;

    const calculationResults: NABERSData = {
      totalEmissions,
      energyRating,
      waterRating,
      overallRating,
      electricityIntensity,
      gasIntensity,
      waterIntensity,
      materialEmissions: totalEmissions * 0.4, // 40% from materials
      transportEmissions: totalEmissions * 0.1, // 10% from transport  
      energyEmissions: totalEmissions * 0.5 // 50% from energy
    };

    setResults(calculationResults);
    onCalculationUpdate(calculationResults);
  };

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(6)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'fill-yellow-200 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)} stars</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            NABERS Calculation Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nabers-area">Net Lettable Area (m²)</Label>
              <Input
                id="nabers-area"
                type="number"
                value={inputs.area || ''}
                onChange={(e) => handleInputChange('area', e.target.value)}
                placeholder="Enter net lettable area"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nabers-electricity">Annual Electricity (kWh)</Label>
              <Input
                id="nabers-electricity"
                type="number"
                value={inputs.electricity || ''}
                onChange={(e) => handleInputChange('electricity', e.target.value)}
                placeholder="Enter annual electricity consumption"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nabers-gas">Annual Gas (MJ)</Label>
              <Input
                id="nabers-gas"
                type="number"
                value={inputs.gas || ''}
                onChange={(e) => handleInputChange('gas', e.target.value)}
                placeholder="Enter annual gas consumption"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nabers-water">Annual Water (kL)</Label>
              <Input
                id="nabers-water"
                type="number"
                value={inputs.water || ''}
                onChange={(e) => handleInputChange('water', e.target.value)}
                placeholder="Enter annual water consumption"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nabers-hours">Operating Hours per Week</Label>
              <Input
                id="nabers-hours"
                type="number"
                value={inputs.hours || ''}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                placeholder="Enter operating hours per week"
              />
            </div>
          </div>

          <Button onClick={calculateNABERS} className="w-full">
            Calculate NABERS Rating
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced NABERS Results */}
      {results && (
        <div className="space-y-6">
          {/* Quick NABERS Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                NABERS Results
                <div className="flex items-center gap-2">
                  <ComplianceFlag 
                    standard="nabers" 
                    status={results.overallRating >= 4.5 ? 'compliant' : results.overallRating >= 3.5 ? 'warning' : 'breach'}
                  />
                  <EmbodiedCarbonClassifier 
                    carbonIntensity={results.totalEmissions / 1000}
                    size="sm"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Star Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">Energy Rating</div>
                  {renderStars(results.energyRating)}
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">Water Rating</div>
                  {renderStars(results.waterRating)}
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">Overall Rating</div>
                  {renderStars(results.overallRating)}
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Total Emissions</div>
                  <div className="text-2xl font-bold text-destructive">
                    {(results.totalEmissions / 1000).toFixed(1)} t CO₂-e
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Electricity Intensity</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {results.electricityIntensity.toFixed(1)} kWh/m²
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Gas Intensity</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {results.gasIntensity.toFixed(1)} MJ/m²
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Water Intensity</div>
                  <div className="text-2xl font-bold text-cyan-600">
                    {results.waterIntensity.toFixed(2)} kL/m²
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Calculator Results */}
          <EnhancedCalculatorResults
            result={{
              totalEmissions: results.totalEmissions,
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
              breakdownByEnergy: { 
                electricity: results.electricityIntensity * inputs.area,
                gas: results.gasIntensity * inputs.area
              }
            }}
            materials={selectedMaterials}
            onMaterialSelect={(material) => {
              // Handle material selection for optimization
              console.log('Selected NABERS material for optimization:', material);
            }}
          />

          {/* NABERS-Specific Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle>NABERS Performance Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Rating Thresholds</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">Energy Rating</span>
                      <div className="flex items-center gap-2">
                        {renderStars(results.energyRating)}
                        <span className={`text-xs px-2 py-1 rounded ${results.energyRating >= 4.5 ? 'bg-green-100 text-green-800' : results.energyRating >= 3.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {results.energyRating >= 4.5 ? 'Excellent' : results.energyRating >= 3.5 ? 'Good' : 'Below Average'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">Water Rating</span>
                      <div className="flex items-center gap-2">
                        {renderStars(results.waterRating)}
                        <span className={`text-xs px-2 py-1 rounded ${results.waterRating >= 4 ? 'bg-green-100 text-green-800' : results.waterRating >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {results.waterRating >= 4 ? 'Excellent' : results.waterRating >= 3 ? 'Good' : 'Below Average'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Performance Indicators</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${results.electricityIntensity < 150 ? 'bg-green-500' : 'bg-red-500'}`} />
                      Electricity: Good performance &lt;150 kWh/m²
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${results.waterIntensity < 0.8 ? 'bg-green-500' : 'bg-red-500'}`} />
                      Water: Efficient buildings use &lt;0.8 kL/m²
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${results.overallRating >= 4.5 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      Overall: 4.5+ stars indicates market-leading performance
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};