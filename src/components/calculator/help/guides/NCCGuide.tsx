import React from 'react';
import { CalculatorHelpModal } from '../CalculatorHelpModal';
import { Building, Thermometer, Zap, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NCCGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NCCGuide: React.FC<NCCGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Building Information',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Enter basic building details that affect energy performance:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Building Type:</strong> Residential, Commercial, or Mixed-use (affects energy requirements)</li>
            <li><strong>Floor Area:</strong> Total conditioned floor area in m² (used for energy intensity calculations)</li>
            <li><strong>Number of Floors:</strong> Above and below ground (impacts heat loss calculations)</li>
            <li><strong>Climate Zone:</strong> Australian climate zone 1-8 (determines energy targets)</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Step 2: Thermal Performance',
      icon: <Thermometer className="h-4 w-4 text-red-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Configure thermal envelope properties for Section J compliance:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Wall R-Value:</strong> Thermal resistance of external walls (minimum varies by climate zone)</li>
            <li><strong>Roof R-Value:</strong> Insulation performance of roof/ceiling (critical for energy efficiency)</li>
            <li><strong>Window U-Value:</strong> Heat transfer coefficient for glazing (lower is better)</li>
            <li><strong>Air Changes/Hour:</strong> Building envelope air tightness (target: less than 5 ACH)</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
              NCC 2025 Update: Enhanced thermal performance requirements now in effect
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 3: Energy Systems',
      icon: <Zap className="h-4 w-4 text-green-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Define HVAC and energy systems for accurate modeling:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>HVAC Type:</strong> System type affects efficiency calculations (heat pump, gas, electric)</li>
            <li><strong>System Efficiency:</strong> COP or EER ratings for equipment performance</li>
            <li><strong>Hot Water System:</strong> Type and efficiency (gas, electric, heat pump, solar)</li>
            <li><strong>Renewable Energy:</strong> Solar PV capacity and expected generation</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Step 4: Calculation & Verification',
      icon: <Calculator className="h-4 w-4 text-purple-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Review results and ensure NCC compliance:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Energy Intensity</h4>
              <p className="text-xs text-muted-foreground mt-1">Must meet Section J targets for building type and climate zone</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Compliance Status</h4>
              <p className="text-xs text-muted-foreground mt-1">Green checkmark indicates NCC 2025 compliance achieved</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const quickStart = [
    "Select your building type from the dropdown (Residential/Commercial/Mixed-use)",
    "Enter total floor area in square meters",
    "Choose the correct Australian climate zone (1-8)",
    "Input thermal performance values from building design",
    "Configure HVAC system type and efficiency ratings",
    "Add renewable energy capacity if applicable",
    "Click Calculate to generate NCC compliance report"
  ];

  const commonErrors = [
    "Using incorrect climate zone - check BCA climate zone maps",
    "Mixing up R-values and U-values (R = 1/U)",
    "Not accounting for thermal bridging in wall assemblies",
    "Incorrect floor area measurement (use conditioned space only)",
    "Missing renewable energy contribution in energy balance"
  ];

  return (
    <CalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="NCC Calculator"
      purpose="Calculate building energy performance to demonstrate compliance with National Construction Code Section J energy efficiency requirements."
      nccRelevance="MANDATORY for all new buildings and major renovations. Section J requires buildings to meet minimum energy performance standards based on climate zone and building class."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
    />
  );
};