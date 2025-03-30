import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Users, Activity as ActivityIcon } from 'lucide-react';
import {useAuth} from "../../context/AuthContext.tsx";

interface ActivityData {
  date: string;
  totalSessions: number;
  activeTime: number;
  idleTime: number;
  uniqueUsers: number;
}

const Activity: React.FC = () => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageActiveTime: 0,
    averageUsers: 0
  });
  const { state } = useAuth();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/activity',
            {
              headers: {
                'Authorization': `Bearer ${state.user?.token}`
              }
            }
            );
        const activityData = await response.json();
        
        // Format data for charts
        const formattedData = activityData.map((item: ActivityData) => ({
          ...item,
          activeHours: item.activeTime / 3600,
          idleHours: item.idleTime / 3600,
          date: format(new Date(item.date), 'MMM dd')
        }));

        setData(formattedData);
        
        // Calculate summary stats
        const totalSessions = formattedData.reduce((sum, item) => sum + item.totalSessions, 0);
        const totalActiveTime = formattedData.reduce((sum, item) => sum + item.activeTime, 0);
        const totalUsers = formattedData.reduce((sum, item) => sum + item.uniqueUsers, 0);
        
        setStats({
          totalSessions,
          averageActiveTime: (totalActiveTime / 3600) / formattedData.length,
          averageUsers: totalUsers / formattedData.length
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Activity Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <h3 className="text-2xl font-bold">{stats.totalSessions}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Daily Active Time</p>
              <h3 className="text-2xl font-bold">{stats.averageActiveTime.toFixed(1)}h</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ActivityIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Daily Users</p>
              <h3 className="text-2xl font-bold">{Math.round(stats.averageUsers)}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Activity Trends</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="activeHours"
                stroke="#10B981"
                name="Active Hours"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="idleHours"
                stroke="#F59E0B"
                name="Idle Hours"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="uniqueUsers"
                stroke="#6366F1"
                name="Active Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Activity Log</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Idle Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {day.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.uniqueUsers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.totalSessions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(day.activeTime / 3600).toFixed(1)}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(day.idleTime / 3600).toFixed(1)}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Activity;