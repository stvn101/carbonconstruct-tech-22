import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Star, Clock, Building, Factory, Home } from 'lucide-react';

interface CalculatorTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  calculatorTypes: string[];
  defaultValues: Record<string, any>;
  tags: string[];
}

interface CalculatorTemplateSelectorProps {
  onSelectTemplate: (template: CalculatorTemplate) => void;
  userFocusAreas?: string[];
  recentTemplates?: string[];
}

const templates: CalculatorTemplate[] = [
  {
    id: 'residential_standard',
    name: 'Standard Residential Project',
    description: 'Typical single-family home with standard construction materials',
    category: 'Residential',
    icon: <Home className="h-5 w-5" />,
    calculatorTypes: ['lca', 'ncc', 'nabers'],
    defaultValues: {
      lca: {
        buildingType: 'residential',
        area: 200,
        materials: ['concrete', 'steel', 'timber']
      },
      ncc: {
        climateZone: 'Zone 6',
        buildingClass: 'Class 1'
      }
    },
    tags: ['residential', 'standard', 'family-home']
  },
  {
    id: 'commercial_office',
    name: 'Commercial Office Building',
    description: 'Multi-story office building with typical commercial specifications',
    category: 'Commercial',
    icon: <Building className="h-5 w-5" />,
    calculatorTypes: ['lca', 'scope', 'nabers', 'green_star'],
    defaultValues: {
      lca: {
        buildingType: 'commercial',
        area: 5000,
        floors: 8
      },
      scope: {
        operationalEnergy: true,
        transportEmissions: true
      }
    },
    tags: ['commercial', 'office', 'multi-story']
  },
  {
    id: 'industrial_warehouse',
    name: 'Industrial Warehouse',
    description: 'Large-scale warehouse or manufacturing facility',
    category: 'Industrial',
    icon: <Factory className="h-5 w-5" />,
    calculatorTypes: ['lca', 'scope', 'breeam'],
    defaultValues: {
      lca: {
        buildingType: 'industrial',
        area: 10000,
        materials: ['steel', 'concrete', 'cladding']
      }
    },
    tags: ['industrial', 'warehouse', 'manufacturing']
  },
  {
    id: 'green_building',
    name: 'Green Star Certified Building',
    description: 'High-performance building targeting Green Star certification',
    category: 'Sustainable',
    icon: <Star className="h-5 w-5" />,
    calculatorTypes: ['green_star', 'lca', 'nabers', 'leed'],
    defaultValues: {
      green_star: {
        targetRating: 'World Leadership',
        sustainableMaterials: true
      },
      lca: {
        includeRecycledContent: true,
        renewableEnergy: true
      }
    },
    tags: ['green-star', 'sustainable', 'high-performance']
  }
];

export const CalculatorTemplateSelector: React.FC<CalculatorTemplateSelectorProps> = ({
  onSelectTemplate,
  userFocusAreas = [],
  recentTemplates = []
}) => {
  // Sort templates based on user preferences
  const sortedTemplates = templates.sort((a, b) => {
    const aRelevance = a.tags.filter(tag => 
      userFocusAreas.some(area => area.toLowerCase().includes(tag))
    ).length;
    const bRelevance = b.tags.filter(tag => 
      userFocusAreas.some(area => area.toLowerCase().includes(tag))
    ).length;
    
    if (aRelevance !== bRelevance) return bRelevance - aRelevance;
    
    // Prioritize recently used templates
    const aRecent = recentTemplates.includes(a.id) ? 1 : 0;
    const bRecent = recentTemplates.includes(b.id) ? 1 : 0;
    
    return bRecent - aRecent;
  });

  const getRecommendationBadge = (template: CalculatorTemplate) => {
    const relevantTags = template.tags.filter(tag => 
      userFocusAreas.some(area => area.toLowerCase().includes(tag))
    );
    
    if (relevantTags.length > 0) return 'Recommended';
    if (recentTemplates.includes(template.id)) return 'Recent';
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Calculator Templates
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Quick start with pre-configured calculator settings for common project types
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTemplates.map((template) => {
            const badge = getRecommendationBadge(template);
            
            return (
              <Card key={template.id} className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {template.icon}
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.category}</p>
                        </div>
                      </div>
                      {badge && (
                        <Badge variant={badge === 'Recommended' ? 'default' : 'secondary'} className="text-xs">
                          {badge}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {template.calculatorTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {userFocusAreas.length === 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Sign in and set your focus areas in your profile to get personalized template recommendations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};