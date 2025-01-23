import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lost-found-1.onrender.com/', 
});

// Automatically include token in headers if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
