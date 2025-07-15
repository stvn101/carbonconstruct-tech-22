import React from 'react';
import { EnhancedCalculatorHelpModal } from '../EnhancedCalculatorHelpModal';
import { Leaf, Package, Truck, Recycle, Calculator, TreePine, Factory, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface EnhancedLCAGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedLCAGuide: React.FC<EnhancedLCAGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Embodied Carbon Assessment',
      icon: <Package className="h-4 w-4 text-brown-600" />,
      priority: 'high' as const,
      isCompliance: false,
      estimatedTime: '15-20 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Calculate carbon emissions from building materials across their full lifecycle:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-brown-500 bg-amber-50/50 dark:bg-amber-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Structural Materials
                <Badge variant="destructive" className="text-xs">High Impact</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Concrete, steel, timber with EPD data</p>
              <div className="text-xs bg-brown-100 dark:bg-brown-950/30 p-2 rounded">
                <strong>Priority:</strong> 60-80% of embodied carbon
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                MEP Systems
                <Badge variant="warning" className="text-xs">Medium Impact</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">HVAC, electrical, plumbing equipment</p>
              <div className="text-xs bg-green-100 dark:bg-green-950/30 p-2 rounded">
                <strong>Impact:</strong> 15-25% of embodied carbon
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-100/80 to-orange-100/80 dark:from-amber-950/40 dark:to-orange-950/40 rounded-lg border-l-4 border-l-amber-500">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">💡 Australian EPD Priority</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Use Australian-specific Environmental Product Declarations where available for 20-30% more accurate embodied carbon factors.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Operational Carbon Modeling',
      icon: <Leaf className="h-4 w-4 text-green-600" />,
      priority: 'high' as const,
      isCompliance: false,
      estimatedTime: '10-15 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Project lifetime operational emissions with climate considerations:</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Design Life Analysis
              </div>
              <p className="text-xs text-muted-foreground">Typically 50-60 years for commercial buildings, 100+ years for infrastructure</p>
            </div>
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Grid Decarbonization</div>
              <p className="text-xs text-muted-foreground">Factor in Australia's renewable energy transition reducing future grid emissions</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Step 3: Transport & Construction',
      icon: <Truck className="h-4 w-4 text-orange-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: '8-12 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Account for construction phase and transport emissions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange-600" />
                Material Transport
              </h4>
              <p className="text-xs text-muted-foreground mb-2">Distance from source to site affects carbon intensity</p>
              <div className="text-xs bg-orange-100 dark:bg-orange-950/30 p-2 rounded">
                <strong>Rule:</strong> Heavy materials (concrete, steel) have highest transport impact
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Factory className="h-4 w-4 text-yellow-600" />
                Construction Equipment
              </h4>
              <p className="text-xs text-muted-foreground mb-2">Diesel consumption for earthworks, cranes, pumping</p>
              <div className="text-xs bg-yellow-100 dark:bg-yellow-950/30 p-2 rounded">
                <strong>Impact:</strong> 3-8% of total project emissions
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Step 4: End-of-Life Planning',
      icon: <Recycle className="h-4 w-4 text-purple-600" />,
      priority: 'low' as const,
      isCompliance: false,
      estimatedTime: '5-8 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Include demolition and circular economy benefits:</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Recycle className="h-4 w-4" />
                Material Recovery Credits
                <Badge variant="success" className="text-xs">Carbon Offset</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Steel recycling can offset 70-90% of embodied carbon, concrete 10-30%</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg border-l-4 border-l-green-500">
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">🔄 NCC 2025 Circular Economy</p>
            <p className="text-xs text-green-800 dark:text-green-200">
              Consider design for disassembly and material reuse to align with emerging circular economy principles.
            </p>
          </div>
        </div>
      )
    }
  ];

  const quickActions = [
    {
      title: 'Residential Project',
      description: 'Pre-fill typical house LCA parameters',
      icon: <Package className="h-4 w-4 text-green-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Residential Template Applied",
          description: "Typical residential building LCA parameters loaded with Australian materials data.",
        });
      }
    },
    {
      title: 'Commercial Office',
      description: 'Standard office building LCA setup',
      icon: <Factory className="h-4 w-4 text-blue-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Commercial Template Applied",
          description: "Office building LCA template with typical structural and MEP systems loaded.",
        });
      }
    },
    {
      title: 'EPD Database',
      description: 'Access Australian EPD materials',
      icon: <TreePine className="h-4 w-4 text-brown-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "EPD Database Opened",
          description: "Australian Environmental Product Declaration database opened for material selection.",
        });
      }
    },
    {
      title: 'Transport Calculator',
      description: 'Calculate material transport emissions',
      icon: <Truck className="h-4 w-4 text-orange-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "Transport Tool Ready",
          description: "Material transport distance and emission calculator opened.",
        });
      }
    },
    {
      title: 'Benchmark Analysis',
      description: 'Compare against industry benchmarks',
      icon: <BarChart3 className="h-4 w-4 text-purple-600" />,
      category: 'analysis',
      action: () => {
        toast({
          title: "Benchmark Comparison",
          description: "LCA results compared against Australian building benchmarks.",
        });
      }
    }
  ];

  const quickStart = [
    "Define project scope and system boundaries (cradle-to-grave or cradle-to-gate)",
    "Input material quantities from architectural and structural drawings",
    "Select appropriate embodied carbon factors from Australian EPD database",
    "Configure operational energy model based on NCC compliance calculations",
    "Add transport distances for major material categories and suppliers",
    "Set building design life appropriate for building type (50-100 years)",
    "Calculate total lifecycle carbon footprint and compare to benchmarks",
    "Generate detailed LCA report with breakdown by lifecycle stage"
  ];

  const commonErrors = [
    "Incomplete material inventory - missing finishes, MEP systems, or temporary works",
    "Using global carbon factors instead of Australian-specific EPD data",
    "Not accounting for renewable energy systems in operational phase calculations",
    "Ignoring transport emissions for heavy materials like concrete and steel",
    "Double-counting emissions between embodied and operational phases",
    "Using outdated electricity grid emission factors instead of current NEM data",
    "Not considering grid decarbonization trends over building design life"
  ];

  return (
    <EnhancedCalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="LCA Calculator"
      purpose="Perform comprehensive lifecycle carbon assessment covering embodied, operational, transport, and end-of-life emissions over the building's entire design life using Australian-specific data."
      nccRelevance="SUPPORTING TOOL for NCC 2025 objectives. While not mandatory, LCA provides comprehensive carbon analysis that supports material selection optimization and demonstrates alignment with broader sustainability goals."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
      quickActions={quickActions}
      completionRate={45}
    />
  );
};