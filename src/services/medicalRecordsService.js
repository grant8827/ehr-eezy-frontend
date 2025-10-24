import { medicalRecordsAPI, vitalSignsAPI } from './apiService';
import toast from 'react-hot-toast';

// Medical Records service to handle all medical records operations
export const medicalRecordsService = {
  // Get all medical records with optional filters
  async getAllMedicalRecords(filters = {}) {
    try {
      const params = {};
      
      if (filters.patient_id) {
        params.patient_id = filters.patient_id;
      }
      if (filters.start_date) {
        params.start_date = filters.start_date;
      }
      if (filters.end_date) {
        params.end_date = filters.end_date;
      }
      if (filters.type) {
        params.type = filters.type;
      }

      const response = await medicalRecordsAPI.getAll(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast.error('Failed to load medical records');
      throw error;
    }
  },

  // Get medical records for a specific patient
  async getPatientMedicalRecords(patientId, filters = {}) {
    try {
      const response = await medicalRecordsAPI.getByPatient(patientId, filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient medical records:', error);
      toast.error('Failed to load patient medical records');
      throw error;
    }
  },

  // Get a single medical record by ID
  async getMedicalRecordById(id) {
    try {
      const response = await medicalRecordsAPI.getById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical record:', error);
      toast.error('Failed to load medical record');
      throw error;
    }
  },

  // Create a new medical record
  async createMedicalRecord(recordData) {
    try {
      const response = await medicalRecordsAPI.create(recordData);
      toast.success('Medical record created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating medical record:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create medical record');
      }
      throw error;
    }
  },

  // Update an existing medical record
  async updateMedicalRecord(id, recordData) {
    try {
      const response = await medicalRecordsAPI.update(id, recordData);
      toast.success('Medical record updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating medical record:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to update medical record');
      }
      throw error;
    }
  },

  // Delete a medical record
  async deleteMedicalRecord(id) {
    try {
      await medicalRecordsAPI.delete(id);
      toast.success('Medical record deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting medical record:', error);
      toast.error('Failed to delete medical record');
      throw error;
    }
  },

  // Get medical records statistics
  async getMedicalRecordsStats(patientId = null) {
    try {
      const response = await medicalRecordsAPI.getStats(patientId);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical records stats:', error);
      return {
        totalRecords: 0,
        recentRecords: 0,
        pendingReviews: 0,
        completedRecords: 0,
      };
    }
  },

  // Vital Signs methods
  
  // Get all vital signs with optional filters
  async getAllVitalSigns(filters = {}) {
    try {
      const response = await vitalSignsAPI.getAll(filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching vital signs:', error);
      toast.error('Failed to load vital signs');
      throw error;
    }
  },

  // Get vital signs for a specific patient
  async getPatientVitalSigns(patientId, filters = {}) {
    try {
      const response = await vitalSignsAPI.getByPatient(patientId, filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient vital signs:', error);
      toast.error('Failed to load patient vital signs');
      throw error;
    }
  },

  // Get latest vital signs for a patient
  async getLatestVitalSigns(patientId) {
    try {
      const response = await vitalSignsAPI.getLatest(patientId);
      return response.data;
    } catch (error) {
      console.error('Error fetching latest vital signs:', error);
      return null;
    }
  },

  // Get vital signs trends for a patient
  async getVitalSignsTrends(patientId, filters = {}) {
    try {
      const response = await vitalSignsAPI.getTrends(patientId, filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching vital signs trends:', error);
      return [];
    }
  },

  // Create new vital signs record
  async createVitalSigns(vitalSignsData) {
    try {
      const response = await vitalSignsAPI.create(vitalSignsData);
      toast.success('Vital signs recorded successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating vital signs:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else {
        toast.error('Failed to record vital signs');
      }
      throw error;
    }
  },

  // Update existing vital signs record
  async updateVitalSigns(id, vitalSignsData) {
    try {
      const response = await vitalSignsAPI.update(id, vitalSignsData);
      toast.success('Vital signs updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating vital signs:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else {
        toast.error('Failed to update vital signs');
      }
      throw error;
    }
  },

  // Delete vital signs record
  async deleteVitalSigns(id) {
    try {
      await vitalSignsAPI.delete(id);
      toast.success('Vital signs deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting vital signs:', error);
      toast.error('Failed to delete vital signs');
      throw error;
    }
  },

  // Helper methods for data formatting and validation

  // Format vital signs for display
  formatVitalSigns(vitalSigns) {
    if (!vitalSigns) return {};

    return {
      bloodPressure: vitalSigns.blood_pressure_systolic && vitalSigns.blood_pressure_diastolic 
        ? `${vitalSigns.blood_pressure_systolic}/${vitalSigns.blood_pressure_diastolic}` 
        : 'Not recorded',
      heartRate: vitalSigns.heart_rate ? `${vitalSigns.heart_rate} bpm` : 'Not recorded',
      temperature: vitalSigns.temperature ? `${vitalSigns.temperature}°F` : 'Not recorded',
      respiratoryRate: vitalSigns.respiratory_rate ? `${vitalSigns.respiratory_rate}/min` : 'Not recorded',
      weight: vitalSigns.weight ? `${vitalSigns.weight} lbs` : 'Not recorded',
      height: vitalSigns.height ? `${vitalSigns.height} in` : 'Not recorded',
      oxygenSaturation: vitalSigns.oxygen_saturation ? `${vitalSigns.oxygen_saturation}%` : 'Not recorded',
    };
  },

  // Validate vital signs data
  validateVitalSigns(vitalSignsData) {
    const errors = {};

    // Blood pressure validation
    if (vitalSignsData.blood_pressure_systolic && (vitalSignsData.blood_pressure_systolic < 60 || vitalSignsData.blood_pressure_systolic > 250)) {
      errors.blood_pressure_systolic = 'Systolic pressure should be between 60-250 mmHg';
    }
    if (vitalSignsData.blood_pressure_diastolic && (vitalSignsData.blood_pressure_diastolic < 30 || vitalSignsData.blood_pressure_diastolic > 150)) {
      errors.blood_pressure_diastolic = 'Diastolic pressure should be between 30-150 mmHg';
    }

    // Heart rate validation
    if (vitalSignsData.heart_rate && (vitalSignsData.heart_rate < 30 || vitalSignsData.heart_rate > 220)) {
      errors.heart_rate = 'Heart rate should be between 30-220 bpm';
    }

    // Temperature validation
    if (vitalSignsData.temperature && (vitalSignsData.temperature < 90 || vitalSignsData.temperature > 110)) {
      errors.temperature = 'Temperature should be between 90-110°F';
    }

    // Respiratory rate validation
    if (vitalSignsData.respiratory_rate && (vitalSignsData.respiratory_rate < 8 || vitalSignsData.respiratory_rate > 40)) {
      errors.respiratory_rate = 'Respiratory rate should be between 8-40 per minute';
    }

    // Oxygen saturation validation
    if (vitalSignsData.oxygen_saturation && (vitalSignsData.oxygen_saturation < 70 || vitalSignsData.oxygen_saturation > 100)) {
      errors.oxygen_saturation = 'Oxygen saturation should be between 70-100%';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Format medical record for display
  formatMedicalRecord(record) {
    if (!record) return {};

    return {
      id: record.id,
      date: new Date(record.created_at || record.visit_date),
      type: record.record_type || record.visit_type || 'General Visit',
      provider: record.provider_name || record.staff?.name || 'Unknown Provider',
      chiefComplaint: record.chief_complaint || record.reason || 'Not specified',
      diagnosis: record.diagnosis || record.assessment || 'Pending',
      treatment: record.treatment || record.plan || 'Not specified',
      notes: record.notes || record.additional_notes || '',
      status: record.status || 'completed',
    };
  },

  // Validate medical record data
  validateMedicalRecord(recordData) {
    const errors = {};

    // Required fields
    if (!recordData.patient_id) {
      errors.patient_id = 'Patient ID is required';
    }
    if (!recordData.visit_date && !recordData.created_at) {
      errors.visit_date = 'Visit date is required';
    }
    if (!recordData.record_type && !recordData.visit_type) {
      errors.record_type = 'Record type is required';
    }

    // Date validation
    if (recordData.visit_date && new Date(recordData.visit_date) > new Date()) {
      errors.visit_date = 'Visit date cannot be in the future';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
};

export default medicalRecordsService;