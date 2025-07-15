
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EPDRatingDashboard from './EPDRatingDashboard';
import RecyclabilityTrafficLights from './RecyclabilityTrafficLights';
import GrokMaterialAnalysis from './GrokMaterialAnalysis';
import EnhancedSustainabilityRecommendations from '../sustainability/EnhancedSustainabilityRecommendations';

const MaterialDashboard: React.FC = () => {
  // Temporary empty data until calculator is rebuilt
  const mockData = {
    materials: [],
    transport: [],
    energy: [],
    results: null
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Material Analytics Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Comprehensive material performance, compliance tracking, and AI-powered insights
        </p>
      </div>

      <Tabs defaultValue="epd-ratings" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="epd-ratings" className="text-xs sm:text-sm py-2 sm:py-3">
            EPD Ratings
          </TabsTrigger>
          <TabsTrigger value="recyclability" className="text-xs sm:text-sm py-2 sm:py-3">
            Recyclability
          </TabsTrigger>
          <TabsTrigger value="grok-analysis" className="text-xs sm:text-sm py-2 sm:py-3">
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs sm:text-sm py-2 sm:py-3">
            Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="epd-ratings" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <EPDRatingDashboard />
        </TabsContent>
        
        <TabsContent value="recyclability" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <RecyclabilityTrafficLights />
        </TabsContent>
        
        <TabsContent value="grok-analysis" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <GrokMaterialAnalysis />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <EnhancedSustainabilityRecommendations 
            materials={mockData.materials}
            transport={mockData.transport}
            energy={mockData.energy}
            calculationResult={mockData.results}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialDashboard;
