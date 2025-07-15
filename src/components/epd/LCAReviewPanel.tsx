import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface EPDRecord {
  id: string;
  product_name: string;
  manufacturer_name: string;
  total_co2e: number;
  submitted_by: string;
  created_at: string;
  status: string;
}

export default function LCAReviewPanel() {
  const [epds, setEpds] = useState<EPDRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEPDs();
  }, []);

  const fetchEPDs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('epd_records')
        .select('*')
        .eq('status', 'submitted_for_review')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEpds(data || []);
    } catch (error) {
      console.error('Error fetching EPDs:', error);
      toast.error('Failed to load EPDs for review');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    epdId: string, 
    action: 'verified' | 'draft', 
    notes: string = ''
  ) => {
    setProcessingId(epdId);
    try {
      const { data: user } = await supabase.auth.getUser();
      const verified_by = user?.user?.email || 'unknown';

      // Update EPD record
      const { error: updateError } = await supabase
        .from('epd_records')
        .update({
          status: action,
          verified_by: action === 'verified' ? verified_by : null,
          verified_at: action === 'verified' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', epdId);

      if (updateError) throw updateError;

      // Log verification action
      const { error: historyError } = await supabase
        .from('epd_verification_history')
        .insert({
          epd_record_id: epdId,
          action: action === 'verified' ? 'approved' : 'rejected',
          verified_by,
          verification_notes: notes
        });

      if (historyError) throw historyError;

      toast.success(`EPD ${action === 'verified' ? 'approved' : 'rejected'} successfully`);
      await fetchEPDs();
    } catch (error) {
      console.error('Error processing EPD:', error);
      toast.error(`Failed to ${action === 'verified' ? 'approve' : 'reject'} EPD`);
    } finally {
      setProcessingId(null);
    }
  };

  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const updateNotes = (epdId: string, value: string) => {
    setNotes(prev => ({ ...prev, [epdId]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">LCA Review Panel</h1>
        <p className="text-muted-foreground">
          Review and verify Environmental Product Declarations awaiting approval
        </p>
      </div>

      {epds.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No EPDs pending verification at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {epds.map((epd) => (
            <Card key={epd.id} className="border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{epd.product_name}</CardTitle>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Manufacturer:</span>
                    <p>{epd.manufacturer_name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Total CO₂e:</span>
                    <p>{(epd.total_co2e || 0).toFixed(2)} kg</p>
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span>
                    <p>{new Date(epd.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Verification Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any comments or notes about this EPD verification..."
                    value={notes[epd.id] || ''}
                    onChange={(e) => updateNotes(epd.id, e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => handleAction(epd.id, 'verified', notes[epd.id])}
                    disabled={processingId === epd.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {processingId === epd.id ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => handleAction(epd.id, 'draft', notes[epd.id])}
                    disabled={processingId === epd.id}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {processingId === epd.id ? 'Processing...' : 'Reject'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}