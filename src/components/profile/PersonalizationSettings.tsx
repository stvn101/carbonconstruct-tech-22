import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Target, Calculator, Bell, Sliders } from 'lucide-react';
import { toast } from 'sonner';

interface PersonalizationSettingsProps {
  profile: any;
  onUpdateSettings: (settings: any) => Promise<void>;
}

const CALCULATOR_TOOLS = [
  'LCA Calculator',
  'Scope Calculator', 
  'LEED Calculator',
  'BREEAM Calculator',
  'Green Star Calculator',
  'NABERS Calculator',
  'NCC Calculator'
];

const COMPLIANCE_STANDARDS = [
  { value: 'ncc', label: 'NCC (National Construction Code)' },
  { value: 'nabers', label: 'NABERS Rating' },
  { value: 'green_star', label: 'Green Star Certification' },
  { value: 'leed', label: 'LEED Certification' },
  { value: 'breeam', label: 'BREEAM Assessment' }
];

export const PersonalizationSettings: React.FC<PersonalizationSettingsProps> = ({
  profile,
  onUpdateSettings
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quickTools, setQuickTools] = useState<string[]>(
    profile?.quick_access_tools || []
  );
  const [carbonGoals, setCarbonGoals] = useState({
    monthly_target: profile?.carbon_footprint_goals?.monthly_target || 0,
    annual_target: profile?.carbon_footprint_goals?.annual_target || 0,
    reduction_percentage: profile?.carbon_footprint_goals?.reduction_percentage || 0
  });
  const [complianceThresholds, setComplianceThresholds] = useState(
    profile?.compliance_thresholds || {}
  );
  const [calculatorPrefs, setCalculatorPrefs] = useState({
    auto_save_calculations: profile?.calculator_preferences?.auto_save_calculations ?? true,
    show_advanced_options: profile?.calculator_preferences?.show_advanced_options ?? false,
    default_calculator: profile?.calculator_preferences?.default_calculator || 'lca',
    show_tooltips: profile?.calculator_preferences?.show_tooltips ?? true
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const updatedProfile = {
        ...profile,
        quick_access_tools: quickTools,
        carbon_footprint_goals: carbonGoals,
        compliance_thresholds: complianceThresholds,
        calculator_preferences: calculatorPrefs
      };
      
      await onUpdateSettings(updatedProfile);
      toast.success('Personalization settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuickTool = (tool: string) => {
    setQuickTools(prev => 
      prev.includes(tool) 
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  const updateComplianceThreshold = (standard: string, value: string) => {
    setComplianceThresholds(prev => ({
      ...prev,
      [standard]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="space-y-6">
      {/* Carbon Footprint Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Carbon Footprint Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_target">Monthly Target (kg CO₂-e)</Label>
              <Input
                id="monthly_target"
                type="number"
                value={carbonGoals.monthly_target}
                onChange={(e) => setCarbonGoals(prev => ({
                  ...prev,
                  monthly_target: parseFloat(e.target.value) || 0
                }))}
                placeholder="e.g., 1000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annual_target">Annual Target (kg CO₂-e)</Label>
              <Input
                id="annual_target"
                type="number"
                value={carbonGoals.annual_target}
                onChange={(e) => setCarbonGoals(prev => ({
                  ...prev,
                  annual_target: parseFloat(e.target.value) || 0
                }))}
                placeholder="e.g., 12000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reduction_percentage">Target Reduction (%)</Label>
              <Input
                id="reduction_percentage"
                type="number"
                value={carbonGoals.reduction_percentage}
                onChange={(e) => setCarbonGoals(prev => ({
                  ...prev,
                  reduction_percentage: parseFloat(e.target.value) || 0
                }))}
                placeholder="e.g., 20"
                max="100"
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Quick Access Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Select calculators to show in your dashboard for quick access:
            </p>
            <div className="flex flex-wrap gap-2">
              {CALCULATOR_TOOLS.map(tool => (
                <Badge
                  key={tool}
                  variant={quickTools.includes(tool) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => toggleQuickTool(tool)}
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Calculator Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save Calculations</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save calculation results to your history
              </p>
            </div>
            <Switch
              checked={calculatorPrefs.auto_save_calculations}
              onCheckedChange={(checked) => setCalculatorPrefs(prev => ({
                ...prev,
                auto_save_calculations: checked
              }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Advanced Options</Label>
              <p className="text-sm text-muted-foreground">
                Display advanced settings in calculators by default
              </p>
            </div>
            <Switch
              checked={calculatorPrefs.show_advanced_options}
              onCheckedChange={(checked) => setCalculatorPrefs(prev => ({
                ...prev,
                show_advanced_options: checked
              }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Tooltips</Label>
              <p className="text-sm text-muted-foreground">
                Display helpful tooltips and guidance
              </p>
            </div>
            <Switch
              checked={calculatorPrefs.show_tooltips}
              onCheckedChange={(checked) => setCalculatorPrefs(prev => ({
                ...prev,
                show_tooltips: checked
              }))}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Default Calculator</Label>
            <Select 
              value={calculatorPrefs.default_calculator}
              onValueChange={(value) => setCalculatorPrefs(prev => ({
                ...prev,
                default_calculator: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default calculator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lca">LCA Calculator</SelectItem>
                <SelectItem value="scope">Scope Calculator</SelectItem>
                <SelectItem value="green_star">Green Star Calculator</SelectItem>
                <SelectItem value="nabers">NABERS Calculator</SelectItem>
                <SelectItem value="ncc">NCC Calculator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Compliance Alert Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Set carbon footprint thresholds for different compliance standards:
          </p>
          
          {COMPLIANCE_STANDARDS.map(standard => (
            <div key={standard.value} className="grid grid-cols-2 gap-4 items-center">
              <Label>{standard.label}</Label>
              <Input
                type="number"
                value={complianceThresholds[standard.value] || ''}
                onChange={(e) => updateComplianceThreshold(standard.value, e.target.value)}
                placeholder="kg CO₂-e threshold"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="min-w-32"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};