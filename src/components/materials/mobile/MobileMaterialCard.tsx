
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Leaf, MapPin } from 'lucide-react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import RecyclabilityIndicator from '../RecyclabilityIndicator';

interface MobileMaterialCardProps {
  material: ExtendedMaterialData;
  onSelect?: (material: ExtendedMaterialData) => void;
  className?: string;
}

const MobileMaterialCard: React.FC<MobileMaterialCardProps> = ({
  material,
  onSelect,
  className
}) => {
  const { isMobile } = useIsMobile();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium line-clamp-2">
          {material.name}
        </CardTitle>
        <div className="flex flex-wrap gap-1 mt-2">
          {material.category && (
            <Badge variant="secondary" className="text-xs">
              {material.category}
            </Badge>
          )}
          {material.region && (
            <Badge variant="outline" className="text-xs flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {material.region}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Carbon Footprint:</span>
            <div className="font-medium">
              {(material.carbon_footprint_kgco2e_kg || material.factor || 0).toFixed(3)} kg CO₂e/kg
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Sustainability:</span>
            <div className="flex items-center">
              <Leaf className="h-3 w-3 mr-1 text-green-600" />
              <span className="font-medium">{material.sustainabilityScore || 'N/A'}/100</span>
            </div>
          </div>
        </div>

        {/* Traffic light recyclability */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Recyclability:</span>
          <RecyclabilityIndicator 
            recyclability={material.recyclability} 
            size="sm"
          />
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

        {onSelect && (
          <Button 
            onClick={() => onSelect(material)} 
            size="sm" 
            className="w-full mt-3"
          >
            <Plus className="h-3 w-3 mr-1" />
            Select Material
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileMaterialCard;
