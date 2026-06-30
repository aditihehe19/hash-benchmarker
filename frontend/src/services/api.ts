import axios from 'axios';

/**
 * Configure Axios base instance for Hash Benchmarker API calls.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for auth tokens or session headers if needed later)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardized API error payloads
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
      details: error.response?.data?.details || null,
    };
    
    // Log in development
    if (import.meta.env.DEV) {
      console.error('[API Error]:', customError);
    }
    
    return Promise.reject(customError);
  }
);

export default api;
