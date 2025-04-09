import React, { useState, useEffect } from 'react';
import {Organization, Employee, Project, Team, Task, WorkSession, Stats} from '../types';
import {  Users, Briefcase, ListTodo, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell,  Tooltip, ResponsiveContainer } from 'recharts';
import {useAuth} from "../context/AuthContext.tsx";
import useAxiosSecure from "../hook/useAxiosSecure.ts";

interface DashboardProps {
    onSelectOrganization: (organization: Organization) => void;
}

const Dashboard: React.FC<DashboardProps> = () => {
    const { state } = useAuth();
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [workSessions, setWorkSessions] = useState<WorkSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        activeEmployees: 0,
        inactiveEmployees: 0,
        onLeaveEmployees: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        planningProjects: 0,
        onHoldProjects: 0,
        todoTasks: 0,
        inProgressTasks: 0,
        reviewTasks: 0,
        completedTasks: 0,
        totalBudget: 0,
        totalHoursLogged: 0,
        activeHours: 0,
        idleHours: 0,
    });
    const axiosSecure = useAxiosSecure();


    console.log("D Work Sessions:", workSessions);
    console.log("D Employees:", employees);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    useEffect(() => {
        // Load selected organization from localStorage
        const savedOrg = localStorage.getItem('selectedOrganization');
        if (savedOrg) {
            const org = JSON.parse(savedOrg);
            setSelectedOrg(org);

            // Check if user is owner/admin of this org
            const userRole = state.user?.organizations.find(o => o.organizationId === org._id)?.role;
            if (userRole === 'owner' || userRole === 'admin') {
                fetchOrganizationData(org._id);
            } else {
                fetchEmployeeData();
            }
        }
    }, [state.user]);


    // Fetch organization data
    const fetchOrganizationData = async (orgId: string) => {
        try {
            setLoading(true);

            // Fetch all data for org dashboard
            const [employeesRes, projectsRes, teamsRes, tasksRes, sessionsRes] = await Promise.all([
                axiosSecure.get(`/employees/organization/${orgId}`),
                axiosSecure.get(`/projects?organizationId=${orgId}`),
                axiosSecure.get(`/teams?organizationId=${orgId}`),
                axiosSecure.get(`/tasks?organizationId=${orgId}`),
                axiosSecure.get(`/sessions?organizationId=${orgId}`)
            ]);

            const [employeesData, projectsData, teamsData, tasksData, sessionsData] = await Promise.all([
                employeesRes.data.data,
                projectsRes.data.data,
                teamsRes.data.data,
                tasksRes.data.data,
                sessionsRes.data.data
            ]);

            console.log(employeesData, projectsData, teamsData, tasksData, sessionsData);

            setEmployees(employeesData);
            setProjects(projectsData);
            setTeams(teamsData);
            setTasks(tasksData);
            setWorkSessions(sessionsData);
            calculateOrgStats(employeesData, projectsData, tasksData, sessionsData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching organization data:', error);
            setLoading(false);
        }
    };

    // Fetch employee data
    const fetchEmployeeData = async () => {
        try {
            setLoading(true);

            // Fetch only the logged-in user's data
            const [tasksRes, sessionsRes] = await Promise.all([
                axiosSecure.get(`tasks?assigneeId=${state.user?._id}`),
                axiosSecure.get(`/sessions?employeeId=${state.user?._id}`)
            ]);

            const [tasksData, sessionsData] = await Promise.all([
                tasksRes.data.data,
                sessionsRes.data.data
            ]);

            setTasks(tasksData);
            setWorkSessions(sessionsData);
            calculateEmployeeStats(tasksData, sessionsData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching employee data:', error);
            setLoading(false);
        }
    };

    // Calculate stats for organization
    const calculateOrgStats = (employees: Employee[], projects: Project[], tasks: Task[], sessions: WorkSession[]) => {
        const totalHoursLogged = sessions.reduce(
            (sum, session) => sum + (((session.activeTime ?? 0) + (session.idleTime ?? 0)) / 3600),
            0
        );

        const stats = {
            activeEmployees: employees.filter(emp => emp.status === 'active').length,
            inactiveEmployees: employees.filter(emp => emp.status === 'inactive').length,
            onLeaveEmployees: employees.filter(emp => emp.status === 'on-leave').length,

            completedProjects: projects.filter(proj => proj.status === 'completed').length,
            inProgressProjects: projects.filter(proj => proj.status === 'in-progress').length,
            planningProjects: projects.filter(proj => proj.status === 'planning').length,
            onHoldProjects: projects.filter(proj => proj.status === 'on-hold').length,

            todoTasks: tasks.filter(task => task.status === 'todo').length,
            inProgressTasks: tasks.filter(task => task.status === 'in-progress').length,
            reviewTasks: tasks.filter(task => task.status === 'review').length,
            completedTasks: tasks.filter(task => task.status === 'completed').length,

            totalBudget: projects.reduce((sum, proj) => sum + (proj.budget ?? 0), 0),
            totalHoursLogged: Math.round(totalHoursLogged * 10) / 10

        };

        setStats(stats);
    };


    const calculateEmployeeStats = (tasks: Task[], sessions: WorkSession[]) => {
        const stats = {
            todoTasks: tasks.filter(task => task.status === 'todo').length,
            inProgressTasks: tasks.filter(task => task.status === 'in-progress').length,
            reviewTasks: tasks.filter(task => task.status === 'review').length,
            completedTasks: tasks.filter(task => task.status === 'completed').length,

            totalHoursLogged: sessions.reduce(
                (sum, session) => sum + (((session.activeTime ?? 0) + (session.idleTime ?? 0)) / 3600),
                0
            ),

            activeHours: sessions.reduce(
                (sum, session) => sum + ((session.activeTime ?? 0) / 3600),
                0
            ),

            idleHours: sessions.reduce(
                (sum, session) => sum + ((session.idleTime ?? 0) / 3600),
                0
            ),
        };

        setStats({
            ...stats,
            activeEmployees: 0,
            inactiveEmployees: 0,
            onLeaveEmployees: 0,
            completedProjects: 0,
            inProgressProjects: 0,
            planningProjects: 0,
            onHoldProjects: 0,
            totalBudget: 0
        });
    };


    const isOrgAdmin = () => {
        if (!selectedOrg || !state.user) return false;
        const userRole = state.user?.organizations.find(o => o.organizationId === selectedOrg._id)?.role;
        return userRole === 'owner' || userRole === 'admin';
    };
    console.log(isOrgAdmin())

    console.log("D Selected Org:", selectedOrg);
    console.log("D State:", state);

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }


    // Render employee dashboard if not admin/owner
    if (!isOrgAdmin()) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">My Dashboard</h2>
                        <p className="text-gray-600">Overview of your activity and tasks</p>
                    </div>
                </div>

                {/* Employee Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Tasks Overview</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>To Do</span>
                                <span className="font-semibold">{stats.todoTasks}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>In Progress</span>
                                <span className="font-semibold">{stats.inProgressTasks}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>In Review</span>
                                <span className="font-semibold">{stats.reviewTasks}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Completed</span>
                                <span className="font-semibold">{stats.completedTasks}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Time Logged</h3>
                        <div className="text-3xl font-bold mb-2">
                            {stats.totalHoursLogged.toFixed(1)}h
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Active Time</span>
                                <span>{stats?.activeHours?.toFixed(1)}h</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Idle Time</span>
                                <span>{stats?.idleHours?.toFixed(1)}h</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Activity Rate</h3>
                        <div className="text-3xl font-bold mb-2">
                            {stats.totalHoursLogged > 0
                                ? (( (stats.activeHours ?? 0) / stats.totalHoursLogged) * 100).toFixed(1)
                                : '0.0'}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{
                                    width: `${
                                        stats.totalHoursLogged > 0
                                            ? ( (stats.activeHours ?? 0 ) / stats.totalHoursLogged) * 100
                                            : 0
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>

                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {workSessions.slice(0, 5).map((session) => (
                            <div key={session._id} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center">
                                    <Clock className="text-gray-400 mr-3" />
                                    <div>
                                        <div className="font-medium">
                                            {format(new Date(session.startTime), 'MMM dd, yyyy')}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {format(new Date(session.startTime), 'HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">
                                        {(((session.activeTime ?? 0) + (session.idleTime ?? 0)) / 3600).toFixed(1)}h
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {(
                                            ((session.activeTime ?? 0) / (((session.activeTime ?? 0) + (session.idleTime ?? 0)) || 1)) * 100
                                        ).toFixed(1)}% active
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Render organization dashboard for admin/owner
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">{selectedOrg?.name} Dashboard</h2>
                    <p className="text-gray-600">Overview of all organization metrics</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Employees</h3>
                        <Users className="text-blue-500" size={24}/>
                    </div>
                    <p className="text-3xl font-bold">{employees.length}</p>
                    <div className="mt-2 text-sm text-gray-600">
                        {stats.activeEmployees} active, {stats.onLeaveEmployees} on leave
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Projects</h3>
                        <Briefcase className="text-green-500" size={24}/>
                    </div>
                    <p className="text-3xl font-bold">{projects.length}</p>
                    <div className="mt-2 text-sm text-gray-600">
                        {stats.inProgressProjects} in progress, {stats.completedProjects} completed
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Tasks</h3>
                        <ListTodo className="text-yellow-500" size={24}/>
                    </div>
                    <p className="text-3xl font-bold">{tasks.length}</p>
                    <div className="mt-2 text-sm text-gray-600">
                        {stats.completedTasks} completed, {stats.todoTasks + stats.inProgressTasks + stats.reviewTasks} pending
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Teams</h3>
                        <Users className="text-purple-500" size={24}/>
                    </div>
                    <p className="text-3xl font-bold">{teams.length}</p>
                    <div className="mt-2 text-sm text-gray-600">
                        Across {projects.length} projects
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Project Status</h3>
                    <div className="h-64">

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        {name: 'Completed', value: stats.completedProjects},
                                        {name: 'In Progress', value: stats.inProgressProjects},
                                        {name: 'Planning', value: stats.planningProjects},
                                        {name: 'On Hold', value: stats.onHoldProjects}
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {[0, 1, 2, 3].map(( index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>

                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Task Status</h3>
                    <div className="h-64">

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        {name: 'To Do', value: stats.todoTasks},
                                        {name: 'In Progress', value: stats.inProgressTasks},
                                        {name: 'Review', value: stats.reviewTasks},
                                        {name: 'Completed', value: stats.completedTasks}
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {[0, 1, 2, 3].map(( index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>

                    </div>
                </div>



            </div>



            {/* Recent Activity*/}
            {/*<div className="bg-white rounded-lg shadow-md p-6">*/}
            {/*    <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>*/}
            {/*    <div className="space-y-4">*/}
            {/*        {projects.slice(0, 5).map((project, index) => (*/}
            {/*            <div key={project._id} className="flex items-start space-x-3 pb-4 border-b border-gray-100">*/}
            {/*                <div className={`p-2 rounded-full ${index % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>*/}
            {/*                    {index % 2 === 0 ? <Briefcase size={20} /> : <ListTodo size={20} />}*/}
            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    <p className="font-medium">{project.name}</p>*/}
            {/*                    <p className="text-sm text-gray-600">*/}
            {/*                        {project.status === 'completed'*/}
            {/*                            ? 'Project completed'*/}
            {/*                            : project.status === 'in-progress'*/}
            {/*                                ? 'Project in progress'*/}
            {/*                                : 'Project status updated'}*/}
            {/*                    </p>*/}
            {/*                    <p className="text-xs text-gray-500 mt-1">*/}
            {/*                        {format(new Date(project.updatedAt), 'MMM dd, yyyy')}*/}
            {/*                    </p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {workSessions.slice(0, 5).map((session, index) => {
                        const employee = employees.find(emp => emp._id === session.employeeId);
                        return (
                            <div key={session._id} className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                                <div
                                    className={`p-2 rounded-full ${index % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {index % 2 === 0 ? <Clock size={20}/> : <Calendar size={20}/>}
                                </div>
                                <div>
                                    <p className="font-medium">{employee?.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Worked for {(((session.activeTime ?? 0) + (session.idleTime ?? 0)) / 3600).toFixed(1)} hours
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {format(new Date(session.startTime), 'MMM dd, yyyy HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;