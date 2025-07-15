
import React from 'react';
import { MaterialInput } from '@/lib/carbonExports';
import { MaterialOptimizationPanel } from '@/components/sustainability/optimization';

interface OptimizationTabContentProps {
  materials: MaterialInput[];
  onOptimizationComplete?: (report: any) => void;
}

const OptimizationTabContent: React.FC<OptimizationTabContentProps> = ({
  materials,
  onOptimizationComplete
}) => {
  return (
    <div className="space-y-6">
      <MaterialOptimizationPanel 
        materials={materials}
        onOptimizationComplete={onOptimizationComplete}
      />
    </div>
  );
};

export default OptimizationTabContent;
