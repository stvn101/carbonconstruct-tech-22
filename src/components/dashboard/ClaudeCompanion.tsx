import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Lightbulb, 
  MessageSquare, 
  Loader2,
  TrendingDown,
  Leaf,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CalculationResult } from '@/lib/carbonCalculations';
import { toast } from 'sonner';

interface ClaudeCompanionProps {
  result?: CalculationResult;
  onAdviceReceived?: (advice: string) => void;
}

export const ClaudeCompanion: React.FC<ClaudeCompanionProps> = ({
  result,
  onAdviceReceived
}) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const suggestedPrompts = [
    {
      id: 'optimization',
      icon: TrendingDown,
      title: 'Reduce Emissions',
      prompt: 'What are the top 3 ways to reduce my project\'s carbon footprint based on this data?',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'compliance',
      icon: Target,
      title: 'Improve Compliance',
      prompt: 'How can I improve my Green Star and NCC 2025 compliance scores?',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'materials',
      icon: Leaf,
      title: 'Material Alternatives',
      prompt: 'Suggest low-carbon material alternatives for my highest-emission materials.',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'transport',
      icon: MessageSquare,
      title: 'Transport Optimization',
      prompt: 'How can I optimize my transport routes and delivery schedules?',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  const getAdvice = async (prompt: string) => {
    if (!result) {
      toast.error('No calculation data available for analysis');
      return;
    }

    setIsLoading(true);
    setSelectedTopic(prompt);

    try {
      const { data, error } = await supabase.functions.invoke('claude-companion', {
        body: {
          prompt,
          calculationData: {
            totalEmissions: result.totalEmissions,
            materialEmissions: result.materialEmissions,
            transportEmissions: result.transportEmissions,
            energyEmissions: result.energyEmissions,
            scope1: result.scope1,
            scope2: result.scope2,
            scope3: result.scope3,
            breakdownByMaterial: result.breakdownByMaterial,
            breakdownByTransport: result.breakdownByTransport,
            breakdownByEnergy: result.breakdownByEnergy
          },
          context: 'dashboard_analysis'
        }
      });

      if (error) throw error;

      if (data.error) {
        setAdvice(data.fallback || 'Unable to generate advice at this time.');
      } else {
        setAdvice(data.advice);
        onAdviceReceived?.(data.advice);
      }

      toast.success('Claude Companion advice generated');
    } catch (error) {
      console.error('Error getting advice:', error);
      toast.error('Failed to get AI advice. Please try again.');
      setAdvice('Unable to connect to Claude Companion. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const complianceScore = result ? Math.min(100, Math.max(0, 
    100 - (result.totalEmissions / 10000) * 100
  )) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Claude Companion
          <Badge variant="secondary" className="ml-auto">AI Assistant</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        {result && (
          <Alert className="bg-blue-50 border-blue-200">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick Analysis:</strong> Your project emits {(result.totalEmissions / 1000).toFixed(1)} t CO₂-e 
              with a {complianceScore.toFixed(0)}% sustainability score. 
              {complianceScore < 70 && " Consider optimization opportunities below."}
            </AlertDescription>
          </Alert>
        )}

        {/* Suggested Topics */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Ask Claude about:</h4>
          <div className="grid grid-cols-2 gap-2">
            {suggestedPrompts.map((suggestion) => {
              const IconComponent = suggestion.icon;
              return (
                <Button
                  key={suggestion.id}
                  variant="outline"
                  size="sm"
                  onClick={() => getAdvice(suggestion.prompt)}
                  disabled={isLoading}
                  className="h-auto p-3 text-left justify-start"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs font-medium">{suggestion.title}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              Claude is analyzing your carbon data...
            </span>
          </div>
        )}

        {/* Advice Display */}
        {advice && !isLoading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium">Claude's Advice</h4>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {advice}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setAdvice('')}
              className="text-xs"
            >
              Clear advice
            </Button>
          </div>
        )}

        {/* No Data State */}
        {!result && (
          <Alert>
            <AlertDescription>
              Complete your carbon calculation to get personalized AI advice from Claude Companion.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};