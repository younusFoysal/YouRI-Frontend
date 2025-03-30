import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  Activity,
  LogOut,
  Layers
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', path: '/admin/users', icon: Users, label: 'Users' },
    { id: 'organizations', path: '/admin/organizations', icon: Building2, label: 'Organizations' },
    { id: 'projects', path: '/admin/projects', icon: Briefcase, label: 'Projects' },
    { id: 'activity', path: '/admin/activity', icon: Activity, label: 'Activity' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <div className="mb-8">
          <Link to="/admin" className="flex items-center space-x-2">
            <Layers className="h-8 w-8 text-red-500" />
            <div>
              <span className="text-xl font-bold">Apployee</span>
              <span className="text-xs text-red-400 block">Master Admin</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;