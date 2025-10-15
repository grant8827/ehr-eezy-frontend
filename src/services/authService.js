import { authAPI, setAuthToken, clearAuth } from './apiService';
import toast from 'react-hot-toast';

// Authentication service to handle all auth-related operations
export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      toast.success('Login successful');
      return { token, user };
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Login failed. Please try again.');
      }
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      toast.success('Registration successful');
      return { token, user };
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
      throw error;
    }
  },

  // Setup business (for first-time setup)
  async setupBusiness(businessData) {
    try {
      const response = await authAPI.setupBusiness(businessData);
      const { token, user, business } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      localStorage.setItem('user_data', JSON.stringify(user));
      localStorage.setItem('business_data', JSON.stringify(business));
      
      toast.success('Business setup completed successfully');
      return { token, user, business };
    } catch (error) {
      console.error('Business setup error:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Business setup failed. Please try again.');
      }
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      await authAPI.logout();
      clearAuth();
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear auth data even if API call fails
      clearAuth();
      toast.success('Logged out');
      return true;
    }
  },

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await authAPI.getUser();
      const user = response.data;
      
      // Update stored user data
      localStorage.setItem('user_data', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      
      if (error.response?.status === 401) {
        // Token expired, clear auth and redirect to login
        this.handleAuthError();
      }
      throw error;
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await authAPI.refresh();
      const { token, user } = response.data;
      
      setAuthToken(token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      console.error('Token refresh error:', error);
      this.handleAuthError();
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    return !!(token && userData);
  },

  // Get stored user data
  getUserData() {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get stored business data
  getBusinessData() {
    try {
      const businessData = localStorage.getItem('business_data');
      return businessData ? JSON.parse(businessData) : null;
    } catch (error) {
      console.error('Error parsing business data:', error);
      return null;
    }
  },

  // Handle authentication errors
  handleAuthError() {
    clearAuth();
    localStorage.removeItem('business_data');
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  },

  // Check user role
  hasRole(requiredRole) {
    const userData = this.getUserData();
    if (!userData) return false;
    
    const userRole = userData.role;
    
    // Define role hierarchy
    const roleHierarchy = {
      'admin': ['admin', 'doctor', 'staff', 'patient'],
      'doctor': ['doctor', 'staff', 'patient'],
      'staff': ['staff', 'patient'],
      'patient': ['patient']
    };
    
    return roleHierarchy[userRole]?.includes(requiredRole) || false;
  },

  // Check if user is admin
  isAdmin() {
    const userData = this.getUserData();
    return userData?.role === 'admin';
  },

  // Check if user is doctor
  isDoctor() {
    const userData = this.getUserData();
    return userData?.role === 'doctor';
  },

  // Check if user is staff
  isStaff() {
    const userData = this.getUserData();
    return userData?.role === 'staff';
  },

  // Check if user is patient
  isPatient() {
    const userData = this.getUserData();
    return userData?.role === 'patient';
  },

  // Get user permissions based on role
  getUserPermissions() {
    const userData = this.getUserData();
    if (!userData) return [];
    
    const rolePermissions = {
      'admin': [
        'view_all_patients',
        'create_patients',
        'update_patients',
        'delete_patients',
        'view_all_appointments',
        'create_appointments',
        'update_appointments',
        'delete_appointments',
        'view_all_bills',
        'create_bills',
        'update_bills',
        'delete_bills',
        'manage_staff',
        'view_reports',
        'manage_settings'
      ],
      'doctor': [
        'view_assigned_patients',
        'create_patients',
        'update_patients',
        'view_assigned_appointments',
        'create_appointments',
        'update_appointments',
        'view_assigned_bills',
        'create_bills',
        'update_bills',
        'create_medical_records',
        'update_medical_records'
      ],
      'staff': [
        'view_assigned_patients',
        'create_patients',
        'update_patients',
        'view_all_appointments',
        'create_appointments',
        'update_appointments',
        'view_all_bills',
        'create_bills',
        'update_bills'
      ],
      'patient': [
        'view_own_profile',
        'update_own_profile',
        'view_own_appointments',
        'view_own_bills',
        'view_own_medical_records'
      ]
    };
    
    return rolePermissions[userData.role] || [];
  },

  // Check if user has specific permission
  hasPermission(permission) {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  },

  // Validate login credentials
  validateLoginData(credentials) {
    const errors = {};

    if (!credentials.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      errors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate registration data
  validateRegistrationData(userData) {
    const errors = {};

    // Required fields
    if (!userData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }
    if (!userData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!userData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!userData.password) {
      errors.password = 'Password is required';
    } else if (userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!userData.password_confirmation) {
      errors.password_confirmation = 'Please confirm your password';
    } else if (userData.password !== userData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    if (!userData.role) {
      errors.role = 'Role is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate business setup data
  validateBusinessData(businessData) {
    const errors = {};

    // Business info
    if (!businessData.business_name?.trim()) {
      errors.business_name = 'Business name is required';
    }
    if (!businessData.business_type) {
      errors.business_type = 'Business type is required';
    }

    // Admin user info
    if (!businessData.admin_first_name?.trim()) {
      errors.admin_first_name = 'First name is required';
    }
    if (!businessData.admin_last_name?.trim()) {
      errors.admin_last_name = 'Last name is required';
    }
    if (!businessData.admin_email?.trim()) {
      errors.admin_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessData.admin_email)) {
      errors.admin_email = 'Please enter a valid email address';
    }
    if (!businessData.admin_password) {
      errors.admin_password = 'Password is required';
    } else if (businessData.admin_password.length < 8) {
      errors.admin_password = 'Password must be at least 8 characters';
    }
    if (!businessData.admin_password_confirmation) {
      errors.admin_password_confirmation = 'Please confirm your password';
    } else if (businessData.admin_password !== businessData.admin_password_confirmation) {
      errors.admin_password_confirmation = 'Passwords do not match';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Get available roles for registration
  getAvailableRoles() {
    return [
      { value: 'doctor', label: 'Doctor' },
      { value: 'staff', label: 'Staff Member' },
      { value: 'patient', label: 'Patient' }
    ];
  },

  // Get business types for setup
  getBusinessTypes() {
    return [
      { value: 'clinic', label: 'Medical Clinic' },
      { value: 'hospital', label: 'Hospital' },
      { value: 'private_practice', label: 'Private Practice' },
      { value: 'urgent_care', label: 'Urgent Care' },
      { value: 'specialty', label: 'Specialty Practice' },
      { value: 'other', label: 'Other' }
    ];
  },
};

export default authService;