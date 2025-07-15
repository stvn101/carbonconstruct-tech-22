import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, Database, Star, CheckCircle, TrendingDown } from 'lucide-react';
import { EnhancedCalculatorResults } from '../enhanced';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import LifecyclePhaseFilter from '@/components/ui/lifecycle-phase-filter';
import EmbodiedCarbonClassifier from '@/components/ui/embodied-carbon-classifier';
import ScopeBadge from '@/components/ui/scope-badge';
import { MaterialSelector, SelectedMaterial } from '../materials/MaterialSelector';
import { calculateEnhancedEmissions, EnhancedCalculationResult } from '@/lib/enhancedCarbonCalculations';

interface LCACalculatorProps {
  onCalculationUpdate: (data: LCAData) => void;
}

interface LCAData {
  totalLCA: number;
  embodiedCarbon: number;
  operationalCarbon: number;
  endOfLifeCarbon: number;
  materialBreakdown: Record<string, number>;
  materialEmissions?: number;
  transportEmissions?: number;
  energyEmissions?: number;
}

export const LCACalculator: React.FC<LCACalculatorProps> = ({ onCalculationUpdate }) => {
  const [inputs, setInputs] = useState({
    designLife: 50,
    energy: 0,
    water: 0,
    transportDistance: 0,
    transportWeight: 0
  });

  const [results, setResults] = useState<LCAData | null>(null);
  const [enhancedResults, setEnhancedResults] = useState<EnhancedCalculationResult | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([]);
  const [activePhase, setActivePhase] = useState<'embodied' | 'transport' | 'end-of-life' | 'all'>('all');
  const [useDatabase, setUseDatabase] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateLCA = async () => {
    setIsCalculating(true);
    
    try {
      if (useDatabase && selectedMaterials.length > 0) {
        // Enhanced calculation using material database
        const { designLife, energy, water, transportDistance, transportWeight } = inputs;
        
        const enhancedInput = {
          materials: selectedMaterials,
          transport: transportDistance > 0 ? [{
            type: 'truck',
            distance: transportDistance,
            weight: transportWeight || 1,
            id: 'lca-transport'
          }] : [],
          energy: energy > 0 ? [{
            type: 'electricity',
            amount: energy * designLife,
            id: 'lca-energy'
          }] : []
        };

        const enhancedResults = await calculateEnhancedEmissions(enhancedInput);
        setEnhancedResults(enhancedResults);

        // Convert to legacy format for compatibility
        const materialBreakdownObj: any = {};
        enhancedResults.materialDetails.forEach(material => {
          materialBreakdownObj[material.name.toLowerCase().replace(/\s+/g, '')] = material.emissions;
        });

        const calculationResults: LCAData = {
          totalLCA: enhancedResults.totalEmissions,
          embodiedCarbon: enhancedResults.materialEmissions,
          operationalCarbon: enhancedResults.energyEmissions,
          endOfLifeCarbon: enhancedResults.materialEmissions * 0.05,
          materialBreakdown: materialBreakdownObj,
          materialEmissions: enhancedResults.materialEmissions,
          transportEmissions: enhancedResults.transportEmissions,
          energyEmissions: enhancedResults.energyEmissions
        };

        setResults(calculationResults);
        onCalculationUpdate(calculationResults);
      } else {
        // Fallback to simplified calculation
        const { designLife, energy, water } = inputs;
        
        // Simple operational calculation
        const annualOperationalCarbon = energy * 0.82 + water * 0.3;
        const totalOperational = annualOperationalCarbon * designLife;
        
        const calculationResults: LCAData = {
          totalLCA: totalOperational,
          embodiedCarbon: 0,
          operationalCarbon: totalOperational,
          endOfLifeCarbon: 0,
          materialBreakdown: {},
          materialEmissions: 0,
          transportEmissions: 0,
          energyEmissions: totalOperational
        };

        setResults(calculationResults);
        onCalculationUpdate(calculationResults);
        setEnhancedResults(null);
      }
    } catch (error) {
      console.error('LCA calculation failed:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Life Cycle Assessment
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={useDatabase ? "default" : "outline"}>
                <Database className="h-3 w-3 mr-1" />
                {useDatabase ? 'Database Mode' : 'Simple Mode'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseDatabase(!useDatabase)}
              >
                {useDatabase ? 'Switch to Simple' : 'Use Database'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {useDatabase ? (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Materials from Database</Label>
                <MaterialSelector
                  selectedMaterials={selectedMaterials}
                  onMaterialChange={setSelectedMaterials}
                  placeholder="Search and select materials from database..."
                />
              </div>
              
              {enhancedResults && (
                <Card className="bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-green-600">Sustainability Score</div>
                        <div className="text-2xl font-bold text-green-700">
                          {enhancedResults.sustainability.score.toFixed(0)}/100
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-blue-600">Data Confidence</div>
                        <div className="text-2xl font-bold text-blue-700">
                          {enhancedResults.sustainability.confidence.toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-purple-600">Green Star</div>
                        <div className="text-lg font-bold text-purple-700">
                          {enhancedResults.sustainability.greenStarCompliant ? (
                            <><CheckCircle className="h-5 w-5 inline mr-1" />Compliant</>
                          ) : (
                            'Not Compliant'
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-orange-600">Recyclability</div>
                        <div className="text-2xl font-bold text-orange-700">
                          {enhancedResults.sustainability.recyclabilityScore.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Operational Parameters</Label>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="designLife">Design Life (years)</Label>
                  <Input
                    id="designLife"
                    type="number"
                    min="10"
                    max="100"
                    value={inputs.designLife}
                    onChange={(e) => handleInputChange('designLife', e.target.value)}
                    placeholder="e.g., 50"
                  />
                </div>

                <div>
                  <Label htmlFor="energy">Annual Energy Use (kWh)</Label>
                  <Input
                    id="energy"
                    type="number"
                    min="0"
                    value={inputs.energy}
                    onChange={(e) => handleInputChange('energy', e.target.value)}
                    placeholder="e.g., 50000"
                  />
                </div>

                <div>
                  <Label htmlFor="water">Annual Water Use (kL)</Label>
                  <Input
                    id="water"
                    type="number"
                    min="0"
                    value={inputs.water}
                    onChange={(e) => handleInputChange('water', e.target.value)}
                    placeholder="e.g., 500"
                  />
                </div>
              </div>
            </div>
            
            {useDatabase && (
              <div className="space-y-4">
                <Label className="text-sm font-medium">Transport Parameters</Label>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="transportDistance">Transport Distance (km)</Label>
                    <Input
                      id="transportDistance"
                      type="number"
                      min="0"
                      value={inputs.transportDistance}
                      onChange={(e) => handleInputChange('transportDistance', e.target.value)}
                      placeholder="e.g., 100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="transportWeight">Transport Weight (tonnes)</Label>
                    <Input
                      id="transportWeight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.transportWeight}
                      onChange={(e) => handleInputChange('transportWeight', e.target.value)}
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button 
            onClick={calculateLCA} 
            className="w-full" 
            disabled={isCalculating || (useDatabase && selectedMaterials.length === 0)}
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Calculating...
              </>
            ) : (
              'Calculate Life Cycle Assessment'
            )}
          </Button>
          
          {useDatabase && selectedMaterials.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Please select materials from the database to perform enhanced calculations
            </p>
          )}
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* LCA Overview with Scope Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                LCA Results
                <div className="flex items-center gap-2">
                  <ScopeBadge scope="combined" size="sm" />
                  <EmbodiedCarbonClassifier 
                    carbonIntensity={results.totalLCA / 1000}
                    size="sm"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Embodied Carbon</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {(results.embodiedCarbon / 1000).toFixed(1)} t CO₂-e
                  </div>
                  <ScopeBadge scope="scope3" size="sm" showTooltip={false} />
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Operational Carbon</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(results.operationalCarbon / 1000).toFixed(1)} t CO₂-e
                  </div>
                  <ScopeBadge scope="scope2" size="sm" showTooltip={false} />
                </Card>

                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">End of Life</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(results.endOfLifeCarbon / 1000).toFixed(1)} t CO₂-e
                  </div>
                  <ScopeBadge scope="scope3" size="sm" showTooltip={false} />
                </Card>

                <Card className="p-4 bg-green-50 dark:bg-green-950/20">
                  <div className="text-sm text-muted-foreground">Total LCA</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {(results.totalLCA / 1000).toFixed(1)} t CO₂-e
                  </div>
                  <ScopeBadge scope="combined" size="sm" showTooltip={false} />
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Lifecycle Phase Filter */}
          <LifecyclePhaseFilter
            activePhase={activePhase}
            onPhaseChange={setActivePhase}
            emissionsByPhase={{
              embodied: results.embodiedCarbon,
              transport: results.transportEmissions || 0,
              endOfLife: results.endOfLifeCarbon
            }}
          />

          {/* Enhanced Calculator Results */}
          <EnhancedCalculatorResults
            result={{
              totalEmissions: results.totalLCA,
              materialEmissions: results.materialEmissions || 0,
              transportEmissions: results.transportEmissions || 0,
              energyEmissions: results.energyEmissions || 0,
              breakdown: {
                materials: results.materialEmissions || 0,
                transport: results.transportEmissions || 0,
                energy: results.energyEmissions || 0,
              },
              breakdownByMaterial: results.materialBreakdown,
              breakdownByTransport: { delivery: results.transportEmissions || 0 },
              breakdownByEnergy: { operational: results.energyEmissions || 0 }
            }}
            materials={selectedMaterials}
            onMaterialSelect={(material) => {
              console.log('Selected LCA material for optimization:', material);
            }}
          />

            {Object.keys(results.materialBreakdown).length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Material Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(results.materialBreakdown).map(([material, emissions]) => (
                    <div key={material} className="text-center">
                      <div className="text-lg font-semibold text-gray-600 capitalize">{material}</div>
                      <div className={`text-xl font-bold ${emissions >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {(emissions / 1000).toFixed(1)} t CO₂-e
                      </div>
                      {emissions < 0 && (
                        <div className="text-xs text-green-600">Carbon Sequestration</div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">LCA Insights</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>Embodied Carbon:</strong> Upfront emissions from materials and construction</p>
              <p>• <strong>Operational Carbon:</strong> Emissions over the building's operational life</p>
              <p>• <strong>End of Life:</strong> Estimated emissions from demolition and disposal</p>
              <p>• <strong>Timber:</strong> Shows negative emissions due to carbon sequestration</p>
              <p>• Consider material substitutions to reduce embodied carbon footprint</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};