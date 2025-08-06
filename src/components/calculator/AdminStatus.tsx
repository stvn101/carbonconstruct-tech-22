import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';

interface AdminStatusProps {
  calculator: CalculatorState;
}

export const AdminStatus: React.FC<AdminStatusProps> = ({ calculator }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Admin dashboard will be available soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};