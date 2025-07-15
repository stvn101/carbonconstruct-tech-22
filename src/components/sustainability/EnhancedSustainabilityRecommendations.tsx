
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Target, TrendingUp, Leaf, AlertTriangle, ArrowRight } from 'lucide-react';
import { MaterialInput, TransportInput, EnergyInput, CalculationResult } from '@/lib/carbonExports';

interface EnhancedRecommendation {
  category: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  priority: number;
  implementationDifficulty: 'Easy' | 'Medium' | 'Complex';
  estimatedSavings: string;
  actionSteps: string[];
  icon: React.ReactNode;
}

interface EnhancedSustainabilityRecommendationsProps {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  calculationResult?: CalculationResult | null;
}

const EnhancedSustainabilityRecommendations: React.FC<EnhancedSustainabilityRecommendationsProps> = ({
  materials,
  transport,
  energy,
  calculationResult
}) => {
  
  const generateRecommendations = (): EnhancedRecommendation[] => {
    const recommendations: EnhancedRecommendation[] = [];
    
    // Always provide material optimization recommendations
    if (materials.length > 0) {
      const totalMaterialEmissions = materials.reduce((sum, m) => sum + ((m.carbonFootprint || 0) * (m.quantity || 0)), 0);
      const avgCarbonFootprint = totalMaterialEmissions / materials.reduce((sum, m) => sum + (m.quantity || 0), 1);
      
      // High impact recommendation if average footprint is above 1.0 kg CO2e/kg
      if (avgCarbonFootprint > 1.0) {
        recommendations.push({
          category: 'Materials',
          title: 'Switch to Low-Carbon Alternatives',
          description: `Your materials have an average carbon footprint of ${avgCarbonFootprint.toFixed(2)} kg CO2e/kg. Consider recycled content materials or bio-based alternatives.`,
          impact: 'High',
          priority: 1,
          implementationDifficulty: 'Medium',
          estimatedSavings: '15-40% reduction',
          actionSteps: [
            'Research recycled content alternatives for highest-emission materials',
            'Contact suppliers for bio-based material options',
            'Request EPD documentation for verification'
          ],
          icon: <Leaf className="h-4 w-4" />
        });
      } else if (avgCarbonFootprint > 0.5) {
        recommendations.push({
          category: 'Materials',
          title: 'Optimize Material Specifications',
          description: `Fine-tune your material selection to reduce the current ${avgCarbonFootprint.toFixed(2)} kg CO2e/kg average footprint.`,
          impact: 'Medium',
          priority: 2,
          implementationDifficulty: 'Easy',
          estimatedSavings: '5-15% reduction',
          actionSteps: [
            'Review material grades and specifications',
            'Consider local suppliers to reduce transport emissions',
            'Evaluate quantity requirements for waste reduction'
          ],
          icon: <Target className="h-4 w-4" />
        });
      } else {
        // Even for low-carbon materials, there's always room for improvement
        recommendations.push({
          category: 'Materials',
          title: 'Enhance Material Circularity',
          description: 'Your materials already have low carbon footprints. Focus on end-of-life circularity and local sourcing.',
          impact: 'Low',
          priority: 3,
          implementationDifficulty: 'Easy',
          estimatedSavings: '2-8% reduction',
          actionSteps: [
            'Verify recyclable content percentages',
            'Establish take-back programs with suppliers',
            'Document material passports for future reuse'
          ],
          icon: <Lightbulb className="h-4 w-4" />
        });
      }
    }

    // Transport optimization recommendations
    if (transport.length > 0) {
      const avgDistance = transport.reduce((sum, t) => sum + (t.distance || 0), 0) / transport.length;
      const totalTransportEmissions = transport.reduce((sum, t) => sum + ((t.carbonFootprint || 0) * (t.weight || 0)), 0);
      
      if (avgDistance > 500 || totalTransportEmissions > 1000) {
        recommendations.push({
          category: 'Transport',
          title: 'Optimize Supply Chain Logistics',
          description: `Average transport distance of ${avgDistance.toFixed(0)}km suggests opportunity for local sourcing and route optimization.`,
          impact: avgDistance > 1000 ? 'High' : 'Medium',
          priority: avgDistance > 1000 ? 1 : 2,
          implementationDifficulty: 'Medium',
          estimatedSavings: '10-25% reduction',
          actionSteps: [
            'Map suppliers within 200km radius',
            'Consolidate shipments to reduce frequency',
            'Negotiate rail transport for long distances'
          ],
          icon: <TrendingUp className="h-4 w-4" />
        });
      } else {
        recommendations.push({
          category: 'Transport',
          title: 'Green Fleet Transition',
          description: 'Your transport distances are optimized. Consider electric or biofuel vehicles for final-mile delivery.',
          impact: 'Low',
          priority: 4,
          implementationDifficulty: 'Complex',
          estimatedSavings: '3-12% reduction',
          actionSteps: [
            'Partner with green logistics providers',
            'Request carbon-neutral shipping options',
            'Track real-time emissions per delivery'
          ],
          icon: <Leaf className="h-4 w-4" />
        });
      }
    }

    // Energy efficiency recommendations
    if (energy.length > 0) {
      const totalEnergyConsumption = energy.reduce((sum, e) => sum + (e.amount || 0), 0);
      const avgCarbonIntensity = energy.reduce((sum, e) => sum + ((e.carbonFootprint || 0) * (e.amount || 0)), 0) / totalEnergyConsumption;
      
      if (avgCarbonIntensity > 0.4) {
        recommendations.push({
          category: 'Energy',
          title: 'Renewable Energy Transition',
          description: `High carbon intensity of ${avgCarbonIntensity.toFixed(2)} kg CO2e/kWh indicates fossil fuel dependency. Switch to renewables.`,
          impact: 'High',
          priority: 1,
          implementationDifficulty: 'Medium',
          estimatedSavings: '20-50% reduction',
          actionSteps: [
            'Install on-site solar panels or wind turbines',
            'Purchase green energy certificates',
            'Negotiate renewable energy contracts with utilities'
          ],
          icon: <TrendingUp className="h-4 w-4" />
        });
      } else {
        recommendations.push({
          category: 'Energy',
          title: 'Energy Efficiency Optimization',
          description: 'Your energy has good carbon intensity. Focus on reducing overall consumption through efficiency measures.',
          impact: 'Medium',
          priority: 3,
          implementationDifficulty: 'Easy',
          estimatedSavings: '5-20% reduction',
          actionSteps: [
            'Implement smart building controls',
            'Upgrade to LED lighting systems',
            'Install energy monitoring and analytics'
          ],
          icon: <Target className="h-4 w-4" />
        });
      }
    }

    // Always add a compliance recommendation
    recommendations.push({
      category: 'Compliance',
      title: 'NCC 2025 & NABERS Preparation',
      description: 'Ensure your project meets upcoming Australian building standards and energy rating requirements.',
      impact: 'Medium',
      priority: 2,
      implementationDifficulty: 'Medium',
      estimatedSavings: 'Risk mitigation',
      actionSteps: [
        'Conduct NCC 2025 compliance audit',
        'Target NABERS 5-star energy rating',
        'Document sustainability measures for certification'
      ],
      icon: <AlertTriangle className="h-4 w-4" />
    });

    // Sort by priority and impact
    return recommendations.sort((a, b) => a.priority - b.priority);
  };

  const recommendations = generateRecommendations();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-50 text-green-700';
      case 'Medium': return 'bg-yellow-50 text-yellow-700';
      case 'Complex': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-medium">Enhanced Sustainability Recommendations</h3>
        <Badge variant="outline" className="w-fit">
          {recommendations.length} optimization opportunities
        </Badge>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {recommendations.map((rec, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  {rec.icon}
                  <span className="line-clamp-2">{rec.title}</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getImpactColor(rec.impact)}>
                    {rec.impact} Impact
                  </Badge>
                  <Badge variant="secondary" className={getDifficultyColor(rec.implementationDifficulty)}>
                    {rec.implementationDifficulty}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col space-y-1 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                <Badge variant="outline" className="w-fit text-xs">
                  {rec.category}
                </Badge>
                <span className="text-xs font-medium text-green-600">
                  💰 {rec.estimatedSavings}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs sm:text-sm mb-3">
                {rec.description}
              </CardDescription>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-foreground">Action Steps:</h4>
                <ul className="space-y-1">
                  {rec.actionSteps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-carbon-500" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full sm:w-auto text-xs"
                onClick={() => {
                  // Future: Connect to detailed recommendations or implementation guides
                  console.log(`Implementing: ${rec.title}`);
                }}
              >
                Get Implementation Guide
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-carbon-50 border-carbon-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-carbon-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-carbon-800 mb-1">
                💡 Pro Tip: Continuous Improvement
              </h4>
              <p className="text-xs text-carbon-700">
                Even projects with excellent sustainability scores can benefit from incremental improvements. 
                Regular monitoring and optimization can achieve additional 2-5% emissions reductions annually.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSustainabilityRecommendations;
