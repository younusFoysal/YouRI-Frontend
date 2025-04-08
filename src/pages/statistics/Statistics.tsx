import StatisticsComponent from '../../components/Statistics';
import {WorkSession} from "../../types.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import React, {useEffect} from "react";

const Statistics: React.FC = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAuth();
  const selectedEmployee = location.state?.selectedEmployee;
  const organizationId = location.state?.organizationId;

  useEffect(() => {
    if (!selectedEmployee || !organizationId || !state.selectedOrganization) {
      navigate('/employees');
    }
  }, [selectedEmployee, organizationId, state.selectedOrganization, navigate]);

  const handleBack = () => {
    navigate('/employees');
  };

  const handleViewSession = (session: WorkSession) => {
    navigate(`/activity`, {
      state: {
        session,
        employeeId: selectedEmployee._id,
        organizationId: organizationId
      }
    });
  };

  if (!selectedEmployee || !organizationId || !state.selectedOrganization) {
    return null;
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <StatisticsComponent
                selectedEmployeeId={selectedEmployee._id}
                onBack={handleBack}
                onViewSession={handleViewSession}
            />
          </div>
        </div>
      </div>
  );
};

export default Statistics;