import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createDbConnection } from '@/services/database/ConnectionStabilizer';
import { toast } from 'sonner';

interface Material {
  id: string;
  name: string;
  category?: string;
  carbon_footprint_kgco2e_kg?: number;
  unit?: string;
  description?: string;
  region?: string;
}

export const useStableMaterials = (category?: string) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true);
      setError(null);

      try {
        const dbConn = createDbConnection();
        const result = await dbConn.withConnection(
          async () => {
            let query = supabase
              .from('unified_materials')
              .select('id, name, category, carbon_footprint_kgco2e_kg, unit, description, region')
              .order('name');

            if (category) {
              query = query.eq('category', category);
            }

            const { data, error } = await query.limit(100);
            
            if (error) throw error;
            return data || [];
          },
          () => {
            // Fallback materials for offline/connection issues
            return [
              {
                id: 'fallback-concrete',
                name: 'Concrete (General Purpose)',
                category: 'Structural',
                carbon_footprint_kgco2e_kg: 0.11,
                unit: 'kg',
                description: 'Standard concrete mix',
                region: 'Australia'
              },
              {
                id: 'fallback-steel',
                name: 'Steel (Structural)',
                category: 'Structural', 
                carbon_footprint_kgco2e_kg: 1.8,
                unit: 'kg',
                description: 'Structural steel',
                region: 'Australia'
              },
              {
                id: 'fallback-timber',
                name: 'Timber (Hardwood)',
                category: 'Structural',
                carbon_footprint_kgco2e_kg: 0.45,
                unit: 'kg',
                description: 'Hardwood timber',
                region: 'Australia'
              }
            ].filter(material => !category || material.category === category);
          }
        );

        if (result) {
          setMaterials(result);
        }
      } catch (err) {
        console.error('Error loading materials:', err);
        setError('Failed to load materials');
        toast.error('Failed to load materials. Using offline data.');
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [category]);

  return { materials, loading, error, refetch: () => setLoading(true) };
};