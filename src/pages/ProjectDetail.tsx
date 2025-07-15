
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { fetchProjectById, updateProject as apiUpdateProject, deleteProject as apiDeleteProject } from '@/services/projectService';
import { SavedProject } from '@/types/project';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import ProjectForm from '@/components/project/ProjectForm';
import { useAuth } from '@/contexts/auth';
import { isOffline, showErrorToast } from '@/utils/errorHandling';
import { useProjects } from '@/contexts/ProjectContext';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProject, deleteProject } = useProjects();
  const [project, setProject] = useState<SavedProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      console.error("Project ID is missing.");
      navigate('/projects');
      return;
    }

    const loadProject = async () => {
      setIsLoading(true);
      try {
        const fetchedProject = await fetchProjectById(projectId);
        if (fetchedProject) {
          setProject(fetchedProject);
        } else {
          setError(new Error("Project not found"));
          toast.error("Project not found.");
          navigate('/projects');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load project'));
        showErrorToast("Failed to load project. Please try again.", "project-load-error");
        navigate('/projects');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, navigate]);

  const handleUpdate = async (updatedProject: SavedProject) => {
    if (!user?.id || !projectId) {
      console.error("User ID or Project ID is missing.");
      return;
    }

    try {
      const projectData = {
        ...updatedProject,
        user_id: user.id,
        id: projectId
      };

      const updated = await updateProject(projectData);

      if (updated) {
        toast.success("Project updated successfully!");
        setProject(updated);
      } else {
        toast.error("Failed to update project.");
      }
    } catch (err) {
      showErrorToast("Failed to update project. Please try again.", "project-update-error");
    }
  };

  const handleDelete = async () => {
    if (!projectId) {
      console.error("Project ID is missing.");
      return;
    }

    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully!");
      navigate('/projects');
    } catch (err) {
      showErrorToast("Failed to delete project. Please try again.", "project-delete-error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error: {error?.message || 'Project not found'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Project Details | CarbonConstruct</title>
        <meta 
          name="description" 
          content="View and edit project details."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Edit Project</h1>
              <p className="text-muted-foreground">
                Update your project details and calculations.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <ProjectForm
                initialData={project}
                onSubmit={handleUpdate}
                onDelete={handleDelete}
                isEditing={true}
              />
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
