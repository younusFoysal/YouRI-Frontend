/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {Building2, Plus, ArrowRight, Briefcase, AlertCircle, UserPlus} from 'lucide-react';
import OrganizationInviteCreate from "./OrganizationInviteCreate.tsx";
import useAxiosSecure from "../../hook/useAxiosSecure.ts";
import {Organization} from "../../types.ts";



const OrganizationSelect: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);

    const { state, selectOrganization } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const response = await axiosSecure.get('/organizations/organizations');
            setOrganizations(response.data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    console.log(state)

    const handleselectOrganization = (org: Organization) => {
        console.log(org);
        // Store the selected organization in localStorage
        localStorage.setItem('selectedOrganization', JSON.stringify(org));
        // Navigate to the dashboard with the selected organization
        selectOrganization(org);
        navigate('/dashboard', { state: { selectedOrganization: org } });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">Select Organization</h2>
                    <p className="text-gray-600">Choose an organization or create a new one</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="text-red-500 mr-2" size={20} />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Organization Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                        <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Plus className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Create New Organization</h3>
                            <p className="text-gray-500 mb-6">Set up a new organization to track employee activity</p>
                            <Link
                                to="/organization/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Create Organization
                            </Link>
                        </div>
                    </div>

                    {/* Join Organization Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                        <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Building2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Join Organization</h3>
                            <p className="text-gray-500 mb-6">Join an existing organization with an invite code</p>
                            <Link
                                to="/organization/join"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                Join Organization
                            </Link>
                        </div>
                    </div>


                    {/* Invitation code Organization Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                        <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <UserPlus className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Invite in Organization</h3>
                            <p className="text-gray-500 mb-6">Invite an user to existing organization with an invite code</p>
                            <Link
                                to="/organization/invite"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                            >
                                Invitation Code
                            </Link>
                        </div>
                    </div>

                    {/* Organization Cards */}
                    {organizations?.map((org) => (
                        <div
                            key={org._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleselectOrganization(org)}
                        >
                            <div
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-32 bg-gray-100 relative">
                                    <img
                                        src={org.logo}
                                        alt={org.name}
                                        className="w-full h-full object-cover rounded-t-lg"
                                    />
                                    <div
                                        className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                        {org.role.charAt(0).toUpperCase() + org.role.slice(1)}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{org.name}</h3>

                                    {org.industry && (
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <Briefcase size={16} className="mr-2 text-gray-500"/>
                                            {org.industry}
                                        </div>
                                    )}

                                    {org.description && (
                                        <p className="text-sm text-gray-500 line-clamp-2">{org.description}</p>
                                    )}

                                    <div className="mt-4 flex justify-between items-center">
                                        <button
                                            className="flex items-center gap-2 text-blue-600 bg-blue-50 hover:text-blue-800 transition-all font-medium px-3 py-2 rounded-lg hover:bg-blue-100 active:scale-95"
                                        >
                                            <span>Select</span>
                                            <ArrowRight size={18}
                                                        className="transition-transform duration-200 group-hover:translate-x-1"/>
                                        </button>


                                        {(org.role === 'owner' || org.role === 'admin') && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowInviteModal(true);
                                                }}
                                                className="px-4 py-2 text-green-600 bg-green-50 hover:text-green-800 transition-all font-medium rounded-lg hover:bg-green-100 active:scale-95"
                                            >
                                                Invite Members
                                            </button>

                                        )}
                                    </div>
                                </div>
                            </div>


                        </div>
                    ))}
                </div>

                {showInviteModal && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
                        <div
                            className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full transform scale-95 transition-all duration-300 ease-out">
                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Invite to Organization</h2>
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="text-gray-500 hover:text-gray-700 transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <div>
                                <OrganizationInviteCreate/>
                            </div>
                            {/*<div className="flex justify-end">*/}
                            {/*    <button*/}
                            {/*        onClick={() => setShowInviteModal(false)}*/}
                            {/*        className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"*/}
                            {/*    >*/}
                            {/*        Close*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                )}


                {organizations.length === 0 && (
                    <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-md">
                        <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Organizations Yet</h3>
                        <p className="text-gray-500 mb-6">You haven't created or joined any organizations yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizationSelect;