import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    });

    // Interceptor para inyectar automáticamente el token JWT en las peticiones
    api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);