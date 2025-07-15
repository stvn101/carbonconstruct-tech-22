
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';
import { Lightbulb, Leaf, Target, TrendingUp, WifiOff } from 'lucide-react';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { useIsMobile } from '@/hooks/use-mobile';

interface SuggestionsTabContentProps {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
}

interface Suggestion {
  category: string;
  title: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
}

const SuggestionsTabContent: React.FC<SuggestionsTabContentProps> = ({
  materials,
  transport,
  energy
}) => {
  const { isOfflineMode } = useOfflineMode();
  const { isMobile } = useIsMobile();

  // Memoize suggestions generation for performance
  const suggestions = useMemo((): Suggestion[] => {
    const suggestionsList: Suggestion[] = [];
    
    // Material suggestions
    if (materials.length > 0) {
      const highCarbonMaterials = materials.filter(m => (m.carbonFootprint || 0) > 1.0);
      if (highCarbonMaterials.length > 0) {
        suggestionsList.push({
          category: 'Materials',
          title: 'Consider Low-Carbon Alternatives',
          description: `${highCarbonMaterials.length} material(s) have high carbon footprints. Consider sustainable alternatives like recycled content or bio-based materials.`,
          impact: 'High',
          icon: <Leaf className="h-4 w-4" />
        });
      }

      const heavyMaterials = materials.filter(m => (m.quantity || 0) > 1000);
      if (heavyMaterials.length > 0) {
        suggestionsList.push({
          category: 'Materials',
          title: 'Optimize Material Quantities',
          description: `Large quantities detected for ${heavyMaterials.length} material(s). Review specifications to minimize waste.`,
          impact: 'Medium',
          icon: <Target className="h-4 w-4" />
        });
      }
    }
    
    // Transport suggestions
    if (transport.length > 0) {
      const longDistanceTransport = transport.filter(t => (t.distance || 0) > 500);
      if (longDistanceTransport.length > 0) {
        suggestionsList.push({
          category: 'Transport',
          title: 'Optimize Transportation Routes',
          description: `${longDistanceTransport.length} transport route(s) exceed 500km. Consider local suppliers or consolidated shipping.`,
          impact: 'Medium',
          icon: <Target className="h-4 w-4" />
        });
      }

      const highCarbonTransport = transport.filter(t => (t.carbonFootprint || 0) > 0.5);
      if (highCarbonTransport.length > 0) {
        suggestionsList.push({
          category: 'Transport',
          title: 'Switch to Lower-Carbon Transport',
          description: 'Consider rail or sea transport instead of trucking for long distances to reduce emissions.',
          impact: 'High',
          icon: <Leaf className="h-4 w-4" />
        });
      }
    }
    
    // Energy suggestions
    if (energy.length > 0) {
      const highEnergyConsumption = energy.filter(e => (e.amount || 0) > 1000);
      if (highEnergyConsumption.length > 0) {
        suggestionsList.push({
          category: 'Energy',
          title: 'Implement Energy Efficiency Measures',
          description: 'High energy consumption detected. Consider renewable energy sources, LED lighting, or improved insulation.',
          impact: 'High',
          icon: <TrendingUp className="h-4 w-4" />
        });
      }

      const fossilFuelEnergy = energy.filter(e => e.type === 'electricity' && (e.carbonFootprint || 0) > 0.3);
      if (fossilFuelEnergy.length > 0) {
        suggestionsList.push({
          category: 'Energy',
          title: 'Switch to Renewable Energy',
          description: 'Your electricity appears to have a high carbon intensity. Consider solar panels or green energy providers.',
          impact: 'High',
          icon: <Leaf className="h-4 w-4" />
        });
      }
    }
    
    // Default suggestion if no specific issues found
    if (suggestionsList.length === 0) {
      suggestionsList.push({
        category: 'General',
        title: 'Sustainability Assessment Complete',
        description: 'Your project appears to have good sustainability characteristics. Continue monitoring and consider future improvements.',
        impact: 'Low',
        icon: <Lightbulb className="h-4 w-4" />
      });
    }
    
    return suggestionsList;
  }, [materials, transport, energy]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getImpactDescription = (impact: string) => {
    switch (impact) {
      case 'High': return 'Significant carbon reduction potential';
      case 'Medium': return 'Moderate improvement opportunity';
      case 'Low': return 'Minor optimization available';
      default: return '';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-medium">Sustainability Suggestions</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {suggestions.length} recommendation{suggestions.length !== 1 ? 's' : ''}
          </Badge>
          {isOfflineMode && (
            <Badge variant="secondary" className="text-xs">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      {isOfflineMode && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-3 sm:p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You're offline. AI-powered suggestions will be available when you reconnect.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:gap-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  {suggestion.icon}
                  <span className="line-clamp-2">{suggestion.title}</span>
                </CardTitle>
                <div className="flex flex-col space-y-1 sm:items-end">
                  <Badge variant={getImpactColor(suggestion.impact)} className="text-xs">
                    {suggestion.impact} Impact
                  </Badge>
                  <Badge variant="outline" className="w-fit text-xs">
                    {suggestion.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs sm:text-sm mb-2">
                {suggestion.description}
              </CardDescription>
              {suggestion.impact !== 'Low' && (
                <p className="text-xs text-muted-foreground italic">
                  💡 {getImpactDescription(suggestion.impact)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50 border-dashed">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-carbon-600" />
            Need More Detailed Analysis?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            For more comprehensive sustainability analysis and AI-powered recommendations, 
            try the "AI Optimization" tab which provides detailed material alternatives and 
            optimization strategies.
          </p>
          {isMobile && (
            <p className="text-xs text-muted-foreground">
              📱 Swipe left or use the navigation arrows to access AI Optimization.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionsTabContent;
