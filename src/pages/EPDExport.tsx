import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, Database, Code, Upload, CheckCircle, Clock } from 'lucide-react';
import { EPDService } from '@/services/epdService';
import { EnhancedEPDService } from '@/services/enhancedEpdService';
import { EPDExportService } from '@/services/epdExportService';
import { EpdExport } from '@/components/epd/EpdExport';
import { EPDRecord } from '@/types/epd';
import { toast } from 'sonner';

const EPDExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [epd, setEpd] = useState<EPDRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const [serverExporting, setServerExporting] = useState(false);
  const [exportedFiles, setExportedFiles] = useState<{ html?: string; csv?: string; json?: string } | null>(null);

  useEffect(() => {
    if (id) {
      loadEPD();
    }
  }, [id]);

  const loadEPD = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await EnhancedEPDService.getEPDWithExportStatus(id);
      if (error) {
        toast.error(`Failed to load EPD: ${  error}`);
        return;
      }
      setEpd(data);
      if (data?.exportUrls) {
        setExportedFiles(data.exportUrls);
      }
    } catch (error) {
      toast.error('An error occurred while loading EPD');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleServerExport = async () => {
    if (!epd) return;
    
    setServerExporting(true);
    try {
      const result = await EnhancedEPDService.submitForServerExport(epd.id);
      
      if (result.success && result.files) {
        setExportedFiles(result.files);
        toast.success('EPD exported successfully on server');
        // Reload EPD to get updated status
        loadEPD();
      } else {
        toast.error(result.error || 'Server export failed');
      }
    } catch (error) {
      toast.error('Server export failed');
      console.error(error);
    } finally {
      setServerExporting(false);
    }
  };

  const handleDownloadFile = async (fileUrl: string, filename: string) => {
    try {
      await EnhancedEPDService.downloadExportedFile(fileUrl, filename);
      toast.success(`${filename} downloaded successfully`);
    } catch (error) {
      toast.error(`Failed to download ${filename}`);
      console.error(error);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
    if (!epd) return;
    
    setExporting(format);
    try {
      switch (format) {
        case 'pdf':
          await EPDExportService.generateEpdPdf(epd);
          toast.success('PDF exported successfully');
          break;
        case 'csv':
          EPDExportService.generateEpdCsv(epd);
          toast.success('CSV exported successfully');
          break;
        case 'json':
          EPDExportService.generateEpdJson(epd);
          toast.success('JSON exported successfully');
          break;
      }
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
      console.error(error);
    } finally {
      setExporting(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!epd) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/epd-generator')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to EPD Generator
        </Button>
        
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">EPD Not Found</h3>
            <p className="text-muted-foreground">
              The requested Environmental Product Declaration could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transform EPD data for EpdExport component
  const exportData = {
    product_name: epd.product_name,
    manufacturer_name: epd.manufacturer_name,
    functional_unit: epd.functional_unit,
    product_description: epd.product_description || '',
    stages: epd.epd_stage_data ? Object.fromEntries(
      Object.entries(epd.epd_stage_data).map(([stage, data]) => [
        stage,
        typeof data === 'object' && data !== null && 'co2e_value' in data 
          ? (data as any).co2e_value 
          : 0
      ])
    ) : {},
    total_co2e: epd.total_co2e || 0,
    gwp_fossil: epd.gwp_fossil || 0,
    gwp_biogenic: epd.gwp_biogenic || 0,
    gwp_total: epd.gwp_total || 0,
    status: epd.status,
    verification_status: epd.verification_status,
    created_at: epd.created_at,
    version_number: epd.version_number,
    data_sources: Array.isArray(epd.data_sources) ? epd.data_sources : []
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/epd/${epd.id}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to EPD Details
        </Button>
        
        <nav className="text-sm text-muted-foreground">
          EPD Generator → {epd.product_name} → Export
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Export EPD</h1>
        <p className="text-muted-foreground">
          Download your Environmental Product Declaration in various formats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Export Options */}
        <div className="space-y-6">
          {/* Server Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Server Export (Recommended)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate professional EPD files using our server-side processing for better quality and formatting.
              </p>
              
              {exportedFiles ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Files generated successfully</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {exportedFiles.html && (
                      <Button
                        onClick={() => handleDownloadFile(
                          exportedFiles.html!,
                          `EPD_${epd?.product_name.replace(/[^a-zA-Z0-9]/g, '_')}_v${epd?.version_number}.html`
                        )}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Download HTML
                      </Button>
                    )}
                    
                    {exportedFiles.csv && (
                      <Button
                        onClick={() => handleDownloadFile(
                          exportedFiles.csv!,
                          `EPD_${epd?.product_name.replace(/[^a-zA-Z0-9]/g, '_')}_v${epd?.version_number}.csv`
                        )}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Database className="w-4 h-4 mr-2" />
                        Download CSV
                      </Button>
                    )}
                    
                    {exportedFiles.json && (
                      <Button
                        onClick={() => handleDownloadFile(
                          exportedFiles.json!,
                          `EPD_${epd?.product_name.replace(/[^a-zA-Z0-9]/g, '_')}_v${epd?.version_number}.json`
                        )}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Download JSON
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleServerExport}
                  disabled={serverExporting}
                  className="w-full"
                >
                  {serverExporting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Generating Files...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Generate EPD Files
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Client Export Section */}
          <Card>
            <CardHeader>
              <CardTitle>Client Export (Basic)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate basic EPD files directly in your browser. For professional documents, use server export above.
              </p>
              
              <Button
                onClick={() => handleExport('pdf')}
                disabled={exporting === 'pdf'}
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                {exporting === 'pdf' ? 'Generating PDF...' : 'Download PDF'}
              </Button>
              
              <Button
                onClick={() => handleExport('csv')}
                disabled={exporting === 'csv'}
                className="w-full justify-start"
                variant="outline"
              >
                <Database className="w-4 h-4 mr-2" />
                {exporting === 'csv' ? 'Generating CSV...' : 'Download CSV'}
              </Button>
              
              <Button
                onClick={() => handleExport('json')}
                disabled={exporting === 'json'}
                className="w-full justify-start"
                variant="outline"
              >
                <Code className="w-4 h-4 mr-2" />
                {exporting === 'json' ? 'Generating JSON...' : 'Download JSON'}
              </Button>
            </CardContent>
          </Card>

          {/* Format Information */}
          <Card>
            <CardHeader>
              <CardTitle>Format Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">PDF</h4>
                <p className="text-muted-foreground">
                  Complete ISO-compliant EPD document suitable for official submissions
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">CSV</h4>
                <p className="text-muted-foreground">
                  Structured data export for analysis and database import
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">JSON</h4>
                <p className="text-muted-foreground">
                  Machine-readable format for API integration and automation
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>EPD Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <EpdExport data={exportData} className="scale-75 origin-top" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EPDExportPage;