import React from 'react';
import { CalculatorHelpModal } from '../CalculatorHelpModal';
import { Leaf, Package, Truck, Recycle } from 'lucide-react';

interface LCAGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LCAGuide: React.FC<LCAGuideProps> = ({ open, onOpenChange }) => {
  const sections = [
    {
      title: 'Step 1: Embodied Carbon Assessment',
      icon: <Package className="h-4 w-4 text-brown-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Calculate carbon emissions from building materials:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Structural Materials:</strong> Concrete, steel, timber quantities and carbon factors</li>
            <li><strong>Envelope Materials:</strong> Insulation, cladding, glazing with EPD data</li>
            <li><strong>Finishes:</strong> Interior materials, flooring, fixtures, and fittings</li>
            <li><strong>MEP Systems:</strong> HVAC equipment, electrical systems, plumbing</li>
            <li><strong>Material Origins:</strong> Local vs imported materials affect transport emissions</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
              Use Australian EPD data where available for accurate embodied carbon factors
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Operational Carbon Modeling',
      icon: <Leaf className="h-4 w-4 text-green-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Project lifetime operational emissions:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Design Life:</strong> Building analysis period (typically 50-60 years)</li>
            <li><strong>Energy Consumption:</strong> Annual heating, cooling, lighting, and equipment loads</li>
            <li><strong>Grid Factors:</strong> Electricity emission factors by state/territory</li>
            <li><strong>Renewable Energy:</strong> On-site generation and green power purchases</li>
            <li><strong>Grid Decarbonization:</strong> Future emission factor projections</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Step 3: Transport & Construction',
      icon: <Truck className="h-4 w-4 text-orange-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Account for construction phase emissions:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Material Transport:</strong> Distance from source to site</li>
            <li><strong>Construction Equipment:</strong> Diesel consumption for earthworks, cranes</li>
            <li><strong>Waste Generation:</strong> Construction and demolition waste to landfill</li>
            <li><strong>Worker Travel:</strong> Daily commuting during construction period</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Step 4: End-of-Life Considerations',
      icon: <Recycle className="h-4 w-4 text-purple-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm">Include demolition and material recovery:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Demolition Energy:</strong> Equipment and transport for building removal</li>
            <li><strong>Material Recovery:</strong> Recycling potential for steel, concrete, timber</li>
            <li><strong>Waste Disposal:</strong> Landfill emissions from non-recyclable materials</li>
            <li><strong>Credit for Recycling:</strong> Avoided emissions from material recovery</li>
          </ul>
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-xs font-medium text-green-800 dark:text-green-300">
              NCC 2025: Consider circular economy principles in material selection
            </p>
          </div>
        </div>
      )
    }
  ];

  const quickStart = [
    "Define project scope and system boundaries (cradle-to-grave)",
    "Input material quantities from architectural and structural drawings",
    "Select appropriate embodied carbon factors from EPD database",
    "Configure operational energy model with HVAC and lighting systems",
    "Add transport distances for major material categories",
    "Set building design life (typically 50-60 years)",
    "Calculate total lifecycle carbon footprint and benchmark results"
  ];

  const commonErrors = [
    "Incomplete material inventory - missing finishes or MEP systems",
    "Using global carbon factors instead of local/regional data",
    "Not accounting for renewable energy in operational phase",
    "Ignoring transport emissions for heavy materials like concrete",
    "Double-counting emissions between different lifecycle stages",
    "Using outdated electricity grid emission factors"
  ];

  return (
    <CalculatorHelpModal
      open={open}
      onOpenChange={onOpenChange}
      title="LCA Calculator"
      purpose="Perform comprehensive lifecycle carbon assessment covering embodied, operational, and end-of-life emissions over the building's entire lifespan."
      nccRelevance="SUPPORTING TOOL for NCC 2025 objectives. While not mandatory, LCA helps optimize material selection and energy systems to achieve overall carbon reduction goals."
      sections={sections}
      quickStart={quickStart}
      commonErrors={commonErrors}
    />
  );
};