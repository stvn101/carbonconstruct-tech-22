import React from 'react';
import { CalculatorHelpModal } from '../CalculatorHelpModal';
import { Award, Zap, Shield, Briefcase } from 'lucide-react';

interface BREEAMGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BREEAMGuide: React.FC<BREEAMGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Energy Performance',
      icon: <Zap className="h-4 w-4 text-green-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Achieve high energy efficiency ratings:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Energy Efficiency:</strong> Up to 15 points for exceeding notional building performance</li>
            <li><strong>Sub-metering:</strong> 2 points for separate energy monitoring systems</li>
            <li><strong>External Lighting:</strong> 1 point for efficient outdoor lighting design</li>
            <li><strong>Low/Zero Carbon:</strong> 3 points for renewable energy systems</li>
            <li><strong>Energy Monitoring:</strong> 1 point for building management systems</li>
          </ul>
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-xs font-medium text-green-800 dark:text-green-300">
              BREEAM energy targets often exceed NCC requirements by 25-40%
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Health & Wellbeing',
      icon: <Shield className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Optimize occupant health and comfort:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Visual Comfort:</strong> 4 points for glare control and daylighting</li>
            <li><strong>Indoor Air Quality:</strong> 2 points for pollutant control and ventilation</li>
            <li><strong>Thermal Comfort:</strong> 2 points for temperature and humidity control</li>
            <li><strong>Acoustic Performance:</strong> 4 points for noise control measures</li>
            <li><strong>Safe Containment:</strong> 1 point for hazardous substance management</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Management Processes',
      icon: <Briefcase className="h-4 w-4 text-purple-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Implement comprehensive project management:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Commissioning:</strong> 2-4 points for building services commissioning</li>
            <li><strong>Construction Site:</strong> 4 points for environmental site management</li>
            <li><strong>Stakeholder Participation:</strong> 1 point for consultation processes</li>
            <li><strong>Life Cycle Costing:</strong> 1 point for whole-life cost analysis</li>
            <li><strong>Post Occupancy:</strong> 1 point for building performance evaluation</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Innovation & Exemplary Performance',
      icon: <Award className="h-4 w-4 text-orange-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Achieve additional credits for exceptional performance:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Innovation Credits:</strong> Up to 10 points for innovative design solutions</li>
            <li><strong>Exemplary Performance:</strong> Double points for exceeding credit thresholds</li>
            <li><strong>BREEAM Accredited Professional:</strong> 1 point for AP involvement</li>
            <li><strong>Research & Development:</strong> Points for contributing to BREEAM research</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
              Innovation credits can help achieve higher certification levels
            </p>
          </div>
        </div>
      )
    }
  ];

  const quickStart = [
    "Select appropriate BREEAM scheme (New Construction, Refurbishment, etc.)",
    "Configure building type and establish assessment methodology",
    "Input energy performance data and compare to notional building",
    "Assess management processes and commissioning procedures",
    "Evaluate health & wellbeing features and indoor environment",
    "Consider materials selection and transportation impacts",
    "Calculate total score and determine certification level"
  ];

  const commonErrors = [
    "Using incorrect BREEAM scheme for building type or project stage",
    "Not accounting for Australian climate in energy calculations",
    "Missing mandatory credits that prevent certification",
    "Inadequate commissioning evidence affecting management credits",
    "Poor integration between water and energy efficiency measures",
    "Insufficient post-occupancy evaluation planning"
  ];

  return (
    <CalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="BREEAM Calculator"
      purpose="Calculate BREEAM International credits across all assessment categories to achieve Pass, Good, Very Good, Excellent, or Outstanding certification."
      nccRelevance="COMPLEMENTARY to NCC compliance. BREEAM standards often exceed NCC requirements and provide international recognition for sustainable building practices."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
    />
  );
};