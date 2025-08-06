import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import type { CalculatorState } from '@/hooks/useCalculator';

interface AIAssistantProps {
  calculator: CalculatorState;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ calculator }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>AI-powered construction sustainability assistant will be available soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};