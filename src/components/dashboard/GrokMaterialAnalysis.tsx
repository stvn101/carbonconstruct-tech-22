
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, CheckCircle, AlertTriangle, Lightbulb, Recycle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import grokService from '@/services/GrokService';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface MaterialAnalysisResult {
  material_id: string;
  material_name: string;
  ncc_compliance: boolean;
  nabers_rating: string;
  green_star_eligible: boolean;
  scope1_score: number;
  scope2_score: number;
  scope3_score: number;
  alternative_materials: string[];
  recommendations: string[];
  verification_confidence: number;
}

const GrokMaterialAnalysis: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query recent materials for analysis
  const { data: recentMaterials } = useQuery({
    queryKey: ['recent-materials-for-analysis'],
    queryFn: async () => {
      // Check authentication before making query
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('unified_materials')
        .select('id, name, carbon_footprint_kgco2e_kg, scope1_emissions, scope2_emissions, scope3_emissions, recyclability, epd_registration_number, verification_status')
        .order('updated_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user // Only run query when user is authenticated
  });

  // Mutation for Grok analysis
  const grokAnalysisMutation = useMutation({
    mutationFn: async (materialId: string) => {
      const material = recentMaterials?.find(m => m.id === materialId);
      if (!material) throw new Error('Material not found');

      // Call Grok service for comprehensive analysis
      const analysisResult = await grokService.queryGrok({
        prompt: `Analyze this construction material for NCC compliance, NABERS rating, Green Star eligibility, and provide scope 1,2,3 emissions scoring. Also suggest alternative materials.`,
        context: {
          material,
          requirements: {
            ncc_2025: true,
            nabers_assessment: true,
            green_star_v1_3: true,
            scope_emissions_analysis: true
          }
        },
        mode: 'compliance_check'
      });

      return {
        material_id: materialId,
        material_name: material.name,
        analysis: analysisResult.response,
        confidence: analysisResult.metadata?.confidence || 0.8
      };
    },
    onSuccess: (data) => {
      toast.success(`Analysis completed for ${data.material_name}`);
      queryClient.invalidateQueries({ queryKey: ['grok-analysis'] });
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
    }
  });

  const mockAnalysisData: MaterialAnalysisResult[] = [
    {
      material_id: '1',
      material_name: 'Low Carbon Concrete',
      ncc_compliance: true,
      nabers_rating: '5-star',
      green_star_eligible: true,
      scope1_score: 85,
      scope2_score: 78,
      scope3_score: 82,
      alternative_materials: ['Recycled Aggregate Concrete', 'Geopolymer Concrete'],
      recommendations: ['Consider using 30% recycled content', 'Local sourcing within 50km recommended'],
      verification_confidence: 92
    },
    {
      material_id: '2',
      material_name: 'Standard Steel',
      ncc_compliance: true,
      nabers_rating: '3-star',
      green_star_eligible: false,
      scope1_score: 45,
      scope2_score: 52,
      scope3_score: 38,
      alternative_materials: ['Recycled Steel', 'Cross-Laminated Timber'],
      recommendations: ['Switch to recycled steel content', 'Consider CLT for non-structural applications'],
      verification_confidence: 88
    }
  ];

  const getComplianceIcon = (compliant: boolean) => {
    return compliant ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const getScopeColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Grok AI Material Analysis
          </h2>
          <p className="text-muted-foreground">AI-powered compliance and sustainability analysis</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedMaterial} 
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">Select material...</option>
            {recentMaterials?.map(material => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </select>
          
          <Button 
            onClick={() => selectedMaterial && grokAnalysisMutation.mutate(selectedMaterial)}
            disabled={!selectedMaterial || grokAnalysisMutation.isPending}
            size="sm"
          >
            {grokAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {mockAnalysisData.map((analysis) => (
          <Card key={analysis.material_id} className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>{analysis.material_name}</span>
                <Badge variant="outline" className="text-xs">
                  {analysis.verification_confidence}% confidence
                </Badge>
              </CardTitle>
              <CardDescription>
                Comprehensive compliance and sustainability analysis
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="compliance" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="scopes">Scopes</TabsTrigger>
                  <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
                  <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compliance" className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">NCC 2025</span>
                        {getComplianceIcon(analysis.ncc_compliance)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {analysis.ncc_compliance ? 'Compliant' : 'Non-compliant'}
                      </div>
                    </Card>
                    
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">NABERS</span>
                        <Badge variant="secondary" className="text-xs">
                          {analysis.nabers_rating}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Energy rating
                      </div>
                    </Card>
                    
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Green Star</span>
                        {getComplianceIcon(analysis.green_star_eligible)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {analysis.green_star_eligible ? 'Eligible' : 'Not eligible'}
                      </div>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="scopes" className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Scope 1</span>
                        <span className={`text-sm font-bold ${getScopeColor(analysis.scope1_score)}`}>
                          {analysis.scope1_score}/100
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Direct emissions
                      </div>
                    </Card>
                    
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Scope 2</span>
                        <span className={`text-sm font-bold ${getScopeColor(analysis.scope2_score)}`}>
                          {analysis.scope2_score}/100
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Energy indirect
                      </div>
                    </Card>
                    
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Scope 3</span>
                        <span className={`text-sm font-bold ${getScopeColor(analysis.scope3_score)}`}>
                          {analysis.scope3_score}/100
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Value chain
                      </div>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="alternatives" className="space-y-3">
                  <div className="space-y-2">
                    {analysis.alternative_materials.map((alt, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 border rounded-md">
                        <Recycle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{alt}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          Alternative
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="recommendations" className="space-y-3">
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 border rounded-md">
                        <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GrokMaterialAnalysis;
