import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

interface EPDForReview {
  id: string;
  product_name: string;
  manufacturer_name: string;
  total_co2e: number;
  created_at: string;
  submitted_at: string;
  status: string;
}

const VerifierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [epds, setEpds] = useState<EPDForReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    verified: 0,
    rejected: 0
  });

  useEffect(() => {
    loadEPDs();
    loadStats();
  }, []);

  const loadEPDs = async () => {
    try {
      const { data, error } = await supabase
        .from('epd_records')
        .select('id, product_name, manufacturer_name, total_co2e, created_at, submitted_at, status')
        .eq('status', 'submitted_for_review')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setEpds(data || []);
    } catch (error) {
      toast.error('Failed to load EPDs for review');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('epd_records')
        .select('status');

      if (error) throw error;

      const stats = data.reduce((acc, epd) => {
        if (epd.status === 'submitted_for_review') acc.pending++;
        else if (epd.status === 'verified') acc.verified++;
        else if (epd.status === 'draft') acc.rejected++;
        return acc;
      }, { pending: 0, verified: 0, rejected: 0 });

      setStats(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">EPD Verification Dashboard</h1>
        <p className="text-muted-foreground">
          Review and verify Environmental Product Declarations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">EPDs awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">Approved EPDs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">EPDs needing revision</p>
          </CardContent>
        </Card>
      </div>

      {/* EPDs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            EPDs Pending Review ({epds.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {epds.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No EPDs pending verification at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {epds.map((epd) => (
                <div key={epd.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{epd.product_name}</h3>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Manufacturer:</span> {epd.manufacturer_name}
                        </div>
                        <div>
                          <span className="font-medium">Total CO₂e:</span> {(epd.total_co2e || 0).toFixed(2)} kg
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {' '}
                          {new Date(epd.submitted_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => navigate(`/verifier/review/${epd.id}`)}
                      className="ml-4"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Verification Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Verify data completeness and accuracy according to ISO 14025, EN 15804, and ISO 21930 standards</p>
            <p>• Check lifecycle stage calculations and methodology</p>
            <p>• Ensure proper documentation and data sources</p>
            <p>• Validate environmental impact calculations</p>
            <p>• Review manufacturer information and product specifications</p>
          </div>
        </CardContent>
      </Card>
    <Footer />
    </div>
  );
};

export default VerifierDashboard;