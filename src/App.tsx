import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Auth Pages
import Login from "./components/auth/Login.tsx";
import Register from "./components/auth/Register.tsx";
import OrganizationSelect from "./components/auth/OrganizationSelect.tsx";
import OrganizationCreate from "./components/auth/OrganizationCreate.tsx";
import OrganizationJoin from "./components/auth/OrganizationJoin.tsx";
import OrganizationInviteCreate from "./components/auth/OrganizationInviteCreate.tsx";

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import Organizations from './pages/organizations/Organizations';
import Projects from './pages/projects/Projects';
import Teams from './pages/teams/Teams';
import Employees from './pages/employees/Employees';
import Tasks from './pages/tasks/Tasks';
import Reports from './pages/reports/Reports';
import Activity from './pages/activity/Activity';
import Statistics from './pages/statistics/Statistics';
import Settings from './pages/settings/Settings';
import Profile from './pages/profile/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrganizations from './pages/admin/Organizations';
import AdminProjects from './pages/admin/Projects';
import AdminActivity from './pages/admin/Activity';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/organizations" element={<AdminOrganizations />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/activity" element={<AdminActivity />} />
            </Route>
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            {/* Organization Setup */}
            <Route path="/organization/select" element={<OrganizationSelect />} />
            <Route path="/organization/create" element={<OrganizationCreate />} />
            <Route path="/organization/join" element={<OrganizationJoin />} />
            <Route path="/organization/invite" element={<OrganizationInviteCreate />} />

            {/* Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/organization/select" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;