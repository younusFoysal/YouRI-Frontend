import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useAxiosSecure = () => {
    const { state } = useAuth();

    const axiosSecure = axios.create({
        baseURL: 'http://localhost:3000/api/v1',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    axiosSecure.interceptors.request.use(
        (config) => {
            if (state.user?.token) {
                config.headers.Authorization = `Bearer ${state.user.token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;
