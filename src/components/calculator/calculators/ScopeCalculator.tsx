import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { EnhancedCalculatorResults } from '../enhanced';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import ScopeBadge from '@/components/ui/scope-badge';
import ComplianceFlag from '@/components/ui/compliance-flag';
import EmbodiedCarbonClassifier from '@/components/ui/embodied-carbon-classifier';

interface ScopeCalculatorProps {
  onCalculationUpdate: (data: ScopeData) => void;
}

interface ScopeData {
  totalEmissions: number;
  scope1Emissions: number;
  scope2Emissions: number;
  scope3Emissions: number;
  materialEmissions?: number;
  transportEmissions?: number;
  energyEmissions?: number;
}

export const ScopeCalculator: React.FC<ScopeCalculatorProps> = ({ onCalculationUpdate }) => {
  const [inputs, setInputs] = useState({
    // Scope 1 - Direct emissions
    gas: 0,
    diesel: 0,
    petrol: 0,
    refrigerants: 0,
    // Scope 2 - Indirect energy emissions
    electricity: 0,
    steam: 0,
    heating: 0,
    cooling: 0,
    // Scope 3 - Other indirect emissions
    travel: 0,
    commuting: 0,
    waste: 0
  });

  const [results, setResults] = useState<ScopeData | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<ExtendedMaterialData[]>([]);

  const calculateScope = () => {
    const {
      gas, diesel, petrol, refrigerants,
      electricity, steam, heating, cooling,
      travel, commuting, waste
    } = inputs;

    // Scope 1 emissions (Direct emissions from owned/controlled sources)
    const scope1Emissions = 
      gas * 1.9 +          // kg CO2-e per m³
      diesel * 2.7 +       // kg CO2-e per L
      petrol * 2.3 +       // kg CO2-e per L
      refrigerants * 1400; // kg CO2-e per kg (R134a equivalent)

    // Scope 2 emissions (Indirect emissions from purchased energy)
    const scope2Emissions = 
      electricity * 0.82 + // kg CO2-e per kWh (Australian grid average)
      steam * 0.07 +       // kg CO2-e per MJ
      heating * 0.05 +     // kg CO2-e per MJ
      cooling * 0.05;      // kg CO2-e per MJ

    // Scope 3 emissions (Other indirect emissions)
    const scope3Emissions = 
      travel * 0.21 +      // kg CO2-e per km (business travel)
      commuting * 0.15 +   // kg CO2-e per km (employee commuting)
      waste * 500;         // kg CO2-e per tonne (waste disposal)

    const totalEmissions = scope1Emissions + scope2Emissions + scope3Emissions;

    const calculationResults: ScopeData = {
      totalEmissions,
      scope1Emissions,
      scope2Emissions,
      scope3Emissions,
      materialEmissions: scope3Emissions * 0.4, // 40% from materials
      transportEmissions: scope3Emissions * 0.6, // 60% from transport/travel
      energyEmissions: scope2Emissions
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            GHG Protocol Scope 1, 2, 3 Emissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scope 1 - Direct Emissions */}
          <div>
            <h4 className="font-semibold mb-3 text-red-700 dark:text-red-400">
              Scope 1 - Direct Emissions (Owned/Controlled Sources)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scope1-gas">Natural Gas (m³)</Label>
                <Input
                  id="scope1-gas"
                  type="number"
                  value={inputs.gas || ''}
                  onChange={(e) => handleInputChange('gas', e.target.value)}
                  placeholder="Enter natural gas consumption"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope1-diesel">Diesel (L)</Label>
                <Input
                  id="scope1-diesel"
                  type="number"
                  value={inputs.diesel || ''}
                  onChange={(e) => handleInputChange('diesel', e.target.value)}
                  placeholder="Enter diesel consumption"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope1-petrol">Petrol (L)</Label>
                <Input
                  id="scope1-petrol"
                  type="number"
                  value={inputs.petrol || ''}
                  onChange={(e) => handleInputChange('petrol', e.target.value)}
                  placeholder="Enter petrol consumption"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope1-refrigerants">Refrigerants (kg)</Label>
                <Input
                  id="scope1-refrigerants"
                  type="number"
                  value={inputs.refrigerants || ''}
                  onChange={(e) => handleInputChange('refrigerants', e.target.value)}
                  placeholder="Enter refrigerant emissions"
                />
              </div>
            </div>
          </div>

          {/* Scope 2 - Indirect Energy Emissions */}
          <div>
            <h4 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">
              Scope 2 - Indirect Energy Emissions (Purchased Energy)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scope2-electricity">Electricity (kWh)</Label>
                <Input
                  id="scope2-electricity"
                  type="number"
                  value={inputs.electricity || ''}
                  onChange={(e) => handleInputChange('electricity', e.target.value)}
                  placeholder="Enter electricity consumption"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope2-steam">Steam (MJ)</Label>
                <Input
                  id="scope2-steam"
                  type="number"
                  value={inputs.steam || ''}
                  onChange={(e) => handleInputChange('steam', e.target.value)}
                  placeholder="Enter steam consumption"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope2-heating">Heating (MJ)</Label>
                <Input
                  id="scope2-heating"
                  type="number"
                  value={inputs.heating || ''}
                  onChange={(e) => handleInputChange('heating', e.target.value)}
                  placeholder="Enter heating consumption"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope2-cooling">Cooling (MJ)</Label>
                <Input
                  id="scope2-cooling"
                  type="number"
                  value={inputs.cooling || ''}
                  onChange={(e) => handleInputChange('cooling', e.target.value)}
                  placeholder="Enter cooling consumption"
                />
              </div>
            </div>
          </div>

          {/* Scope 3 - Other Indirect Emissions */}
          <div>
            <h4 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-400">
              Scope 3 - Other Indirect Emissions (Value Chain)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scope3-travel">Business Travel (km)</Label>
                <Input
                  id="scope3-travel"
                  type="number"
                  value={inputs.travel || ''}
                  onChange={(e) => handleInputChange('travel', e.target.value)}
                  placeholder="Enter business travel distance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope3-commuting">Employee Commuting (km)</Label>
                <Input
                  id="scope3-commuting"
                  type="number"
                  value={inputs.commuting || ''}
                  onChange={(e) => handleInputChange('commuting', e.target.value)}
                  placeholder="Enter employee commuting distance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope3-waste">Waste Generated (tonnes)</Label>
                <Input
                  id="scope3-waste"
                  type="number"
                  value={inputs.waste || ''}
                  onChange={(e) => handleInputChange('waste', e.target.value)}
                  placeholder="Enter waste generated"
                />
              </div>
            </div>
          </div>

          <Button onClick={calculateScope} className="w-full">
            Calculate GHG Emissions by Scope
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* Scope Results with Enhanced Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                GHG Protocol Scope Results
                <div className="flex items-center gap-2">
                  <ComplianceFlag 
                    standard="greenstar" 
                    status={results.totalEmissions < 100000 ? 'compliant' : 'warning'}
                  />
                  <EmbodiedCarbonClassifier 
                    carbonIntensity={results.totalEmissions / 1000}
                    size="sm"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 bg-red-50 dark:bg-red-950/20">
                  <div className="text-sm text-muted-foreground mb-2">Scope 1 Emissions</div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {(results.scope1Emissions / 1000).toFixed(1)} t CO₂-e
                  </div>
                  <ScopeBadge scope="scope1" size="sm" showTooltip={false} />
                </Card>

                <Card className="p-4 bg-orange-50 dark:bg-orange-950/20">
                  <div className="text-sm text-muted-foreground mb-2">Scope 2 Emissions</div>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {(results.scope2Emissions / 1000).toFixed(1)} t CO₂-e
                  </div>
                  <ScopeBadge scope="scope2" size="sm" showTooltip={false} />
                </Card>

                <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
                  <div className="text-sm text-muted-foreground mb-2">Scope 3 Emissions</div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {(results.scope3Emissions / 1000).toFixed(1)} t CO₂-e
                  </div>
                  <ScopeBadge scope="scope3" size="sm" showTooltip={false} />
                </Card>

                <Card className="p-4 bg-green-50 dark:bg-green-950/20">
                  <div className="text-sm text-muted-foreground mb-2">Total Emissions</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {(results.totalEmissions / 1000).toFixed(1)} t CO₂-e
                  </div>
                  <ScopeBadge scope="combined" size="sm" showTooltip={false} />
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
              breakdownByTransport: { 
                travel: results.scope3Emissions * 0.4, 
                commuting: results.scope3Emissions * 0.2 
              },
              breakdownByEnergy: { 
                electricity: results.scope2Emissions * 0.8,
                heating: results.scope2Emissions * 0.2
              }
            }}
            materials={selectedMaterials}
            onMaterialSelect={(material) => {
              console.log('Selected Scope material for optimization:', material);
            }}
          />

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">GHG Protocol Scope Definitions</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Scope 1:</strong> Direct emissions from owned or controlled sources (combustion, vehicles, refrigerants)</p>
              <p><strong>Scope 2:</strong> Indirect emissions from purchased electricity, steam, heating, and cooling</p>
              <p><strong>Scope 3:</strong> All other indirect emissions in the value chain (travel, commuting, waste, etc.)</p>
              <p className="text-xs pt-2 border-t">Emission factors based on Australian National Greenhouse Accounts and IPCC guidelines</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};