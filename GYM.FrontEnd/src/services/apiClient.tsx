import axios from 'axios';

// 1. Create a personalized axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5137/api', // asp.net port
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. We add the Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // store token to localStorage
    const token = localStorage.getItem('gym_token');

    // Si el token existe, lo metemos en las cabeceras de autorización
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // if we get an error it gets rejected
    return Promise.reject(error);
  }
);

// 3. Optional: Response interceptor to handle global errors (example: token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if the asp.net backed responds with "Not authorized"
    if (error.response && error.response.status === 401) {
      console.warn('Token expirado o inválido. Redirigiendo al login...');
      localStorage.removeItem('gym_token');
      // Aquí podrías forzar un redireccionamiento al login si usas react-router:
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;