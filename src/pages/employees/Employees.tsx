import EmployeeList from '../../components/EmployeeList';
import {useEffect, useState} from "react";
import {Employee} from "../../types.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const Employees: React.FC = () => {

  // const [employees, setEmployees] = useState<Employee[]>([]);
  // const { state } = useAuth();
  // const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  //
  //
  //
  // useEffect(() => {
  //       // Load selected organization from localStorage
  //       const savedOrg = localStorage.getItem('selectedOrganization');
  //       console.log("+++Org",savedOrg);
  //       if (savedOrg) {
  //           setSelectedOrganization(JSON.parse(savedOrg));
  //       }
  //   }, []);
  //
  // useEffect(() => {
  //   fetchEmployees();
  // }, [selectedOrganization]);
  //
  // console.log(selectedOrganization)
  //
  // const fetchEmployees = async () => {
  //       try {
  //
  //           // Filter employees by organization if one is selected
  //           if (selectedOrganization) {
  //               const url = `http://localhost:5000/api/employees?organizationId=${selectedOrganization?._id}`;
  //               const response = await fetch(url, {
  //                   headers: {
  //                       'Authorization': `Bearer ${state.user?.token}`
  //                   }
  //               });
  //               const data = await response.json();
  //               console.log(data);
  //
  //               // console.log(selectedOrganization);
  //               // const filteredEmployees = data.filter((emp: Employee) =>
  //               //         //   emp.organizationId === selectedOrganization._id
  //               //         emp.organizations.some(org => org.organizationId === selectedOrganization._id)
  //               // );
  //               // console.log(filteredEmployees);
  //               setEmployees(data);
  //           }
  //           // } else {
  //           //     const url = `http://localhost:5000/api/employees`;
  //           //     const response = await fetch(url, {
  //           //         headers: {
  //           //             'Authorization': `Bearer ${state.user?.token}`
  //           //         }
  //           //     });
  //           //     const data = await response.json();
  //           //     console.log(data);
  //           //     setEmployees(data);
  //           // }
  //       } catch (error) {
  //           console.error('Error fetching employees:', error);
  //       }
  //   };
  //
  // const handleSelectEmployee = (employee: Employee) => {
  //   // Handle employee selection
  //   console.log('Selected employee:', employee);
  // };


    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { state } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state.selectedOrganization) {
            navigate('/organizations');
            return;
        }

        fetchEmployees();
    }, [state.selectedOrganization, navigate]);

    const fetchEmployees = async () => {
        if (!state.selectedOrganization) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `http://localhost:5000/api/employees?organizationId=${state.selectedOrganization._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${state.user?.token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }

            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEmployee = (employee: Employee) => {
        navigate(`/statistics`, {
            state: {
                selectedEmployee: employee,
                organizationId: state.selectedOrganization?._id
            }
        });
    };

    if (!state.selectedOrganization) {
        return null;
    }


  //   return <EmployeeList
  //     employees={employees}
  //     organizationId={selectedOrganization?._id}
  //     onSelectEmployee={handleSelectEmployee}
  // />;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <EmployeeList
                        employees={employees}
                        loading={loading}
                        error={error}
                        organizationId={state.selectedOrganization._id}
                        onSelectEmployee={handleSelectEmployee}
                    />
                </div>
            </div>
        </div>
    );
};

export default Employees;