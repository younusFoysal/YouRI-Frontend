import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Briefcase, Building2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { state } = useAuth();
  const user = state.user;

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <div className="relative px-6 pb-6">
          <div className="flex items-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white -mt-12 mr-4"
            />
            <div className="mt-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.position}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Briefcase className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{user.position || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building2 className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{user.department || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Organization Memberships</h3>
              <div className="space-y-4">
                {user.organizations.map((org) => (
                  <div key={org.organizationId} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{org.organizationName}</p>
                        <p className="text-sm text-gray-500 capitalize">{org.role}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <Calendar className="inline-block mr-1" size={16} />
                        Joined {format(new Date(org.joinedAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {user.skills && user.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;