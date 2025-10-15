import { patientAPI } from './apiService';
import toast from 'react-hot-toast';

// Patient service to handle all patient-related operations
export const patientService = {
  // Get all patients with optional filters
  async getAllPatients(filters = {}) {
    try {
      const params = {};
      
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.perPage) {
        params.per_page = filters.perPage;
      }

      const response = await patientAPI.getAll(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
      throw error;
    }
  },

  // Get a single patient by ID
  async getPatientById(id) {
    try {
      const response = await patientAPI.getById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Failed to load patient details');
      throw error;
    }
  },

  // Create a new patient
  async createPatient(patientData) {
    try {
      const response = await patientAPI.create(patientData);
      toast.success('Patient created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create patient');
      }
      throw error;
    }
  },

  // Update an existing patient
  async updatePatient(id, patientData) {
    try {
      const response = await patientAPI.update(id, patientData);
      toast.success('Patient updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to update patient');
      }
      throw error;
    }
  },

  // Delete a patient
  async deletePatient(id) {
    try {
      await patientAPI.delete(id);
      toast.success('Patient deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
      throw error;
    }
  },

  // Search patients
  async searchPatients(searchTerm) {
    try {
      const response = await patientAPI.getAll({ search: searchTerm });
      return response.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      toast.error('Failed to search patients');
      throw error;
    }
  },

  // Get patient statistics
  async getPatientStats() {
    try {
      // This would need to be implemented in the backend
      // For now, calculate from available data
      const response = await patientAPI.getAll();
      const patients = response.data.data || [];
      
      const total = patients.length;
      const active = patients.filter(p => p.status === 'active').length;
      const inactive = patients.filter(p => p.status === 'inactive').length;
      
      return {
        total,
        active,
        inactive,
        newThisMonth: 0, // Would need backend calculation
      };
    } catch (error) {
      console.error('Error getting patient stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        newThisMonth: 0,
      };
    }
  },

  // Helper function to format patient name
  formatPatientName(patient) {
    if (!patient) return 'Unknown Patient';
    
    const parts = [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean);
    return parts.join(' ');
  },

  // Helper function to format patient contact info
  formatPatientContact(patient) {
    if (!patient) return {};
    
    return {
      email: patient.email || 'No email',
      phone: patient.phone || 'No phone',
      address: this.formatPatientAddress(patient),
    };
  },

  // Helper function to format patient address
  formatPatientAddress(patient) {
    if (!patient) return 'No address';
    
    const parts = [
      patient.address,
      patient.city,
      patient.state,
      patient.zip_code
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'No address';
  },

  // Helper function to calculate age from date of birth
  calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  // Validate patient data before submission
  validatePatientData(patientData) {
    const errors = {};

    // Required fields
    if (!patientData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }
    if (!patientData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!patientData.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required';
    }
    if (!patientData.gender) {
      errors.gender = 'Gender is required';
    }

    // Email validation
    if (patientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    if (patientData.phone && !/^[\d\s\-\+\(\)]+$/.test(patientData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Date of birth validation (not in future)
    if (patientData.date_of_birth && new Date(patientData.date_of_birth) > new Date()) {
      errors.date_of_birth = 'Date of birth cannot be in the future';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
};

export default patientService;