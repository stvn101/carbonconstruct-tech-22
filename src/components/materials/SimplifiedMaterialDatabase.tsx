
/**
 * Simplified Material Database - Direct display of all materials
 */
import React from "react";
import { motion } from "framer-motion";
import { Database, Search, Filter, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSimplifiedMaterials } from "@/hooks/useSimplifiedMaterials";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import RecyclabilityIndicator from "./RecyclabilityIndicator";

const MaterialCard: React.FC<{ material: ExtendedMaterialData }> = ({ material }) => (
  <Card className="h-full hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium line-clamp-2">
        {material.name}
      </CardTitle>
      <CardDescription className="text-xs flex items-center justify-between">
        <span>{material.category} • {material.region}</span>
        <RecyclabilityIndicator recyclability={material.recyclability} size="sm" showIcon={false} />
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Carbon Footprint:</span>
          <span className="font-medium">
            {(material.carbon_footprint_kgco2e_kg || material.factor || 0).toFixed(2)} kg CO₂e/kg
          </span>
        </div>
        
        {material.scope1_emissions && (
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scope 1:</span>
              <span>{material.scope1_emissions.toFixed(2)} kg CO₂e</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scope 2:</span>
              <span>{material.scope2_emissions?.toFixed(2)} kg CO₂e</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scope 3:</span>
              <span>{material.scope3_emissions?.toFixed(2)} kg CO₂e</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Sustainability Score:</span>
          <span className="font-medium">
            {material.sustainabilityScore || material.environmental_impact_score || 'N/A'}
          </span>
        </div>
        
        {material.carbon_intensity_category && (
          <Badge 
            variant={
              material.carbon_intensity_category === 'low' ? 'default' : 
              material.carbon_intensity_category === 'medium' ? 'secondary' : 
              'destructive'
            }
            className="text-xs"
          >
            {material.carbon_intensity_category} impact
          </Badge>
        )}
      </div>
      
      {material.tags && material.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {material.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {material.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{material.tags.length - 3}
            </Badge>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

const SimplifiedMaterialDatabase: React.FC = () => {
  const {
    allMaterials,
    filteredMaterials,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    loading,
    error,
    totalCount,
    refreshMaterials,
    resetFilters,
    categories,
    tags
  } = useSimplifiedMaterials();

  return (
    <ErrorBoundaryWrapper feature="Simplified Material Database">
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
              <Database className="h-6 w-6 text-carbon-700" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Australian Materials Database
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Construction materials with traffic light recyclability system
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Total Materials: {totalCount}</span>
            <span>•</span>
            <span>Showing: {filteredMaterials.length}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={refreshMaterials}
              disabled={loading}
              className="ml-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading materials: {error.message}
              <Button variant="outline" size="sm" onClick={refreshMaterials} className="ml-2">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag === 'all' ? 'All Tags' : tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No materials found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </ErrorBoundaryWrapper>
  );
};

export default SimplifiedMaterialDatabase;
