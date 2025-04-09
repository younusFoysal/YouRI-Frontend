/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useEffect, useState} from 'react';
import {Employee, Organization} from '../types';
import { Mail, Building2, Search, ArrowUpDown, UserPlus, X } from 'lucide-react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {useAuth} from "../context/AuthContext.tsx";
import useAxiosSecure from "../hook/useAxiosSecure.ts";



interface EmployeeListProps {
  employees: Employee[];
  organizationId?: string;
  onSelectEmployee: (employee: Employee) => void;
  loading: boolean;
  error: any;
}

type SortField = 'name' | 'position' | 'department';
type SortOrder = 'asc' | 'desc';

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, organizationId, onSelectEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    avatar: '',
    organizationId: organizationId || ''
    // organizationId: selectedOrgId
  });

  const { state } = useAuth();
  console.log("State", state);
  console.log("EmployeeList", employees);
  console.log("OrganizationId", organizationId);




  useEffect(() => {
    // Update the organizationId in the newEmployee state when the prop changes
    setNewEmployee(prev => ({
      ...prev,
      organizationId: organizationId || ''
      // organizationId: selectedOrgId
    }));
  }, [organizationId]);

  // TODO: Implement the addEmployee function ---- OLD
  // const queryClient = useQueryClient();
  //
  // const axiosSecure = useAxiosSecure();
  //
  // const fetchEmployees = async () => {
  //   const { data } = await axiosSecure.get(`${API_URL}/employees?organizationId=${selectedOrgId}`);
  //   //console.log('Fetched employees:', data);
  //   return data;
  // };
  //
  // const { data: employees = [] } = useQuery({
  //   queryKey: ['employees', selectedOrgId],
  //   queryFn: fetchEmployees,
  //   enabled: !!selectedOrgId
  // });
  //
  // console.log('Employees:', employees);
  //
  //
  // const addEmployee = async (newEmployee: Partial<Employee>) => {
  //   const { data } = await axiosSecure.post(`${API_URL}/employees`, {
  //     ...newEmployee,
  //     avatar: newEmployee.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  //   });
  //   return data;
  // };
  //
  //
  //
  // const addEmployeeMutation = useMutation({
  //   mutationFn: addEmployee,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['employees'] });
  //     setShowAddModal(false);
  //     setNewEmployee({
  //       name: '',
  //       position: '',
  //       department: '',
  //       email: '',
  //       avatar: '',
  //       organizationId: selectedOrgId
  //     });
  //   }
  // });

  // Update the handleAddEmployee function
  // const handleAddEmployee = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   addEmployeeMutation.mutate(newEmployee);
  // };

  // const handleAddEmployee = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axiosSecure.post('/employees', {
  //       ...newEmployee,
  //       avatar: newEmployee.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  //     });
  //
  //     if (response.status === 200 || response.status === 201) {
  //       setShowAddModal(false);
  //       setNewEmployee({
  //         name: '',
  //         position: '',
  //         department: '',
  //         email: '',
  //         avatar: '',
  //         organizationId: organizationId || ''
  //       });
  //       // Refresh employee list using React Query
  //       queryClient.invalidateQueries(['employees']);
  //     }
  //   } catch (error) {
  //     console.error('Error adding employee:', error);
  //   }
  // };

  const departments = [...new Set(employees.map(emp => emp.department))];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // const handleAddEmployee = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('http://localhost:5000/api/employees', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         ...newEmployee,
  //         avatar: newEmployee.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  //       }),
  //     });
  //
  //     if (response.ok) {
  //       setShowAddModal(false);
  //       setNewEmployee({
  //         name: '',
  //         position: '',
  //         department: '',
  //         email: '',
  //         avatar: ''
  //       });
  //       // Trigger a refresh of the employee list
  //       window.location.reload();
  //     } else {
  //       console.error('Failed to add employee');
  //     }
  //   } catch (error) {
  //     console.error('Error adding employee:', error);
  //   }
  // };

  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      const compareValue = sortOrder === 'asc' ? 1 : -1;
      return a[sortField] > b[sortField] ? compareValue : -compareValue;
    });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <div className="flex flex-col md:flex-row gap-4">

          {/*<select*/}
          {/*    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
          {/*    value={selectedOrgId}*/}
          {/*    onChange={(e) => setSelectedOrgId(e.target.value)}*/}
          {/*>*/}
          {/*  {organizations.map(org => (*/}
          {/*      <option key={org._id} value={org._id}>*/}
          {/*        {org.name}*/}
          {/*      </option>*/}
          {/*  ))}*/}
          {/*</select>*/}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
            <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {/*<button*/}
          {/*    onClick={() => setShowAddModal(true)}*/}
          {/*    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"*/}
          {/*>*/}
          {/*  <UserPlus size={20} className="mr-2"/>*/}
          {/*  Add Employee*/}
          {/*</button>*/}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('position')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Position</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Department</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              { filteredEmployees.length > 0 ? (
                filteredEmployees?.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 size={16} className="mr-2" />
                      {employee.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail size={16} className="mr-2" />
                      {employee.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onSelectEmployee(employee)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
              ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {selectedOrgId ? (
                          <div>
                            <p className="mb-2">No employees found in this organization.</p>
                            <p>Click "Add Employee" to add employees to this organization.</p>
                          </div>
                      ) : (
                          <div>
                            <p className="mb-2">No employees found.</p>
                            <p>Please select an organization first or add new employees.</p>
                          </div>
                      )}
                    </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {/*{showAddModal && (*/}
      {/*    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">*/}
      {/*      <div className="bg-white rounded-lg p-6 w-full max-w-md">*/}
      {/*        <div className="flex justify-between items-center mb-4">*/}
      {/*          <h3 className="text-xl font-semibold">Add New Employee</h3>*/}
      {/*          <button*/}
      {/*              onClick={() => setShowAddModal(false)}*/}
      {/*              className="text-gray-500 hover:text-gray-700"*/}
      {/*          >*/}
      {/*            <X size={20}/>*/}
      {/*          </button>*/}
      {/*        </div>*/}
      {/*        <form onSubmit={handleAddEmployee} className="space-y-4">*/}
      {/*        <div>*/}
      {/*          <label className="block text-sm font-medium text-gray-700 mb-1">*/}
      {/*            Name*/}
      {/*          </label>*/}
      {/*          <input*/}
      {/*            type="text"*/}
      {/*            required*/}
      {/*            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
      {/*            value={newEmployee.name}*/}
      {/*            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div>*/}
      {/*          <label className="block text-sm font-medium text-gray-700 mb-1">*/}
      {/*            Position*/}
      {/*          </label>*/}
      {/*          <input*/}
      {/*            type="text"*/}
      {/*            required*/}
      {/*            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
      {/*            value={newEmployee.position}*/}
      {/*            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div>*/}
      {/*          <label className="block text-sm font-medium text-gray-700 mb-1">*/}
      {/*            Department*/}
      {/*          </label>*/}
      {/*          <input*/}
      {/*            type="text"*/}
      {/*            required*/}
      {/*            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
      {/*            value={newEmployee.department}*/}
      {/*            onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div>*/}
      {/*          <label className="block text-sm font-medium text-gray-700 mb-1">*/}
      {/*            Email*/}
      {/*          </label>*/}
      {/*          <input*/}
      {/*            type="email"*/}
      {/*            required*/}
      {/*            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
      {/*            value={newEmployee.email}*/}
      {/*            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div>*/}
      {/*          <label className="block text-sm font-medium text-gray-700 mb-1">*/}
      {/*            Avatar URL (optional)*/}
      {/*          </label>*/}
      {/*          <input*/}
      {/*            type="url"*/}
      {/*            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
      {/*            value={newEmployee.avatar}*/}
      {/*            onChange={(e) => setNewEmployee({ ...newEmployee, avatar: e.target.value })}*/}
      {/*            placeholder="https://example.com/avatar.jpg"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*          {!selectedOrgId && (*/}
      {/*              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">*/}
      {/*                <p className="text-sm text-yellow-700">*/}
      {/*                  Warning: No organization selected. This employee won't be associated with any organization.*/}
      {/*                </p>*/}
      {/*              </div>*/}
      {/*          )}*/}
      {/*        <div className="flex justify-end space-x-3 mt-6">*/}
      {/*          <button*/}
      {/*            type="button"*/}
      {/*            onClick={() => setShowAddModal(false)}*/}
      {/*            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"*/}
      {/*          >*/}
      {/*            Cancel*/}
      {/*          </button>*/}
      {/*          <button*/}
      {/*            type="submit"*/}
      {/*            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"*/}
      {/*          >*/}
      {/*            Add Employee*/}
      {/*          </button>*/}
      {/*        </div>*/}
      {/*      </form>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export default EmployeeList;