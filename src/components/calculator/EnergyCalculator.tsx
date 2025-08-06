import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Trash2, Plus, Zap } from 'lucide-react';
import { EnergyInput } from '@/lib/carbonCalculations';
import type { CalculatorState } from '@/hooks/useCalculator';

interface EnergyCalculatorProps {
  calculator: CalculatorState;
  actions: any;
}

const ENERGY_TYPES = [
  'Electricity - Grid (AU)',
  'Electricity - Solar',
  'Electricity - Wind',
  'Natural Gas',
  'LPG',
  'Diesel',
  'Petrol'
];

export const EnergyCalculator: React.FC<EnergyCalculatorProps> = ({
  calculator,
  actions
}) => {
  const [newEnergy, setNewEnergy] = useState({
    type: '',
    amount: 0,
    unit: 'kWh',
    renewablePercentage: 0
  });

  const handleAddEnergy = () => {
    if (newEnergy.type && newEnergy.amount > 0) {
      actions.addEnergy(newEnergy);
      setNewEnergy({
        type: '',
        amount: 0,
        unit: 'kWh',
        renewablePercentage: 0
      });
    }
  };

  const getTotalEmissions = () => {
    return Object.values(calculator.result?.breakdownByEnergy || {})
      .reduce((sum, value) => sum + value, 0);
  };

  const getUnitForType = (type: string) => {
    if (type.includes('Electricity')) return 'kWh';
    if (type.includes('Gas') || type.includes('LPG')) return 'MJ';
    return 'L';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Energy Emissions Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Energy Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="energy-type">Energy Type</Label>
              <Select 
                value={newEnergy.type} 
                onValueChange={(value) => {
                  const unit = getUnitForType(value);
                  setNewEnergy(prev => ({ ...prev, type: value, unit }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select energy source" />
                </SelectTrigger>
                <SelectContent>
                  {ENERGY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={newEnergy.amount || ''}
                onChange={(e) => setNewEnergy(prev => ({ 
                  ...prev, 
                  amount: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Unit: {newEnergy.unit}
              </div>
            </div>
            
            <div>
              <Label htmlFor="renewable">Renewable % (Optional)</Label>
              <div className="space-y-2">
                <Slider
                  value={[newEnergy.renewablePercentage]}
                  onValueChange={(value) => setNewEnergy(prev => ({ 
                    ...prev, 
                    renewablePercentage: value[0] 
                  }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="text-sm text-center">
                  {newEnergy.renewablePercentage}%
                </div>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleAddEnergy} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Energy
              </Button>
            </div>
          </div>

          {/* Energy List */}
          {calculator.energy.length > 0 ? (
            <div className="space-y-3">
              {calculator.energy.map((energy) => (
                <div key={energy.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-medium">{energy.type}</div>
                      {energy.renewablePercentage && energy.renewablePercentage > 0 && (
                        <div className="text-sm text-green-600">
                          {energy.renewablePercentage}% renewable
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div>{energy.amount} {energy.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Emissions</div>
                      <div className="font-medium">
                        {((calculator.result?.breakdownByEnergy[energy.type] || 0) / 1000).toFixed(2)} t CO₂-e
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={energy.type.includes('Solar') || energy.type.includes('Wind') ? 'default' : 'outline'}>
                        {energy.type.includes('Solar') || energy.type.includes('Wind') ? 'Clean' : 'Fossil'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.removeEnergy(energy.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No energy sources added yet. Add energy consumption above to calculate emissions.
            </div>
          )}

          {/* Summary */}
          {calculator.energy.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Energy Emissions:</span>
                  <span className="text-xl font-bold text-primary">
                    {(getTotalEmissions() / 1000).toFixed(2)} t CO₂-e
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};