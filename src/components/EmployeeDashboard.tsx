import React, { useState, useEffect } from 'react';
import { Employee, WorkSession, Project, Task } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isWithinInterval, addDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Clock, TrendingUp, Calendar, CheckCircle, ArrowUp, BarChart2 } from 'lucide-react';

interface EmployeeDashboardProps {
    organizationId?: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ organizationId }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [sessions, setSessions] = useState<WorkSession[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
    const [weeklyStats, setWeeklyStats] = useState<any>({
        totalHours: 0,
        dailyHours: [],
        topProjects: [],
        topEmployeesByTime: [],
        topEmployeesByActivity: [],
        ongoingTasks: []
    });

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

    useEffect(() => {
        fetchData();
    }, [organizationId]);

    useEffect(() => {
        if (employees.length > 0 && sessions.length > 0 && projects.length > 0) {
            calculateWeeklyStats();
        }
    }, [employees, sessions, projects, tasks, selectedWeek]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch employees
            const employeesResponse = await fetch('http://localhost:5000/api/employees');
            const employeesData = await employeesResponse.json();
            setEmployees(employeesData);

            // Fetch projects
            let projectsUrl = 'http://localhost:5000/api/projects';
            if (organizationId) {
                projectsUrl += `?organizationId=${organizationId}`;
            }
            const projectsResponse = await fetch(projectsUrl);
            const projectsData = await projectsResponse.json();
            setProjects(projectsData);

            // Fetch tasks
            const tasksResponse = await fetch('http://localhost:5000/api/tasks');
            const tasksData = await tasksResponse.json();
            setTasks(tasksData);

            // Fetch sessions for the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const sessionsResponse = await fetch(`http://localhost:5000/api/sessions?startDate=${format(thirtyDaysAgo, 'yyyy-MM-dd')}`);
            const sessionsData = await sessionsResponse.json();
            setSessions(sessionsData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const calculateWeeklyStats = () => {
        const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 0 }); // Sunday
        const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 0 });

        // Filter sessions for the selected week
        const weekSessions = sessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
        });

        // Calculate total hours for the week
        const totalSeconds = weekSessions.reduce((sum, session) =>
            sum + session.activeTime + session.idleTime, 0);
        const totalHours = totalSeconds / 3600;

        // Calculate hours per day
        const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
        const dailyHours = daysOfWeek.map(day => {
            const daySessions = weekSessions.filter(session => {
                const sessionDate = new Date(session.startTime);
                return sessionDate.getDate() === day.getDate() &&
                    sessionDate.getMonth() === day.getMonth() &&
                    sessionDate.getFullYear() === day.getFullYear();
            });

            const daySeconds = daySessions.reduce((sum, session) =>
                sum + session.activeTime + session.idleTime, 0);

            return {
                day: format(day, 'EEE'),
                fullDay: format(day, 'EEEE'),
                date: format(day, 'MMM dd'),
                hours: daySeconds / 3600,
                active: daySessions.reduce((sum, session) => sum + session.activeTime, 0) / 3600,
                idle: daySessions.reduce((sum, session) => sum + session.idleTime, 0) / 3600
            };
        });

        // Calculate top projects by hours
        const projectHours = new Map<string, number>();
        const projectActivity = new Map<string, { active: number, total: number }>();

        weekSessions.forEach(session => {
            if (session.projectId) {
                const projectId = session.projectId;
                const sessionHours = (session.activeTime + session.idleTime) / 3600;
                const activeHours = session.activeTime / 3600;

                projectHours.set(projectId, (projectHours.get(projectId) || 0) + sessionHours);

                const current = projectActivity.get(projectId) || { active: 0, total: 0 };
                projectActivity.set(projectId, {
                    active: current.active + activeHours,
                    total: current.total + sessionHours
                });
            }
        });

        const topProjects = Array.from(projectHours.entries())
            .map(([projectId, hours]) => {
                const project = projects.find(p => p._id === projectId);
                const activity = projectActivity.get(projectId);
                const activityPercentage = activity ? (activity.active / activity.total) * 100 : 0;

                return {
                    id: projectId,
                    name: project ? project.name : 'Unknown Project',
                    hours,
                    hoursFormatted: formatTime(hours * 3600),
                    activityPercentage: Math.round(activityPercentage),
                    lastWeekHours: 0, // This would need historical data
                    lastWeekPercentage: 0 // This would need historical data
                };
            })
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 3);

        // Calculate top employees by hours logged
        const employeeHours = new Map<string, number>();
        const employeeActivity = new Map<string, { active: number, total: number }>();

        weekSessions.forEach(session => {
            const employeeId = session.employeeId;
            const sessionHours = (session.activeTime + session.idleTime) / 3600;
            const activeHours = session.activeTime / 3600;

            employeeHours.set(employeeId, (employeeHours.get(employeeId) || 0) + sessionHours);

            const current = employeeActivity.get(employeeId) || { active: 0, total: 0 };
            employeeActivity.set(employeeId, {
                active: current.active + activeHours,
                total: current.total + sessionHours
            });
        });

        const topEmployeesByTime = Array.from(employeeHours.entries())
            .map(([employeeId, hours]) => {
                const employee = employees.find(e => e._id === employeeId);
                return {
                    id: employeeId,
                    name: employee ? employee.name : 'Unknown Employee',
                    avatar: employee ? employee.avatar : '',
                    hours,
                    hoursFormatted: formatTime(hours * 3600)
                };
            })
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 5);

        // Calculate top employees by activity percentage
        const topEmployeesByActivity = Array.from(employeeActivity.entries())
            .map(([employeeId, { active, total }]) => {
                const employee = employees.find(e => e._id === employeeId);
                const activityPercentage = total > 0 ? (active / total) * 100 : 0;

                return {
                    id: employeeId,
                    name: employee ? employee.name : 'Unknown Employee',
                    avatar: employee ? employee.avatar : '',
                    activityPercentage: Math.round(activityPercentage),
                    activeHours: active,
                    totalHours: total
                };
            })
            .sort((a, b) => b.activityPercentage - a.activityPercentage)
            .slice(0, 5);

        // Get ongoing tasks
        const ongoingTasks = tasks
            .filter(task => task.status === 'in-progress')
            .map(task => {
                const project = projects.find(p => p._id === task.projectId);
                const assignee = employees.find(e => e._id === task.assigneeId);

                // Calculate hours spent on this task from sessions
                const taskSessions = sessions.filter(s => s.taskId === task._id);
                const taskSeconds = taskSessions.reduce((sum, session) =>
                    sum + session.activeTime + session.idleTime, 0);

                return {
                    id: task._id,
                    title: task.title,
                    projectId: task.projectId,
                    projectName: project ? project.name : 'Unknown Project',
                    assigneeId: task.assigneeId,
                    assigneeName: assignee ? assignee.name : 'Unassigned',
                    hoursSpent: formatTime(taskSeconds)
                };
            })
            .slice(0, 4);

        // Calculate timesheet data
        const timesheet = daysOfWeek.map(day => {
            const daySessions = weekSessions.filter(session => {
                const sessionDate = new Date(session.startTime);
                return sessionDate.getDate() === day.getDate() &&
                    sessionDate.getMonth() === day.getMonth() &&
                    sessionDate.getFullYear() === day.getFullYear();
            });

            const daySeconds = daySessions.reduce((sum, session) =>
                sum + session.activeTime + session.idleTime, 0);

            return {
                date: format(day, 'MMM dd'),
                day: format(day, 'EEE'),
                fullDate: format(day, 'LLL dd, yyyy'),
                hours: formatTime(daySeconds)
            };
        });

        setWeeklyStats({
            totalHours,
            totalHoursFormatted: formatTime(totalHours * 3600),
            dailyHours,
            topProjects,
            topEmployeesByTime,
            topEmployeesByActivity,
            ongoingTasks,
            timesheet,
            weekStart: format(weekStart, 'LLL dd, yyyy'),
            weekEnd: format(weekEnd, 'LLL dd, yyyy')
        });
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const handlePreviousWeek = () => {
        const prevWeek = new Date(selectedWeek);
        prevWeek.setDate(prevWeek.getDate() - 7);
        setSelectedWeek(prevWeek);
    };

    const handleNextWeek = () => {
        const nextWeek = new Date(selectedWeek);
        nextWeek.setDate(nextWeek.getDate() + 7);
        setSelectedWeek(nextWeek);
    };

    const handleCurrentWeek = () => {
        setSelectedWeek(new Date());
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Employee Dashboard</h2>
                    <p className="text-gray-600">Weekly activity overview</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handlePreviousWeek}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={handleCurrentWeek}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Current Week
                    </button>
                    <button
                        onClick={handleNextWeek}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        &gt;
                    </button>
                    <span className="text-gray-600 ml-2">
            {weeklyStats.weekStart} - {weeklyStats.weekEnd}
          </span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Hours</h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">+4.4%</span>
                    </div>
                    <p className="text-2xl font-bold">{weeklyStats.totalHoursFormatted}</p>
                    <div className="mt-4 h-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyStats.dailyHours}>
                                <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                        {weeklyStats.dailyHours.map((day: any) => (
                            <span key={day.day}>{day.day}</span>
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Total hours this week</div>
                </div>

                {weeklyStats.topProjects.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">{weeklyStats.topProjects[0].name}</h3>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">+6.9%</span>
                        </div>
                        <p className="text-2xl font-bold">{weeklyStats.topProjects[0].hoursFormatted}</p>
                        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Last Week</div>
                            <div className="text-lg font-semibold">94h 30m</div>
                        </div>
                        <div className="mt-4 h-16 flex justify-end">
                            <div className="w-12 h-full bg-indigo-200 rounded-lg mx-1"></div>
                            <div className="w-12 h-full bg-indigo-300 rounded-lg mx-1"></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">Most Hour Logged Project</div>
                    </div>
                )}

                {weeklyStats.topProjects.length > 1 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">{weeklyStats.topProjects[1].name}</h3>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">-1.4%</span>
                        </div>
                        <p className="text-2xl font-bold">{weeklyStats.topProjects[1].activityPercentage}%</p>
                        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Last Week</div>
                            <div className="text-lg font-semibold">81%</div>
                        </div>
                        <div className="mt-4 h-16 flex justify-end">
                            <div className="w-12 h-full bg-teal-300 rounded-lg mx-1"></div>
                            <div className="w-12 h-full bg-teal-400 rounded-lg mx-1"></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">Most Project Activity</div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase">All Projects</h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">+7%</span>
                    </div>
                    <p className="text-2xl font-bold">79%</p>
                    <div className="mt-4 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 rounded-full" style={{ width: '79%' }}></div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">{format(new Date(), 'MMMM dd, yyyy')}</div>
                    <div className="mt-2 text-xs text-gray-500">Today's activity</div>
                </div>
            </div>

            {/* Activity Report and Top Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <h3 className="text-lg font-semibold">Activity Report</h3>
                            <span className="ml-2 text-sm text-gray-500">All Projects</span>
                        </div>
                        <button className="text-sm text-blue-500 hover:text-blue-700">View More</button>
                    </div>

                    <div className="flex justify-between items-end h-64">
                        {weeklyStats.dailyHours.map((day: any, index: number) => {
                            // Determine color based on activity level
                            let color = 'bg-teal-400';
                            if (day.hours < 4) color = 'bg-red-400';
                            else if (day.hours < 6) color = 'bg-yellow-400';

                            return (
                                <div key={day.day} className="flex flex-col items-center">
                                    <div className="h-48 w-8 bg-gray-100 rounded-full relative">
                                        <div
                                            className={`absolute bottom-0 w-full rounded-full ${color}`}
                                            style={{ height: `${Math.min(100, (day.hours / 10) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 bg-gray-100 rounded-lg p-2 text-center">
                                        <div className="text-xs text-gray-500">Feb</div>
                                        <div className="text-sm font-medium">{22 + index}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Top Assigned Projects</h3>
                    </div>

                    <div className="h-64 flex items-center justify-center">
                        <div className="w-48 h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={weeklyStats.topProjects}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="hours"
                                    >
                                        {weeklyStats.topProjects.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="ml-8 space-y-4">
                            {weeklyStats.topProjects.map((project: any, index: number) => (
                                <div key={project._id} className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <div>
                                        <div className="text-sm font-medium">{project.name}</div>
                                        <div className="text-xs text-gray-500">{project.hoursFormatted}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Employees */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Top 5 Members by Time Logged</h3>
                    <div className="space-y-4">
                        {weeklyStats.topEmployeesByTime.map((employee: any, index: number) => (
                            <div key={employee._id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <img
                                            src={employee.avatar}
                                            alt={employee.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="font-medium">{employee.name}</div>
                                        <div className="text-sm text-gray-500">{employee.hoursFormatted}</div>
                                    </div>
                                </div>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${Math.min(100, (employee.hours / (weeklyStats.topEmployeesByTime[0]?.hours || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Top 5 Members by Activity</h3>
                    <div className="space-y-4">
                        {weeklyStats.topEmployeesByActivity.map((employee: any, index: number) => (
                            <div key={employee._id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <img
                                            src={employee.avatar}
                                            alt={employee.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="font-medium">{employee.name}</div>
                                        <div className="text-sm text-gray-500">{employee.activityPercentage}% active</div>
                                    </div>
                                </div>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${employee.activityPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ongoing Tasks and Timesheet */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Ongoing Tasks</h3>
                    <div className="space-y-4">
                        {weeklyStats.ongoingTasks.map((task: any) => (
                            <div key={task._id} className="p-4 rounded-lg" style={{
                                backgroundColor: task.projectName.includes('Falcom') ? '#EBF5FF' :
                                    task.projectName.includes('Starship') ? '#FFFBEB' :
                                        '#F3E8FF'
                            }}>
                                <div className="font-medium mb-1">{task.title}</div>
                                <div className="flex items-center justify-between text-sm">
                                    <div>{task.projectName}</div>
                                    <div>{task.hoursSpent}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Timesheet</h3>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">All Projects</span>
                            <button className="text-sm text-blue-500 hover:text-blue-700">View More</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {weeklyStats?.timesheet?.map((day: any, index: number) => (
                            <div key={index} className="text-center">
                                <div className="text-sm text-gray-500 mb-1">{day.fullDate}</div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-center text-blue-500 mb-1">
                                        <Clock size={16} className="mr-1" />
                                        <span>{day.hours}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Weekly Total</div>
                            <div className="bg-teal-500 text-white rounded-lg p-4">
                                <div className="flex items-center justify-center mb-1">
                                    <Clock size={16} className="mr-1" />
                                    <span>{weeklyStats.totalHoursFormatted}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;