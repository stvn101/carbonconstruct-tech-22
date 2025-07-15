import React from 'react';
import { CalculatorHelpModal } from '../CalculatorHelpModal';
import { Award, Droplets, Wind, TreePine } from 'lucide-react';

interface LEEDGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LEEDGuide: React.FC<LEEDGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Energy & Atmosphere (EA)',
      icon: <Award className="h-4 w-4 text-green-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Optimize energy performance for maximum EA points:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Energy Performance:</strong> 16-20 points for exceeding ASHRAE 90.1 baseline by 5-50%</li>
            <li><strong>Renewable Energy:</strong> 1-3 points for on-site or off-site renewable systems</li>
            <li><strong>Enhanced Commissioning:</strong> 6 points for comprehensive building systems verification</li>
            <li><strong>Measurement & Verification:</strong> 3 points for ongoing energy monitoring systems</li>
          </ul>
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-xs font-medium text-green-800 dark:text-green-300">
              NCC compliance helps achieve LEED energy performance thresholds
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Water Efficiency (WE)',
      icon: <Droplets className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Implement water conservation strategies:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Indoor Water Use:</strong> 6 points for efficient fixtures and fittings</li>
            <li><strong>Outdoor Water Use:</strong> 2-4 points for landscape water efficiency</li>
            <li><strong>Water Metering:</strong> 1 point for building-level water monitoring</li>
            <li><strong>Cooling Tower:</strong> 2 points for efficient cooling water management</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Indoor Environmental Quality (EQ)',
      icon: <Wind className="h-4 w-4 text-purple-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Enhance occupant comfort and wellbeing:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Ventilation:</strong> 1-3 points for outdoor air delivery monitoring</li>
            <li><strong>Thermal Comfort:</strong> 1 point for design and verification compliance</li>
            <li><strong>Daylighting:</strong> 2-3 points for natural light optimization</li>
            <li><strong>Views:</strong> 1 point for direct line of sight to outdoors</li>
            <li><strong>Acoustic Performance:</strong> 1 point for noise control measures</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Materials & Resources (MR)',
      icon: <TreePine className="h-4 w-4 text-brown-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Select sustainable building materials:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>EPDs:</strong> 1-2 points for Environmental Product Declarations</li>
            <li><strong>Regional Materials:</strong> 1-2 points for locally sourced materials</li>
            <li><strong>Recycled Content:</strong> 1-2 points for post-consumer recycled materials</li>
            <li><strong>Rapidly Renewable:</strong> 1 point for bio-based materials</li>
            <li><strong>Construction Waste:</strong> 1-2 points for waste diversion from landfill</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
              Australian materials databases support MR credit calculations
            </p>
          </div>
        </div>
      )
    }
  ];

  const quickStart = [
    "Establish project baseline using ASHRAE 90.1 energy model",
    "Configure building systems for 20%+ energy performance improvement",
    "Design water-efficient systems and native landscaping",
    "Select materials with EPDs and regional sourcing",
    "Plan construction waste management and recycling program",
    "Design for optimal daylighting and natural ventilation",
    "Calculate total points and determine certification level"
  ];

  const commonErrors = [
    "Using incorrect baseline - ASHRAE 90.1 not local energy codes",
    "Not accounting for Australian climate data in energy modeling",
    "Missing documentation for sustainable material claims",
    "Inadequate commissioning scope affecting EA credits",
    "Poor integration between water efficiency and landscape design",
    "Insufficient measurement and verification planning"
  ];

  return (
    <CalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="LEED Calculator"
      purpose="Calculate LEED v4.1 BD+C points across all credit categories to achieve Certified, Silver, Gold, or Platinum certification levels."
      nccRelevance="COMPLEMENTARY to NCC requirements. LEED energy performance credits align with and exceed NCC Section J requirements, supporting international sustainability recognition."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
    />
  );
};