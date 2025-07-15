import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PersonalizationData {
  calculationHistory: any[];
  complianceAlerts: any[];
  favoriteMaterials: any[];
  isLoading: boolean;
  error: string | null;
}

export const usePersonalization = (userId: string | undefined) => {
  const [data, setData] = useState<PersonalizationData>({
    calculationHistory: [],
    complianceAlerts: [],
    favoriteMaterials: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!userId) {
      setData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    fetchPersonalizationData();
  }, [userId]);

  const fetchPersonalizationData = async () => {
    if (!userId) return;

    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      // Fetch calculation history
      const { data: historyData, error: historyError } = await supabase
        .from('user_calculation_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (historyError) throw historyError;

      // Fetch compliance alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('user_compliance_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (alertsError) throw alertsError;

      // Fetch favorite materials with material details
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('user_material_favorites')
        .select(`
          *,
          material:unified_materials(
            id,
            name,
            carbon_footprint_kgco2e_kg,
            category,
            description
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      setData({
        calculationHistory: historyData || [],
        complianceAlerts: alertsData || [],
        favoriteMaterials: favoritesData || [],
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching personalization data:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load personalization data'
      }));
    }
  };

  const addToFavorites = async (materialId: string, category?: string, notes?: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_material_favorites')
        .insert([{
          user_id: userId,
          material_id: materialId,
          category,
          notes
        }]);

      if (error) throw error;

      toast.success('Material added to favorites');
      fetchPersonalizationData(); // Refresh data
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add material to favorites');
    }
  };

  const removeFromFavorites = async (materialId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_material_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('material_id', materialId);

      if (error) throw error;

      toast.success('Material removed from favorites');
      fetchPersonalizationData(); // Refresh data
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove material from favorites');
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('user_compliance_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;

      setData(prev => ({
        ...prev,
        complianceAlerts: prev.complianceAlerts.map(alert =>
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      }));
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast.error('Failed to update alert');
    }
  };

  const saveCalculationHistory = async (
    calculatorType: string,
    calculationData: any,
    results: any,
    carbonFootprint?: number,
    complianceStatus?: string,
    improvementSuggestions?: string[]
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_calculation_history')
        .insert([{
          user_id: userId,
          calculator_type: calculatorType,
          calculation_data: calculationData,
          results,
          carbon_footprint: carbonFootprint,
          compliance_status: complianceStatus,
          improvement_suggestions: improvementSuggestions
        }]);

      if (error) throw error;

      // Refresh data to show new calculation
      fetchPersonalizationData();
    } catch (error) {
      console.error('Error saving calculation history:', error);
      // Don't show error toast as this is background operation
    }
  };

  const createComplianceAlert = async (
    alertType: string,
    title: string,
    message: string,
    severity: 'info' | 'warning' | 'critical' = 'info',
    relatedStandard?: string,
    actionRequired: boolean = false,
    expiresAt?: Date
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_compliance_alerts')
        .insert([{
          user_id: userId,
          alert_type: alertType,
          title,
          message,
          severity,
          related_standard: relatedStandard,
          action_required: actionRequired,
          expires_at: expiresAt?.toISOString()
        }]);

      if (error) throw error;

      fetchPersonalizationData(); // Refresh data
    } catch (error) {
      console.error('Error creating compliance alert:', error);
    }
  };

  return {
    ...data,
    addToFavorites,
    removeFromFavorites,
    markAlertAsRead,
    saveCalculationHistory,
    createComplianceAlert,
    refreshData: fetchPersonalizationData
  };
};