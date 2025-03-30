import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DayPicker } from 'react-day-picker';
import {
  format,
  parseISO,
  differenceInSeconds,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isWithinInterval
} from 'date-fns';
import { DailyStats, WeeklyStats, MonthlyStats, WorkSession } from '../types';
import { Calendar, Clock, Activity, Coffee, ArrowLeft, Eye, ChevronDown } from 'lucide-react';
import 'react-day-picker/dist/style.css';
import AddSessionModal from "./AddSessionModal.tsx";

interface StatisticsProps {
  selectedEmployeeId: string;
  onBack: () => void;
  onViewSession: (session: WorkSession) => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

const Statistics: React.FC<StatisticsProps> = ({
  selectedEmployeeId,
  onBack,
  onViewSession
}) => {
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [customRangeSessions, setCustomRangeSessions] = useState<WorkSession[]>([]);
  const [customRangeStats, setCustomRangeStats] = useState<{
    totalHours: number;
    activeHours: number;
    idleHours: number;
    totalSessions: number;
  } | null>(null);

  //console.log(customRangeStats)


  const [showAddSessionModal, setShowAddSessionModal] = useState(false);


  useEffect(() => {
    if (view === 'daily') {
      fetchDailyStats();
    } else if (view === 'weekly') {
      fetchWeeklyStats();
    } else if (view === 'monthly') {
      fetchMonthlyStats();
    } else if (view === 'custom' && dateRange.from && dateRange.to) {
      fetchCustomRangeStats();
    }
  }, [selectedDate, view, selectedEmployeeId, dateRange]);
  console.log("Selected Employee ID in stats:", selectedEmployeeId);


  const fetchDailyStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/stats/daily/${selectedEmployeeId}?date=${format(selectedDate, 'yyyy-MM-dd')}`
      );
      const data = await response.json();
      console.log(data);
      setDailyStats(data);
    } catch (error) {
      console.error('Error fetching daily stats:', error);
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/stats/weekly/${selectedEmployeeId}?date=${format(selectedDate, 'yyyy-MM-dd')}`
      );
      const data = await response.json();
      setWeeklyStats(data);
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
  };

  const fetchMonthlyStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/stats/monthly/${selectedEmployeeId}?date=${format(selectedDate, 'yyyy-MM-dd')}`
      );
      const data = await response.json();
      setMonthlyStats(data);
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
    }
  };

  const fetchCustomRangeStats = async () => {
    if (!dateRange.from || !dateRange.to) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/stats/daily/${selectedEmployeeId}?startDate=${format(dateRange.from, 'yyyy-MM-dd')}&endDate=${format(dateRange.to, 'yyyy-MM-dd')}`
      );
      const data = await response.json();
      //console.log(data)

      // Ensure data is an array before processing
      const statsArray = Array.isArray(data) ? data : [data];
      
      // Calculate total stats for the custom range
      const totalStats = {
        totalHours: 0,
        activeHours: 0,
        idleHours: 0,
        totalSessions: 0
      };

      const allSessions: WorkSession[] = [];

      statsArray.forEach((day: DailyStats) => {
        totalStats.totalHours += day.totalHours;
        totalStats.activeHours += day.activeHours;
        totalStats.idleHours += day.idleHours;
        totalStats.totalSessions += day.sessionCount;
        allSessions.push(...day.sessions);
      });

      console.log("All Sessions",allSessions)
      console.log(totalStats)

      setCustomRangeStats(totalStats);
      setCustomRangeSessions(allSessions);
    } catch (error) {
      console.error('Error fetching custom range stats:', error);
    }
  };

  const formatDuration = (seconds: number, totalDuration: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const percentage = totalDuration > 0 ? ((seconds / totalDuration) * 100).toFixed(1) : '0';
    return `${hours}h ${minutes}m (${percentage}%)`;
  };

  const renderSessionList = (sessions: WorkSession[]) => {
    return (
      <div className="mt-4 space-y-3">
        {sessions.map((session) => {
          const duration = differenceInSeconds(
            new Date(session.endTime),
            new Date(session.startTime)
          );
          const activePercentage = (session.activeTime / duration) * 100;
          const idlePercentage = (session.idleTime / duration) * 100;

          return (
              <div key={session._id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-600"/>
                    <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {format(new Date(session.startTime), 'MMM dd, yyyy')}
                    </span>
                      <span className="text-sm text-gray-500">
                      {format(new Date(session.startTime), 'HH:mm')} -{' '}
                        {format(new Date(session.endTime), 'HH:mm')}
                    </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {formatDuration(duration)}
                  </span>
                    <button
                        onClick={() => onViewSession(session)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={16}/>
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Activity size={16} className="text-green-500"/>
                    <span className="text-sm">
                      Active: {formatDuration(session.activeTime, duration)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coffee size={16} className="text-orange-500"/>
                    <span className="text-sm">
                      Idle: {formatDuration(session.idleTime, duration)}
                    </span>
                  </div>
                </div>
              </div>
          );
        })}
      </div>
    );
  };

  const renderDatePicker = () => {
    return (
        <div className="relative">
          <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
          >
            <Calendar size={16}/>
            <span>
            {view === 'weekly'
                ? `Week of ${format(startOfWeek(selectedDate), 'MMM dd, yyyy')}`
                : format(selectedDate, 'MMMM yyyy')}
          </span>
            <ChevronDown size={16} />
          </button>
          {isDatePickerOpen && (
              <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setIsDatePickerOpen(false);
                      }
                    }}
                    footer={false}
                />
              </div>
          )}
        </div>
    );
  };

  const renderDailyView = () => {
    if (!dailyStats) return null;

    return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            {renderDatePicker()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Daily Total</h3>
              <span className="text-2xl font-bold">
              {dailyStats.totalHours.toFixed(1)}h
            </span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Active Time</h3>
              <span className="text-2xl font-bold">
              {dailyStats.activeHours.toFixed(1)}h
            </span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Sessions</h3>
              <span className="text-2xl font-bold">{dailyStats.sessionCount}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Sessions Timeline</h3>
            {renderSessionList(dailyStats.sessions)}
          </div>
        </div>
    );
  };

  const renderWeeklyView = () => {
    if (!weeklyStats) return null;

    return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            {renderDatePicker()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Weekly Total</h3>
              <span className="text-2xl font-bold">
              {weeklyStats.totalHours.toFixed(1)}h
            </span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Active Time</h3>
              <span className="text-2xl font-bold">
              {weeklyStats.activeHours.toFixed(1)}h
            </span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Average Sessions/Day</h3>
              <span className="text-2xl font-bold">
              {weeklyStats.averageSessionsPerDay.toFixed(1)}
            </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Sessions Timeline</h3>
            {renderSessionList(weeklyStats.sessions)}
          </div>
        </div>
    );
  };

  const renderMonthlyView = () => {
    if (!monthlyStats) return null;

    return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            {renderDatePicker()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Monthly Total</h3>
              <span className="text-2xl font-bold">
              {monthlyStats.totalHours.toFixed(1)}h
            </span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Active Time</h3>
              <span className="text-2xl font-bold">
              {monthlyStats.activeHours.toFixed(1)}h
            </span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Total Sessions</h3>
              <span className="text-2xl font-bold">{monthlyStats.totalSessions}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Sessions Timeline</h3>
            {renderSessionList(monthlyStats.sessions)}
          </div>
        </div>
    );
  };

  const renderCustomView = () => {
    return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative">
              <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
              >
                <Calendar size={16} />
                <span>
                {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
                    : 'Select Date Range'}
              </span>
                <ChevronDown size={16} />
              </button>

              {isDatePickerOpen && (
                  <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                    <DayPicker
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range || { from: undefined, to: undefined });
                          if (range?.from && range?.to) {
                            setIsDatePickerOpen(false);
                          }
                        }}
                        numberOfMonths={2}
                        className="p-4"
                    />
                  </div>
              )}
            </div>
          </div>

          {dateRange.from && dateRange.to && customRangeStats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2">Total Hours</h3>
                    <span className="text-2xl font-bold">
                  {customRangeStats.totalHours.toFixed(1)}h
                </span>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2">Active Time</h3>
                    <span className="text-2xl font-bold">
                  {customRangeStats.activeHours.toFixed(1)}h
                </span>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2">Total Sessions</h3>
                    <span className="text-2xl font-bold">
                  {customRangeStats.totalSessions}
                </span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-4">Sessions Timeline</h3>
                  {renderSessionList(customRangeSessions)}
                </div>
              </>
          )}
        </div>
    );
  };

  return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20}/>
              <span>Back to Employees</span>
            </button>
            <h2 className="text-2xl font-bold">Work Statistics</h2>
          </div>
          <div className="flex space-x-2">
            <button
                onClick={() => setView('daily')}
                className={`px-4 py-2 rounded-lg ${
                    view === 'daily'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              Daily
            </button>
            <button
                onClick={() => setView('weekly')}
                className={`px-4 py-2 rounded-lg ${
                    view === 'weekly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              Weekly
            </button>
            <button
                onClick={() => setView('monthly')}
                className={`px-4 py-2 rounded-lg ${
                    view === 'monthly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              Monthly
            </button>
            <button
                onClick={() => setView('custom')}
                className={`px-4 py-2 rounded-lg ${
                    view === 'custom'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              Custom
            </button>

            <button
                onClick={() => setShowAddSessionModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Session
            </button>

          </div>
        </div>

        {view === 'daily' && renderDailyView()}
        {view === 'weekly' && renderWeeklyView()}
        {view === 'monthly' && renderMonthlyView()}
        {view === 'custom' && renderCustomView()}


        {showAddSessionModal && (
            <AddSessionModal
                employeeId={selectedEmployeeId}
                onClose={() => setShowAddSessionModal(false)}
                onSuccess={() => {
                  // Refresh the stats after adding a new session
                  if (view === 'daily') {
                    fetchDailyStats();
                  } else if (view === 'weekly') {
                    fetchWeeklyStats();
                  } else if (view === 'monthly') {
                    fetchMonthlyStats();
                  }
                }}
            />
        )}


      </div>
  );
};

export default Statistics;