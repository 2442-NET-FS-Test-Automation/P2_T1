import axios from 'axios';
import { getToken } from '../auth/storage';

// Instancia centralizada de Axios apuntando a la API de ASP.NET Core
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5076/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

//This apiCall just change http://localhost:5076/api to http://localhost:5076/ without "/api"
//because for some reason to call auth endpoints you don't need to use "/api" just call /authorization
export const apiCall = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5076/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Solicitud para inyectar el Token Bearer si existe para llamadas de
// api call
apiCall.interceptors.request.use(
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