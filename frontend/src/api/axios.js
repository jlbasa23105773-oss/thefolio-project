import axios from 'axios';
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});
// This interceptor runs before EVERY request.
// It reads the token from localStorage and adds it to the Authorization

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // This catches errors before the request is even sent
    return Promise.reject(error);
  }
);
export default instance;