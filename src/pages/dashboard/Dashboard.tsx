import DashboardComponent from '../../components/Dashboard';
import React, {useEffect} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const Dashboard: React.FC = () => {

  const { state, selectOrganization } = useAuth();
  const navigate = useNavigate();

  console.log(state);

  useEffect(() => {
    if (!state.selectedOrganization) {
      navigate('/organizations');
    }
  }, [state.selectedOrganization, navigate]);

  if (!state.selectedOrganization) {
    return null;
  }

  return <DashboardComponent onSelectOrganization={selectOrganization} />;
};

export default Dashboard;