import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  setupBusiness: (data) => api.post('/auth/setup-business', data),
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getUser: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

// Patient API
export const patientAPI = {
  getAll: (params = {}) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Appointment API
export const appointmentAPI = {
  getAll: (params = {}) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  checkAvailability: (params) => api.get('/appointments/availability/check', { params }),
  updateStatus: (id, data) => api.patch(`/appointments/${id}/status`, data),
};

// Staff API
export const staffAPI = {
  getAll: (params = {}) => api.get('/staff', { params }),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
  getStats: () => api.get('/staff-stats'),
};

// Doctor API
export const doctorAPI = {
  getAll: (params = {}) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Medical Records API
export const medicalRecordsAPI = {
  getAll: (params = {}) => api.get('/medical-records', { params }),
  getById: (id) => api.get(`/medical-records/${id}`),
  getByPatient: (patientId, params = {}) => api.get(`/patients/${patientId}/medical-records`, { params }),
  create: (data) => api.post('/medical-records', data),
  update: (id, data) => api.put(`/medical-records/${id}`, data),
  delete: (id) => api.delete(`/medical-records/${id}`),
};

// Billing API
export const billingAPI = {
  getAll: (params = {}) => api.get('/bills', { params }),
  getById: (id) => api.get(`/bills/${id}`),
  getByPatient: (patientId, params = {}) => api.get(`/patients/${patientId}/bills`, { params }),
  create: (data) => api.post('/bills', data),
  update: (id, data) => api.put(`/bills/${id}`, data),
  delete: (id) => api.delete(`/bills/${id}`),
  markAsPaid: (id, data) => api.post(`/bills/${id}/pay`, data),
};

// Messages API
export const messagesAPI = {
  getAll: (params = {}) => api.get('/messages', { params }),
  getById: (id) => api.get(`/messages/${id}`),
  create: (data) => api.post('/messages', data),
  update: (id, data) => api.put(`/messages/${id}`, data),
  delete: (id) => api.delete(`/messages/${id}`),
  markAsRead: (id) => api.post(`/messages/${id}/read`),
  getUnreadCount: () => api.get('/messages/unread/count'),
};

// Telehealth API
export const telehealthAPI = {
  getAll: (params = {}) => api.get('/telehealth', { params }),
  getById: (id) => api.get(`/telehealth/${id}`),
  create: (data) => api.post('/telehealth', data),
  update: (id, data) => api.put(`/telehealth/${id}`, data),
  delete: (id) => api.delete(`/telehealth/${id}`),
  startSession: (id, data) => api.post(`/telehealth/${id}/start`, data),
  endSession: (id, data) => api.post(`/telehealth/${id}/end`, data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Utility functions for authentication
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.Authorization;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  delete api.defaults.headers.Authorization;
};

// Export the configured axios instance for custom requests
export { api };
export default api;