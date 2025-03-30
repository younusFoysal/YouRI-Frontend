
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Building2, Briefcase, Activity, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const AdminDashboard: React.FC = () => {
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${state.user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="p-6 flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">Error: {error}</p>
          </div>
        </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Master Admin Dashboard</h1>
            <p className="text-gray-600">Overview of all system metrics</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{dashboardData.counts.totalUsers}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">{dashboardData.growth.userGrowth.toFixed(1)}%</span>
              </div>
              <span className="text-sm text-gray-500 ml-2">vs last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Organizations</p>
                <h3 className="text-2xl font-bold">{dashboardData.counts.totalOrganizations}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">{dashboardData.growth.orgGrowth.toFixed(1)}%</span>
              </div>
              <span className="text-sm text-gray-500 ml-2">vs last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Projects</p>
                <h3 className="text-2xl font-bold">{dashboardData.counts.totalProjects}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Briefcase className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex items-center text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">New: {dashboardData.counts.newOrgsToday} today</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <h3 className="text-2xl font-bold">{dashboardData.counts.activeUsers}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex items-center text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">New: {dashboardData.counts.newUsersToday} today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" tickFormatter={(value) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][value - 1]} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" name="Active Users" />
                  <Line type="monotone" dataKey="sessions" stroke="#10B981" name="Sessions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Organization Types</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                      data={dashboardData.organizationTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="_id"
                      label={({ _id, percent }) => `${_id || 'Other'} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dashboardData.organizationTypes.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* Recent Users */}
            {dashboardData.recentActivity.users.map((user: any) => (
                <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">New User Registration</p>
                      <p className="text-sm text-gray-500">{user.name} ({user.email})</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </span>
                </div>
            ))}

            {/* Recent Organizations */}
            {dashboardData.recentActivity.organizations.map((org: any) => (
                <div key={org._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Organization Created</p>
                      <p className="text-sm text-gray-500">{org.name} ({org.industry || 'No industry specified'})</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                {format(new Date(org.createdAt), 'MMM dd, yyyy')}
              </span>
                </div>
            ))}

            {/* Recent Sessions */}
            {dashboardData.recentActivity.sessions.map((session: any) => (
                <div key={session._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Activity className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Work Session</p>
                      <p className="text-sm text-gray-500">
                        {session.employeeId?.name || 'Unknown User'} -
                        {((session.activeTime + session.idleTime) / 3600).toFixed(1)}h
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                {format(new Date(session.startTime), 'MMM dd, yyyy HH:mm')}
              </span>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;








// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { Users, Building2, Briefcase, Activity, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts';
//
// const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
//
// const AdminDashboard: React.FC = () => {
//   const { state } = useAuth();
//   const [loading, setLoading] = useState(true);
//
//
//
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalOrganizations: 0,
//     totalProjects: 0,
//     activeUsers: 0,
//     newUsersToday: 0,
//     newOrgsToday: 0,
//     userGrowth: 12, // Percentage
//     orgGrowth: 8, // Percentage
//   });
//
//   const [activityData, setActivityData] = useState([
//     { name: 'Mon', users: 120, sessions: 240 },
//     { name: 'Tue', users: 150, sessions: 300 },
//     { name: 'Wed', users: 180, sessions: 360 },
//     { name: 'Thu', users: 170, sessions: 340 },
//     { name: 'Fri', users: 200, sessions: 400 },
//     { name: 'Sat', users: 160, sessions: 320 },
//     { name: 'Sun', users: 140, sessions: 280 },
//   ]);
//
//   const organizationTypes = [
//     { name: 'Technology', value: 35 },
//     { name: 'Healthcare', value: 25 },
//     { name: 'Finance', value: 20 },
//     { name: 'Education', value: 20 },
//   ];
//
//
//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Master Admin Dashboard</h1>
//           <p className="text-gray-600">Overview of all system metrics</p>
//         </div>
//       </div>
//
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Users</p>
//               <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-full">
//               <Users className="h-6 w-6 text-blue-600" />
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <div className="flex items-center text-green-500">
//               <ArrowUpRight className="h-4 w-4" />
//               <span className="text-sm font-medium">{stats.userGrowth}%</span>
//             </div>
//             <span className="text-sm text-gray-500 ml-2">vs last month</span>
//           </div>
//         </div>
//
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Organizations</p>
//               <h3 className="text-2xl font-bold">{stats.totalOrganizations}</h3>
//             </div>
//             <div className="p-3 bg-green-100 rounded-full">
//               <Building2 className="h-6 w-6 text-green-600" />
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <div className="flex items-center text-green-500">
//               <ArrowUpRight className="h-4 w-4" />
//               <span className="text-sm font-medium">{stats.orgGrowth}%</span>
//             </div>
//             <span className="text-sm text-gray-500 ml-2">vs last month</span>
//           </div>
//         </div>
//
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Projects</p>
//               <h3 className="text-2xl font-bold">{stats.totalProjects}</h3>
//             </div>
//             <div className="p-3 bg-yellow-100 rounded-full">
//               <Briefcase className="h-6 w-6 text-yellow-600" />
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <div className="flex items-center text-red-500">
//               <ArrowDownRight className="h-4 w-4" />
//               <span className="text-sm font-medium">5%</span>
//             </div>
//             <span className="text-sm text-gray-500 ml-2">vs last month</span>
//           </div>
//         </div>
//
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Active Users</p>
//               <h3 className="text-2xl font-bold">{stats.activeUsers}</h3>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-full">
//               <Activity className="h-6 w-6 text-purple-600" />
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <div className="flex items-center text-green-500">
//               <TrendingUp className="h-4 w-4" />
//               <span className="text-sm font-medium">12%</span>
//             </div>
//             <span className="text-sm text-gray-500 ml-2">vs last week</span>
//           </div>
//         </div>
//       </div>
//
//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={activityData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="users" stroke="#3B82F6" name="Active Users" />
//                 <Line type="monotone" dataKey="sessions" stroke="#10B981" name="Sessions" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-semibold mb-4">Organization Types</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={organizationTypes}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={120}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {organizationTypes.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//
//       {/* Recent Activity */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center space-x-4">
//               <div className="p-2 bg-blue-100 rounded-full">
//                 <Users className="h-5 w-5 text-blue-600" />
//               </div>
//               <div>
//                 <p className="font-medium">New User Registration</p>
//                 <p className="text-sm text-gray-500">John Doe joined the platform</p>
//               </div>
//             </div>
//             <span className="text-sm text-gray-500">2 minutes ago</span>
//           </div>
//
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center space-x-4">
//               <div className="p-2 bg-green-100 rounded-full">
//                 <Building2 className="h-5 w-5 text-green-600" />
//               </div>
//               <div>
//                 <p className="font-medium">New Organization Created</p>
//                 <p className="text-sm text-gray-500">Tech Solutions Inc. was created</p>
//               </div>
//             </div>
//             <span className="text-sm text-gray-500">1 hour ago</span>
//           </div>
//
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center space-x-4">
//               <div className="p-2 bg-yellow-100 rounded-full">
//                 <Activity className="h-5 w-5 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="font-medium">High Activity Alert</p>
//                 <p className="text-sm text-gray-500">Unusual activity detected in Project X</p>
//               </div>
//             </div>
//             <span className="text-sm text-gray-500">3 hours ago</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default AdminDashboard;