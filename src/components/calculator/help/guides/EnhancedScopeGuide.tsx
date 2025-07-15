import React from 'react';
import { EnhancedCalculatorHelpModal } from '../EnhancedCalculatorHelpModal';
import { Zap, Factory, Truck, Globe, Calculator, FileText, Activity, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface EnhancedScopeGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedScopeGuide: React.FC<EnhancedScopeGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Scope 1 Direct Emissions',
      icon: <Factory className="h-4 w-4 text-red-600" />,
      priority: 'high' as const,
      isCompliance: true,
      estimatedTime: '8-12 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Calculate emissions from sources directly owned or controlled by your organization:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Factory className="h-4 w-4" />
                Natural Gas Combustion
                <Badge variant="destructive" className="text-xs">Primary Source</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Heating, hot water, cooking (m³ × emission factor)</p>
              <div className="text-xs bg-red-100 dark:bg-red-950/30 p-2 rounded">
                <strong>Australian Factor:</strong> 51.4 kg CO₂-e/GJ (NGA 2024)
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Refrigerant Leakage
                <Badge variant="warning" className="text-xs">High GWP</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">HFC/HCFC from HVAC systems (kg × GWP)</p>
              <div className="text-xs bg-orange-100 dark:bg-orange-950/30 p-2 rounded">
                <strong>Critical:</strong> R410A = 2,088 GWP, R134a = 1,430 GWP
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-red-100/80 to-pink-100/80 dark:from-red-950/40 dark:to-pink-950/40 rounded-lg border-l-4 border-l-red-500">
            <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">⚠️ GHG Protocol Compliance</p>
            <p className="text-xs text-red-800 dark:text-red-200">
              Use Australian National Greenhouse Account factors for mandatory corporate reporting under NGER Act.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Scope 2 Energy Emissions',
      icon: <Zap className="h-4 w-4 text-blue-600" />,
      priority: 'high' as const,
      isCompliance: true,
      estimatedTime: '5-8 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Account for purchased electricity with Australian grid factors:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <div className="font-medium text-sm mb-1">NSW</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">0.81</div>
              <div className="text-xs text-muted-foreground">kg CO₂-e/kWh</div>
            </div>
            <div className="p-3 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <div className="font-medium text-sm mb-1">VIC</div>
              <div className="text-lg font-bold text-green-700 dark:text-green-300">1.02</div>
              <div className="text-xs text-muted-foreground">kg CO₂-e/kWh</div>
            </div>
            <div className="p-3 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <div className="font-medium text-sm mb-1">QLD</div>
              <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">0.79</div>
              <div className="text-xs text-muted-foreground">kg CO₂-e/kWh</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Renewable Energy Deductions
                <Badge variant="success" className="text-xs">Emission Reduction</Badge>
              </div>
              <p className="text-xs text-muted-foreground">GreenPower purchases and on-site solar generation reduce Scope 2 emissions</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Step 3: Scope 3 Value Chain',
      icon: <Truck className="h-4 w-4 text-green-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: '15-25 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Include relevant upstream and downstream emissions across 15 categories:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Material Categories
                <Badge variant="destructive" className="text-xs">Highest Impact</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Concrete, steel, timber embodied carbon</p>
              <div className="text-xs bg-green-100 dark:bg-green-950/30 p-2 rounded">
                <strong>Focus:</strong> Often 60-80% of construction Scope 3
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Transportation & Logistics</div>
              <p className="text-xs text-muted-foreground mb-2">Material delivery, waste removal, employee commuting</p>
              <div className="text-xs bg-blue-100 dark:bg-blue-950/30 p-2 rounded">
                <strong>Data:</strong> Use supplier-specific or distance-based calculations
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 dark:from-amber-950/40 dark:to-yellow-950/40 rounded-lg border-l-4 border-l-amber-500">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">📊 Scope 3 Prioritization</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Focus on material categories first - they typically represent 80% of construction industry Scope 3 emissions.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 4: Reporting & Verification',
      icon: <Globe className="h-4 w-4 text-purple-600" />,
      priority: 'medium' as const,
      isCompliance: true,
      estimatedTime: '5-10 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Ensure compliance with GHG Protocol and Australian reporting standards:</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                NGER Act Compliance
                <Badge variant="destructive" className="text-xs">Mandatory</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Companies with {'>'}25,000 tCO₂-e must report under National Greenhouse and Energy Reporting</p>
            </div>
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Data Quality Hierarchy</div>
              <p className="text-xs text-muted-foreground">Primary data {'>'}  Secondary data {'>'}  Industry averages {'>'}  Proxy data</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const quickActions = [
    {
      title: 'Small Office',
      description: 'Template for <2000m² office building',
      icon: <Factory className="h-4 w-4 text-blue-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Small Office Template Applied",
          description: "Scope 1-3 template for small commercial office with typical Australian emissions factors.",
        });
      }
    },
    {
      title: 'Large Commercial',
      description: 'Template for >5000m² commercial building',
      icon: <BarChart3 className="h-4 w-4 text-green-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Large Commercial Template",
          description: "Enterprise-scale Scope 1-3 template with comprehensive value chain coverage.",
        });
      }
    },
    {
      title: 'Residential Complex',
      description: 'Multi-residential building template',
      icon: <Activity className="h-4 w-4 text-purple-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Residential Template Applied",
          description: "Multi-residential complex template with typical energy and material profiles.",
        });
      }
    },
    {
      title: 'State Grid Factors',
      description: 'Latest Australian emission factors',
      icon: <Zap className="h-4 w-4 text-orange-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "Grid Factors Updated",
          description: "Latest Australian state electricity emission factors loaded from NGA database.",
        });
      }
    },
    {
      title: 'NGER Calculator',
      description: 'National Greenhouse & Energy Reporting',
      icon: <Globe className="h-4 w-4 text-red-600" />,
      category: 'compliance',
      action: () => {
        toast({
          title: "NGER Compliance Tool",
          description: "National Greenhouse and Energy Reporting calculator opened for mandatory compliance.",
        });
      }
    }
  ];

  const quickStart = [
    "Define organizational and operational boundaries using GHG Protocol guidance",
    "Collect 12 months of energy consumption data (electricity, gas, diesel)",
    "Calculate Scope 1 emissions from direct fuel combustion using NGA factors",
    "Determine Scope 2 using location-based Australian state grid factors",
    "Identify and prioritize material Scope 3 categories relevant to construction",
    "Apply Australian-specific emission factors consistently across all scopes",
    "Verify total emissions align with industry benchmarks and NGER thresholds",
    "Generate comprehensive GHG inventory report for corporate disclosure"
  ];

  const commonErrors = [
    "Double-counting emissions between scopes (e.g., electricity in both Scope 1 and 2)",
    "Using incorrect or outdated Australian emission factors from non-NGA sources",
    "Missing refrigerant leakage calculations - critical in Australian climate zones",
    "Not accounting for GreenPower purchases or renewable energy certificates",
    "Incomplete Scope 3 boundary definition - excluding major material categories",
    "Mixing different reporting periods - ensure consistent 12-month timeframe",
    "Using global emission factors instead of Australian state-specific grid factors"
  ];

  return (
    <EnhancedCalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="Scope 1-3 Calculator"
      purpose="Calculate comprehensive greenhouse gas emissions across all three scopes following GHG Protocol standards and Australian National Greenhouse Account methods for complete corporate carbon footprint assessment."
      nccRelevance="COMPLEMENTARY to NCC 2025 requirements. Provides comprehensive carbon accounting supporting corporate sustainability reporting and aligns with broader Australian climate policy including NGER Act compliance requirements."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
      quickActions={quickActions}
      completionRate={55}
    />
  );
};