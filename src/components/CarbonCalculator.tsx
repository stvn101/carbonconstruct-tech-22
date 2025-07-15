
import React from 'react';
import NewCalculator from './calculator/NewCalculator';

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

const CarbonCalculator = ({ demoMode = false }: CarbonCalculatorProps) => {
  return (
    <div className="container mx-auto px-4 md:px-6 pb-16">
      <NewCalculator demoMode={demoMode} />
    </div>
  );
};

export default CarbonCalculator;
