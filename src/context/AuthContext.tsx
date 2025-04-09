/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AuthContextType, User, Organization } from '../types';
import useAxiosCommon from "../hook/useAxiosCommon.ts";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const axiosCommon = useAxiosCommon();

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // Load user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
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
                setSelectedOrganization(parsedOrg);
            } catch (error) {
                console.error('Error parsing stored organization:', error);
                localStorage.removeItem('selectedOrganization');
            }
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosCommon.post('auth/login', {
                email,
                password
            }, {
                withCredentials: true
            });


            const data = response.data;

            if (response.status !== 200) {
                throw new Error(data.message || 'Login failed');
            }

            const userData = data.data;
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));

            setLoading(false);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, position?: string, department?: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosCommon.post('/users/register', {
                name,
                email,
                password,
                position,
                department
            });


            const data = await response.data;

            if (response.status !== 200) {
                throw new Error(data.message || 'Registration failed');
            }

            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(data));

            setLoading(false);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setSelectedOrganization(null);
        localStorage.removeItem('user');
        localStorage.removeItem('selectedOrganization');
    };

    const clearError = () => {
        setError(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const selectOrganization = (organization: Organization) => {
        setSelectedOrganization(organization);
        localStorage.setItem('selectedOrganization', JSON.stringify(organization));
    };

    // Create a state object to maintain compatibility with existing code
    const state = {
        user,
        isAuthenticated,
        loading,
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
