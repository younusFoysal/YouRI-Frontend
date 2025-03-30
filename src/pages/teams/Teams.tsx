import TeamList from '../../components/TeamList';
import {Team} from "../../types.ts";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const Teams: React.FC = () => {

  const [teams, setTeams] = useState<Team[]>([]);
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.selectedOrganization) {
      navigate('/organizations');
      return;
    }

    fetchTeams();
  }, [state.selectedOrganization, navigate]);

  const fetchTeams = async () => {
    if (!state.selectedOrganization) return;

    try {
      const response = await fetch(
          `http://localhost:5000/api/teams?organizationId=${state.selectedOrganization._id}`,
          {
            headers: {
              'Authorization': `Bearer ${state.user?.token}`
            }
          }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }

      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleSelectTeam = (team: Team) => {
    navigate(`/teams/${team._id}`, { state: { team } });
  };

  if (!state.selectedOrganization) {
    return null;
  }

  return <div className="min-h-screen bg-gray-100">
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <TeamList
            organizationId={state.selectedOrganization._id}
            onSelectTeam={handleSelectTeam}
        />
      </div>
    </div>
  </div>;
};

export default Teams;