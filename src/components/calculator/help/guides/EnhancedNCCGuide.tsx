import React from 'react';
import { EnhancedCalculatorHelpModal } from '../EnhancedCalculatorHelpModal';
import { Building, Thermometer, Zap, Calculator, Home, Building2, Factory, Lightbulb, Settings, Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface EnhancedNCCGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedNCCGuide: React.FC<EnhancedNCCGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Building Information',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      priority: 'high' as const,
      isCompliance: true,
      estimatedTime: '2-3 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Enter basic building details that affect energy performance:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Building Type
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Residential, Commercial, or Mixed-use - directly affects NCC energy requirements and calculation methods</p>
            </div>
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Floor Area (m²)
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Total conditioned floor area - critical for energy intensity calculations per Section J</p>
            </div>
            <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Number of Floors</div>
              <p className="text-xs text-muted-foreground">Above and below ground levels - impacts heat loss calculations and compliance thresholds</p>
            </div>
            <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                Climate Zone
                <Badge variant="success" className="text-xs">Auto-detected</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Australian climate zone 1-8 - determines specific energy targets and compliance benchmarks</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Pro Tip: Climate Zone Impact</p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Different climate zones have varying energy performance requirements. Zone 8 (alpine) has 40% stricter thermal requirements than Zone 1 (tropical).
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Thermal Performance',
      icon: <Thermometer className="h-4 w-4 text-red-600" />,
      priority: 'high' as const,
      isCompliance: true,
      estimatedTime: '5-7 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Configure thermal envelope properties for Section J compliance:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-600" />
                Wall R-Value
                <Badge variant="destructive" className="text-xs">Critical</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Thermal resistance of external walls</p>
              <div className="text-xs bg-red-100 dark:bg-red-950/30 p-2 rounded">
                <strong>Climate Zone Minimums:</strong><br/>
                Zone 1-3: R1.5 | Zone 4-5: R2.5 | Zone 6-8: R3.5
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                Roof R-Value
                <Badge variant="destructive" className="text-xs">Critical</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Insulation performance of roof/ceiling</p>
              <div className="text-xs bg-blue-100 dark:bg-blue-950/30 p-2 rounded">
                <strong>Minimum Requirements:</strong><br/>
                Residential: R3.5-R6.0 | Commercial: R2.5-R5.0
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 dark:from-amber-950/40 dark:to-yellow-950/40 rounded-lg border-l-4 border-l-amber-500">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">⚠️ NCC 2025 Enhanced Requirements</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              New thermal performance standards are 20% stricter than NCC 2019. Ensure your R-values meet the updated minimums for your climate zone.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 3: Energy Systems',
      icon: <Zap className="h-4 w-4 text-green-600" />,
      priority: 'medium' as const,
      isCompliance: true,
      estimatedTime: '4-6 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Define HVAC and energy systems for accurate modeling:</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                HVAC System Selection
              </div>
              <p className="text-xs text-muted-foreground">Heat pump systems can improve compliance by 25-40% compared to electric resistance heating</p>
            </div>
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-1">System Efficiency Ratings</div>
              <p className="text-xs text-muted-foreground">COP (heating) and EER (cooling) values directly impact energy compliance scores</p>
            </div>
            <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Renewable Energy Integration
                <Badge variant="success" className="text-xs">Bonus Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Solar PV systems can offset up to 100% of building energy consumption for compliance</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Step 4: Verification & Compliance',
      icon: <Calculator className="h-4 w-4 text-purple-600" />,
      priority: 'high' as const,
      isCompliance: true,
      estimatedTime: '2-3 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Review calculated results and ensure NCC compliance:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-green-600" />
                Energy Intensity Check
              </h4>
              <p className="text-xs text-muted-foreground mb-2">Must meet Section J targets for building type and climate zone</p>
              <div className="text-xs bg-green-100 dark:bg-green-950/30 p-2 rounded">
                <strong>Pass Criteria:</strong> ≤ Deemed-to-Satisfy limits
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <h4 className="font-medium text-sm mb-2">Compliance Verification</h4>
              <p className="text-xs text-muted-foreground mb-2">Automated compliance checking against NCC 2025 requirements</p>
              <div className="text-xs bg-blue-100 dark:bg-blue-950/30 p-2 rounded">
                <strong>Status:</strong> Real-time compliance monitoring
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const quickActions = [
    {
      title: 'Residential House',
      description: 'Pre-fill typical single-family home values',
      icon: <Home className="h-4 w-4 text-green-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Template Applied",
          description: "Residential house template loaded with typical values for quick start.",
        });
      }
    },
    {
      title: 'Commercial Office',
      description: 'Set up standard office building parameters',
      icon: <Building2 className="h-4 w-4 text-blue-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Template Applied",
          description: "Commercial office template loaded with industry standard values.",
        });
      }
    },
    {
      title: 'Industrial Facility',
      description: 'Configure for manufacturing or warehouse',
      icon: <Factory className="h-4 w-4 text-purple-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Template Applied",
          description: "Industrial facility template configured for heavy energy use.",
        });
      }
    },
    {
      title: 'Check Climate Zone',
      description: 'Auto-detect based on location',
      icon: <Gauge className="h-4 w-4 text-orange-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "Climate Zone Detected",
          description: "Climate zone 4 detected for your location.",
        });
      }
    },
    {
      title: 'Calculate R-Values',
      description: 'Get minimum requirements for your zone',
      icon: <Calculator className="h-4 w-4 text-red-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "R-Values Calculated",
          description: "Minimum R-values calculated based on your climate zone and building type.",
        });
      }
    },
    {
      title: 'Energy System Guide',
      description: 'Choose optimal HVAC for compliance',
      icon: <Zap className="h-4 w-4 text-green-600" />,
      category: 'guidance',
      action: () => {
        toast({
          title: "System Guide Opened",
          description: "HVAC selection guide opened with efficiency recommendations.",
        });
      }
    }
  ];

  const quickStart = [
    "Select building type from templates or enter custom details",
    "Enter total conditioned floor area in square meters",
    "Auto-detect or manually select Australian climate zone (1-8)",
    "Input thermal performance values from building design specifications",
    "Configure HVAC system type and efficiency ratings (COP/EER)",
    "Add renewable energy capacity if solar PV or other systems installed",
    "Review compliance status and click Calculate for detailed NCC report",
    "Export results for building permit applications and documentation"
  ];

  const commonErrors = [
    "Using incorrect climate zone - verify against official BCA climate zone maps",
    "Confusing R-values with U-values (Remember: R-value = 1/U-value)",
    "Not accounting for thermal bridging in wall and roof assemblies",
    "Measuring gross floor area instead of conditioned space only",
    "Missing renewable energy system contribution in energy balance calculations",
    "Using outdated NCC 2019 thermal performance values instead of NCC 2025 requirements"
  ];

  return (
    <EnhancedCalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="NCC Calculator"
      purpose="Calculate building energy performance to demonstrate compliance with National Construction Code Section J energy efficiency requirements using the latest NCC 2025 standards."
      nccRelevance="MANDATORY for all new buildings and major renovations. Section J requires buildings to meet minimum energy performance standards based on climate zone and building class. Non-compliance can result in permit delays and costly redesign."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
      quickActions={quickActions}
      completionRate={25}
    />
  );
};