import toast from 'react-hot-toast';
import { api } from './apiService';

// Patient Invitation service to handle invitation-related operations
export const patientInvitationService = {
  // Send invitation to a patient
  async sendInvitation(invitationData) {
    try {
      console.log('📧 Sending invitation via Laravel backend...', invitationData);
      
      const response = await api.post('/patient-invitations', {
        first_name: invitationData.firstName,
        last_name: invitationData.lastName,
        email: invitationData.email,
        phone: invitationData.phone,
        date_of_birth: invitationData.dateOfBirth,
        gender: invitationData.gender,
        personal_message: invitationData.message
      });

      console.log('✅ Backend response:', response.data);
      
      return {
        id: response.data.invitation.id,
        firstName: response.data.invitation.first_name,
        lastName: response.data.invitation.last_name,
        email: response.data.invitation.email,
        phone: response.data.invitation.phone,
        dateOfBirth: response.data.invitation.date_of_birth,
        gender: response.data.invitation.gender,
        message: response.data.invitation.personal_message,
        status: response.data.invitation.status,
        sent_at: response.data.invitation.created_at,
        registration_url: response.data.registration_url,
        expires_at: response.data.invitation.expires_at
      };
    } catch (error) {
      console.error('❌ Error sending invitation:', error);
      
      // Handle specific error cases
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          const errorMessages = Object.values(validationErrors).flat();
          throw new Error(errorMessages.join(', '));
        }
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send invitation. Please try again.';
      throw new Error(errorMessage);
    }
  },

  // Get all sent invitations
  async getAllInvitations(filters = {}) {
    try {
      console.log('📋 Fetching invitations from Laravel backend...');
      
      const response = await api.get('/patient-invitations', { params: filters });
      
      console.log('✅ Invitations fetched:', response.data);
      
      // Transform the data to match frontend expectations
      const transformedInvitations = response.data.invitations.map(invitation => ({
        id: invitation.id,
        firstName: invitation.first_name,
        lastName: invitation.last_name,
        email: invitation.email,
        phone: invitation.phone,
        dateOfBirth: invitation.date_of_birth,
        gender: invitation.gender,
        message: invitation.personal_message,
        status: invitation.status,
        sent_at: invitation.created_at,
        expires_at: invitation.expires_at,
        resent_at: invitation.resent_at,
        registered_at: invitation.registered_at
      }));
      
      return {
        data: transformedInvitations,
        total: transformedInvitations.length,
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      console.error('❌ Error fetching invitations:', error);
      
      // Fallback for offline mode
      const storedInvitations = this.getStoredInvitations();
      toast.error('Unable to fetch from server. Showing local data.');
      
      return {
        data: storedInvitations,
        total: storedInvitations.length,
        offline: true
      };
    }
  },

  // Get invitation by ID
  async getInvitationById(id) {
    try {
      console.log(`🔍 Fetching invitation ${id} from Laravel backend...`);
      
      const response = await api.get(`/patient-invitations/${id}`);
      
      const invitation = response.data.invitation;
      
      // Transform to match frontend expectations
      return {
        id: invitation.id,
        firstName: invitation.first_name,
        lastName: invitation.last_name,
        email: invitation.email,
        phone: invitation.phone,
        dateOfBirth: invitation.date_of_birth,
        gender: invitation.gender,
        message: invitation.personal_message,
        status: invitation.status,
        sent_at: invitation.created_at,
        expires_at: invitation.expires_at,
        resent_at: invitation.resent_at,
        registered_at: invitation.registered_at
      };
    } catch (error) {
      console.error('❌ Error fetching invitation:', error);
      
      if (error.response?.status === 404) {
        return null;
      }
      
      // Fallback to stored invitations
      const storedInvitations = this.getStoredInvitations();
      const invitation = storedInvitations.find(inv => inv.id === parseInt(id));
      return invitation || null;
    }
  },

  // Resend invitation
  async resendInvitation(invitationId) {
    try {
      console.log(`🔄 Resending invitation ${invitationId} via Laravel backend...`);
      
      const response = await api.post(`/patient-invitations/${invitationId}/resend`);
      
      console.log('✅ Invitation resent:', response.data);
      
      const invitation = response.data.invitation;
      
      // Transform to match frontend expectations
      return {
        id: invitation.id,
        firstName: invitation.first_name,
        lastName: invitation.last_name,
        email: invitation.email,
        phone: invitation.phone,
        dateOfBirth: invitation.date_of_birth,
        gender: invitation.gender,
        message: invitation.personal_message,
        status: invitation.status,
        sent_at: invitation.created_at,
        expires_at: invitation.expires_at,
        resent_at: invitation.updated_at,
        registered_at: invitation.registered_at
      };
    } catch (error) {
      console.error('❌ Error resending invitation:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resend invitation. Please try again.';
      throw new Error(errorMessage);
    }
  },

  // Cancel invitation
  async cancelInvitation(invitationId) {
    try {
      console.log(`❌ Cancelling invitation ${invitationId} via Laravel backend...`);
      
      const response = await api.post(`/patient-invitations/${invitationId}/cancel`);
      
      console.log('✅ Invitation cancelled:', response.data);
      
      return true;
    } catch (error) {
      console.error('❌ Error cancelling invitation:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel invitation. Please try again.';
      throw new Error(errorMessage);
    }
  },

  // Check invitation status
  async checkInvitationStatus(email, token) {
    try {
      console.log(`🔍 Checking invitation status for ${email}...`);
      
      const response = await api.get(`/patient-invitations/check?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
      
      const invitation = response.data.invitation;
      
      return {
        valid: response.data.valid,
        invitation: invitation ? {
          id: invitation.id,
          firstName: invitation.first_name,
          lastName: invitation.last_name,
          email: invitation.email,
          phone: invitation.phone,
          dateOfBirth: invitation.date_of_birth,
          gender: invitation.gender,
          message: invitation.personal_message,
          status: invitation.status,
          sent_at: invitation.created_at,
          expires_at: invitation.expires_at
        } : null,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error checking invitation status:', error);
      
      if (error.response?.status === 404) {
        return {
          valid: false,
          message: 'Invitation not found or already used',
          invitation: null
        };
      }
      
      // Fallback to stored invitations for development
      const storedInvitations = this.getStoredInvitations();
      const invitation = storedInvitations.find(inv => inv.email === email);
      
      if (invitation && invitation.status === 'sent') {
        return {
          valid: true,
          invitation: invitation,
          message: 'Valid invitation (from local storage)'
        };
      }
      
      return {
        valid: false,
        message: 'Invitation not found or already used'
      };
    }
  },

  // Mark invitation as registered (when patient completes registration)
  async markAsRegistered(email, token, patientData) {
    try {
      console.log(`✅ Completing registration for ${email}...`);
      
      const response = await api.post('/patient-invitations/complete', {
        email: email,
        token: token,
        ...patientData
      });
      
      console.log('✅ Registration completed:', response.data);
      
      return {
        success: true,
        patient: response.data.patient,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error completing registration:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to complete registration. Please try again.';
      throw new Error(errorMessage);
    }
  },

  // Helper function to get stored invitations (for demo purposes)
  getStoredInvitations() {
    try {
      const stored = localStorage.getItem('patient_invitations');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing stored invitations:', error);
      return [];
    }
  },

  // Helper function to generate invitation token (for demo purposes)
  generateInvitationToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },

  // Get invitation statistics
  async getInvitationStats() {
    try {
      console.log('📊 Fetching invitation statistics from Laravel backend...');
      
      const response = await api.get('/patient-invitations/stats');
      
      return {
        total: response.data.total || 0,
        sent: response.data.sent || 0,
        registered: response.data.registered || 0,
        cancelled: response.data.cancelled || 0,
        expired: response.data.expired || 0,
        pending: response.data.pending || 0,
        conversionRate: response.data.conversion_rate || 0
      };
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      
      // Fallback to local stats
      const invitations = this.getStoredInvitations();
      
      const total = invitations.length;
      const sent = invitations.filter(inv => inv.status === 'sent').length;
      const registered = invitations.filter(inv => inv.status === 'registered').length;
      const pending = sent;
      
      return {
        total,
        sent,
        registered,
        cancelled: 0,
        expired: 0,
        pending,
        conversionRate: total > 0 ? Math.round((registered / total) * 100) : 0
      };
    }
  },

  // Validate invitation data
  validateInvitationData(invitationData) {
    const errors = {};

    // Required fields
    if (!invitationData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!invitationData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!invitationData.email?.trim()) {
      errors.email = 'Email is required';
    }
    if (!invitationData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    if (!invitationData.gender) {
      errors.gender = 'Gender is required';
    }

    // Email validation
    if (invitationData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitationData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (if provided)
    if (invitationData.phone && !/^[\d\s\-\+\(\)]+$/.test(invitationData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Date of birth validation (not in future)
    if (invitationData.dateOfBirth && new Date(invitationData.dateOfBirth) > new Date()) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },


};

export default patientInvitationService;