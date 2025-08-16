import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Database, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Material {
  id: string;
  name: string;
  category: string;
  embodied_carbon: number;
  unit: string;
  data_quality: string;
  source: string;
  region: string;
}

interface DatabaseStats {
  total_materials: number;
  categories: number;
  avg_carbon: number;
  high_quality_count: number;
}

const MaterialsDatabase: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'All', 'Concrete', 'Steel', 'Timber', 'Masonry', 'Insulation', 
    'Cladding', 'Roofing', 'Flooring', 'Glass', 'Aluminum', 'Plastics',
    'Sealants', 'Paints'
  ];

  useEffect(() => {
    fetchMaterials();
    fetchStats();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchTerm, selectedCategory]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('unified_materials')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setMaterials(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load materials database');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('validate_unified_materials_data');
      
      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(material => material.category === selectedCategory);
    }

    setFilteredMaterials(filtered);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'High': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header with Status Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Database className="h-8 w-8 text-carbon-600" />
            <h1 className="text-3xl font-bold">Materials Database</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Online</span>
          </div>
        </div>
        
        {/* Database Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-carbon-600">{stats.total_materials}</p>
                  <p className="text-sm text-muted-foreground">Total Materials</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div>
                <p className="text-2xl font-bold text-carbon-600">{stats.categories}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </Card>
            <Card className="p-4">
              <div>
                <p className="text-2xl font-bold text-carbon-600">{stats.high_quality_count}</p>
                <p className="text-sm text-muted-foreground">High Quality</p>
              </div>
            </Card>
            <Card className="p-4">
              <div>
                <p className="text-2xl font-bold text-carbon-600">{Math.round(stats.avg_carbon)}</p>
                <p className="text-sm text-muted-foreground">Avg. Carbon</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMaterials.length} of {materials.length} materials
          {selectedCategory && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Materials Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base leading-tight pr-2">
                  {material.name}
                </CardTitle>
                <Badge 
                  variant="secondary" 
                  className={`text-xs shrink-0 ${getQualityColor(material.data_quality)}`}
                >
                  {material.data_quality}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <Badge variant="outline" className="text-xs">
                    {material.category}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Carbon:</span>
                  <span className="text-sm font-medium">
                    {material.embodied_carbon?.toFixed(1) || 'N/A'} kg CO₂e/{material.unit}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Source:</span>
                  <span className="text-xs text-muted-foreground truncate max-w-32">
                    {material.source}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Region:</span>
                  <Badge variant="outline" className="text-xs">
                    {material.region}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && !loading && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No materials found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or browse all materials.
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setSelectedCategory('');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">Database Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchMaterials}>
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  );
};

export default MaterialsDatabase;