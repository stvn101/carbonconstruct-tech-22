
import React from 'react';
import { SavedProject } from '@/types/project';

interface ProjectFormProps {
  initialData?: SavedProject;
  onSubmit: (project: SavedProject) => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

// Temporary stub component until project form is rebuilt
const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit, onDelete, isEditing }) => {
  return (
    <div className="p-8 text-center">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-amber-800 mb-2">Project Form Under Construction</h3>
        <p className="text-amber-700 mb-4">
          The project form is being rebuilt with the new calculator system.
        </p>
        {initialData && (
          <div className="text-left bg-white rounded p-4 mt-4">
            <h4 className="font-medium mb-2">Current Project Data:</h4>
            <pre className="text-sm text-gray-600 overflow-auto">
              {JSON.stringify(initialData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;
