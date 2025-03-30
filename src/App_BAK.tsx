import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EmployeeList from './components/EmployeeList';
import ProjectList from './components/ProjectList';
import TeamList from './components/TeamList';
import TaskList from './components/TaskList';
import ActivityMonitor from './components/ActivityMonitor';
import Statistics from './components/Statistics';
import { Employee, WorkSession, Organization, Project, Team, Task } from './types';
import { ArrowLeft } from 'lucide-react';
import Dashboard from "./components/Dashboard.tsx";
import EmployeeDashboard from "./components/EmployeeDashboard.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Reports from "./components/Reports.tsx";
import {Toaster} from "react-hot-toast";
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';


// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OrganizationCreate from './components/auth/OrganizationCreate';
import OrganizationJoin from './components/auth/OrganizationJoin';
import OrganizationSelect from './components/auth/OrganizationSelect';
import PrivateRoute from './components/PrivateRoute';
import {AuthProvider, useAuth} from './context/AuthContext';



const queryClient = new QueryClient();


function MainApp_BAK() {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedSession, setSelectedSession] = useState<WorkSession | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

    const navigate = useNavigate();

  console.log(state);

    useEffect(() => {
        // Load selected organization from localStorage
        const savedOrg = localStorage.getItem('selectedOrganization');
        console.log("+++Org",savedOrg);
        if (savedOrg) {
            setSelectedOrganization(JSON.parse(savedOrg));
        }
    }, []);

  useEffect(() => {
    fetchEmployees();
  }, [selectedOrganization]);

  console.log(selectedOrganization)

    const fetchEmployees = async () => {
        try {

            // Filter employees by organization if one is selected
            if (selectedOrganization) {
                const url = `http://localhost:5000/api/employees?organizationId=${selectedOrganization?._id}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${state.user?.token}`
                    }
                });
                const data = await response.json();
                console.log(data);

                // console.log(selectedOrganization);
                // const filteredEmployees = data.filter((emp: Employee) =>
                //         //   emp.organizationId === selectedOrganization._id
                //         emp.organizations.some(org => org.organizationId === selectedOrganization._id)
                // );
                // console.log(filteredEmployees);
                setEmployees(data);
            }
            // } else {
            //     const url = `http://localhost:5000/api/employees`;
            //     const response = await fetch(url, {
            //         headers: {
            //             'Authorization': `Bearer ${state.user?.token}`
            //         }
            //     });
            //     const data = await response.json();
            //     console.log(data);
            //     setEmployees(data);
            // }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

  // const fetchEmployees = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/api/employees');
  //     const data = await response.json();
  //     setEmployees(data);
  //   } catch (error) {
  //     console.error('Error fetching employees:', error);
  //   }
  // };
  //console.log('employees:', employees);

  const handleBack = () => {
    if (activeTab === 'activity' && selectedSession) {
      setSelectedSession(null);
      setActiveTab('statistics');
    } else if (activeTab === 'statistics' && selectedEmployee) {
      setSelectedEmployee(null);
      setActiveTab('employees');
    } else if (activeTab === 'projects' && selectedProject) {
      setSelectedProject(null);
      if (selectedOrganization) {
        setActiveTab('organizations');
      }
    } else if (activeTab === 'teams' && selectedTeam) {
      setSelectedTeam(null);
      if (selectedOrganization) {
        setActiveTab('organizations');
      }
    } else if (activeTab === 'tasks' && selectedTask) {
      setSelectedTask(null);
      if (selectedProject) {
        setActiveTab('projects');
      } else if (selectedEmployee) {
        setActiveTab('employees');
      }
    } else if (activeTab === 'organizations' && selectedOrganization) {
      setSelectedOrganization(null);
      localStorage.removeItem('selectedOrganization');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset selections when changing tabs
    if (tab !== 'statistics') setSelectedEmployee(null);
    if (tab !== 'activity') setSelectedSession(null);
    // if (tab !== 'organizations') setSelectedOrganization(null);
    if (tab !== 'projects') setSelectedProject(null);
    if (tab !== 'teams') setSelectedTeam(null);
    if (tab !== 'tasks') setSelectedTask(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
            <Dashboard
                onSelectOrganization={(organization) => {
                  setSelectedOrganization(organization);
                  localStorage.setItem('selectedOrganization', JSON.stringify(organization));
                  //setSelectedOrganization(state.selectedOrganization._id);
                }}
            />
        );
        case 'employee-dashboard':
            return (
                <EmployeeDashboard
                    organizationId={selectedOrganization?._id}
                />
            );
      case 'organizations':
        return (
            navigate('/organization/select')
            //  navigate('/organization/select', { state: { selectedOrganization: org } })
          // <OrganizationList
          //   // onSelectOrganization={(organization) => {
          //   //   setSelectedOrganization(organization);
          //   // }}
          // />
        );
      case 'projects':
        return (
          <div className="h-full">
            {selectedOrganization && (
              <div className="p-6">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Organizations</span>
                </button>
                <h2 className="text-xl font-semibold mt-4 mb-6">
                  Projects for {selectedOrganization.name}
                </h2>
              </div>
            )}
            <ProjectList
              organizationId={selectedOrganization?._id}
              onSelectProject={(project) => {
                setSelectedProject(project);
                setActiveTab('tasks');
              }}
            />
          </div>
        );
      case 'teams':
        return (
          <div className="h-full">
            {selectedOrganization && (
              <div className="p-6">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Organizations</span>
                </button>
                <h2 className="text-xl font-semibold mt-4 mb-6">
                  Teams for {selectedOrganization.name}
                </h2>
              </div>
            )}
            <TeamList
              organizationId={selectedOrganization?._id}
              onSelectTeam={(team) => {
                setSelectedTeam(team);
              }}
            />
          </div>
        );
        case 'employees':
            return (
                <div className="h-full">
                    {selectedOrganization && (
                        <div className="p-6">
                            <button
                                onClick={handleBack}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft size={20} />
                                <span>Back to Organizations</span>
                            </button>
                            <h2 className="text-xl font-semibold mt-4 mb-6">
                                Employees for {selectedOrganization.name}
                            </h2>
                        </div>
                    )}
                    <EmployeeList
                        employees={employees}
                        organizationId={selectedOrganization?._id}
                        onSelectEmployee={(employee) => {
                            setSelectedEmployee(employee);
                            setActiveTab('statistics');
                        }}
                    />
                </div>
            );
      case 'tasks':
        return (
          <div className="h-full">
            {(selectedProject || selectedEmployee) && (
              <div className="p-6">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={20} />
                  <span>
                    {selectedProject
                      ? `Back to Projects`
                      : `Back to Employees`}
                  </span>
                </button>
                <h2 className="text-xl font-semibold mt-4 mb-6">
                  {selectedProject
                    ? `Tasks for ${selectedProject.name}`
                    : selectedEmployee
                    ? `Tasks for ${selectedEmployee.name}`
                    : 'All Tasks'}
                </h2>
              </div>
            )}
            <TaskList
              projectId={selectedProject?._id}
              employeeId={selectedEmployee?._id}
              onSelectTask={(task) => {
                setSelectedTask(task);
              }}
            />
          </div>
        );
      case 'reports':
          return (
              <Reports organizationId={selectedOrganization?._id} />
          );
      case 'activity':
        return selectedSession ? (
          <div className="h-full">
            <div className="p-6">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Back to Statistics</span>
              </button>
            </div>
            <ActivityMonitor workSession={selectedSession} />
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            Please select a session to view its activity
          </div>
        );
      case 'statistics':
        return selectedEmployee ? (
          <Statistics
            selectedEmployeeId={selectedEmployee._id}
            onBack={handleBack}
            onViewSession={(session) => {
              setSelectedSession(session);
              setActiveTab('activity');
            }}
          />
        ) : (
          <div className="p-6 text-center text-gray-600">
            Please select an employee to view their statistics
          </div>
        );
      default:
        return null;
    }
  };

  return (
      <QueryClientProvider client={queryClient}>
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        <Toaster/>
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
      </QueryClientProvider>
  );
}


function App_BAK() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/organization/select" element={<OrganizationSelect />} />
                        <Route path="/organization/create" element={<OrganizationCreate />} />
                        <Route path="/organization/join" element={<OrganizationJoin />} />
                        <Route path="/dashboard" element={<MainApp_BAK />} />
                        <Route path="/" element={<Navigate to="/organization/select" replace />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}


export default App_BAK;