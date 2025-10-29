import axios from 'axios';
import { API_BASE_URL } from '../utils/helpers';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Accept': 'application/json' },
});

// Interceptor to attach the correct auth token from sessionStorage
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('adminAuthToken') || sessionStorage.getItem('userAuthToken');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default apiClient;// touch to trigger HMR
