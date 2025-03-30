import {Organization} from "../../types.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import OrganizationSelect from "../../components/auth/OrganizationSelect.tsx";

const Organizations: React.FC = () => {

  const navigate = useNavigate();
  const { selectOrganization } = useAuth();

  const handleSelectOrganization = (org: Organization) => {
    selectOrganization(org);
    navigate('/dashboard');
  };

  // return <OrganizationList />;
  return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <OrganizationSelect onSelectOrganization={handleSelectOrganization} />
          </div>
        </div>
      </div>
  );
};

export default Organizations;