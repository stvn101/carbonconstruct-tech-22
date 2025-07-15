import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Star, CheckCircle, AlertTriangle, Leaf } from 'lucide-react';
import { materialDatabaseService, MaterialSearchFilters } from '@/services/materialDatabaseService';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { useDebounce } from '@/hooks/useDebounce';

interface MaterialSelectorProps {
  selectedMaterials: SelectedMaterial[];
  onMaterialChange: (materials: SelectedMaterial[]) => void;
  category?: string;
  placeholder?: string;
}

export interface SelectedMaterial {
  id: string;
  material: ExtendedMaterialData;
  quantity: number;
  unit: string;
  carbonFactor: number;
  confidence: number;
}

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  selectedMaterials,
  onMaterialChange,
  category,
  placeholder = "Search and select materials..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ExtendedMaterialData[]>([]);
  const [popularMaterials, setPopularMaterials] = useState<ExtendedMaterialData[]>([]);
  const [filters, setFilters] = useState<MaterialSearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadPopularMaterials();
  }, [category]);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      searchMaterials();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, filters]);

  const loadPopularMaterials = async () => {
    try {
      const materials = category 
        ? await materialDatabaseService.getMaterialsByCategory(category)
        : await materialDatabaseService.getPopularMaterials(20);
      setPopularMaterials(materials);
    } catch (error) {
      console.error('Failed to load popular materials:', error);
    }
  };

  const searchMaterials = async () => {
    setIsLoading(true);
    try {
      const materials = await materialDatabaseService.searchMaterials({
        ...filters,
        searchTerm: debouncedSearchTerm,
        category: category || filters.category
      });
      setSearchResults(materials);
    } catch (error) {
      console.error('Material search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMaterial = async (material: ExtendedMaterialData) => {
    try {
      const lookupResult = await materialDatabaseService.lookupMaterial(
        material.name || '',
        material.carbon_footprint_kgco2e_kg || 1.0
      );

      const newSelectedMaterial: SelectedMaterial = {
        id: material.id || `temp-${Date.now()}`,
        material: lookupResult.material,
        quantity: 1,
        unit: material.unit || 'kg',
        carbonFactor: lookupResult.carbonFactor,
        confidence: lookupResult.confidence
      };

      const updatedMaterials = [...selectedMaterials, newSelectedMaterial];
      onMaterialChange(updatedMaterials);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add material:', error);
    }
  };

  const updateMaterialQuantity = (materialId: string, quantity: number) => {
    const updatedMaterials = selectedMaterials.map(m =>
      m.id === materialId ? { ...m, quantity } : m
    );
    onMaterialChange(updatedMaterials);
  };

  const removeMaterial = (materialId: string) => {
    const updatedMaterials = selectedMaterials.filter(m => m.id !== materialId);
    onMaterialChange(updatedMaterials);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="h-4 w-4" />;
    if (confidence >= 60) return <AlertTriangle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const displayMaterials = searchTerm.trim() ? searchResults : popularMaterials;

  return (
    <div className="space-y-4">
      {/* Selected Materials */}
      {selectedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedMaterials.map((selectedMaterial) => (
              <div key={selectedMaterial.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedMaterial.material.name}</span>
                    <Badge 
                      variant="outline" 
                      className={getConfidenceColor(selectedMaterial.confidence)}
                    >
                      {getConfidenceIcon(selectedMaterial.confidence)}
                      {selectedMaterial.confidence}%
                    </Badge>
                    {selectedMaterial.material.green_star_compliant && (
                      <Badge variant="default" className="text-green-600">
                        <Star className="h-3 w-3 mr-1" />
                        Green Star
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMaterial.carbonFactor.toFixed(2)} kg CO₂-e/{selectedMaterial.unit}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={selectedMaterial.quantity}
                    onChange={(e) => updateMaterialQuantity(
                      selectedMaterial.id, 
                      parseFloat(e.target.value) || 0
                    )}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    {selectedMaterial.unit}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMaterial(selectedMaterial.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Material Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {placeholder}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Materials from Database</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={filters.recyclability || 'all'}
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  recyclability: value === 'all' ? undefined : value as 'High' | 'Medium' | 'Low'
                }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Recyclability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.carbonIntensity || 'all'}
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  carbonIntensity: value === 'all' ? undefined : value as 'low' | 'medium' | 'high'
                }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Carbon Impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Material Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Searching materials...</p>
                </div>
              ) : displayMaterials.length > 0 ? (
                displayMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => addMaterial(material)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{material.name}</span>
                        {material.green_star_compliant && (
                          <Badge variant="default" className="text-green-600">
                            <Star className="h-3 w-3 mr-1" />
                            Green Star
                          </Badge>
                        )}
                        {material.recyclability === 'High' && (
                          <Badge variant="outline" className="text-green-600">
                            <Leaf className="h-3 w-3 mr-1" />
                            Recyclable
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {material.carbon_footprint_kgco2e_kg?.toFixed(2)} kg CO₂-e/{material.unit || 'kg'}
                        {material.description && ` • ${material.description}`}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {material.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Quality: {material.data_quality_rating || 1}/10
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm.trim() ? 'No materials found' : 'Start typing to search materials'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};