/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {createContext, useContext, useReducer, useEffect, useRef} from 'react';
import {Organization, User} from '../types';


interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    selectedOrganization: Organization | null;
}

type AuthAction =
    | { type: 'LOGIN_REQUEST' }
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGIN_FAIL'; payload: string }
    | { type: 'REGISTER_REQUEST' }
    | { type: 'REGISTER_SUCCESS'; payload: User }
    | { type: 'REGISTER_FAIL'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'SELECT_ORGANIZATION'; payload: Organization };

interface AuthContextType {
    state: AuthState;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, position?: string, department?: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    updateUser: (user: User) => void;
    selectOrganization: (organization: Organization) => void;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    selectedOrganization: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
        case 'REGISTER_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAIL':
        case 'REGISTER_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            localStorage.removeItem('user');
            localStorage.removeItem('selectedOrganization');
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                selectedOrganization: null,
            };
        case 'CLEAR_ERROR':
            if (!state.error) return state;
            return {
                ...state,
                error: null,
            };
        case 'UPDATE_USER':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                user: action.payload,
            };
        case 'SELECT_ORGANIZATION':
            localStorage.setItem('selectedOrganization', JSON.stringify(action.payload));
            return {
                ...state,
                selectedOrganization: action.payload,
            };
        default:
            return state;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Function to initialize authentication state from localStorage
    // const initializeAuth = () => {
    //     const storedUser = localStorage.getItem('user');
    //     if (storedUser) {
    //         try {
    //             const parsedUser = JSON.parse(storedUser);
    //             if (!state.isAuthenticated) {
    //                 dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
    //             }
    //         } catch (error) {
    //             console.error('Error parsing stored user:', error);
    //             localStorage.removeItem('user');
    //         }
    //     }
    // };

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
            }
        }


        const selectedOrg = localStorage.getItem('selectedOrganization');
        if (selectedOrg) {
            try {
                const parsedOrg = JSON.parse(selectedOrg);
                dispatch({ type: 'SELECT_ORGANIZATION', payload: parsedOrg });
            } catch (error) {
                console.error('Error parsing stored organization:', error);
                localStorage.removeItem('selectedOrganization');
            }
        }


    }, []);


    // useEffect(() => {
    //     const user = localStorage.getItem('user');
    //     if (user) {
    //         dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(user) });
    //     }
    // }, []);

    const login = async (email: string, password: string) => {
        try {
            dispatch({ type: 'LOGIN_REQUEST' });
            const response = await fetch('http://localhost:3000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            dispatch({ type: 'LOGIN_SUCCESS', payload: data.data });
        } catch (error: any) {
            dispatch({ type: 'LOGIN_FAIL', payload: error.message });
        }
    };

    const register = async (name: string, email: string, password: string, position?: string, department?: string) => {
        try {
            dispatch({ type: 'REGISTER_REQUEST' });
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, position, department }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            dispatch({ type: 'REGISTER_SUCCESS', payload: data });
        } catch (error: any) {
            dispatch({ type: 'REGISTER_FAIL', payload: error.message });
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const updateUser = (user: User) => {
        dispatch({ type: 'UPDATE_USER', payload: user });
    };

    const selectOrganization = (organization: Organization) => {
        dispatch({ type: 'SELECT_ORGANIZATION', payload: organization });
    };

    return (
        <AuthContext.Provider value={{ state, login, register, logout, clearError, updateUser, selectOrganization }}>
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