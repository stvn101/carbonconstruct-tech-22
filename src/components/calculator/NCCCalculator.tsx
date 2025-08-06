import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';

interface NCCCalculatorProps {
  calculator: CalculatorState;
  actions: any;
}

export const NCCCalculator: React.FC<NCCCalculatorProps> = ({ calculator }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          National Construction Code (NCC) Compliance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>NCC compliance checker will be available soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};