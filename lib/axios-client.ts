import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies/sessions
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Future: Add auth token if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      if (status === 401 && typeof window !== 'undefined') {
        window.location.reload();
      }
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        data: data,
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: 'Network error. Please check your connection.',
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
);

export default axiosClient;
