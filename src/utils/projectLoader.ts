
import { SavedProject } from '@/types/project';
import { fetchUserProjects } from '@/services/projectService';
import { Dispatch, SetStateAction } from 'react';

// Temporary stub for project loading utilities
export const loadProjectData = async (projectId: string): Promise<SavedProject | null> => {
  console.log('Project loader temporarily unavailable - loadProjectData stub called with:', projectId);
  return null;
};

export const validateProjectData = (project: any): boolean => {
  console.log('Project loader temporarily unavailable - validateProjectData stub called');
  return false;
};

// Fix the function signature that was causing the error
export const processProjectData = (project: SavedProject): SavedProject => {
  console.log('Project loader temporarily unavailable - processProjectData stub called');
  return project;
};

// Add the missing loadProjects function
export const loadProjects = async (
  userId: string,
  setProjects: Dispatch<SetStateAction<SavedProject[]>>,
  setFetchError: Dispatch<SetStateAction<Error | null>>
): Promise<SavedProject[]> => {
  try {
    console.log('Loading projects for user:', userId);
    const projects = await fetchUserProjects(userId);
    setProjects(projects);
    setFetchError(null);
    return projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    const errorObj = error instanceof Error ? error : new Error('Failed to load projects');
    setFetchError(errorObj);
    return [];
  }
};
