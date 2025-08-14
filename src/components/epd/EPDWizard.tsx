import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { X, ArrowLeft, ArrowRight, CheckCircle, Factory, Truck, Zap, Trash2 } from 'lucide-react';
import { EPDFormData } from '@/types/epd';
import { EPDService } from '@/services/epdService';
import { toast } from 'sonner';
import { safeLocal } from '@/utils/safeLocal'; // ✅ robust localStorage wrapper

interface EPDWizardProps {
  onClose: () => void;
}

// ---- helpers ---------------------------------------------------------------

// Single-key draft store keeps the whole form in one place.
// (Purely additive: doesn’t affect server or other app behavior.)
const DRAFT_KEY = 'epd_wizard_draft_v1';

const DEFAULT_FORM: EPDFormData = {
  // Step 1: Product Description
  product_name: '',
  product_description: '',
  functional_unit: '1 kg',

  // Step 2: Manufacturer Details
  manufacturer_name: '',
  manufacturer_location: '',
  manufacturer_abn: '',

  // Step 3: Material Breakdown
  materials: [
    { name: '', quantity: 0, unit: 'kg', carbon_footprint: 0 }
  ],

  // Step 4: Transport & Energy
  transport: { mode: 'truck', distance: 100, fuel_type: 'diesel' },
  energy: { electricity: 0, gas: 0, renewable_percentage: 0 },

  // Step 5: Waste Scenarios
  waste: { recycling_rate: 10, landfill_rate: 80, incineration_rate: 10 }
};

// Safe numeric coercion to avoid NaN leaks
const asInt = (v: string) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};
const asFloat = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

// ---- component -------------------------------------------------------------

export const EPDWizard: React.FC<EPDWizardProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Load once from local storage (or defaults). Saves dev time if the page
  // refreshes; doesn’t change server behavior or validations.
  const [formData, setFormData] = useState<EPDFormData>(() => {
    const draft = safeLocal.get<EPDFormData | null>(DRAFT_KEY, null);
    return draft ?? DEFAULT_FORM;
  });

  // Auto-save the entire form whenever it changes (debounced-light via microtask).
  useEffect(() => {
    // No debounce delay needed here—writes are tiny; this is robust & simple.
    safeLocal.set(DRAFT_KEY, formData);
  }, [formData]);

  const totalSteps = 5;
  const progressPercentage = useMemo(() => (currentStep / totalSteps) * 100, [currentStep]);

  const steps = [
    { number: 1, title: 'Product Description', icon: Factory },
    { number: 2, title: 'Manufacturer Details', icon: Factory },
    { number: 3, title: 'Material Breakdown', icon: Factory },
    { number: 4, title: 'Transport & Energy', icon: Truck },
    { number: 5, title: 'Waste Scenarios', icon: Trash2 }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(s => s + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await EPDService.createEPD(formData);

      if (error) {
        const msg = typeof error === 'string' ? error : (error?.message ?? 'Unknown error');
        toast.error(`Failed to create EPD: ${msg}`);
        return;
      }

      toast.success('EPD created successfully!');
      onClose();
    } catch (err: any) {
      toast.error(`An unexpected error occurred${err?.message ? `: ${err.message}` : ''}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [
        ...prev.materials,
        { name: '', quantity: 0, unit: 'kg', carbon_footprint: 0 }
      ]
    }));
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const updateMaterial = (index: number, field: keyof EPDFormData['materials'][number], value: any) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="product_name">Product Name *</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                placeholder="e.g., High-Performance Concrete Block"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="product_description">Product Description</Label>
              <Textarea
                id="product_description"
                value={formData.product_description}
                onChange={(e) => setFormData(prev => ({ ...prev, product_description: e.target.value }))}
                placeholder="Detailed description of the product, its intended use, and key characteristics"
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="functional_unit">Functional Unit *</Label>
              <Select
                value={formData.functional_unit}
                onValueChange={(value) => setFormData(prev => ({ ...prev, functional_unit: value }))}
              >
                <SelectTrigger id="functional_unit" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 kg">1 kg</SelectItem>
                  <SelectItem value="1 m²">1 m²</SelectItem>
                  <SelectItem value="1 m³">1 m³</SelectItem>
                  <SelectItem value="1 piece">1 piece</SelectItem>
                  <SelectItem value="1 tonne">1 tonne</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                The reference unit for all environmental impacts
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="manufacturer_name">Manufacturer Name *</Label>
              <Input
                id="manufacturer_name"
                value={formData.manufacturer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturer_name: e.target.value }))}
                placeholder="Company or organization name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manufacturer_location">Manufacturing Location</Label>
              <Input
                id="manufacturer_location"
                value={formData.manufacturer_location}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturer_location: e.target.value }))}
                placeholder="City, State, Country"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manufacturer_abn">ABN (Australian Business Number)</Label>
              <Input
                id="manufacturer_abn"
                value={formData.manufacturer_abn}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturer_abn: e.target.value }))}
                placeholder="12 345 678 901"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Material Components</h3>
              <Button onClick={addMaterial} variant="outline" size="sm">
                Add Material
              </Button>
            </div>

            {formData.materials.map((material, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Material Name</Label>
                    <Input
                      value={material.name}
                      onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                      placeholder="e.g., Portland Cement"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(index, 'quantity', asFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Unit</Label>
                    <Select
                      value={material.unit}
                      onValueChange={(value) => updateMaterial(index, 'unit', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="m²">m²</SelectItem>
                        <SelectItem value="m³">m³</SelectItem>
                        <SelectItem value="pieces">pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>Carbon Factor (kg CO₂e)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={material.carbon_footprint}
                        onChange={(e) => updateMaterial(index, 'carbon_footprint', asFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    {formData.materials.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMaterial(index)}
                        className="mt-6"
                        aria-label="Remove material"
                        title="Remove material"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Transport Assumptions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Transport Mode</Label>
                  <Select
                    value={formData.transport.mode}
                    onValueChange={(value) =>
                      setFormData(prev => ({ ...prev, transport: { ...prev.transport, mode: value } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="rail">Rail</SelectItem>
                      <SelectItem value="ship">Ship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Distance (km)</Label>
                  <Input
                    type="number"
                    value={formData.transport.distance}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        transport: { ...prev.transport, distance: asInt(e.target.value) }
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Fuel Type</Label>
                  <Select
                    value={formData.transport.fuel_type}
                    onValueChange={(value) =>
                      setFormData(prev => ({
                        ...prev,
                        transport: { ...prev.transport, fuel_type: value }
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Energy Inputs (Manufacturing)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Electricity (kWh)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.energy.electricity}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        energy: { ...prev.energy, electricity: asFloat(e.target.value) }
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Natural Gas (kWh)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.energy.gas}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        energy: { ...prev.energy, gas: asFloat(e.target.value) }
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Renewable Energy (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.energy.renewable_percentage}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        energy: { ...prev.energy, renewable_percentage: asInt(e.target.value) }
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              End-of-Life Scenarios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Recycling Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.waste.recycling_rate}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      waste: { ...prev.waste, recycling_rate: asInt(e.target.value) }
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Landfill Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.waste.landfill_rate}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      waste: { ...prev.waste, landfill_rate: asInt(e.target.value) }
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Incineration Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.waste.incineration_rate}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      waste: { ...prev.waste, incineration_rate: asInt(e.target.value) }
                    }))
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Total percentages should sum to 100%. Current total:{' '}
                {formData.waste.recycling_rate +
                  formData.waste.landfill_rate +
                  formData.waste.incineration_rate}
                %
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Create New EPD</h1>
          <p className="text-muted-foreground">ISO 14025 Compliant Environmental Product Declaration</p>
        </div>
        <Button variant="ghost" onClick={onClose} aria-label="Close">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="w-full" />
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  isCompleted
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : isActive
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-muted-foreground text-muted-foreground'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.number}
              </div>
              <span className={`text-sm ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep === totalSteps ? (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Creating EPD...' : 'Create EPD'}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
