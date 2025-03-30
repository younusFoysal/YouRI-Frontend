import React, { useState, useEffect } from 'react';
import { Team, Organization, Employee, Project } from '../types';
import { Search, ArrowUpDown, Plus, X, Users, Building2, Briefcase } from 'lucide-react';

interface TeamListProps {
  organizationId?: string;
  onSelectTeam: (team: Team) => void;
}

type SortField = 'name';
type SortOrder = 'asc' | 'desc';

const TeamList: React.FC<TeamListProps> = ({ organizationId, onSelectTeam }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    organizationId: organizationId || '',
    projectIds: [] as string[],
    leaderId: '',
    memberIds: [] as string[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
    fetchOrganizations();
    fetchEmployees();
    fetchProjects();
  }, [organizationId]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/teams';
      if (organizationId) {
        url += `?organizationId=${organizationId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setTeams(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/organizations');
      const data = await response.json();
      setOrganizations(data);
      
      // If no organizationId is provided and we have organizations, set the first one as default
      if (!organizationId && data.length > 0 && !newTeam.organizationId) {
        setNewTeam(prev => ({ ...prev, organizationId: data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      let url = 'http://localhost:5000/api/projects';
      if (organizationId) {
        url += `?organizationId=${organizationId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewTeam({
          name: '',
          description: '',
          organizationId: organizationId || '',
          projectIds: [],
          leaderId: '',
          memberIds: []
        });
        fetchTeams();
      } else {
        console.error('Failed to add team');
      }
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handleToggleMember = (employeeId: string) => {
    if (newTeam.memberIds.includes(employeeId)) {
      setNewTeam({
        ...newTeam,
        memberIds: newTeam.memberIds.filter(_id => _id !== employeeId),
        leaderId: newTeam.leaderId === employeeId ? '' : newTeam.leaderId
      });
    } else {
      setNewTeam({
        ...newTeam,
        memberIds: [...newTeam.memberIds, employeeId]
      });
    }
  };

  const handleToggleProject = (projectId: string) => {
    if (newTeam.projectIds.includes(projectId)) {
      setNewTeam({
        ...newTeam,
        projectIds: newTeam.projectIds.filter(_id => _id !== projectId)
      });
    } else {
      setNewTeam({
        ...newTeam,
        projectIds: [...newTeam.projectIds, projectId]
      });
    }
  };

  const getOrganizationName = (orgId: string) => {
    const org = organizations.find(o => o._id === orgId);
    return org ? org.name : 'Unknown Organization';
  };

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e._id === empId);
    return emp ? emp.name : 'Unknown Employee';
  };

  const getProjectName = (projId: string) => {
    const proj = projects.find(p => p._id === projId);
    return proj ? proj.name : 'Unknown Project';
  };

  const filteredTeams = teams
    .filter(team => {
      return team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => {
      const compareValue = sortOrder === 'asc' ? 1 : -1;
      return a[sortField].toLowerCase() > b[sortField].toLowerCase() ? compareValue : -compareValue;
    });

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
        <h2 className="text-2xl font-bold">Teams</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search teams..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Team
          </button>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Teams Yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first team.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Add Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div 
              key={team._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectTeam(team)}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
                
                {!organizationId && (
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Building2 size={16} className="mr-2" />
                    {getOrganizationName(team.organizationId)}
                  </div>
                )}
                
                {team.description && (
                  <p className="text-sm text-gray-500 mb-4">{team.description}</p>
                )}
                
                <div className="space-y-3">
                  {team.leaderId && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Team Lead:</span>
                      <span>{getEmployeeName(team.leaderId)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <span className="font-medium mr-2">Members:</span>
                    <span>{team.memberIds.length}</span>
                  </div>
                  
                  {team.projectIds.length > 0 && (
                    <div className="flex items-start text-sm">
                      <span className="font-medium mr-2">Projects:</span>
                      <div className="flex flex-wrap gap-1">
                        {team.projectIds.slice(0, 2).map((projectId) => (
                          <span key={projectId} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {getProjectName(projectId)}
                          </span>
                        ))}
                        {team.projectIds.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{team.projectIds.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Team</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>
              
              {!organizationId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTeam.organizationId}
                    onChange={(e) => setNewTeam({ ...newTeam, organizationId: e.target.value })}
                  >
                    <option value="">Select Organization</option>
                    {organizations.map(org => (
                      <option key={org._id} value={org._id}>{org.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Members
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {employees.length === 0 ? (
                    <p className="text-sm text-gray-500">No employees available</p>
                  ) : (
                    <div className="space-y-2">
                      {employees.map(employee => (
                        <div key={employee._id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`employee-${employee._id}`}
                            checked={newTeam.memberIds.includes(employee._id)}
                            onChange={() => handleToggleMember(employee._id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`employee-${employee._id}`} className="ml-2 block text-sm text-gray-900">
                            {employee.name} - {employee.position}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Leader
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newTeam.leaderId}
                  onChange={(e) => setNewTeam({ ...newTeam, leaderId: e.target.value })}
                >
                  <option value="">Select Team Leader</option>
                  {employees
                    .filter(emp => newTeam.memberIds.includes(emp._id))
                    .map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                </select>
                {newTeam.memberIds.length > 0 && !newTeam.leaderId && (
                  <p className="text-xs text-gray-500 mt-1">Select a team leader from the members</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Projects
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {projects.length === 0 ? (
                    <p className="text-sm text-gray-500">No projects available</p>
                  ) : (
                    <div className="space-y-2">
                      {projects
                        .filter(project => !organizationId || project.organizationId === newTeam.organizationId)
                        .map(project => (
                          <div key={project._id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`project-${project._id}`}
                              checked={newTeam.projectIds.includes(project._id)}
                              onChange={() => handleToggleProject(project._id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`project-${project._id}`} className="ml-2 block text-sm text-gray-900">
                              {project.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamList;