import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';

interface NABERSCalculatorProps {
  calculator: CalculatorState;
  actions: any;
}

export const NABERSCalculator: React.FC<NABERSCalculatorProps> = ({ calculator }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          NABERS Energy Rating
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>NABERS energy rating calculator will be available soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};