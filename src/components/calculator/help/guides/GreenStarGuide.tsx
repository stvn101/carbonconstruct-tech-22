import React from 'react';
import { CalculatorHelpModal } from '../CalculatorHelpModal';
import { Star, Leaf, Droplets, Users } from 'lucide-react';

interface GreenStarGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GreenStarGuide: React.FC<GreenStarGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Energy Category',
      icon: <Star className="h-4 w-4 text-green-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Optimize energy performance for Green Star points:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Greenhouse Gas Emissions:</strong> Up to 20 points for energy efficiency improvements</li>
            <li><strong>Peak Energy Demand:</strong> 1 point for demand management systems</li>
            <li><strong>Energy Sub-metering:</strong> 1 point for detailed energy monitoring</li>
            <li><strong>Lighting Power Density:</strong> 2 points for efficient lighting design</li>
            <li><strong>Renewable Energy:</strong> 2 points for on-site generation systems</li>
          </ul>
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-xs font-medium text-green-800 dark:text-green-300">
              NCC Section J compliance provides foundation for Green Star energy credits
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Water Category',
      icon: <Droplets className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Implement comprehensive water management:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Potable Water:</strong> Up to 10 points for water use reduction</li>
            <li><strong>Water Meters:</strong> 1 point for building-level water monitoring</li>
            <li><strong>Landscape Irrigation:</strong> 1 point for efficient irrigation systems</li>
            <li><strong>Fire Systems:</strong> 1 point for water-efficient fire protection</li>
            <li><strong>Cooling Systems:</strong> 1 point for water-efficient cooling towers</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Materials Category',
      icon: <Leaf className="h-4 w-4 text-brown-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Select sustainable building materials:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Concrete:</strong> Up to 4 points for supplementary cementitious materials</li>
            <li><strong>Steel:</strong> Up to 4 points for recycled content and responsible sourcing</li>
            <li><strong>Timber:</strong> Up to 3 points for certified sustainable forestry</li>
            <li><strong>PVC Minimization:</strong> 1 point for avoiding PVC where practical</li>
            <li><strong>Design for Disassembly:</strong> 1 point for end-of-life planning</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
              Australian materials databases support responsible sourcing verification
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Indoor Environment Quality',
      icon: <Users className="h-4 w-4 text-purple-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Enhance occupant health and productivity:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Daylight:</strong> Up to 4 points for natural lighting optimization</li>
            <li><strong>Glare Reduction:</strong> 1 point for external shading and blinds</li>
            <li><strong>High Frequency Ballasts:</strong> 1 point for flicker-free lighting</li>
            <li><strong>Internal Noise:</strong> Up to 2 points for acoustic design</li>
            <li><strong>Volatile Organics:</strong> Up to 5 points for low-emission materials</li>
            <li><strong>Thermal Comfort:</strong> 1 point for individual comfort control</li>
          </ul>
        </div>
      )
    }
  ];

  const quickStart = [
    "Select appropriate Green Star rating tool (Design & As Built, etc.)",
    "Configure building type and establish baseline performance",
    "Input energy performance data and calculate GHG reduction",
    "Design water-efficient systems and native landscaping",  
    "Specify sustainable materials with appropriate certifications",
    "Plan indoor environment quality features for occupant wellbeing",
    "Calculate total points and determine star rating (4-6 stars)"
  ];

  const commonErrors = [
    "Using inappropriate rating tool for building type or project stage",
    "Not accounting for Australian climate conditions in modeling",
    "Missing material certification documentation",
    "Inadequate daylight modeling affecting IEQ credits",
    "Poor coordination between energy and water efficiency strategies",
    "Insufficient commissioning planning for building systems"
  ];

  return (
    <CalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="Green Star Calculator"
      purpose="Calculate Green Building Council Australia points across all categories to achieve 4, 5, or 6 Green Star certification recognizing environmental excellence."
      nccRelevance="BUILDS UPON NCC requirements. Green Star 4-star minimum aligns with NCC 2025 objectives, while 5-6 stars demonstrate leadership in sustainable building performance."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
    />
  );
};