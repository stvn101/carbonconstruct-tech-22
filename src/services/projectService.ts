
import { SavedProject } from '@/types/project';

// Temporary stub service until project functionality is rebuilt
export const fetchProjectById = async (projectId: string): Promise<SavedProject | null> => {
  console.log('Project service temporarily unavailable - fetchProjectById stub called with:', projectId);
  return null;
};

export const updateProject = async (project: SavedProject): Promise<SavedProject | null> => {
  console.log('Project service temporarily unavailable - updateProject stub called');
  return null;
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  console.log('Project service temporarily unavailable - deleteProject stub called with:', projectId);
  return false;
};

export const fetchUserProjects = async (userId: string): Promise<SavedProject[]> => {
  console.log('Project service temporarily unavailable - fetchUserProjects stub called');
  return [];
};

export const createProject = async (project: Omit<SavedProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<SavedProject | null> => {
  console.log('Project service temporarily unavailable - createProject stub called');
  return null;
};
