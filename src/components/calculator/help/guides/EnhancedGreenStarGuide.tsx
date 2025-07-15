import React from 'react';
import { EnhancedCalculatorHelpModal } from '../EnhancedCalculatorHelpModal';
import { Star, Leaf, Droplets, Users, Calculator, Building, TreePine, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface EnhancedGreenStarGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedGreenStarGuide: React.FC<EnhancedGreenStarGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Energy Category',
      icon: <Star className="h-4 w-4 text-green-600" />,
      priority: 'high' as const,
      isCompliance: true,
      estimatedTime: '20-30 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Optimize energy performance for Green Star points (26 available):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Greenhouse Gas Emissions
                <Badge variant="destructive" className="text-xs">20 Points Max</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Energy efficiency improvements beyond NCC baseline</p>
              <div className="text-xs bg-green-100 dark:bg-green-950/30 p-2 rounded">
                <strong>4-Star Min:</strong> 15% better than NCC | <strong>6-Star:</strong> 40%+ improvement
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Renewable Energy
                <Badge variant="success" className="text-xs">2 Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">On-site solar PV and renewable systems</p>
              <div className="text-xs bg-blue-100 dark:bg-blue-950/30 p-2 rounded">
                <strong>Australia:</strong> Excellent solar resource supports renewable credits
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg border-l-4 border-l-green-500">
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">✅ NCC 2025 Foundation</p>
            <p className="text-xs text-green-800 dark:text-green-200">
              NCC Section J compliance provides the foundation for Green Star energy credits - 4-star minimum aligns with NCC objectives.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Water Category',
      icon: <Droplets className="h-4 w-4 text-blue-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: '10-15 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Implement comprehensive water management (14 points available):</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Potable Water Reduction
                <Badge variant="destructive" className="text-xs">10 Points Max</Badge>
              </div>
              <p className="text-xs text-muted-foreground">WELS 4-6 star fixtures, rainwater harvesting, greywater recycling</p>
            </div>
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Australian Water Context</div>
              <p className="text-xs text-muted-foreground">Design for water security considering drought resilience and restrictions</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Step 3: Materials Category',
      icon: <Leaf className="h-4 w-4 text-brown-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: '15-20 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Select sustainable building materials (17 points available):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-brown-500 bg-amber-50/50 dark:bg-amber-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Concrete & Steel
                <Badge variant="success" className="text-xs">8 Points Max</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Supplementary cementitious materials and recycled steel content</p>
              <div className="text-xs bg-brown-100 dark:bg-brown-950/30 p-2 rounded">
                <strong>Australia:</strong> Strong local steel recycling and fly ash availability
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                Timber Certification
                <Badge variant="warning" className="text-xs">3 Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">FSC/PEFC certified sustainable forestry</p>
              <div className="text-xs bg-green-100 dark:bg-green-950/30 p-2 rounded">
                <strong>Local:</strong> Australian plantation forests support certification
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg border-l-4 border-l-blue-500">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">🇦🇺 Australian Material Advantage</p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Strong Australian materials databases and local supply chains support responsible sourcing verification and reduce transport emissions.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 4: Indoor Environment Quality',
      icon: <Users className="h-4 w-4 text-purple-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: '12-18 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Enhance occupant health and productivity (17 points available):</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Daylight & Views
                <Badge variant="success" className="text-xs">5 Points Max</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Natural lighting optimization with glare control and external views</p>
            </div>
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Low Emission Materials
                <Badge variant="warning" className="text-xs">5 Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Formaldehyde and VOC limits for adhesives, sealants, paints</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <p className="text-xs font-medium text-purple-800 dark:text-purple-300 mb-1">Australian Climate Adaptation</p>
            <p className="text-xs text-purple-700 dark:text-purple-400">
              Balance natural lighting benefits with intense solar conditions requiring effective shading systems
            </p>
          </div>
        </div>
      )
    }
  ];

  const quickActions = [
    {
      title: 'Office Building',
      description: 'Standard commercial office setup',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Office Green Star Template",
          description: "Commercial office building template optimized for Green Star Design & As Built assessment.",
        });
      }
    },
    {
      title: 'Residential Building',
      description: 'Multi-residential apartment setup',
      icon: <Users className="h-4 w-4 text-green-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Residential Template Applied",
          description: "Multi-residential building template with apartment-specific Green Star requirements.",
        });
      }
    },
    {
      title: 'Mixed-Use Development',
      description: 'Combined residential/commercial',
      icon: <Award className="h-4 w-4 text-purple-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Mixed-Use Template Applied",
          description: "Complex development template balancing residential and commercial Green Star criteria.",
        });
      }
    },
    {
      title: 'GHG Calculator',
      description: 'Greenhouse gas emissions modeling',
      icon: <Calculator className="h-4 w-4 text-orange-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "GHG Calculator Ready",
          description: "Greenhouse gas emissions calculator opened for Energy category analysis.",
        });
      }
    },
    {
      title: 'Material Database',
      description: 'Australian sustainable materials',
      icon: <TreePine className="h-4 w-4 text-brown-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "Material Database Opened",
          description: "Australian sustainable materials database with certification tracking.",
        });
      }
    },
    {
      title: 'Star Rating Predictor',
      description: 'Predict final Green Star rating',
      icon: <Star className="h-4 w-4 text-yellow-600" />,
      category: 'analysis',
      action: () => {
        toast({
          title: "Rating Predictor Ready",
          description: "Green Star rating predictor tool opened to estimate final certification level.",
        });
      }
    }
  ];

  const quickStart = [
    "Select appropriate Green Star tool (Design & As Built, Performance, Interiors)",
    "Configure building type and establish baseline performance using NCC compliance",
    "Input energy performance data targeting 15%+ improvement over NCC for 4-star minimum",
    "Design comprehensive water efficiency systems using WELS-rated fixtures",
    "Specify sustainable materials with appropriate certifications and recycled content",
    "Plan indoor environment quality features emphasizing Australian climate adaptation",
    "Consider transport access and sustainable site development requirements",
    "Calculate total points across all categories targeting 4-star (45+), 5-star (60+), or 6-star (75+) rating"
  ];

  const commonErrors = [
    "Using inappropriate Green Star tool - ensure correct choice for building type and project stage",
    "Not accounting for Australian climate zone impacts on energy and comfort modeling",
    "Missing mandatory minimum energy performance requirements that prevent certification",
    "Inadequate material certification documentation affecting Materials category credits",
    "Poor daylight modeling not accounting for intense Australian solar conditions and glare",
    "Insufficient coordination between energy, water, and materials strategies for optimal points",
    "Not leveraging Australian renewable energy and materials advantages for maximum credits"
  ];

  return (
    <EnhancedCalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="Green Star Calculator"
      purpose="Calculate Green Building Council Australia (GBCA) points across all categories to achieve 4-star (45+), 5-star (60+), or 6-star (75+) Green Star certification recognizing Australian environmental excellence."
      nccRelevance="BUILDS UPON NCC requirements. Green Star 4-star minimum aligns with NCC 2025 objectives and demonstrates market leadership, while 5-6 star ratings position buildings as exemplars of sustainable design and operation."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
      quickActions={quickActions}
      completionRate={85}
    />
  );
};