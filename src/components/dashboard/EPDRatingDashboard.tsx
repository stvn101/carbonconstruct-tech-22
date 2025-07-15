
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, FileCheck } from 'lucide-react';
import { useAuthedSupabaseQuery } from '@/hooks/useAuthedQuery';
import { supabase } from '@/integrations/supabase/client';

interface EPDRating {
  rating_percentage: number;
  category_name: string;
  description: string;
  material_count: number;
  percentage_of_total: number;
  sample_materials: string[];
  suppliers_used: string[];
}

const EPDRatingDashboard: React.FC = () => {
  const { data: epdRatings, isLoading } = useAuthedSupabaseQuery({
    queryKey: ['epd-rating-dashboard'],
    table: 'unified_materials',
    query: async (supabase) => {
      // Get materials with EPD ratings and calculate dashboard data
      const { data: materials, error } = await supabase
        .from('unified_materials')
        .select('*');
      
      if (error) throw error;

      // Calculate EPD rating distribution
      const ratingCategories = [
        { rating: 95, name: 'Verified EPD', description: 'Fully verified Environmental Product Declaration' },
        { rating: 80, name: 'Peer Reviewed', description: 'Peer reviewed data with high confidence' },
        { rating: 65, name: 'Industry Average', description: 'Industry averaged by commonly known sources' },
        { rating: 50, name: 'Basic Data', description: 'Basic industry data with limited verification' }
      ];

      const totalMaterials = materials?.length || 0;
      
      const results = ratingCategories.map(category => {
        const categoryMaterials = materials?.filter(m => {
          // Determine EPD rating based on verification status and data quality
          if (m.verification_status === 'verified' && m.epd_registration_number) return category.rating === 95;
          if (m.verification_status === 'verified') return category.rating === 80;
          if (m.data_quality_rating && m.data_quality_rating >= 65) return category.rating === 65;
          return category.rating === 50;
        }) || [];

        return {
          rating_percentage: category.rating,
          category_name: category.name,
          description: category.description,
          material_count: categoryMaterials.length,
          percentage_of_total: totalMaterials > 0 ? (categoryMaterials.length / totalMaterials) * 100 : 0,
          sample_materials: categoryMaterials.slice(0, 4).map(m => m.name).filter(Boolean),
          suppliers_used: [...new Set(categoryMaterials.map(m => m.source).filter(Boolean))].slice(0, 3)
        };
      });

      return { data: results, error: null };
    },
    fallbackData: []
  });

  const getRatingIcon = (percentage: number) => {
    switch (percentage) {
      case 95: return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
      case 80: return <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />;
      case 65: return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />;
      case 50: return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />;
    }
  };

  const getRatingColor = (percentage: number) => {
    switch (percentage) {
      case 95: return 'bg-green-100 border-green-200 text-green-800';
      case 80: return 'bg-blue-100 border-blue-200 text-blue-800';
      case 65: return 'bg-orange-100 border-orange-200 text-orange-800';
      case 50: return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
          <h2 className="text-xl sm:text-2xl font-bold">EPD Rating Distribution</h2>
          <p className="text-sm text-muted-foreground">Environmental Product Declaration verification levels</p>
        </div>
        <Badge variant="outline" className="text-xs sm:text-sm w-fit">
          {epdRatings?.reduce((sum, rating) => sum + rating.material_count, 0) || 0} Total Materials
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {epdRatings?.map((rating) => (
          <Card key={rating.rating_percentage} className={`${getRatingColor(rating.rating_percentage)} border-2`}>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="text-sm sm:text-base">{rating.rating_percentage}% EPD</span>
                {getRatingIcon(rating.rating_percentage)}
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                {rating.category_name}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{rating.material_count}</div>
                <div className="text-xs sm:text-sm opacity-75">Materials</div>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {rating.percentage_of_total.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <div className="text-xs font-medium opacity-75">Sample Materials:</div>
                <div className="space-y-1">
                  {rating.sample_materials?.slice(0, 2).map((material, idx) => (
                    <div key={idx} className="text-xs opacity-75 truncate">
                      • {material}
                    </div>
                  ))}
                  {rating.sample_materials?.length > 2 && (
                    <div className="text-xs opacity-60">
                      +{rating.sample_materials.length - 2} more
                    </div>
                  )}
                </div>
              </div>

              {rating.suppliers_used?.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium opacity-75">Suppliers:</div>
                  <div className="text-xs opacity-60 truncate">
                    {rating.suppliers_used.slice(0, 2).join(', ')}
                    {rating.suppliers_used.length > 2 && ` +${rating.suppliers_used.length - 2}`}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-lg">
        <div><strong>95% EPD:</strong> Fully verified Environmental Product Declarations</div>
        <div><strong>80% EPD:</strong> Peer reviewed data with high confidence</div>
        <div><strong>65% EPD:</strong> Industry averaged by commonly known sources</div>
        <div><strong>50% EPD:</strong> Basic industry data with limited verification</div>
      </div>
    </div>
  );
};

export default EPDRatingDashboard;
