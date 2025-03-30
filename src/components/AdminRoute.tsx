import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";
import { jwtDecode } from 'jwt-decode';
import {JwtPayload} from "../types.ts";


const AdminRoute: React.FC = () => {
    const { state } = useAuth();

    if (state.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Check if user is authenticated and is a master admin
    // if (!state.isAuthenticated || !state.user?.isMasterAdmin) {
    //     return <Navigate to="/login" />;
    // }

    // Decode JWT token and check admin role
    const isAdmin = () => {
        if (state.user?.token) {
            const decoded: JwtPayload = jwtDecode(state.user.token);
            return decoded.role === 'admin';
        }
        return false;
    };

    // Check if user is authenticated and has admin role
    if (!state.isAuthenticated || !isAdmin()) {
        return <Navigate to="/login" />;
    }


    return <Outlet />;
};

export default AdminRoute;