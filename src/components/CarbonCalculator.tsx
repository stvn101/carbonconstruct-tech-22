
import React from 'react';
import SafeNewCalculator from './calculator/SafeNewCalculator';

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

const CarbonCalculator = ({ demoMode = false }: CarbonCalculatorProps) => {
  return (
    <div className="container mx-auto px-4 md:px-6 pb-16">
      <SafeNewCalculator demoMode={demoMode} />
    </div>
  );
};

export default CarbonCalculator;
