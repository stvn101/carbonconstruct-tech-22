import React from 'react';
import { EnhancedCalculatorHelpModal } from '../EnhancedCalculatorHelpModal';
import { Award, Zap, Shield, Briefcase, Calculator, Building, CheckCircle, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface EnhancedBREEAMGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedBREEAMGuide: React.FC<EnhancedBREEAMGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Energy Performance',
      icon: <Zap className="h-4 w-4 text-green-600" />,
      priority: 'high' as const,
      isCompliance: false,
      estimatedTime: '25-35 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Achieve high energy efficiency ratings (21 points available):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Energy Efficiency
                <Badge variant="destructive" className="text-xs">15 Points Max</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Exceed notional building performance by significant margins</p>
              <div className="text-xs bg-green-100 dark:bg-green-950/30 p-2 rounded">
                <strong>Australia:</strong> 25-40% better than NCC requirements for maximum points
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Low/Zero Carbon
                <Badge variant="success" className="text-xs">3 Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Renewable energy systems and carbon reduction</p>
              <div className="text-xs bg-blue-100 dark:bg-blue-950/30 p-2 rounded">
                <strong>Solar:</strong> Excellent resource in most Australian locations
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg border-l-4 border-l-green-500">
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">🔋 BREEAM Energy Advantage</p>
            <p className="text-xs text-green-800 dark:text-green-200">
              BREEAM energy targets often exceed NCC requirements by 25-40%, positioning buildings as market leaders in efficiency.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Health & Wellbeing',
      icon: <Shield className="h-4 w-4 text-blue-600" />,
      priority: 'high' as const,
      isCompliance: false,
      estimatedTime: '15-20 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Optimize occupant health and comfort (15 points available):</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Visual & Thermal Comfort
                <Badge variant="success" className="text-xs">6 Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Glare control, daylighting, temperature and humidity management</p>
            </div>
            <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Acoustic Performance
                <Badge variant="warning" className="text-xs">4 Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Comprehensive noise control for productive environments</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">Australian Climate Considerations</p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Address intense solar conditions and seasonal temperature variations in comfort design
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 3: Management Processes',
      icon: <Briefcase className="h-4 w-4 text-purple-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: '10-15 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Implement comprehensive project management (12 points available):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                Commissioning
              </h4>
              <p className="text-xs text-muted-foreground mb-2">Building services commissioning and verification</p>
              <div className="text-xs bg-purple-100 dark:bg-purple-950/30 p-2 rounded">
                <strong>Points:</strong> 2-4 based on scope and quality
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <h4 className="font-medium text-sm mb-2">Construction Site Impact</h4>
              <p className="text-xs text-muted-foreground mb-2">Environmental site management during construction</p>
              <div className="text-xs bg-green-100 dark:bg-green-950/30 p-2 rounded">
                <strong>Focus:</strong> Dust, noise, water, and waste management
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Step 4: Innovation & Performance',
      icon: <Award className="h-4 w-4 text-orange-600" />,
      priority: 'low' as const,
      isCompliance: false,
      estimatedTime: '8-12 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Achieve additional credits for exceptional performance (10+ points available):</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Innovation Credits
                <Badge variant="success" className="text-xs">Up to 10 Points</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Innovative design solutions beyond standard BREEAM scope</p>
            </div>
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Exemplary Performance</div>
              <p className="text-xs text-muted-foreground">Achieve double points by significantly exceeding credit thresholds</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-orange-100/80 to-red-100/80 dark:from-orange-950/40 dark:to-red-950/40 rounded-lg border-l-4 border-l-orange-500">
            <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">🚀 Innovation Opportunity</p>
            <p className="text-xs text-orange-800 dark:text-orange-200">
              Innovation credits can be decisive for achieving higher certification levels - document unique solutions thoroughly.
            </p>
          </div>
        </div>
      )
    }
  ];

  const quickActions = [
    {
      title: 'Office Building',
      description: 'Commercial office BREEAM setup',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Office BREEAM Template Applied",
          description: "Commercial office building template configured for BREEAM International assessment.",
        });
      }
    },
    {
      title: 'Retail Development',
      description: 'Shopping center/retail configuration',
      icon: <Award className="h-4 w-4 text-green-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Retail Template Applied",
          description: "Retail development template with high occupancy and extended hours considerations.",
        });
      }
    },
    {
      title: 'Mixed-Use Building',
      description: 'Complex multi-function setup',
      icon: <BarChart3 className="h-4 w-4 text-purple-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Mixed-Use Template Applied",
          description: "Complex building template with residential, commercial, and retail components.",
        });
      }
    },
    {
      title: 'Energy Calculator',
      description: 'Notional building comparison',
      icon: <Calculator className="h-4 w-4 text-orange-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "BREEAM Energy Tool Ready",
          description: "Energy performance calculator opened for notional building comparison.",
        });
      }
    },
    {
      title: 'Acoustic Analysis',
      description: 'Sound performance calculator',
      icon: <Shield className="h-4 w-4 text-blue-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "Acoustic Calculator Opened",
          description: "Acoustic performance analysis tool for Health & Wellbeing credits.",
        });
      }
    },
    {
      title: 'BREEAM AP Directory',
      description: 'Find accredited professionals',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      category: 'certification',
      action: () => {
        toast({
          title: "AP Directory Opened",
          description: "BREEAM Accredited Professional directory for your region.",
        });
      }
    }
  ];

  const quickStart = [
    "Select appropriate BREEAM scheme (New Construction, Refurbishment, In-Use)",
    "Configure building type and establish assessment methodology with climate data",
    "Input energy performance data and compare to notional building baseline",
    "Assess management processes including commissioning and site impact procedures",
    "Evaluate health & wellbeing features focusing on Australian climate adaptation",
    "Consider sustainable materials selection and responsible sourcing verification",
    "Plan innovation strategies and identify potential exemplary performance areas",
    "Calculate total score and determine certification level (Pass/Good/Very Good/Excellent/Outstanding)"
  ];

  const commonErrors = [
    "Using incorrect BREEAM scheme - ensure appropriate choice for building type and project stage",
    "Not accounting for Australian climate zone differences in energy and comfort calculations",
    "Missing mandatory minimum standards that prevent certification regardless of total score",
    "Inadequate commissioning evidence and documentation affecting Management category",
    "Poor integration between energy efficiency and health & wellbeing strategies",
    "Insufficient post-occupancy evaluation planning for In-Use performance verification",
    "Not leveraging Australian renewable energy advantages for Low/Zero Carbon credits"
  ];

  return (
    <EnhancedCalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="BREEAM Calculator"
      purpose="Calculate BREEAM International credits across all assessment categories to achieve Pass (30+), Good (45+), Very Good (55+), Excellent (70+), or Outstanding (85+) certification."
      nccRelevance="COMPLEMENTARY to NCC compliance. BREEAM standards often exceed NCC requirements by 25-40% and provide prestigious international recognition for sustainable building practices and operational excellence."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
      quickActions={quickActions}
      completionRate={75}
    />
  );
};