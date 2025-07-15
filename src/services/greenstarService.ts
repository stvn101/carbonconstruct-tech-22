
import { supabase } from '@/integrations/supabase/client';
import { performDbOperation } from '@/services/supabase/db';
import type { Json } from '@/integrations/supabase/types';

export interface GreenStarProject {
  id?: string;
  user_id: string;
  project_name: string;
  project_type: string;
  location: string;
  target_rating: 'None' | 'Good Practice' | 'Best Practice';
  total_project_cost?: number;
  building_layer_costs?: Json;
  products?: Json;
  compliance_results?: Json;
  overall_score?: number;
  achieved_credits?: number;
  total_possible_credits?: number;
  achievement_level?: 'None' | 'Good Practice' | 'Best Practice';
  recommendations?: string[];
  submission_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GreenStarInitiative {
  id?: string;
  initiative_id: string;
  initiative_name: string;
  rpv_score: number;
  categories: Json;
  recognition_date: string;
  expiry_date?: string;
  is_active: boolean;
  description?: string;
}

export const createGreenStarProject = async (project: Omit<GreenStarProject, 'id' | 'created_at' | 'updated_at'>): Promise<GreenStarProject> => {
  return performDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('green_star_projects')
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      return data as GreenStarProject;
    },
    'create Green Star project'
  );
};

export const fetchGreenStarProjects = async (userId: string): Promise<GreenStarProject[]> => {
  return performDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('green_star_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as GreenStarProject[];
    },
    'fetch Green Star projects'
  );
};

export const updateGreenStarProject = async (project: GreenStarProject): Promise<GreenStarProject> => {
  return performDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('green_star_projects')
        .update(project)
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;
      return data as GreenStarProject;
    },
    'update Green Star project'
  );
};

export const deleteGreenStarProject = async (projectId: string): Promise<void> => {
  return performDbOperation(
    async () => {
      const { error } = await supabase
        .from('green_star_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    },
    'delete Green Star project'
  );
};

export const fetchGreenStarInitiatives = async (): Promise<GreenStarInitiative[]> => {
  return performDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('green_star_initiatives')
        .select('*')
        .eq('is_active', true)
        .order('rpv_score', { ascending: false });

      if (error) throw error;
      return (data || []) as GreenStarInitiative[];
    },
    'fetch Green Star initiatives'
  );
};

export const fetchGreenStarMaterials = async (filters?: {
  building_layer?: string;
  compliant_only?: boolean;
  min_rpv_score?: number;
}): Promise<any[]> => {
  return performDbOperation(
    async () => {
      let query = supabase
        .from('unified_materials')
        .select(`
          *,
          green_star_certifications (
            certificate_number,
            initiative_id,
            issue_date,
            expiry_date,
            green_star_initiatives (
              initiative_name,
              rpv_score
            )
          )
        `);

      if (filters?.compliant_only) {
        query = query.eq('green_star_compliant', true);
      }

      if (filters?.min_rpv_score) {
        query = query.gte('green_star_rpv_score', filters.min_rpv_score);
      }

      if (filters?.building_layer) {
        query = query.contains('building_layers', [filters.building_layer]);
      }

      const { data, error } = await query.order('green_star_rpv_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    'fetch Green Star materials'
  );
};
