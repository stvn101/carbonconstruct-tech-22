import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';

interface LEEDCalculatorProps {
  calculator: CalculatorState;
  actions: any;
}

export const LEEDCalculator: React.FC<LEEDCalculatorProps> = ({ calculator }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          LEED Certification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>LEED certification calculator will be available soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};