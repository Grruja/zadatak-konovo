import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add a request interceptor to include the token in every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Check if it's a token expired error from our backend
      const errorData = error.response?.data;
      if (errorData?.error === 'TOKEN_EXPIRED') {
        // Dispatch a custom event that the AuthContext can listen to
        window.dispatchEvent(new CustomEvent('sessionExpired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api; 