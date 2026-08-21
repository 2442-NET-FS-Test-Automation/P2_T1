import axios from 'axios';
import { clearToken, getToken } from '../auth/storage';

// Instancia centralizada de Axios apuntando a la API de ASP.NET Core
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'gym-api-e8gkdgcxc6fqhufn.centralus-01.azurewebsites.net',
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

// Interceptor de Respuesta para manejar errores globales, especialmente 401 (No autorizado)
// Esto es útil para redirigir al usuario a la página de login si su token ha expirado o es inválido
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa (200, 201, etc.), no hace nada
  (error) => {
    // Si el servidor responde con un 401 (No autorizado / Token vencido)
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada o token inválido. Redirigiendo a Login...');
      
      // 1. Limpiamos las credenciales guardadas
      clearToken();

      // 2. Redirigimos al usuario a la pantalla de Login
      window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);

//This apiCall just change http://localhost:5076/api to http://localhost:5076/ without "/api"
//because for some reason to call auth endpoints you don't need to use "/api" just call /authorization
export const apiCall = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'gym-api-e8gkdgcxc6fqhufn.centralus-01.azurewebsites.net',
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