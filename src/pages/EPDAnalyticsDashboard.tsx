import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, TrendingUp, AlertTriangle, CheckCircle2, BarChart3, Clock, XCircle, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface EPDStats {
  total: number;
  verified: number;
  pending: number;
  draft: number;
  avgCo2e: number;
  totalMaterials: number;
}

interface MaterialStats {
  id: string;
  name: string;
  epd_count: number;
  has_epd: boolean;
  avg_co2e: number;
}

const EPDAnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<EPDStats>({
    total: 0,
    verified: 0,
    pending: 0,
    draft: 0,
    avgCo2e: 0,
    totalMaterials: 0
  });
  const [missingEpds, setMissingEpds] = useState<MaterialStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Check authentication before making query
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('Authentication required for EPD dashboard');
        setLoading(false);
        return;
      }

      // Load EPD statistics
      const { data: epdData, error: epdError } = await supabase
        .from('epd_records')
        .select('status, total_co2e');

      if (epdError) throw epdError;

      const epdStats = epdData.reduce((acc, epd) => {
        acc.total++;
        if (epd.status === 'verified') acc.verified++;
        else if (epd.status === 'submitted_for_review') acc.pending++;
        else if (epd.status === 'draft') acc.draft++;
        
        if (epd.total_co2e) acc.totalCo2e += epd.total_co2e;
        return acc;
      }, { total: 0, verified: 0, pending: 0, draft: 0, totalCo2e: 0 });

      // Load materials without EPDs
      const { data: materialsData, error: materialsError } = await supabase
        .from('unified_materials')
        .select('id, name, carbon_footprint_kgco2e_kg')
        .limit(100);

      if (materialsError) throw materialsError;

      // Get materials that have EPDs
      const { data: materialsWithEpds, error: materialEpdError } = await supabase
        .from('epd_records')
        .select('material_id')
        .not('material_id', 'is', null);

      if (materialEpdError) throw materialEpdError;

      const materialIdsWithEpds = new Set(materialsWithEpds.map(m => m.material_id));
      
      const materialsWithoutEpds = materialsData
        .filter(material => !materialIdsWithEpds.has(material.id))
        .slice(0, 20)
        .map(material => ({
          id: material.id,
          name: material.name,
          epd_count: 0,
          has_epd: false,
          avg_co2e: material.carbon_footprint_kgco2e_kg || 0
        }));

      setStats({
        total: epdStats.total,
        verified: epdStats.verified,
        pending: epdStats.pending,
        draft: epdStats.draft,
        avgCo2e: epdStats.total > 0 ? epdStats.totalCo2e / epdStats.total : 0,
        totalMaterials: materialsData.length
      });

      setMissingEpds(materialsWithoutEpds);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportVerifiedEpds = async () => {
    setExporting(true);
    try {
      const { data: verifiedEpds, error } = await supabase
        .from('epd_records')
        .select('*')
        .eq('status', 'verified')
        .order('verified_at', { ascending: false });

      if (error) throw error;

      if (verifiedEpds.length === 0) {
        toast.info('No verified EPDs available for export');
        return;
      }

      // Create CSV content
      const headers = [
        'Product Name',
        'Manufacturer',
        'Functional Unit',
        'Total CO2e (kg)',
        'GWP Fossil (kg)',
        'GWP Biogenic (kg)',
        'GWP Total (kg)',
        'Version',
        'Verified At',
        'Verified By',
        'EPD Hash'
      ];

      const csvContent = [
        headers.join(','),
        ...verifiedEpds.map(epd => [
          `"${epd.product_name}"`,
          `"${epd.manufacturer_name}"`,
          `"${epd.functional_unit}"`,
          epd.total_co2e || 0,
          epd.gwp_fossil || 0,
          epd.gwp_biogenic || 0,
          epd.gwp_total || 0,
          epd.version_number,
          epd.verified_at ? new Date(epd.verified_at).toISOString() : '',
          epd.verified_by || '',
          epd.epd_hash || ''
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `verified_epds_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${verifiedEpds.length} verified EPDs`);
    } catch (error) {
      toast.error('Failed to export EPDs');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const getComplianceScore = () => {
    if (stats.total === 0) return 0;
    const verificationRate = (stats.verified / stats.total) * 100;
    return Math.round(verificationRate);
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">EPD Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Environmental Product Declaration analytics and compliance overview
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Total EPDs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Environmental declarations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Verified EPDs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}% verification rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Avg CO₂e Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.avgCo2e.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">kg CO₂e per product</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              Material Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.totalMaterials}</div>
            <p className="text-xs text-muted-foreground">Materials in database</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compliance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>NCC & NABERS Readiness</span>
              <Badge variant={getComplianceScore() >= 80 ? "default" : "secondary"}>
                {getComplianceScore()}% Ready
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Verified EPDs</span>
                <span className="text-sm font-medium">{stats.verified}/{stats.total}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(stats.verified / Math.max(stats.total, 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>ISO 14025 Compliance: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>EN 15804 Standards: Implemented</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>ISO 21930 Guidelines: Followed</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={exportVerifiedEpds} disabled={exporting} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export Verified EPDs'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/verifier/dashboard')}
                className="flex-1"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Verifier Portal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Missing EPDs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Materials Without EPDs ({missingEpds.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {missingEpds.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All materials have EPDs!</p>
                </div>
              ) : (
                missingEpds.map((material) => (
                  <div key={material.id} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{material.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Carbon footprint: {material.avg_co2e.toFixed(2)} kg CO₂e/kg
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Missing EPD
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>EPD Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-green-500 mb-2">{stats.verified}</div>
              <div className="text-sm text-muted-foreground">Verified & Published</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-orange-500 mb-2">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Under Review</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-gray-500 mb-2">{stats.draft}</div>
              <div className="text-sm text-muted-foreground">Draft / Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EPDAnalyticsDashboard;