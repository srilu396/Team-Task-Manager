import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/project.service';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { Plus, FolderKanban } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      showToast('Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your team's projects</p>
        </div>
        
        {user?.role === 'admin' && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span>New Project</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map(project => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onClick={() => navigate(`/projects/${project._id}`)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <FolderKanban size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
          <p className="text-gray-500 text-center max-w-sm">
            {user?.role === 'admin' 
              ? "Get started by creating a new project for your team." 
              : "You haven't been assigned to any projects yet."}
          </p>
          {user?.role === 'admin' && (
            <Button className="mt-6" onClick={() => setIsModalOpen(true)}>
              Create Project
            </Button>
          )}
        </div>
      )}

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={fetchProjects}
      />
    </div>
  );
};

export default Projects;
