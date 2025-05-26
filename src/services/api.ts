import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle common errors
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Check for auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Force refresh if not on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject({ message, status: error.response?.status });
  }
);

const api = {
  setToken: (token: string | null) => {
    if (token) {
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common.Authorization;
    }
  },
  
  get: (url: string, params = {}) => instance.get(url, { params }),
  
  post: (url: string, data = {}) => instance.post(url, data),
  
  put: (url: string, data = {}) => instance.put(url, data),
  
  patch: (url: string, data = {}) => instance.patch(url, data),
  
  delete: (url: string) => instance.delete(url),
};

export default api;