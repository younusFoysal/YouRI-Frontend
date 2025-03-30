import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Copy, Check, AlertCircle } from 'lucide-react';

interface Organization {
  _id: string;
  name: string;
}

const OrganizationInviteCreate: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserOrganizations();
  }, []);

  const fetchUserOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/organizations', {
        headers: {
          'Authorization': `Bearer ${state.user?.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      
      const data = await response.json();
      const ownedOrgs = data.filter(org => org.role === 'owner' || org.role === 'admin');
      setOrganizations(ownedOrgs);
      
      if (ownedOrgs.length > 0) {
        setSelectedOrg(ownedOrgs[0]._id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) {
      setError('Please select an organization');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/auth/organizations/${selectedOrg}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.user?.token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate invite code');
      }
      
      setInviteCode(data.inviteCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="  flex items-center justify-center mt-4">
      <div className="max-w-md w-full space-y-12 bg-white p-4 rounded-xl ">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Generate Invite Code</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create an invite code for your organization
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerateInvite} className="mt-8 space-y-6">
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
              Select Organization
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="organization"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {organizations.map(org => (
                  <option key={org._id} value={org._id}>{org.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedOrg}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate Invite Code'}
          </button>
        </form>

        {inviteCode && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Invite Code</label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={inviteCode}
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={copyInviteCode}
                className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
              >
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {copied && (
              <p className="mt-1 text-sm text-green-600">Copied to clipboard!</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Share this code with users you want to invite to your organization. The code will expire in 7 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationInviteCreate;