
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import RecyclabilityIndicator from '../RecyclabilityIndicator';
import ScopeBadge from '@/components/ui/scope-badge';
import EmbodiedCarbonClassifier from '@/components/ui/embodied-carbon-classifier';
import ComplianceFlag from '@/components/ui/compliance-flag';

interface MaterialCardProps {
  material: ExtendedMaterialData;
  onViewDetails?: (material: ExtendedMaterialData) => void;
  onSelect?: (material: ExtendedMaterialData) => void;
  showComplianceFlags?: boolean;
  showScopeLabels?: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ 
  material, 
  onViewDetails, 
  onSelect,
  showComplianceFlags = true,
  showScopeLabels = true
}) => {
  if (!material || !material.name) return null;

  const carbonIntensity = material.carbon_footprint_kgco2e_kg || material.factor || 0;
  
  // Determine compliance status based on material properties
  const getComplianceStatus = () => {
    if (material.ncc_requirements || material.applicable_standards) {
      return carbonIntensity < 50 ? 'compliant' : carbonIntensity < 150 ? 'warning' : 'breach';
    }
    return 'unknown';
  };

  const complianceStatus = getComplianceStatus() as 'compliant' | 'warning' | 'breach' | 'unknown';

  const handleAction = () => {
    if (onSelect) {
      onSelect(material);
    } else if (onViewDetails) {
      onViewDetails(material);
    }
  };

  return (
    <Card key={material.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{material.name}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {material.category && (
            <Badge variant="outline">{material.category}</Badge>
          )}
          <RecyclabilityIndicator recyclability={material.recyclability} size="sm" />
          <EmbodiedCarbonClassifier 
            carbonIntensity={carbonIntensity}
            size="sm"
          />
          {showScopeLabels && material.emission_scope && (
            <ScopeBadge 
              scope={material.emission_scope as any} 
              size="sm" 
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {material.description || 'No description available.'}
        </p>
        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Carbon Factor</span>
            <span className="font-medium">
              {carbonIntensity} kgCO₂e/{material.unit || 'kg'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sustainability Score</span>
            <span className="font-medium">
              <Badge className={getSustainabilityColorClass(material.sustainabilityScore || 0)}>
                {material.sustainabilityScore || 'N/A'}
              </Badge>
            </span>
          </div>
          
          {/* Compliance Indicators */}
          {showComplianceFlags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {material.ncc_requirements && (
                <ComplianceFlag 
                  standard="ncc2025" 
                  status={complianceStatus}
                  variant="indicator"
                  size="sm"
                  showDetails={false}
                />
              )}
              {material.green_star_compliant && (
                <ComplianceFlag 
                  standard="greenstar" 
                  status="compliant"
                  variant="indicator"
                  size="sm"
                  showDetails={false}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleAction}
        >
          <Info className="h-4 w-4 mr-2" />
          {onSelect ? 'Select Material' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function for sustainability score color
export function getSustainabilityColorClass(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 hover:bg-green-100';
  if (score >= 60) return 'bg-lime-100 text-lime-800 hover:bg-lime-100';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
  if (score >= 20) return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
  return 'bg-red-100 text-red-800 hover:bg-red-100';
}

export default MaterialCard;
