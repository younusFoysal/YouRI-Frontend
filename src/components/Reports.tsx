import React, { useState, useEffect } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { Employee, WorkSession, Project } from '../types';
import {Calendar, Search, Filter, ArrowDown, BarChart2, Download, Globe, Clock} from 'lucide-react';
import toast from 'react-hot-toast';

interface ReportsProps {
    organizationId?: string;
}

const Reports: React.FC<ReportsProps> = ({ organizationId }) => {
    const [reportType, setReportType] = useState<'time' | 'apps'>('time');
    const [view, setView] = useState<'daily' | 'weekly'>('daily');
    const [selectedProject, setSelectedProject] = useState<string>('all');
    const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
    const [dateRange, setDateRange] = useState<{
        startDate: string;
        endDate: string;
    }>({
        startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });
    const [sortBy, setSortBy] = useState<string>('date');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [sessions, setSessions] = useState<WorkSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<any[]>([]);
    const [appsReportData, setAppsReportData] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, [organizationId]);

    useEffect(() => {
        if (employees.length > 0 && sessions.length > 0) {
            if (reportType === 'time') {
                generateTimeReport();
            } else {
                generateAppsReport();
            }
        }
    }, [employees, sessions, selectedProject, selectedEmployee, dateRange, view, reportType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch employees
            let employeesUrl = 'http://localhost:5000/api/employees';
            if (organizationId) {
                employeesUrl += `?organizationId=${organizationId}`;
            }
            const employeesResponse = await fetch(employeesUrl);
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

            // Fetch sessions for the date range
            const sessionsResponse = await fetch(`http://localhost:5000/api/sessions?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
            const sessionsData = await sessionsResponse.json();
            setSessions(sessionsData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    // const generateReport = () => {
    //     // Filter sessions based on selected project and employee
    //     let filteredSessions = [...sessions];
    //
    //     if (selectedProject !== 'all') {
    //         filteredSessions = filteredSessions.filter(session => session.projectId === selectedProject);
    //     }
    //
    //     if (selectedEmployee !== 'all') {
    //         filteredSessions = filteredSessions.filter(session => session.employeeId === selectedEmployee);
    //     }
    //
    //     // Filter by date range
    //     filteredSessions = filteredSessions.filter(session => {
    //         const sessionDate = new Date(session.startTime);
    //         return isWithinInterval(sessionDate, {
    //             start: new Date(`${dateRange.startDate}T00:00:00`),
    //             end: new Date(`${dateRange.endDate}T23:59:59`)
    //         });
    //     });
    //
    //     // Group sessions by employee and date
    //     const employeeData: Record<string, any> = {};
    //
    //     filteredSessions.forEach(session => {
    //         const employeeId = session.employeeId;
    //         const sessionDate = format(new Date(session.startTime), 'yyyy-MM-dd');
    //
    //         if (!employeeData[employeeId]) {
    //             employeeData[employeeId] = {
    //                 employee: employees.find(e => e._id === employeeId),
    //                 dates: {}
    //             };
    //         }
    //
    //         if (!employeeData[employeeId].dates[sessionDate]) {
    //             employeeData[employeeId].dates[sessionDate] = {
    //                 totalTime: 0,
    //                 activeTime: 0,
    //                 idleTime: 0,
    //                 sessions: []
    //             };
    //         }
    //
    //         employeeData[employeeId].dates[sessionDate].totalTime += (session.activeTime + session.idleTime);
    //         employeeData[employeeId].dates[sessionDate].activeTime += session.activeTime;
    //         employeeData[employeeId].dates[sessionDate].idleTime += session.idleTime;
    //         employeeData[employeeId].dates[sessionDate].sessions.push(session);
    //     });
    //
    //     // Convert to array format for the report
    //     const reportItems: any[] = [];
    //
    //     Object.keys(employeeData).forEach(employeeId => {
    //         const employeeInfo = employeeData[employeeId];
    //
    //         if (view === 'daily') {
    //             // For daily view, show each day separately
    //             Object.keys(employeeInfo.dates).forEach(date => {
    //                 const dateData = employeeInfo.dates[date];
    //                 const totalSeconds = dateData.totalTime;
    //                 const activeSeconds = dateData.activeTime;
    //                 const idleSeconds = dateData.idleTime;
    //                 const activityPercentage = totalSeconds > 0 ? Math.round((activeSeconds / totalSeconds) * 100) : 0;
    //
    //                 reportItems.push({
    //                     date,
    //                     employee: employeeInfo.employee,
    //                     totalTime: totalSeconds,
    //                     activeTime: activeSeconds,
    //                     idleTime: idleSeconds,
    //                     neutralTime: totalSeconds - activeSeconds - idleSeconds,
    //                     activityPercentage
    //                 });
    //             });
    //         } else {
    //             // For weekly view, aggregate all days
    //             let totalSeconds = 0;
    //             let activeSeconds = 0;
    //             let idleSeconds = 0;
    //
    //             Object.keys(employeeInfo.dates).forEach(date => {
    //                 const dateData = employeeInfo.dates[date];
    //                 totalSeconds += dateData.totalTime;
    //                 activeSeconds += dateData.activeTime;
    //                 idleSeconds += dateData.idleTime;
    //             });
    //
    //             const activityPercentage = totalSeconds > 0 ? Math.round((activeSeconds / totalSeconds) * 100) : 0;
    //
    //             reportItems.push({
    //                 date: `${dateRange.startDate} to ${dateRange.endDate}`,
    //                 employee: employeeInfo.employee,
    //                 totalTime: totalSeconds,
    //                 activeTime: activeSeconds,
    //                 idleTime: idleSeconds,
    //                 neutralTime: totalSeconds - activeSeconds - idleSeconds,
    //                 activityPercentage
    //             });
    //         }
    //     });
    //
    //     // Sort the report items
    //     reportItems.sort((a, b) => {
    //         if (sortBy === 'date') {
    //             return new Date(b.date).getTime() - new Date(a.date).getTime();
    //         } else if (sortBy === 'name') {
    //             return a.employee.name.localeCompare(b.employee.name);
    //         } else if (sortBy === 'time') {
    //             return b.totalTime - a.totalTime;
    //         } else if (sortBy === 'activity') {
    //             return b.activityPercentage - a.activityPercentage;
    //         }
    //         return 0;
    //     });
    //
    //     setReportData(reportItems);
    // };



    const generateTimeReport = () => {
        // Filter sessions based on selected project and employee
        let filteredSessions = [...sessions];

        if (selectedProject !== 'all') {
            filteredSessions = filteredSessions.filter(session => session.projectId === selectedProject);
        }

        if (selectedEmployee !== 'all') {
            filteredSessions = filteredSessions.filter(session => session.employeeId === selectedEmployee);
        }

        // Filter by date range
        filteredSessions = filteredSessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            return isWithinInterval(sessionDate, {
                start: new Date(`${dateRange.startDate}T00:00:00`),
                end: new Date(`${dateRange.endDate}T23:59:59`)
            });
        });

        // Group sessions by employee and date
        const employeeData: Record<string, any> = {};

        filteredSessions.forEach(session => {
            const employeeId = session.employeeId;
            const sessionDate = format(new Date(session.startTime), 'yyyy-MM-dd');

            if (!employeeData[employeeId]) {
                employeeData[employeeId] = {
                    employee: employees.find(e => e._id === employeeId),
                    dates: {}
                };
            }

            if (!employeeData[employeeId].dates[sessionDate]) {
                employeeData[employeeId].dates[sessionDate] = {
                    totalTime: 0,
                    activeTime: 0,
                    idleTime: 0,
                    sessions: []
                };
            }

            employeeData[employeeId].dates[sessionDate].totalTime += (session.activeTime + session.idleTime);
            employeeData[employeeId].dates[sessionDate].activeTime += session.activeTime;
            employeeData[employeeId].dates[sessionDate].idleTime += session.idleTime;
            employeeData[employeeId].dates[sessionDate].sessions.push(session);
        });

        // Convert to array format for the report
        const reportItems: any[] = [];

        Object.keys(employeeData).forEach(employeeId => {
            const employeeInfo = employeeData[employeeId];

            if (view === 'daily') {
                // For daily view, show each day separately
                Object.keys(employeeInfo.dates).forEach(date => {
                    const dateData = employeeInfo.dates[date];
                    const totalSeconds = dateData.totalTime;
                    const activeSeconds = dateData.activeTime;
                    const idleSeconds = dateData.idleTime;
                    const activityPercentage = totalSeconds > 0 ? Math.round((activeSeconds / totalSeconds) * 100) : 0;

                    reportItems.push({
                        date,
                        employee: employeeInfo.employee,
                        totalTime: totalSeconds,
                        activeTime: activeSeconds,
                        idleTime: idleSeconds,
                        neutralTime: totalSeconds - activeSeconds - idleSeconds,
                        activityPercentage
                    });
                });
            } else {
                // For weekly view, aggregate all days
                let totalSeconds = 0;
                let activeSeconds = 0;
                let idleSeconds = 0;

                Object.keys(employeeInfo.dates).forEach(date => {
                    const dateData = employeeInfo.dates[date];
                    totalSeconds += dateData.totalTime;
                    activeSeconds += dateData.activeTime;
                    idleSeconds += dateData.idleTime;
                });

                const activityPercentage = totalSeconds > 0 ? Math.round((activeSeconds / totalSeconds) * 100) : 0;

                reportItems.push({
                    date: `${dateRange.startDate} to ${dateRange.endDate}`,
                    employee: employeeInfo.employee,
                    totalTime: totalSeconds,
                    activeTime: activeSeconds,
                    idleTime: idleSeconds,
                    neutralTime: totalSeconds - activeSeconds - idleSeconds,
                    activityPercentage
                });
            }
        });

        // Sort the report items
        reportItems.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            } else if (sortBy === 'name') {
                return a.employee.name.localeCompare(b.employee.name);
            } else if (sortBy === 'time') {
                return b.totalTime - a.totalTime;
            } else if (sortBy === 'activity') {
                return b.activityPercentage - a.activityPercentage;
            }
            return 0;
        });

        setReportData(reportItems);
    };

    const generateAppsReport = () => {
        // Filter sessions based on selected project and employee
        let filteredSessions = [...sessions];

        if (selectedProject !== 'all') {
            filteredSessions = filteredSessions.filter(session => session.projectId === selectedProject);
        }

        if (selectedEmployee !== 'all') {
            filteredSessions = filteredSessions.filter(session => session.employeeId === selectedEmployee);
        }

        // Filter by date range
        filteredSessions = filteredSessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            return isWithinInterval(sessionDate, {
                start: new Date(`${dateRange.startDate}T00:00:00`),
                end: new Date(`${dateRange.endDate}T23:59:59`)
            });
        });

        // Group by date and employee
        const dateEmployeeMap: Record<string, Record<string, any>> = {};

        filteredSessions.forEach(session => {
            const date = format(new Date(session.startTime), 'yyyy-MM-dd');
            const employeeId = session.employeeId;

            if (!dateEmployeeMap[date]) {
                dateEmployeeMap[date] = {};
            }

            if (!dateEmployeeMap[date][employeeId]) {
                dateEmployeeMap[date][employeeId] = {
                    employee: employees.find(e => e._id === employeeId),
                    totalTime: 0,
                    applications: {},
                    urls: {}
                };
            }

            // Add session time
            dateEmployeeMap[date][employeeId].totalTime += (session.activeTime + session.idleTime);

            // Process applications
            session.applications.forEach(app => {
                if (!dateEmployeeMap[date][employeeId].applications[app.name]) {
                    dateEmployeeMap[date][employeeId].applications[app.name] = {
                        name: app.name,
                        icon: app.icon,
                        timeSpent: 0
                    };
                }
                dateEmployeeMap[date][employeeId].applications[app.name].timeSpent += app.timeSpent;
            });

            // Process URLs
            session.links.forEach(link => {
                const urlObj = new URL(link.url);
                const domain = urlObj.hostname;

                if (!dateEmployeeMap[date][employeeId].urls[domain]) {
                    dateEmployeeMap[date][employeeId].urls[domain] = {
                        domain,
                        url: link.url,
                        title: link.title,
                        timeSpent: 0,
                        visits: 0
                    };
                }

                // Estimate time spent on URL (in a real app this would be tracked)
                // Here we're just incrementing visit count
                dateEmployeeMap[date][employeeId].urls[domain].visits += 1;

                // Assign some estimated time (this is just for demo)
                // In a real app, you'd track actual time spent on each URL
                const estimatedTimePerVisit = 300; // 5 minutes in seconds
                dateEmployeeMap[date][employeeId].urls[domain].timeSpent += estimatedTimePerVisit;
            });
        });

        // Convert to array format for the report
        const reportItems: any[] = [];

        Object.keys(dateEmployeeMap).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).forEach(date => {
            Object.keys(dateEmployeeMap[date]).forEach(employeeId => {
                const employeeData = dateEmployeeMap[date][employeeId];

                // Convert applications to array and sort by time spent
                const applications = Object.values(employeeData.applications)
                    .sort((a: any, b: any) => b.timeSpent - a.timeSpent);

                // Convert URLs to array and sort by time spent
                const urls = Object.values(employeeData.urls)
                    .sort((a: any, b: any) => b.timeSpent - a.timeSpent);

                reportItems.push({
                    date,
                    employee: employeeData.employee,
                    totalTime: employeeData.totalTime,
                    applications,
                    urls
                });
            });
        });

        setAppsReportData(reportItems);
    };





    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };

    const handleApplyFilters = () => {
        fetchData();
    };

    const handleExport = () => {
        // In a real app, this would generate a CSV or Excel file
        toast.success('Export functionality would be implemented here');
    };

    const handleShowGraph = () => {
        // In a real app, this would show a graph visualization
        toast.success('Graph visualization would be implemented here');
    };

    const calculatePercentage = (timeSpent: number, totalTime: number): number => {
        return Math.round((timeSpent / totalTime) * 100);
    };

    const getRandomColor = (index: number): string => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
        ];
        return colors[index % colors.length];
    };

    const getAppIcon = (app: any): React.ReactNode => {
        // For demo purposes, we'll use some placeholder icons
        // In a real app, you'd use the actual app icons
        const appNameLower = app.name.toLowerCase();

        if (app.icon) {
            return <img src={app.icon} alt={app.name} className="w-6 h-6" />;
        }

        // Fallback to a colored circle with first letter
        const firstLetter = app.name.charAt(0).toUpperCase();
        const bgColor = getRandomColor(app.name.length);

        return (
            <div className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center text-white text-xs font-bold`}>
                {firstLetter}
            </div>
        );
    };

    const getDomainIcon = (domain: string): React.ReactNode => {
        // For demo purposes, we'll use colored circles with first letter
        // In a real app, you'd use favicon.ico from the domain
        const firstLetter = domain.charAt(0).toUpperCase();
        const bgColor = getRandomColor(domain.length);

        return (
            <div className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center text-white text-xs font-bold`}>
                {firstLetter}
            </div>
        );
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
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    {reportType === 'time' ? 'Time & Activity Report' : 'Apps & URL Usage Report'}
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setReportType('time')}
                        className={`px-4 py-2 rounded-lg ${
                            reportType === 'time'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Clock size={18} className="inline mr-2" />
                        Time Report
                    </button>
                    <button
                        onClick={() => setReportType('apps')}
                        className={`px-4 py-2 rounded-lg ${
                            reportType === 'apps'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Globe size={18} className="inline mr-2" />
                        Apps & URLs
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reportType === 'time' && (
                        <div>
                            <div className="flex space-x-2 mb-4">
                                <button
                                    onClick={() => setView('daily')}
                                    className={`px-4 py-2 rounded-lg ${
                                        view === 'daily'
                                            ? 'bg-teal-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Daily
                                </button>
                                <button
                                    onClick={() => setView('weekly')}
                                    className={`px-4 py-2 rounded-lg ${
                                        view === 'weekly'
                                            ? 'bg-teal-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Weekly
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Projects</label>
                        <div className="relative">
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                            >
                                <option value="all">All Projects</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>{project.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <ArrowDown size={16} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">For</label>
                        <div className="relative">
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <option value="all">All Employees</option>
                                {employees.map(employee => (
                                    <option key={employee._id} value={employee._id}>{employee.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <ArrowDown size={16} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="date"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="date"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    {reportType === 'time' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <div className="relative">
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="date">Date (New to old)</option>
                                    <option value="name">Name</option>
                                    <option value="time">Time Worked</option>
                                    <option value="activity">Activity Percentage</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ArrowDown size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleApplyFilters}
                        className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 self-end"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {reportType === 'time' ? (
                // Time & Activity Report Table
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">
                            {selectedProject === 'all' ? 'All Projects' : projects.find(p => p._id === selectedProject)?.name}
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleShowGraph}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                            >
                                <BarChart2 size={18} className="mr-2" />
                                Show Graph
                            </button>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
                            >
                                <Download size={18} className="mr-2" />
                                Export
                            </button>
                        </div>
                    </div>

                    {reportData.length > 0 ? (
                        <div>
                            {view === 'daily' && (
                                <div className="text-lg font-medium mb-4">
                                    {format(new Date(reportData[0].date), 'd MMM, yyyy')}
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Time Worked</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Idle Time</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Average Activity</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Active Time</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Neutral Time</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {reportData.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={item.employee.avatar}
                                                        alt={item.employee.name}
                                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                                    />
                                                    <div className="font-medium">{item.employee.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatTime(item.totalTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.idleTime > 0 ? formatTime(item.idleTime) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                                                        <div
                                                            className={`h-2.5 rounded-full ${
                                                                item.activityPercentage > 70 ? 'bg-teal-500' :
                                                                    item.activityPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${item.activityPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span>{item.activityPercentage}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-teal-500">
                                                {formatTime(item.activeTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatTime(item.neutralTime)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No data available for the selected filters. Try adjusting your filters or date range.
                        </div>
                    )}
                </div>
            ) : (
                // Apps & URL Usage Report
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">
                            {selectedProject === 'all' ? 'All Projects' : projects.find(p => p._id === selectedProject)?.name}
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
                            >
                                <Download size={18} className="mr-2" />
                                Export
                            </button>
                        </div>
                    </div>

                    {appsReportData.length > 0 ? (
                        <div className="space-y-8">
                            {appsReportData.map((item, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4">
                                    <div className="text-lg font-medium mb-4">
                                        {format(new Date(item.date), 'd MMM, yyyy')}
                                    </div>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center">
                                            <img
                                                src={item.employee.avatar}
                                                alt={item.employee.name}
                                                className="w-10 h-10 rounded-full object-cover mr-3"
                                            />
                                            <div className="font-medium">{item.employee.name}</div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Total Time: <span className="font-medium">{formatTime(item.totalTime)}</span>
                                        </div>
                                    </div>

                                    {/* Applications */}
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium mb-3">Apps</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {item.applications.map((app: any, appIndex: number) => {
                                                const percentage = calculatePercentage(app.timeSpent, item.totalTime);
                                                return (
                                                    <div key={appIndex} className="bg-gray-50 p-4 rounded-lg">
                                                        <div className="flex items-center mb-2">
                                                            {getAppIcon(app)}
                                                            <div className="ml-2">
                                                                <div className="font-medium">{app.name}</div>
                                                                <div className="text-sm text-gray-500">{formatTime(app.timeSpent)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-500 h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-right mt-1 text-gray-500">{percentage}%</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* URLs */}
                                    <div>
                                        <h4 className="text-md font-medium mb-3">URLs</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {item.urls.map((url: any, urlIndex: number) => {
                                                const percentage = calculatePercentage(url.timeSpent, item.totalTime);
                                                return (
                                                    <div key={urlIndex} className="bg-gray-50 p-4 rounded-lg">
                                                        <div className="flex items-center mb-2">
                                                            {getDomainIcon(url.domain)}
                                                            <div className="ml-2 truncate">
                                                                <div className="font-medium truncate">{url.domain}</div>
                                                                <div className="text-sm text-gray-500">{formatTime(url.timeSpent)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-right mt-1 text-gray-500">{percentage}%</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No data available for the selected filters. Try adjusting your filters or date range.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;