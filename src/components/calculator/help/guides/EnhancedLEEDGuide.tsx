import React from 'react';
import { EnhancedCalculatorHelpModal } from '../EnhancedCalculatorHelpModal';
import { Award, Droplets, Wind, TreePine, Calculator, Zap, Building, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface EnhancedLEEDGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedLEEDGuide: React.FC<EnhancedLEEDGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Energy & Atmosphere (EA)',
      icon: <Award className="h-4 w-4 text-green-600" />,
      priority: 'high' as const,
      isCompliance: false,
      estimatedTime: '20-30 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Optimize energy performance for maximum EA category points (33 available):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Energy Performance
                <Badge variant="destructive" className="text-xs">20 Points Max</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Exceed ASHRAE 90.1 baseline by 5-50%</p>
              <div className="text-xs bg-green-100 dark:bg-green-950/30 p-2 rounded">
                <strong>Australia:</strong> Use climate-adjusted baselines for tropical/temperate zones
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Enhanced Commissioning
                <Badge variant="success" className="text-xs">6 Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Comprehensive building systems verification</p>
              <div className="text-xs bg-blue-100 dark:bg-blue-950/30 p-2 rounded">
                <strong>Key:</strong> Aligns with NCC commissioning requirements
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg border-l-4 border-l-green-500">
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">✅ NCC Synergy Opportunity</p>
            <p className="text-xs text-green-800 dark:text-green-200">
              NCC Section J compliance provides solid foundation for LEED energy performance credits - often achieving 8-12 points automatically.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Water Efficiency (WE)',
      icon: <Droplets className="h-4 w-4 text-blue-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: '10-15 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Implement water conservation strategies (12 points available):</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Indoor Water Reduction
                <Badge variant="success" className="text-xs">6 Points Max</Badge>
              </div>
              <p className="text-xs text-muted-foreground">WELS 4-6 star fixtures and fittings for maximum water efficiency</p>
            </div>
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Australian Water Context</div>
              <p className="text-xs text-muted-foreground">Consider drought conditions and regional water restrictions in design</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Step 3: Indoor Environmental Quality (EQ)',
      icon: <Wind className="h-4 w-4 text-purple-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: '15-20 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Enhance occupant comfort and wellbeing (16 points available):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Wind className="h-4 w-4 text-purple-600" />
                Daylighting & Views
              </h4>
              <p className="text-xs text-muted-foreground mb-2">Natural light optimization with glare control</p>
              <div className="text-xs bg-purple-100 dark:bg-purple-950/30 p-2 rounded">
                <strong>Australia:</strong> Consider intense sun conditions and UV protection
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <h4 className="font-medium text-sm mb-2">Thermal Comfort</h4>
              <p className="text-xs text-muted-foreground mb-2">Design and verification compliance</p>
              <div className="text-xs bg-blue-100 dark:bg-blue-950/30 p-2 rounded">
                <strong>Climate:</strong> Adapt to Australian seasonal variations
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Step 4: Materials & Resources (MR)',
      icon: <TreePine className="h-4 w-4 text-brown-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: '12-18 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Select sustainable building materials (13 points available):</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-brown-500 bg-amber-50/50 dark:bg-amber-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                EPDs & Regional Materials
                <Badge variant="success" className="text-xs">4 Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Environmental Product Declarations and materials sourced within 160km</p>
            </div>
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Australian Material Advantage</div>
              <p className="text-xs text-muted-foreground">Local steel, timber, and concrete industries support regional material credits</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg border-l-4 border-l-blue-500">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">🇦🇺 Australian EPD Database</p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Growing Australian EPD database supports MR credit achievement - particularly strong in steel and concrete sectors.
            </p>
          </div>
        </div>
      )
    }
  ];

  const quickActions = [
    {
      title: 'Office Building',
      description: 'Standard commercial office LEED setup',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Office LEED Template Applied",
          description: "Commercial office building template optimized for Australian climate and LEED v4.1 BD+C.",
        });
      }
    },
    {
      title: 'Educational Facility',
      description: 'School/university LEED configuration',
      icon: <Award className="h-4 w-4 text-green-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Educational Template Applied",
          description: "Educational facility template with enhanced IEQ requirements for learning environments.",
        });
      }
    },
    {
      title: 'Healthcare Building',
      description: 'Hospital/clinic specialized setup',
      icon: <CheckCircle className="h-4 w-4 text-red-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Healthcare Template Applied",
          description: "Healthcare facility template with stringent air quality and safety requirements.",
        });
      }
    },
    {
      title: 'Energy Modeling',
      description: 'ASHRAE 90.1 baseline calculator',
      icon: <Calculator className="h-4 w-4 text-orange-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "Energy Model Ready",
          description: "ASHRAE 90.1 baseline energy model calculator opened for EA credit analysis.",
        });
      }
    },
    {
      title: 'WELS Rating Tool',
      description: 'Australian water efficiency calculator',
      icon: <Droplets className="h-4 w-4 text-blue-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "WELS Calculator Opened",
          description: "Water Efficiency Labelling Scheme calculator for Australian fixtures and fittings.",
        });
      }
    },
    {
      title: 'Certification Roadmap',
      description: 'Point allocation strategy guide',
      icon: <Award className="h-4 w-4 text-purple-600" />,
      category: 'guidance',
      action: () => {
        toast({
          title: "Certification Strategy",
          description: "LEED certification roadmap opened with point allocation recommendations.",
        });
      }
    }
  ];

  const quickStart = [
    "Select appropriate LEED rating system (BD+C, O+M, ID+C) for project type",
    "Establish ASHRAE 90.1 baseline energy model with Australian climate data",
    "Configure building systems targeting 20%+ energy performance improvement",
    "Design water-efficient systems using WELS-rated fixtures and native landscaping",
    "Specify materials with EPDs and plan for regional sourcing within 160km",
    "Plan construction waste management achieving 75%+ diversion from landfill",
    "Design optimal daylighting with glare control suitable for Australian conditions",
    "Calculate total points across all categories and determine target certification level"
  ];

  const commonErrors = [
    "Using incorrect ASHRAE 90.1 baseline - must adapt to Australian climate zones",
    "Not accounting for Australian building code differences in energy modeling",
    "Missing documentation requirements for sustainable material and EPD claims",
    "Inadequate commissioning scope affecting Energy & Atmosphere credit achievement",
    "Poor integration between water efficiency design and Australian drought resilience",
    "Insufficient measurement and verification planning for ongoing performance",
    "Not leveraging Australian material advantages for regional sourcing credits"
  ];

  return (
    <EnhancedCalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="LEED Calculator"
      purpose="Calculate LEED v4.1 Building Design and Construction points across all credit categories to achieve Certified (40+), Silver (50+), Gold (60+), or Platinum (80+) certification levels."
      nccRelevance="COMPLEMENTARY to NCC requirements. LEED energy performance credits align with and significantly exceed NCC Section J requirements, providing international sustainability recognition while supporting Australian climate goals."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
      quickActions={quickActions}
      completionRate={65}
    />
  );
};