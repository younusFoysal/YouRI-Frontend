import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Login from "../components/auth/Login.tsx";
import Register from "../components/auth/Register.tsx";
import AdminRoute from "../components/AdminRoute.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";
import AdminDashboard from "../pages/admin/Dashboard.tsx";
import AdminUsers from "../pages/admin/Users.tsx";
import AdminOrganizations from "../pages/admin/Organizations.tsx";
import AdminProjects from "../pages/admin/Projects.tsx";
import AdminActivity from "../pages/admin/Activity.tsx";
import PrivateRoute from "../components/PrivateRoute.tsx";
import OrganizationSelect from "../components/auth/OrganizationSelect.tsx";
import OrganizationCreate from "../components/auth/OrganizationCreate.tsx";
import OrganizationJoin from "../components/auth/OrganizationJoin.tsx";
import OrganizationInviteCreate from "../components/auth/OrganizationInviteCreate.tsx";
import DashboardLayout from "../layouts/DashboardLayout.tsx";
import Dashboard from "../pages/dashboard/Dashboard.tsx";
import EmployeeDashboard from "../pages/dashboard/EmployeeDashboard.tsx";
import Organizations from "../pages/organizations/Organizations.tsx";
import Projects from "../pages/projects/Projects.tsx";
import Teams from "../pages/teams/Teams.tsx";
import Employees from "../pages/employees/Employees.tsx";
import Tasks from "../pages/tasks/Tasks.tsx";
import Reports from "../pages/reports/Reports.tsx";
import Activity from "../pages/activity/Activity.tsx";
import Statistics from "../pages/statistics/Statistics.tsx";
import Settings from "../pages/settings/Settings.tsx";
import Profile from "../pages/profile/Profile.tsx";
import {useAuth} from "../context/AuthContext.tsx";

const AppRoutes = () => {
    const { state } = useAuth();

    return (
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
                </Route>

                {/* Root path redirect */}
                <Route path="/" element={
                    state.isAuthenticated ? (
                        state.user?.isMasterAdmin ? (
                            <Navigate to="/admin" replace />
                        ) : (
                            <Navigate to="/dashboard" replace />
                        )
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
