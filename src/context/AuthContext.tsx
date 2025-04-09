/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AuthContextType, User, Organization } from '../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosCommon from "../hook/useAxiosCommon.ts";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);
    const axiosCommon = useAxiosCommon();
    const queryClient = useQueryClient();
    const hasInitialized = useRef(false);

    // Initialize user and organization from localStorage
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // Load user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                queryClient.setQueryData(['user'], parsedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
            }
        }

        // Load selected organization from localStorage
        const selectedOrg = localStorage.getItem('selectedOrganization');
        if (selectedOrg) {
            try {
                const parsedOrg = JSON.parse(selectedOrg);
                queryClient.setQueryData(['selectedOrganization'], parsedOrg);
            } catch (error) {
                console.error('Error parsing stored organization:', error);
                localStorage.removeItem('selectedOrganization');
            }
        }
    }, [queryClient]);

    // User query with proper typing
    const { data: user = null } = useQuery<User | null>({
        queryKey: ['user'],
        enabled: false, // Don't fetch automatically, we'll manage this manually
        staleTime: Infinity, // Don't refetch automatically
        initialData: null
    });

    // Selected organization query with proper typing
    const { data: selectedOrganization = null } = useQuery<Organization | null>({
        queryKey: ['selectedOrganization'],
        enabled: false, // Don't fetch automatically, we'll manage this manually
        staleTime: Infinity, // Don't refetch automatically
        initialData: null
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const response = await axiosCommon.post('auth/login', {
                email,
                password
            }, {
                withCredentials: true
            });
            return response.data.data as User;
        },
        onSuccess: (userData) => {
            queryClient.setQueryData(['user'], userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setError(null);
            toast.success("Login successful! Welcome back.");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            setError(errorMessage);
            toast.error(`Login failed: ${errorMessage}`);
        }
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: async ({ name, email, password, position, department }:
                           { name: string; email: string; password: string; position?: string; department?: string }) => {
            const response = await axiosCommon.post('/users/register', {
                name,
                email,
                password,
                position,
                department
            });
            return {
                userData: response.data.data as User,
                email,
                password
            };
        },
        onSuccess: async (data) => {
            toast.success("Registration successful! Logging you in...");

            // Automatically log in the user after successful registration
            try {
                await loginMutation.mutateAsync({
                    email: data.email,
                    password: data.password
                });
            } catch (error) {
                // If login fails after registration, at least store the basic user data
                // but the user will need to log in manually to get a token
                const basicUserData = data.userData;
                queryClient.setQueryData(['user'], basicUserData);
                localStorage.setItem('user', JSON.stringify(basicUserData));
                toast.error("Auto-login failed. Please log in manually.");
            }
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            setError(errorMessage);
            toast.error(`Registration failed: ${errorMessage}`);
        }
    });

    const login = async (email: string, password: string) => {
        try {
            await loginMutation.mutateAsync({ email, password });
            return true;
        } catch (error) {
            return false;
        }
    };

    const register = async (name: string, email: string, password: string, position?: string, department?: string) => {
        try {
            await registerMutation.mutateAsync({ name, email, password, position, department });
            return true;
        } catch (error) {
            return false;
        }
    };

    const logout = () => {
        queryClient.setQueryData(['user'], null);
        queryClient.setQueryData(['selectedOrganization'], null);
        localStorage.removeItem('user');
        localStorage.removeItem('selectedOrganization');
        toast.success("You have been logged out successfully.");
    };

    const clearError = () => {
        setError(null);
    };

    const updateUser = (updatedUser: User) => {
        queryClient.setQueryData(['user'], updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success("User profile updated successfully.");
    };

    const selectOrganization = (organization: Organization) => {
        queryClient.setQueryData(['selectedOrganization'], organization);
        localStorage.setItem('selectedOrganization', JSON.stringify(organization));
        toast.success(`Organization "${organization.name}" selected.`);
    };

    // Create a state object with proper typing to maintain compatibility with existing code
    const state: {
        user: User | null;
        isAuthenticated: boolean;
        loading: boolean;
        error: string | null;
        selectedOrganization: Organization | null;
    } = {
        user,
        isAuthenticated: !!user,
        loading: loginMutation.isPending || registerMutation.isPending,
        error,
        selectedOrganization
    };

    return (
        <AuthContext.Provider value={{
            state,
            login,
            register,
            logout,
            clearError,
            updateUser,
            selectOrganization
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
