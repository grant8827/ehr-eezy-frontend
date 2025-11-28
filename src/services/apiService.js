import axios from 'axios';
import toast from 'react-hot-toast';

// API Configuration - Smart URL selection
const getApiUrl = () => {
  // Check for explicit environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect based on hostname
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  
  // Default to production
  return 'https://ehr-eezy-backend-production.up.railway.app/api';
};

// Configure axios defaults
const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Log the API URL being used for debugging
console.log('🔗 API Service URL:', API_BASE_URL);

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
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  uploadProfilePicture: (formData) => api.post('/auth/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateNotificationPreferences: (data) => api.put('/auth/notifications', data),
  deactivateAccount: (data) => api.post('/auth/deactivate', data),
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
  getStats: (patientId) => api.get(`/medical-records/stats${patientId ? `?patient_id=${patientId}` : ''}`),
};

// Vital Signs API
export const vitalSignsAPI = {
  getAll: (params = {}) => api.get('/vital-signs', { params }),
  getById: (id) => api.get(`/vital-signs/${id}`),
  getByPatient: (patientId, params = {}) => api.get(`/patients/${patientId}/vital-signs`, { params }),
  create: (data) => api.post('/vital-signs', data),
  update: (id, data) => api.put(`/vital-signs/${id}`, data),
  delete: (id) => api.delete(`/vital-signs/${id}`),
  getLatest: (patientId) => api.get(`/patients/${patientId}/vital-signs/latest`),
  getTrends: (patientId, params = {}) => api.get(`/patients/${patientId}/vital-signs/trends`, { params }),
};

// Lab Results API
export const labResultsAPI = {
  getAll: (params = {}) => api.get('/lab-results', { params }),
  getById: (id) => api.get(`/lab-results/${id}`),
  getByPatient: (patientId, params = {}) => api.get(`/patients/${patientId}/lab-results`, { params }),
  create: (data) => api.post('/lab-results', data),
  update: (id, data) => api.put(`/lab-results/${id}`, data),
  delete: (id) => api.delete(`/lab-results/${id}`),
  getByCategory: (category, params = {}) => api.get(`/lab-results/category/${category}`, { params }),
  getAbnormal: (params = {}) => api.get('/lab-results/abnormal', { params }),
};

// Prescriptions API
export const prescriptionsAPI = {
  getAll: (params = {}) => api.get('/prescriptions', { params }),
  getById: (id) => api.get(`/prescriptions/${id}`),
  getByPatient: (patientId, params = {}) => api.get(`/patients/${patientId}/prescriptions`, { params }),
  create: (data) => api.post('/prescriptions', data),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  delete: (id) => api.delete(`/prescriptions/${id}`),
  updateStatus: (id, status) => api.patch(`/prescriptions/${id}/status`, { status }),
  getActive: (params = {}) => api.get('/prescriptions/active', { params }),
  getExpiring: (params = {}) => api.get('/prescriptions/expiring', { params }),
  refill: (id, data = {}) => api.post(`/prescriptions/${id}/refill`, data),
};

// Medical Documents API
export const medicalDocumentsAPI = {
  getAll: (params = {}) => api.get('/medical-documents', { params }),
  getById: (id) => api.get(`/medical-documents/${id}`),
  getByPatient: (patientId, params = {}) => api.get(`/patients/${patientId}/documents`, { params }),
  create: (formData) => api.post('/medical-documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/medical-documents/${id}`, data),
  delete: (id) => api.delete(`/medical-documents/${id}`),
  download: (id) => api.get(`/medical-documents/${id}/download`, { 
    responseType: 'blob' 
  }),
  getMetadata: () => api.get('/medical-documents/metadata'),
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
  getConversations: () => api.get('/messages/conversations'),
  getAvailableUsers: (params = {}) => api.get('/messages/available-users', { params }),
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