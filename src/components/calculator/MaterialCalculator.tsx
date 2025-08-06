import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Factory } from 'lucide-react';
import { MaterialInput } from '@/lib/carbonCalculations';
import type { CalculatorState } from '@/hooks/useCalculator';

interface MaterialCalculatorProps {
  calculator: CalculatorState;
  actions: any;
}

const MATERIAL_TYPES = [
  'Concrete',
  'Steel (Structural)',
  'Steel (Reinforcement)',
  'Timber (Hardwood)',
  'Timber (Softwood)',
  'Aluminum',
  'Glass',
  'Brick',
  'Insulation (Bulk)',
  'Insulation (Reflective)',
  'Plasterboard',
  'Carpet',
  'Paint',
  'Ceramic Tiles'
];

export const MaterialCalculator: React.FC<MaterialCalculatorProps> = ({
  calculator,
  actions
}) => {
  const [newMaterial, setNewMaterial] = useState({
    type: '',
    quantity: 0,
    unit: 'kg',
    supplier: '',
    region: 'AU'
  });

  const handleAddMaterial = () => {
    if (newMaterial.type && newMaterial.quantity > 0) {
      actions.addMaterial(newMaterial);
      setNewMaterial({
        type: '',
        quantity: 0,
        unit: 'kg',
        supplier: '',
        region: 'AU'
      });
    }
  };

  const getTotalEmissions = () => {
    return Object.values(calculator.result?.breakdownByMaterial || {})
      .reduce((sum, value) => sum + value, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Material Emissions Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Material Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="material-type">Material Type</Label>
              <Select 
                value={newMaterial.type} 
                onValueChange={(value) => setNewMaterial(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={newMaterial.quantity || ''}
                onChange={(e) => setNewMaterial(prev => ({ 
                  ...prev, 
                  quantity: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0"
              />
            </div>
            
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select 
                value={newMaterial.unit} 
                onValueChange={(value) => setNewMaterial(prev => ({ ...prev, unit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="tonne">tonne</SelectItem>
                  <SelectItem value="m³">m³</SelectItem>
                  <SelectItem value="m²">m²</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="supplier">Supplier (Optional)</Label>
              <Input
                id="supplier"
                value={newMaterial.supplier}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, supplier: e.target.value }))}
                placeholder="Supplier name"
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleAddMaterial} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
          </div>

          {/* Materials List */}
          {calculator.materials.length > 0 ? (
            <div className="space-y-3">
              {calculator.materials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-medium">{material.type}</div>
                      {material.supplier && (
                        <div className="text-sm text-muted-foreground">{material.supplier}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Quantity</div>
                      <div>{material.quantity} {material.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Emissions</div>
                      <div className="font-medium">
                        {((calculator.result?.breakdownByMaterial[material.type] || 0) / 1000).toFixed(2)} t CO₂-e
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {material.region || 'AU'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.removeMaterial(material.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No materials added yet. Add materials above to calculate emissions.
            </div>
          )}

          {/* Summary */}
          {calculator.materials.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Material Emissions:</span>
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