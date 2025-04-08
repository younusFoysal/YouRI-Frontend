import React, {useEffect} from 'react';
import {Navigate, Outlet, useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// const PrivateRoute: React.FC = () => {
//     const { state } = useAuth();
//
//     if (state.loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }
//
//     return state.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

const PrivateRoute: React.FC = () => {
    const { state } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Check if we have a stored path to return to after authentication
    useEffect(() => {
        if (state.isAuthenticated && location.pathname === "/login") {
            const returnPath = sessionStorage.getItem('returnPath');
            if (returnPath) {
                navigate(returnPath);
                sessionStorage.removeItem('returnPath');
            }
        }
    }, [state.isAuthenticated, location]);

    if (state.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // If not authenticated, store the current path and redirect to login
    if (!state.isAuthenticated) {
        // Store the path we were trying to access
        if (location.pathname !== "/login") {
            sessionStorage.setItem('returnPath', location.pathname);
        }
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};


export default PrivateRoute;