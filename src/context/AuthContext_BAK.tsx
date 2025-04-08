// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { AuthContextType, User, Organization } from '../types';
// import axios from "axios";
//
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
//
//     const hasInitialized = useRef(false);
//
//     useEffect(() => {
//         if (hasInitialized.current) return;
//         hasInitialized.current = true;
//
//         // Load user from localStorage
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             try {
//                 const parsedUser = JSON.parse(storedUser);
//                 setUser(parsedUser);
//                 setIsAuthenticated(true);
//             } catch (error) {
//                 console.error('Error parsing stored user:', error);
//                 localStorage.removeItem('user');
//             }
//         }
//
//         // Load selected organization from localStorage
//         const selectedOrg = localStorage.getItem('selectedOrganization');
//         if (selectedOrg) {
//             try {
//                 const parsedOrg = JSON.parse(selectedOrg);
//                 setSelectedOrganization(parsedOrg);
//             } catch (error) {
//                 console.error('Error parsing stored organization:', error);
//                 localStorage.removeItem('selectedOrganization');
//             }
//         }
//     }, []);
//
//     const login = async (email: string, password: string) => {
//         try {
//             setLoading(true);
//             setError(null);
//
//             const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
//                 email,
//                 password,
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 withCredentials: true,
//             });
//
//             const data = response.data;
//
//             if (response.status !== 200) {
//                 throw new Error(data.message || 'Login failed');
//             }
//
//             const userData = data.data;
//             setUser(userData);
//             setIsAuthenticated(true);
//             localStorage.setItem('user', JSON.stringify(userData));
//
//             setLoading(false);
//         } catch (error: any) {
//             setError(error.message);
//             setLoading(false);
//         }
//     };
//
//     const register = async (name: string, email: string, password: string, position?: string, department?: string) => {
//         try {
//             setLoading(true);
//             setError(null);
//
//             const response = await fetch('http://localhost:5000/api/auth/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ name, email, password, position, department }),
//             });
//
//             const data = await response.json();
//
//             if (!response.ok) {
//                 throw new Error(data.message || 'Registration failed');
//             }
//
//             setUser(data);
//             setIsAuthenticated(true);
//             localStorage.setItem('user', JSON.stringify(data));
//
//             setLoading(false);
//         } catch (error: any) {
//             setError(error.message);
//             setLoading(false);
//         }
//     };
//
//     const logout = () => {
//         setUser(null);
//         setIsAuthenticated(false);
//         setSelectedOrganization(null);
//         localStorage.removeItem('user');
//         localStorage.removeItem('selectedOrganization');
//     };
//
//     const clearError = () => {
//         setError(null);
//     };
//
//     const updateUser = (updatedUser: User) => {
//         setUser(updatedUser);
//         localStorage.setItem('user', JSON.stringify(updatedUser));
//     };
//
//     const selectOrganization = (organization: Organization) => {
//         setSelectedOrganization(organization);
//         localStorage.setItem('selectedOrganization', JSON.stringify(organization));
//     };
//
//     // Create a state object to maintain compatibility with existing code
//     const state = {
//         user,
//         isAuthenticated,
//         loading,
//         error,
//         selectedOrganization
//     };
//
//     return (
//         <AuthContext.Provider value={{
//             state,
//             login,
//             register,
//             logout,
//             clearError,
//             updateUser,
//             selectOrganization
//         }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = (): AuthContextType => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };
//
//
//
//
//
// // TODO: OLD CODE with useReducer
//
//
// // import React, {createContext, useContext, useReducer, useEffect, useRef} from 'react';
// // import {AuthAction, AuthContextType, AuthState, Organization, User} from '../types';
// // import axios from "axios";
// //
// //
// //
// //
// // const initialState: AuthState = {
// //     user: null,
// //     isAuthenticated: false,
// //     loading: false,
// //     error: null,
// //     selectedOrganization: null,
// // };
// //
// // const AuthContext = createContext<AuthContextType | undefined>(undefined);
// //
// // const authReducer = (state: AuthState, action: AuthAction): AuthState => {
// //     switch (action.type) {
// //         case 'LOGIN_REQUEST':
// //         case 'REGISTER_REQUEST':
// //             return {
// //                 ...state,
// //                 loading: true,
// //                 error: null,
// //             };
// //         case 'LOGIN_SUCCESS':
// //         case 'REGISTER_SUCCESS':
// //             localStorage.setItem('user', JSON.stringify(action.payload));
// //             return {
// //                 ...state,
// //                 user: action.payload,
// //                 isAuthenticated: true,
// //                 loading: false,
// //                 error: null,
// //             };
// //         case 'LOGIN_FAIL':
// //         case 'REGISTER_FAIL':
// //             return {
// //                 ...state,
// //                 loading: false,
// //                 error: action.payload,
// //             };
// //         case 'LOGOUT':
// //             localStorage.removeItem('user');
// //             localStorage.removeItem('selectedOrganization');
// //             return {
// //                 ...state,
// //                 user: null,
// //                 isAuthenticated: false,
// //                 selectedOrganization: null,
// //             };
// //         case 'CLEAR_ERROR':
// //             if (!state.error) return state;
// //             return {
// //                 ...state,
// //                 error: null,
// //             };
// //         case 'UPDATE_USER':
// //             localStorage.setItem('user', JSON.stringify(action.payload));
// //             return {
// //                 ...state,
// //                 user: action.payload,
// //             };
// //         case 'SELECT_ORGANIZATION':
// //             localStorage.setItem('selectedOrganization', JSON.stringify(action.payload));
// //             return {
// //                 ...state,
// //                 selectedOrganization: action.payload,
// //             };
// //         default:
// //             return state;
// //     }
// // };
// //
// // export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// //     const [state, dispatch] = useReducer(authReducer, initialState);
// //
// //     // Function to initialize authentication state from localStorage
// //     // const initializeAuth = () => {
// //     //     const storedUser = localStorage.getItem('user');
// //     //     if (storedUser) {
// //     //         try {
// //     //             const parsedUser = JSON.parse(storedUser);
// //     //             if (!state.isAuthenticated) {
// //     //                 dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
// //     //             }
// //     //         } catch (error) {
// //     //             console.error('Error parsing stored user:', error);
// //     //             localStorage.removeItem('user');
// //     //         }
// //     //     }
// //     // };
// //
// //     const hasInitialized = useRef(false);
// //
// //     useEffect(() => {
// //         if (hasInitialized.current) return;
// //         hasInitialized.current = true;
// //
// //         const storedUser = localStorage.getItem('user');
// //         if (storedUser) {
// //             try {
// //                 const parsedUser = JSON.parse(storedUser);
// //                 dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
// //             } catch (error) {
// //                 console.error('Error parsing stored user:', error);
// //                 localStorage.removeItem('user');
// //             }
// //         }
// //
// //
// //         const selectedOrg = localStorage.getItem('selectedOrganization');
// //         if (selectedOrg) {
// //             try {
// //                 const parsedOrg = JSON.parse(selectedOrg);
// //                 dispatch({ type: 'SELECT_ORGANIZATION', payload: parsedOrg });
// //             } catch (error) {
// //                 console.error('Error parsing stored organization:', error);
// //                 localStorage.removeItem('selectedOrganization');
// //             }
// //         }
// //
// //
// //     }, []);
// //
// //
// //     // useEffect(() => {
// //     //     const user = localStorage.getItem('user');
// //     //     if (user) {
// //     //         dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(user) });
// //     //     }
// //     // }, []);
// //
// //     const login = async (email: string, password: string) => {
// //         try {
// //             dispatch({ type: 'LOGIN_REQUEST' });
// //             const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
// //                 email,
// //                 password,
// //             }, {
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 withCredentials: true, // If you want to send cookies
// //             });
// //
// //             // You don't need response.json() in axios, response.data already gives you the parsed data
// //             const data = response.data;
// //
// //             if (response.status !== 200) {
// //                 throw new Error(data.message || 'Login failed');
// //             }
// //
// //
// //             dispatch({ type: 'LOGIN_SUCCESS', payload: data.data });
// //         } catch (error: any) {
// //             dispatch({ type: 'LOGIN_FAIL', payload: error.message });
// //         }
// //     };
// //
// //     const register = async (name: string, email: string, password: string, position?: string, department?: string) => {
// //         try {
// //             dispatch({ type: 'REGISTER_REQUEST' });
// //             const response = await fetch('http://localhost:5000/api/auth/register', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify({ name, email, password, position, department }),
// //             });
// //
// //             const data = await response.json();
// //
// //             if (!response.ok) {
// //                 throw new Error(data.message || 'Registration failed');
// //             }
// //
// //             dispatch({ type: 'REGISTER_SUCCESS', payload: data });
// //         } catch (error: any) {
// //             dispatch({ type: 'REGISTER_FAIL', payload: error.message });
// //         }
// //     };
// //
// //     const logout = () => {
// //         dispatch({ type: 'LOGOUT' });
// //     };
// //
// //     const clearError = () => {
// //         dispatch({ type: 'CLEAR_ERROR' });
// //     };
// //
// //     const updateUser = (user: User) => {
// //         dispatch({ type: 'UPDATE_USER', payload: user });
// //     };
// //
// //     const selectOrganization = (organization: Organization) => {
// //         dispatch({ type: 'SELECT_ORGANIZATION', payload: organization });
// //     };
// //
// //     return (
// //         <AuthContext.Provider value={{ state, login, register, logout, clearError, updateUser, selectOrganization }}>
// //             {children}
// //         </AuthContext.Provider>
// //     );
// // };
// //
// // export const useAuth = (): AuthContextType => {
// //     const context = useContext(AuthContext);
// //     if (context === undefined) {
// //         throw new Error('useAuth must be used within an AuthProvider');
// //     }
// //     return context;
// // };