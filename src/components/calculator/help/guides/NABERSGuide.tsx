import React from 'react';
import { CalculatorHelpModal } from '../CalculatorHelpModal';
import { Star, TrendingUp, Activity, Award } from 'lucide-react';

interface NABERSGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NABERSGuide: React.FC<NABERSGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Energy Data Collection',
      icon: <Activity className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Gather 12 months of actual energy consumption data:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Electricity Bills:</strong> Monthly kWh consumption for base building services</li>
            <li><strong>Gas Bills:</strong> Monthly MJ consumption if applicable</li>
            <li><strong>Green Power:</strong> Percentage of renewable energy purchased</li>
            <li><strong>On-site Generation:</strong> Solar PV or other renewable systems</li>
            <li><strong>Building Hours:</strong> Standard operating hours per week</li>
          </ul>
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              Note: NABERS requires actual consumption data, not design estimates
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Building Profile Setup',
      icon: <Star className="h-4 w-4 text-green-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Configure building characteristics for accurate rating:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Net Lettable Area:</strong> Tenanted area in m² (excludes common areas)</li>
            <li><strong>Building Type:</strong> Office, Shopping Centre, Hotel, etc.</li>
            <li><strong>Climate Zone:</strong> Australian climate zone affects benchmarks</li>
            <li><strong>Occupancy Hours:</strong> Standard weekly operating hours</li>
            <li><strong>Special Equipment:</strong> Data centres, commercial kitchens, etc.</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Step 3: Rating Calculation',
      icon: <TrendingUp className="h-4 w-4 text-purple-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Understanding your NABERS Energy rating:</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Energy Intensity</h4>
              <p className="text-xs text-muted-foreground mt-1">MJ/m²/year calculated from consumption data</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Star Rating</h4>
              <p className="text-xs text-muted-foreground mt-1">1-6 stars based on benchmark comparison</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-xs font-medium text-green-800 dark:text-green-300">
              NCC 2025: Commercial buildings &gt;1000m² must achieve minimum 3.5 stars
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 4: Certification Process',
      icon: <Award className="h-4 w-4 text-red-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Complete NABERS certification requirements:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Accredited Assessor:</strong> Required for official NABERS rating</li>
            <li><strong>Data Verification:</strong> Energy bills must be verified independently</li>
            <li><strong>Site Inspection:</strong> Physical verification of building systems</li>
            <li><strong>Rating Certificate:</strong> Valid for 12 months from issue date</li>
          </ul>
        </div>
      )
    }
  ];

  const quickStart = [
    "Collect 12 months of energy bills (electricity and gas)",
    "Measure net lettable area accurately in square meters",
    "Select correct building type from NABERS categories",
    "Enter monthly energy consumption data systematically",
    "Configure building operating hours and special equipment",
    "Review calculated energy intensity and star rating",
    "Export results for accredited assessor verification"
  ];

  const commonErrors = [
    "Using gross floor area instead of net lettable area",
    "Including tenant energy consumption in base building assessment",
    "Mixing different billing periods or incomplete 12-month data",
    "Incorrect climate zone selection affecting benchmarks",
    "Not accounting for green power purchases",
    "Missing on-site renewable energy generation data"
  ];

  return (
    <CalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="NABERS Calculator"
      purpose="Calculate NABERS Energy rating based on actual building energy consumption data and compare against national benchmarks."
      nccRelevance="REQUIRED for NCC 2025 compliance. Commercial buildings over 1000m² must achieve minimum 3.5 star NABERS Energy rating or equivalent."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
    />
  );
};