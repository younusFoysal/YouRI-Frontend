

import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Users,
  Clock,
  BarChart2,
  Settings,
  Building2,
  Briefcase,
  ListTodo,
  Layers,
  LayoutDashboard,
  UserCheck,
  FileText,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'employee-dashboard', path: '/employee-dashboard', icon: UserCheck, label: 'Employee Dashboard' },
    { id: 'organizations', path: '/organizations', icon: Building2, label: 'Organizations' },
    { id: 'projects', path: '/projects', icon: Briefcase, label: 'Projects' },
    { id: 'teams', path: '/teams', icon: Users, label: 'Teams' },
    { id: 'employees', path: '/employees', icon: Users, label: 'Employees' },
    { id: 'tasks', path: '/tasks', icon: ListTodo, label: 'Tasks' },
    { id: 'reports', path: '/reports', icon: FileText, label: 'Reports' },
    { id: 'activity', path: '/activity', icon: Clock, label: 'Activity' },
    { id: 'statistics', path: '/statistics', icon: BarChart2, label: 'Statistics' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
      <div className="w-64 h-screen bg-gray-900 text-white p-4 flex flex-col">
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Layers className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">YouRI</span>
          </Link>
        </div>

        <nav className="flex-grow space-y-1">
          {menuItems?.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
                <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-red-700 hover:text-white"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
  );
};

export default Sidebar;


















// import React from 'react';
// import {
//   Users,
//   Clock,
//   BarChart2,
//   Settings,
//   Building2,
//   Briefcase,
//   ListTodo,
//   LayoutDashboard,
//   UserCheck, FileText, LogOut
// } from 'lucide-react';
// import {useNavigate} from "react-router-dom";
// import {useAuth} from "../context/AuthContext.tsx";
//
// interface SidebarProps {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }
//
// const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
//
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//
//   const menuItems = [
//     { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//     { id: 'employee-dashboard', icon: UserCheck, label: 'Employee Dashboard' },
//     { id: 'organizations', icon: Building2, label: 'Organizations' },
//     { id: 'projects', icon: Briefcase, label: 'Projects' },
//     { id: 'teams', icon: Users, label: 'Teams' },
//     { id: 'employees', icon: Users, label: 'Employees' },
//     { id: 'tasks', icon: ListTodo, label: 'Tasks' },
//     { id: 'reports', icon: FileText, label: 'Reports' },
//     { id: 'activity', icon: Clock, label: 'Activity' },
//     { id: 'statistics', icon: BarChart2, label: 'Statistics' },
//     { id: 'settings', icon: Settings, label: 'Settings' },
//   ];
//
//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };
//
//   return (
//       <div className="w-64 h-screen bg-gray-900 text-white p-4">
//         <div className="mb-8">
//           <h1 className="text-xl font-bold">Employee Tracker</h1>
//         </div>
//         <nav>
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//                 <button
//                     key={item.id}
//                     onClick={() => setActiveTab(item.id)}
//                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
//                         activeTab === item.id
//                             ? 'bg-blue-600 text-white'
//                             : 'text-gray-300 hover:bg-gray-800'
//                     }`}
//                 >
//                   <Icon size={20}/>
//                   <span>{item.label}</span>
//                 </button>
//             );
//           })}
//         </nav>
//
//         <div className="mt-auto">
//           <button
//               onClick={handleLogout}
//               className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors text-gray-300 hover:bg-red-700 hover:text-white"
//           >
//             <LogOut size={20}/>
//             <span>Logout</span>
//           </button>
//         </div>
//
//       </div>
//   );
// };
//
// export default Sidebar;