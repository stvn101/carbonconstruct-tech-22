
import { SavedProject } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';

export const fetchProjectById = async (projectId: string): Promise<SavedProject | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      materials: [],
      transport: [],
      energy: [],
      result: data.result,
      tags: data.tags || [],
      status: 'draft',
      region: data.region || 'AU',
      total_emissions: data.total || 0,
      premium_only: false
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const updateProject = async (project: SavedProject): Promise<SavedProject | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: project.name,
        description: project.description,
        result: project.result,
        total: project.total_emissions,
        region: project.region,
        tags: project.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', project.id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...project,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

export const fetchUserProjects = async (userId: string): Promise<SavedProject[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      created_at: project.created_at,
      updated_at: project.updated_at,
      user_id: project.user_id,
      materials: [],
      transport: [],
      energy: [],
      result: project.result,
      tags: project.tags || [],
      status: 'draft',
      region: project.region || 'AU',
      total_emissions: project.total || 0,
      premium_only: false
    }));
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
};

export const createProject = async (projectData: any): Promise<SavedProject | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: projectData.name,
        description: projectData.description,
        result: projectData.result || {},
        total: projectData.total_emissions || 0,
        region: 'AU',
        tags: projectData.tags || []
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      materials: projectData.materials || [],
      transport: projectData.transport || [],
      energy: projectData.energy || [],
      result: data.result,
      tags: data.tags || [],
      status: 'draft',
      region: data.region || 'AU',
      total_emissions: data.total || 0,
      premium_only: projectData.premium_only || false
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
};
