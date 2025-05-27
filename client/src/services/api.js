import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://lost-found-pe0p.onrender.com/api', // Adjust this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;