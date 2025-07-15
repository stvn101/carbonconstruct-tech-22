
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Download, Database, CheckCircle, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExportData {
  summary: {
    total_materials: number;
    materials_with_carbon_data: number;
    materials_with_categories: number;
    data_quality_summary: any;
  };
  materials: any[];
}

const MaterialsExportManager: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      console.log('🔄 Starting unified materials export...');
      
      // Get validation data
      const { data: validationData, error: validationError } = await supabase
        .rpc('validate_unified_materials_data');
      
      if (validationError) {
        throw validationError;
      }

      // Get all materials
      const { data: materials, error: materialsError } = await supabase
        .from('unified_materials')
        .select('*')
        .order('name');

      if (materialsError) {
        throw materialsError;
      }

      const summary = validationData?.[0] || {
        total_materials: materials?.length || 0,
        materials_with_carbon_data: 0,
        materials_with_categories: 0,
        data_quality_summary: {}
      };

      setExportData({
        summary,
        materials: materials || []
      });

      toast.success('Materials exported successfully!', {
        description: `Exported ${summary.total_materials} materials from unified database.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        description: error.message || 'Failed to export materials data',
        duration: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadCSV = () => {
    if (!exportData?.materials) return;
    
    const headers = ['Name', 'Category', 'Carbon Footprint (kg CO2e/kg)', 'Region', 'Tags', 'Sustainability Score'];
    const csvContent = [
      headers.join(','),
      ...exportData.materials.map(material => [
        `"${material.name || ''}"`,
        `"${material.category || ''}"`,
        material.carbon_footprint_kgco2e_kg || '',
        `"${material.region || ''}"`,
        `"${material.tags?.join('; ') || ''}"`,
        material.sustainability_score || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `unified_materials_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('CSV file downloaded!', {
      description: 'Check your downloads folder for the exported materials data.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Unified Materials Export Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              Export materials from the unified database. All materials are now consolidated into a single 
              <code className="mx-1 px-2 py-1 bg-gray-100 rounded">unified_materials</code> table.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 bg-carbon-600 hover:bg-carbon-700"
            >
              <BarChart3 className="h-4 w-4" />
              {isExporting ? 'Analyzing & Exporting...' : 'Analyze & Export Materials'}
            </Button>
          </div>

          {exportData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-carbon-600">
                      {exportData.summary.total_materials}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Unified materials database
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">With Carbon Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {exportData.summary.materials_with_carbon_data}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Materials with emission factors
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Categorized</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {exportData.summary.materials_with_categories}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Materials with categories
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Export completed successfully! Materials are ready for download.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button 
                  onClick={downloadCSV}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsExportManager;
