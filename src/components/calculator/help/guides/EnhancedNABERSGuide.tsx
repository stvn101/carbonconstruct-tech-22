import React from 'react';
import { EnhancedCalculatorHelpModal } from '../EnhancedCalculatorHelpModal';
import { Star, TrendingUp, Activity, Award, FileText, Calendar, CheckCircle, Building, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface EnhancedNABERSGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedNABERSGuide: React.FC<EnhancedNABERSGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Energy Data Collection',
      icon: <Activity className="h-4 w-4 text-blue-600" />,
      priority: 'high' as const,
      isCompliance: true,
      estimatedTime: '10-15 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Gather 12 months of actual energy consumption data for accurate NABERS assessment:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Electricity Bills
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Monthly kWh consumption for base building services only</p>
              <div className="text-xs bg-blue-100 dark:bg-blue-950/30 p-2 rounded">
                <strong>Exclude:</strong> Tenant consumption, IT equipment, commercial kitchens
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Gas Bills (if applicable)
                <Badge variant="outline" className="text-xs">Optional</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Monthly MJ consumption for heating/hot water</p>
              <div className="text-xs bg-green-100 dark:bg-green-950/30 p-2 rounded">
                <strong>Include:</strong> Base building HVAC and hot water systems only
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Green Power Certificates
                <Badge variant="success" className="text-xs">Bonus</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Percentage of renewable energy purchased</p>
              <div className="text-xs bg-purple-100 dark:bg-purple-950/30 p-2 rounded">
                <strong>Impact:</strong> Can improve rating by 0.5-1.0 stars
              </div>
            </div>
            <div className="p-4 border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">On-site Generation</div>
              <p className="text-xs text-muted-foreground mb-2">Solar PV or other renewable systems</p>
              <div className="text-xs bg-orange-100 dark:bg-orange-950/30 p-2 rounded">
                <strong>Note:</strong> Must have 12 months of generation data
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 dark:from-amber-950/40 dark:to-yellow-950/40 rounded-lg border-l-4 border-l-amber-500">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">⚠️ Critical: Actual Data Required</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              NABERS requires 12 months of actual consumption data - design estimates or projections are not acceptable for certification.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Building Profile Setup',
      icon: <Building className="h-4 w-4 text-green-600" />,
      priority: 'high' as const,
      isCompliance: true,
      estimatedTime: '5-8 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Configure building characteristics for accurate NABERS rating calculation:</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Net Lettable Area (NLA)
                <Badge variant="destructive" className="text-xs">Critical</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Tenanted area in m² excluding common areas, plant rooms, and circulation spaces</p>
            </div>
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Building Type Classification</div>
              <p className="text-xs text-muted-foreground">Office, Shopping Centre, Hotel, Data Centre - affects benchmark comparison</p>
            </div>
            <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-2">Operating Hours Profile</div>
              <p className="text-xs text-muted-foreground">Standard weekly operating hours impact energy intensity normalization</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Step 3: Star Rating Calculation',
      icon: <TrendingUp className="h-4 w-4 text-purple-600" />,
      priority: 'medium' as const,
      isCompliance: true,
      estimatedTime: '3-5 min',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Understanding your NABERS Energy rating methodology:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                Energy Intensity
              </h4>
              <p className="text-xs text-muted-foreground mb-2">MJ/m²/year calculated from 12-month consumption</p>
              <div className="text-xs bg-blue-100 dark:bg-blue-950/30 p-2 rounded">
                Lower = Better performance
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Benchmark Comparison
              </h4>
              <p className="text-xs text-muted-foreground mb-2">Compared against similar buildings in database</p>
              <div className="text-xs bg-purple-100 dark:bg-purple-950/30 p-2 rounded">
                Climate adjusted automatically
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                Star Rating
              </h4>
              <p className="text-xs text-muted-foreground mb-2">1-6 stars based on percentile ranking</p>
              <div className="text-xs bg-yellow-100 dark:bg-yellow-950/30 p-2 rounded">
                6 stars = Top 25% performers
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg border-l-4 border-l-green-500">
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">✅ NCC 2025 Compliance Requirement</p>
            <p className="text-xs text-green-800 dark:text-green-200">
              Commercial buildings over 1000m² must achieve minimum 3.5 star NABERS Energy rating for building permit approval.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 4: Certification Process',
      icon: <Award className="h-4 w-4 text-red-600" />,
      priority: 'medium' as const,
      isCompliance: false,
      estimatedTime: 'External process',
      content: (
        <div className="space-y-4">
          <p className="text-sm">Complete NABERS certification requirements for official rating:</p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Accredited Assessor
                <Badge variant="destructive" className="text-xs">Mandatory</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Independent third-party verification required for official NABERS rating</p>
            </div>
            <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-1">Data Verification Process</div>
              <p className="text-xs text-muted-foreground">Energy bills and building details verified independently by assessor</p>
            </div>
            <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
              <div className="font-medium text-sm mb-1">Physical Site Inspection</div>
              <p className="text-xs text-muted-foreground">On-site verification of building systems and boundary conditions</p>
            </div>
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
          title: "Office Template Applied",
          description: "Standard office building parameters loaded for NABERS assessment.",
        });
      }
    },
    {
      title: 'Shopping Centre',
      description: 'Retail/shopping centre configuration',
      icon: <Building className="h-4 w-4 text-green-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Retail Template Applied",
          description: "Shopping centre template with typical energy patterns loaded.",
        });
      }
    },
    {
      title: 'Hotel/Accommodation',
      description: 'Hotel and accommodation setup',
      icon: <Building className="h-4 w-4 text-purple-600" />,
      category: 'templates',
      action: () => {
        toast({
          title: "Hotel Template Applied",
          description: "Accommodation facility template with 24/7 operations loaded.",
        });
      }
    },
    {
      title: 'Upload Energy Bills',
      description: 'Import 12 months of utility data',
      icon: <FileText className="h-4 w-4 text-orange-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "File Upload Ready",
          description: "Ready to import electricity and gas bills for analysis.",
        });
      }
    },
    {
      title: 'Check NLA Calculator',
      description: 'Calculate Net Lettable Area correctly',
      icon: <Activity className="h-4 w-4 text-green-600" />,
      category: 'tools',
      action: () => {
        toast({
          title: "NLA Calculator Opened",
          description: "Net Lettable Area calculation tool opened with NABERS guidelines.",
        });
      }
    },
    {
      title: 'Find Assessor',
      description: 'Locate accredited NABERS assessor',
      icon: <CheckCircle className="h-4 w-4 text-red-600" />,
      category: 'certification',
      action: () => {
        toast({
          title: "Assessor Directory",
          description: "Opening NABERS accredited assessor directory for your location.",
        });
      }
    }
  ];

  const quickStart = [
    "Collect 12 months of electricity bills (and gas if applicable)",
    "Measure or obtain accurate Net Lettable Area (NLA) in square meters",
    "Select correct building type from NABERS categories",
    "Enter monthly energy consumption data systematically",
    "Configure building operating hours and special equipment loads",
    "Add green power purchases and on-site renewable generation",
    "Review calculated energy intensity and preliminary star rating",
    "Export results for accredited assessor verification and certification"
  ];

  const commonErrors = [
    "Using Gross Floor Area (GFA) instead of Net Lettable Area (NLA) - can cause 20-30% error",
    "Including tenant energy consumption in base building assessment",
    "Using incomplete or mixed billing periods instead of full 12-month cycle",
    "Incorrect climate zone selection affecting benchmark comparisons",
    "Not accounting for green power purchases in renewable energy calculations",
    "Missing on-site renewable energy generation data or incorrect metering",
    "Incorrect building type classification leading to wrong benchmark comparison"
  ];

  return (
    <EnhancedCalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="NABERS Calculator"
      purpose="Calculate NABERS Energy rating based on actual building energy consumption data and compare against national benchmarks for building performance certification."
      nccRelevance="REQUIRED for NCC 2025 compliance. Commercial buildings over 1000m² must achieve minimum 3.5 star NABERS Energy rating or demonstrate equivalent performance through alternative assessment methods."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
      quickActions={quickActions}
      completionRate={35}
    />
  );
};