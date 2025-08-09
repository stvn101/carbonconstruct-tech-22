import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Eye, Edit, Share2 } from 'lucide-react';
import { EPDService } from '@/services/epdService';
import { EpdExport } from '@/components/epd/EpdExport';
import { EPDRecord } from '@/types/epd';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

const EPDDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [epd, setEpd] = useState<EPDRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEPD();
    }
  }, [id]);

  const loadEPD = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await EPDService.getEPD(id);
      if (error) {
        toast.error(`Failed to load EPD: ${  error}`);
        return;
      }
      setEpd(data);
    } catch (error) {
      toast.error('An error occurred while loading EPD');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      submitted_for_review: { variant: 'outline' as const, label: 'Under Review' },
      verified: { variant: 'default' as const, label: 'Verified' },
      published: { variant: 'default' as const, label: 'Published' },
      archived: { variant: 'secondary' as const, label: 'Archived' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
      <Footer />
    </>
  );
  }

  if (!epd) {
  return (
    <>
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
      <Footer />
    </>
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
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/epd-generator')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to EPD Generator
          </Button>
          
          <nav className="text-sm text-muted-foreground">
            EPD Generator → {epd.product_name}
          </nav>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{epd.product_name}</h1>
            <p className="text-muted-foreground">
              {epd.manufacturer_name} • Version {epd.version_number}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge(epd.status)}
            <Button 
              variant="outline" 
              onClick={() => navigate(`/epd/export/${epd.id}`)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {epd.status === 'draft' && (
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="preview">EPD Preview</TabsTrigger>
            <TabsTrigger value="data">Technical Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Product Name</p>
                      <p className="font-semibold">{epd.product_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Manufacturer</p>
                      <p className="font-semibold">{epd.manufacturer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Functional Unit</p>
                      <p className="font-semibold">{epd.functional_unit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ISO Compliant</p>
                      <p className="font-semibold">{epd.iso_compliant ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  {epd.product_description && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{epd.product_description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Environmental Impact Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{epd.total_co2e?.toFixed(2) || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Total CO₂e (kg)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">GWP Fossil</span>
                      <span className="text-sm font-medium">{epd.gwp_fossil?.toFixed(2) || 'N/A'} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">GWP Biogenic</span>
                      <span className="text-sm font-medium">{epd.gwp_biogenic?.toFixed(2) || 'N/A'} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">GWP Total</span>
                      <span className="text-sm font-medium">{epd.gwp_total?.toFixed(2) || 'N/A'} kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <EpdExport data={exportData} />
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Technical Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Lifecycle Stage Data</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                      {JSON.stringify(epd.epd_stage_data, null, 2)}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Metadata</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Created:</span> {new Date(epd.created_at).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Updated:</span> {new Date(epd.updated_at).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Verification Status:</span> {epd.verification_status}
                      </div>
                      <div>
                        <span className="font-medium">Version:</span> {epd.version_number}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  );
};

export default EPDDetailPage;