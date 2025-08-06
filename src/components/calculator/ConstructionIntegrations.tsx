import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';

interface ConstructionIntegrationsProps {
  calculator: CalculatorState;
}

export const ConstructionIntegrations: React.FC<ConstructionIntegrationsProps> = ({ calculator }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Construction Integrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Construction software integrations will be available soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};