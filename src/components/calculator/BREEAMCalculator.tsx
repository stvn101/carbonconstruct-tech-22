import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';

interface BREEAMCalculatorProps {
  calculator: CalculatorState;
  actions: any;
}

export const BREEAMCalculator: React.FC<BREEAMCalculatorProps> = ({ calculator }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          BREEAM Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>BREEAM assessment calculator will be available soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};