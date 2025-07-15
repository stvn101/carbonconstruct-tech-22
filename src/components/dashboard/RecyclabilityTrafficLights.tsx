
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Recycle } from 'lucide-react';
import { useAuthedSupabaseQuery } from '@/hooks/useAuthedQuery';
import { supabase } from '@/integrations/supabase/client';

interface RecyclabilityData {
  recyclability: string;
  recyclability_color: string;
  material_count: number;
  percentage: number;
  top_materials: string[];
}

const RecyclabilityTrafficLights: React.FC = () => {
  const { data: recyclabilityData, isLoading } = useAuthedSupabaseQuery({
    queryKey: ['recyclability-dashboard'],
    table: 'unified_materials',
    query: async (supabase) => {
      // Get materials and calculate recyclability distribution
      const { data: materials, error } = await supabase
        .from('unified_materials')
        .select('name, recyclability');
      
      if (error) throw error;

      // Calculate recyclability distribution
      const recyclabilityCategories = ['High', 'Medium', 'Low'];
      const totalMaterials = materials?.length || 0;

      const results = recyclabilityCategories.map(recyclability => {
        const categoryMaterials = materials?.filter(m => 
          m.recyclability === recyclability
        ) || [];

        const color = recyclability === 'High' ? 'green' : 
                     recyclability === 'Medium' ? 'orange' : 'red';

        return {
          recyclability,
          recyclability_color: color,
          material_count: categoryMaterials.length,
          percentage: totalMaterials > 0 ? (categoryMaterials.length / totalMaterials) * 100 : 0,
          top_materials: categoryMaterials
            .map(m => m.name)
            .filter(Boolean)
            .slice(0, 6)
        };
      }).filter(data => data.material_count > 0);

      return { data: results, error: null };
    },
    fallbackData: []
  });

  const getTrafficLightEmoji = (color: string) => {
    switch (color) {
      case 'green': return '🟢';
      case 'orange': return '🟠';
      case 'red': return '🔴';
      default: return '⚪';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 border-green-200 text-green-800';
      case 'orange': return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'red': return 'bg-red-100 border-red-200 text-red-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Recyclability Traffic Lights</h2>
          <p className="text-sm text-muted-foreground">Material recyclability distribution by color coding</p>
        </div>
        <Recycle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {recyclabilityData?.map((data) => (
          <Card key={data.recyclability} className={`${getColorClasses(data.recyclability_color)} border-2`}>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{getTrafficLightEmoji(data.recyclability_color)}</span>
                  <span className="text-sm sm:text-base">{data.recyclability}</span>
                </span>
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Recyclability Level
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{data.material_count}</div>
                <div className="text-xs sm:text-sm opacity-75">Materials</div>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {data.percentage.toFixed(1)}% of total
                </Badge>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <div className="text-xs font-medium opacity-75">Top Materials:</div>
                <div className="space-y-1">
                  {data.top_materials?.slice(0, 3).map((material, idx) => (
                    <div key={idx} className="text-xs opacity-75 truncate">
                      • {material}
                    </div>
                  ))}
                  {data.top_materials?.length > 3 && (
                    <div className="text-xs opacity-60">
                      +{data.top_materials.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-lg">
        <div><strong>🟢 High:</strong> Materials with excellent recyclability and circular economy potential</div>
        <div><strong>🟠 Medium:</strong> Materials with moderate recyclability requiring processing</div>
        <div><strong>🔴 Low:</strong> Materials with limited recyclability or end-of-life challenges</div>
      </div>
    </div>
  );
};

export default RecyclabilityTrafficLights;
