import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X, FileText, Clock, User, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { EPDRecord } from '@/types/epd';
import { toast } from 'sonner';
import { hashEpd } from '@/utils/epdHash';

const VerifierReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [epd, setEpd] = useState<EPDRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [epdHash, setEpdHash] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadEPD();
    }
  }, [id]);

  const loadEPD = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('epd_records')
        .select('*')
        .eq('id', id)
        .eq('status', 'submitted_for_review')
        .single();

      if (error) {
        toast.error(`Failed to load EPD: ${  error.message}`);
        return;
      }

      setEpd(data as unknown as EPDRecord);
      
      // Generate hash for display
      if (data) {
        const hash = await hashEpd(data as unknown as EPDRecord);
        setEpdHash(hash);
      }
    } catch (error) {
      toast.error('An error occurred while loading EPD');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (action: 'approve' | 'reject') => {
    if (!epd) return;
    
    setProcessing(true);
    try {
      const updates: any = {
        status: action === 'approve' ? 'verified' : 'draft',
        updated_at: new Date().toISOString()
      };

      if (action === 'approve') {
        updates.verified_at = new Date().toISOString();
        updates.verified_by = 'verifier@carbonconstruct.com.au';
        updates.epd_hash = epdHash;
      }

      const { error: updateError } = await supabase
        .from('epd_records')
        .update(updates)
        .eq('id', epd.id);

      if (updateError) throw updateError;

      // Log verification action
      const { error: historyError } = await supabase
        .from('epd_verification_history')
        .insert({
          epd_record_id: epd.id,
          action: action === 'approve' ? 'approved' : 'rejected',
          verified_by: 'verifier@carbonconstruct.com.au',
          verification_notes: verificationNotes
        });

      if (historyError) throw historyError;

      toast.success(`EPD ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      navigate('/verifier/dashboard');
    } catch (error) {
      toast.error(`Failed to ${action} EPD`);
      console.error(error);
    } finally {
      setProcessing(false);
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
        <Button variant="ghost" onClick={() => navigate('/verifier/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">EPD Not Found</h3>
            <p className="text-muted-foreground">
              The EPD is not available for review or has already been processed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/verifier/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">EPD Verification</h1>
            <p className="text-muted-foreground">
              Review and verify Environmental Product Declaration
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Pending Review
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* EPD Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                  <p className="text-lg font-semibold">{epd.product_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
                  <p className="text-lg">{epd.manufacturer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Functional Unit</label>
                  <p>{epd.functional_unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Version</label>
                  <p>v{epd.version_number}</p>
                </div>
              </div>
              {epd.product_description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1">{epd.product_description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{(epd.total_co2e || 0).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total CO₂e (kg)</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold">{(epd.gwp_fossil || 0).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">GWP Fossil (kg)</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold">{(epd.gwp_biogenic || 0).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">GWP Biogenic (kg)</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold">{(epd.gwp_total || 0).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">GWP Total (kg)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifecycle Stages */}
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Stage Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Stage</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-right p-2">Emissions (kg CO₂e)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(epd.epd_stage_data).map(([stage, data]) => {
                      if (data && typeof data === 'object' && 'co2e_value' in data) {
                        const stageData = data as any;
                        return (
                          <tr key={stage} className="border-b border-border/50">
                            <td className="p-2 font-mono">{stage}</td>
                            <td className="p-2">{stageData.description || stage}</td>
                            <td className="p-2 text-right">{stageData.co2e_value.toFixed(3)}</td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Hash Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Document Integrity Hash
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">SHA-256 Hash:</p>
                <code className="text-xs font-mono break-all">{epdHash}</code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Verification Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Verification Notes</label>
                <Textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Add comments about the verification process..."
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleVerification('approve')}
                  disabled={processing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {processing ? 'Processing...' : 'Approve EPD'}
                </Button>

                <Button
                  onClick={() => handleVerification('reject')}
                  disabled={processing}
                  variant="destructive"
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  {processing ? 'Processing...' : 'Reject EPD'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Notice */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Compliance Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• ISO 14025: Environmental labels and declarations</p>
                <p>• EN 15804: Sustainability of construction works</p>
                <p>• ISO 21930: Sustainability in building construction</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifierReview;