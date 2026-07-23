import axios from 'axios';
import { getToken } from '../auth/storage';

// Instancia centralizada de Axios apuntando a la API de ASP.NET Core
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5076/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Solicitud para inyectar el Token Bearer si existe
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // Asignación segura de cabeceras en Axios
    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);