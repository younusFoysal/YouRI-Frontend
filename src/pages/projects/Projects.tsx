import ProjectList from '../../components/ProjectList';
import {Project} from "../../types.ts";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const Projects: React.FC = () => {

  const [projects, setProjects] = useState<Project[]>([]);
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.selectedOrganization) {
      navigate('/organizations');
      return;
    }

    fetchProjects();
  }, [state.selectedOrganization, navigate]);

  const fetchProjects = async () => {
    if (!state.selectedOrganization) return;

    try {
      const response = await fetch(
          `http://localhost:5000/api/projects?organizationId=${state.selectedOrganization._id}`,
          {
            headers: {
              'Authorization': `Bearer ${state.user?.token}`
            }
          }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSelectProject = (project: Project) => {
    navigate(`/projects/${project._id}`, { state: { project } });
  };

  if (!state.selectedOrganization) {
    return null;
  }

  return <div className="min-h-screen bg-gray-100">
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <ProjectList
            organizationId={state.selectedOrganization._id}
            onSelectProject={handleSelectProject}
        />
      </div>
    </div>
  </div>;
};

export default Projects;