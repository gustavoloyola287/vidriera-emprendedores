import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor para adjuntar el JWT token a todas las solicitudes enviadas
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

export default api;