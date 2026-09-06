import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor para adjuntar el JWT token a todas las solicitudes enviadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Validar que el token existe y no es una cadena 'null' o 'undefined'
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
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

// Exportamos de ambas formas para soportar "import api" e "import { api }"
export { api };
export default api;