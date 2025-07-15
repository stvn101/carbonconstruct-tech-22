import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building, RotateCcw } from 'lucide-react';
import { EnhancedCalculatorResults } from '../enhanced';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import ComplianceFlag from '@/components/ui/compliance-flag';

interface NCCCalculatorProps {
  onCalculationUpdate: (data: NCCData) => void;
  defaultValues?: Partial<typeof initialInputs>;
}

const initialInputs = {
  floorArea: 0,
  energy: 0,
  renewable: 0,
  occupants: 0
};

interface NCCData {
  totalEmissions: number;
  efficiencyRating: number;
  isCompliant: boolean;
  energyIntensity: number;
  materialEmissions?: number;
  transportEmissions?: number;
  energyEmissions?: number;
}

export const NCCCalculator: React.FC<NCCCalculatorProps> = ({ 
  onCalculationUpdate, 
  defaultValues 
}) => {
  const [inputs, setInputs] = useState({ ...initialInputs, ...defaultValues });

  const [results, setResults] = useState<NCCData | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<ExtendedMaterialData[]>([]);

  // Apply default values when they change
  useEffect(() => {
    if (defaultValues) {
      setInputs({ ...initialInputs, ...defaultValues });
    }
  }, [defaultValues]);

  const calculateNCC = () => {
    const { floorArea, energy, renewable, occupants } = inputs;

    // NCC calculation logic
    const energyIntensity = floorArea > 0 ? energy / floorArea : 0;
    const renewableReduction = (renewable / 100) * energy;
    const netEnergy = energy - renewableReduction;
    const emissionFactor = 0.82; // kg CO2-e per kWh (Australian grid average)
    const totalEmissions = netEnergy * emissionFactor;

    // Energy efficiency rating (1-10 scale)
    let efficiencyRating = 10;
    if (energyIntensity > 200) {
      efficiencyRating = Math.max(1, 10 - Math.floor((energyIntensity - 200) / 50));
    } else if (energyIntensity > 100) {
      efficiencyRating = Math.max(5, 10 - Math.floor((energyIntensity - 100) / 25));
    }

    // Compliance status
    const isCompliant = energyIntensity <= 150 && renewable >= 10;

    const calculationResults: NCCData = {
      totalEmissions,
      efficiencyRating,
      isCompliant,
      energyIntensity,
      materialEmissions: totalEmissions * 0.6, // 60% from materials
      transportEmissions: totalEmissions * 0.2, // 20% from transport
      energyEmissions: totalEmissions * 0.2 // 20% from energy
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

  const resetCalculator = () => {
    setInputs(initialInputs);
    setResults(null);
    setSelectedMaterials([]);
    onCalculationUpdate({
      totalEmissions: 0,
      efficiencyRating: 0,
      isCompliant: false,
      energyIntensity: 0
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              NCC Calculation Inputs
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetCalculator}
              className="text-destructive hover:text-destructive"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ncc-floor-area">Floor Area (m²)</Label>
              <Input
                id="ncc-floor-area"
                type="number"
                value={inputs.floorArea || ''}
                onChange={(e) => handleInputChange('floorArea', e.target.value)}
                placeholder="Enter floor area"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ncc-energy">Annual Energy Consumption (kWh)</Label>
              <Input
                id="ncc-energy"
                type="number"
                value={inputs.energy || ''}
                onChange={(e) => handleInputChange('energy', e.target.value)}
                placeholder="Enter annual energy consumption"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ncc-renewable">Renewable Energy (%)</Label>
              <Input
                id="ncc-renewable"
                type="number"
                value={inputs.renewable || ''}
                onChange={(e) => handleInputChange('renewable', e.target.value)}
                placeholder="Enter percentage of renewable energy"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ncc-occupants">Number of Occupants</Label>
              <Input
                id="ncc-occupants"
                type="number"
                value={inputs.occupants || ''}
                onChange={(e) => handleInputChange('occupants', e.target.value)}
                placeholder="Enter number of occupants"
              />
            </div>
          </div>

          <Button onClick={calculateNCC} className="w-full">
            Calculate NCC Compliance
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Quick Compliance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                NCC 2025 Results
                <ComplianceFlag 
                  standard="ncc2025" 
                  status={results.isCompliant ? 'compliant' : 'breach'}
                  currentValue={results.energyIntensity}
                  threshold={150}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Efficiency Rating</div>
                  <div className="text-2xl font-bold text-primary">
                    {results.efficiencyRating}/10
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Total Emissions</div>
                  <div className="text-2xl font-bold text-destructive">
                    {(results.totalEmissions / 1000).toFixed(1)} t CO₂-e
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Energy Intensity</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {results.energyIntensity.toFixed(1)} kWh/m²
                  </div>
                </Card>

                <Card className={`p-4 ${results.isCompliant ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
                  <div className="text-sm text-muted-foreground">Compliance Status</div>
                  <div className={`text-2xl font-bold ${results.isCompliant ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {results.isCompliant ? 'Compliant' : 'Non-Compliant'}
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
              breakdownByTransport: { electricity: results.energyEmissions || 0 },
              breakdownByEnergy: { grid: results.energyEmissions || 0 }
            }}
            materials={selectedMaterials}
            onMaterialSelect={(material) => {
              // Handle material selection for replacement
              console.log('Selected material for optimization:', material);
            }}
          />

          {/* NCC-Specific Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>NCC 2025 Compliance Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Energy Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${results.energyIntensity <= 150 ? 'bg-green-500' : 'bg-red-500'}`} />
                      Energy intensity ≤ 150 kWh/m² for compliance
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${inputs.renewable >= 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                      Minimum 10% renewable energy required
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${results.efficiencyRating >= 7 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      Energy efficiency rating of 7+ indicates good performance
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Improvement Opportunities</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Building envelope improvements</li>
                    <li>• Enhanced insulation systems</li>
                    <li>• High-performance glazing</li>
                    <li>• Renewable energy integration</li>
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