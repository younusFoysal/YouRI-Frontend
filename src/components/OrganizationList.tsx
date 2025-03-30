import React from 'react';
import OrganizationSelect from './auth/OrganizationSelect';

const OrganizationList: React.FC = () => {

  return <OrganizationSelect />;
};

export default OrganizationList;




// import React, { useState, useEffect } from 'react';
// import { Organization } from '../types';
// import { Building2, Search, ArrowUpDown, Plus, X, Globe, Briefcase } from 'lucide-react';
//
// interface OrganizationListProps {
//   onSelectOrganization: (organization: Organization) => void;
// }
//
// type SortField = 'name' | 'industry';
// type SortOrder = 'asc' | 'desc';
//
// const OrganizationList: React.FC<OrganizationListProps> = ({ onSelectOrganization }) => {
//   const [organizations, setOrganizations] = useState<Organization[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [industryFilter, setIndustryFilter] = useState<string>('all');
//   const [sortField, setSortField] = useState<SortField>('name');
//   const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newOrganization, setNewOrganization] = useState({
//     name: '',
//     description: '',
//     industry: '',
//     website: '',
//     logo: ''
//   });
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     fetchOrganizations();
//   }, []);
//
//   const fetchOrganizations = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:5000/api/organizations');
//       const data = await response.json();
//       setOrganizations(data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching organizations:', error);
//       setLoading(false);
//     }
//   };
//
//   const industries = [...new Set(organizations.map(org => org.industry))].filter(Boolean);
//
//   const handleSort = (field: SortField) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortOrder('asc');
//     }
//   };
//
//   const handleAddOrganization = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/organizations', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...newOrganization,
//           logo: newOrganization.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop'
//         }),
//       });
//
//       if (response.ok) {
//         setShowAddModal(false);
//         setNewOrganization({
//           name: '',
//           description: '',
//           industry: '',
//           website: '',
//           logo: ''
//         });
//         fetchOrganizations();
//       } else {
//         console.error('Failed to add organization');
//       }
//     } catch (error) {
//       console.error('Error adding organization:', error);
//     }
//   };
//
//   const filteredOrganizations = organizations
//     .filter(organization => {
//       const matchesSearch = organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (organization.description && organization.description.toLowerCase().includes(searchTerm.toLowerCase()));
//       const matchesIndustry = industryFilter === 'all' || organization.industry === industryFilter;
//       return matchesSearch && matchesIndustry;
//     })
//     .sort((a, b) => {
//       const compareValue = sortOrder === 'asc' ? 1 : -1;
//       if (!a[sortField]) return 1;
//       if (!b[sortField]) return -1;
//       return a[sortField].toLowerCase() > b[sortField].toLowerCase() ? compareValue : -compareValue;
//     });
//
//   if (loading) {
//     return (
//       <div className="p-6 flex justify-center items-center h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h2 className="text-2xl font-bold">Organizations</h2>
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search organizations..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           {industries.length > 0 && (
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={industryFilter}
//               onChange={(e) => setIndustryFilter(e.target.value)}
//             >
//               <option value="all">All Industries</option>
//               {industries.map(industry => (
//                 <option key={industry} value={industry}>{industry}</option>
//               ))}
//             </select>
//           )}
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Plus size={20} className="mr-2" />
//             Add Organization
//           </button>
//         </div>
//       </div>
//
//       {organizations.length === 0 ? (
//         <div className="bg-white rounded-lg shadow-md p-8 text-center">
//           <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-xl font-medium text-gray-900 mb-2">No Organizations Yet</h3>
//           <p className="text-gray-500 mb-6">Get started by creating your first organization.</p>
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <Plus size={20} className="mr-2" />
//             Add Organization
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredOrganizations.map((organization) => (
//             <div
//               key={organization.id}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
//               onClick={() => onSelectOrganization(organization)}
//             >
//               <div className="h-32 bg-gray-200 relative">
//                 <img
//                   src={organization.logo}
//                   alt={organization.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold mb-2">{organization.name}</h3>
//                 {organization.industry && (
//                   <div className="flex items-center text-sm text-gray-600 mb-2">
//                     <Briefcase size={16} className="mr-2" />
//                     {organization.industry}
//                   </div>
//                 )}
//                 {organization.website && (
//                   <div className="flex items-center text-sm text-blue-600 mb-2">
//                     <Globe size={16} className="mr-2" />
//                     <a href={organization.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
//                       {organization.website.replace(/^https?:\/\/(www\.)?/, '')}
//                     </a>
//                   </div>
//                 )}
//                 {organization.description && (
//                   <p className="text-sm text-gray-500 mt-2 line-clamp-2">{organization.description}</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//
//       {/* Add Organization Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">Add New Organization</h3>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleAddOrganization} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={newOrganization.name}
//                   onChange={(e) => setNewOrganization({ ...newOrganization, name: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Industry
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={newOrganization.industry}
//                   onChange={(e) => setNewOrganization({ ...newOrganization, industry: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Website
//                 </label>
//                 <input
//                   type="url"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={newOrganization.website}
//                   onChange={(e) => setNewOrganization({ ...newOrganization, website: e.target.value })}
//                   placeholder="https://example.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   rows={3}
//                   value={newOrganization.description}
//                   onChange={(e) => setNewOrganization({ ...newOrganization, description: e.target.value })}
//                 ></textarea>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Logo URL (optional)
//                 </label>
//                 <input
//                   type="url"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={newOrganization.logo}
//                   onChange={(e) => setNewOrganization({ ...newOrganization, logo: e.target.value })}
//                   placeholder="https://example.com/logo.jpg"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Add Organization
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default OrganizationList;