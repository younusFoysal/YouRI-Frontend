import React from 'react';
import ActivityMonitor from '../../components/ActivityMonitor';
import {useAuth} from "../../context/AuthContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";

const Activity: React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { state: authState } = useAuth();

    const session = location.state?.session;
    const employeeId = location.state?.employeeId;
    const organizationId = location.state?.organizationId;

    // Redirect if no session data
    if (!session || !employeeId || !organizationId) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">No Session Selected</h2>
                    <button
                        onClick={() => navigate('/statistics')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Return to Statistics
                    </button>
                </div>
            </div>
        );
    }

  return (
      <div className="p-6">
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Activity Monitor</h1>
              <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
              >
                  Back to Statistics
              </button>
          </div>
          <ActivityMonitor workSession={session} />
      </div>
  );
};

export default Activity;