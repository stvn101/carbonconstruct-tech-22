import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Truck } from 'lucide-react';
import { TransportInput } from '@/lib/carbonCalculations';
import type { CalculatorState } from '@/hooks/useCalculator';

interface TransportCalculatorProps {
  calculator: CalculatorState;
  actions: any;
}

const TRANSPORT_TYPES = [
  'Road Transport - Light Vehicle',
  'Road Transport - Heavy Vehicle',
  'Rail Transport',
  'Sea Transport',
  'Air Transport'
];

export const TransportCalculator: React.FC<TransportCalculatorProps> = ({
  calculator,
  actions
}) => {
  const [newTransport, setNewTransport] = useState({
    type: '',
    distance: 0,
    unit: 'km',
    fuelType: 'Diesel',
    loadFactor: 1
  });

  const handleAddTransport = () => {
    if (newTransport.type && newTransport.distance > 0) {
      actions.addTransport(newTransport);
      setNewTransport({
        type: '',
        distance: 0,
        unit: 'km',
        fuelType: 'Diesel',
        loadFactor: 1
      });
    }
  };

  const getTotalEmissions = () => {
    return Object.values(calculator.result?.breakdownByTransport || {})
      .reduce((sum, value) => sum + value, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Transport Emissions Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Transport Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="transport-type">Transport Type</Label>
              <Select 
                value={newTransport.type} 
                onValueChange={(value) => setNewTransport(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transport" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSPORT_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                type="number"
                value={newTransport.distance || ''}
                onChange={(e) => setNewTransport(prev => ({ 
                  ...prev, 
                  distance: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0"
              />
            </div>
            
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select 
                value={newTransport.unit} 
                onValueChange={(value) => setNewTransport(prev => ({ ...prev, unit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">km</SelectItem>
                  <SelectItem value="miles">miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="load-factor">Load Factor</Label>
              <Input
                id="load-factor"
                type="number"
                step="0.1"
                min="0.1"
                max="2"
                value={newTransport.loadFactor || ''}
                onChange={(e) => setNewTransport(prev => ({ 
                  ...prev, 
                  loadFactor: parseFloat(e.target.value) || 1 
                }))}
                placeholder="1.0"
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleAddTransport} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </div>
          </div>

          {/* Transport List */}
          {calculator.transport.length > 0 ? (
            <div className="space-y-3">
              {calculator.transport.map((transport) => (
                <div key={transport.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-medium">{transport.type}</div>
                      <div className="text-sm text-muted-foreground">
                        Load Factor: {transport.loadFactor || 1}x
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Distance</div>
                      <div>{transport.distance} {transport.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Emissions</div>
                      <div className="font-medium">
                        {((calculator.result?.breakdownByTransport[transport.type] || 0) / 1000).toFixed(2)} t CO₂-e
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {transport.fuelType || 'Diesel'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.removeTransport(transport.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transport routes added yet. Add routes above to calculate emissions.
            </div>
          )}

          {/* Summary */}
          {calculator.transport.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Transport Emissions:</span>
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