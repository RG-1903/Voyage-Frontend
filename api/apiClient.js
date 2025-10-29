import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Interceptor to attach the correct auth token from sessionStorage
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('adminAuthToken') || sessionStorage.getItem('userAuthToken');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default apiClient;