import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Validar que el token existe y no es una cadena 'null' o 'undefined'
    if (token && token !== 'null' && token !== 'undefined' && token.trim().length > 10) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token.trim()}`;
      }  
    } else{
      // Si no hay token, asegurarnos de borrar el header Authorization
      if (config.headers) {
        delete config.headers.Authorization;
      } 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };
export default api;