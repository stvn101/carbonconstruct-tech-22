import React from 'react';
import { CalculatorHelpModal } from '../CalculatorHelpModal';
import { Zap, Factory, Truck, Globe } from 'lucide-react';

interface ScopeGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScopeGuide: React.FC<ScopeGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Scope 1: Direct Emissions',
      icon: <Factory className="h-4 w-4 text-red-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Calculate emissions from sources directly owned or controlled:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Natural Gas:</strong> On-site combustion for heating, hot water, cooking (m³ × emission factor)</li>
            <li><strong>Diesel Generators:</strong> Backup power systems and construction equipment (L × emission factor)</li>
            <li><strong>Fleet Vehicles:</strong> Company-owned vehicles for maintenance and operations</li>
            <li><strong>Refrigerants:</strong> HFC/HCFC leakage from HVAC systems (kg × GWP factor)</li>
          </ul>
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <p className="text-xs font-medium text-red-800 dark:text-red-300">
              Use Australian National Greenhouse Account factors for accurate calculations
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Scope 2: Indirect Energy Emissions',
      icon: <Zap className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Account for purchased electricity and energy:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Grid Electricity:</strong> kWh consumption × state-specific emission factors</li>
            <li><strong>Location-Based:</strong> Average grid emission factors for your region</li>
            <li><strong>Market-Based:</strong> Supplier-specific factors including green power</li>
            <li><strong>Renewable Energy:</strong> Deduct on-site solar generation and green power purchases</li>
          </ul>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">State Factors (kg CO₂-e/kWh)</h4>
              <p className="text-xs text-muted-foreground mt-1">NSW: 0.81, VIC: 1.02, QLD: 0.79, SA: 0.40</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Renewable Energy</h4>
              <p className="text-xs text-muted-foreground mt-1">GreenPower and LGCs reduce Scope 2 emissions</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Scope 3: Value Chain Emissions',
      icon: <Truck className="h-4 w-4 text-green-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Include relevant upstream and downstream emissions:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Purchased Goods:</strong> Embodied carbon in materials and products</li>
            <li><strong>Transportation:</strong> Material delivery, waste removal, employee commuting</li>
            <li><strong>Waste Generated:</strong> Treatment and disposal of operational waste</li>
            <li><strong>Business Travel:</strong> Flights and accommodation for company activities</li>
            <li><strong>Leased Assets:</strong> Downstream emissions from tenant energy use</li>
          </ul>
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              Focus on material categories - often 80% of construction Scope 3 emissions
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Carbon Accounting & Reporting',
      icon: <Globe className="h-4 w-4 text-purple-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Ensure compliance with GHG Protocol standards:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Organizational Boundaries:</strong> Operational vs financial control approach</li>
            <li><strong>Temporal Boundaries:</strong> Reporting period and data collection timeframes</li>
            <li><strong>Data Quality:</strong> Primary data preferred, secondary data where necessary</li>
            <li><strong>Verification:</strong> Third-party verification for credible reporting</li>
          </ul>
        </div>
      )
    }
  ];

  const quickStart = [
    "Define organizational and operational boundaries clearly",
    "Collect 12 months of energy consumption data (electricity, gas)",
    "Calculate Scope 1 emissions from direct fuel combustion",
    "Determine Scope 2 using location-based grid emission factors",
    "Identify material Scope 3 categories for your building type",
    "Apply Australian emission factors consistently throughout",
    "Verify total emissions align with industry benchmarks"
  ];

  const commonErrors = [
    "Double-counting emissions between scopes (e.g., electricity in Scope 1 and 2)",
    "Using incorrect emission factors - ensure Australian NGA factors",
    "Missing refrigerant leakage from HVAC systems (significant in hot climates)",
    "Not accounting for green power purchases in Scope 2 calculations",
    "Incomplete Scope 3 boundary - excluding major material categories",
    "Mixing reporting periods - ensure consistent 12-month timeframe"
  ];

  return (
    <CalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="Scope 1-3 Calculator"
      purpose="Calculate comprehensive greenhouse gas emissions across all three scopes following GHG Protocol standards for complete carbon footprint assessment."
      nccRelevance="COMPLEMENTARY to NCC 2025 requirements. Provides comprehensive carbon accounting that supports broader sustainability goals and corporate reporting obligations."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
    />
  );
};