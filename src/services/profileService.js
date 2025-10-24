import { authAPI } from './apiService';
import toast from 'react-hot-toast';

// Profile service to handle user profile operations
export const profileService = {
  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await authAPI.getUser();
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await authAPI.updateProfile(profileData);
      toast.success('Profile updated successfully');
      
      // Update localStorage with new user data
      if (response.data.user) {
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      throw error;
    }
  },

  // Upload profile picture
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const response = await authAPI.uploadProfilePicture(formData);
      toast.success('Profile picture updated successfully');
      
      // Update localStorage with new user data
      if (response.data.user) {
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      const message = error.response?.data?.message || 'Failed to upload profile picture';
      toast.error(message);
      throw error;
    }
  },

  // Update notification preferences
  async updateNotificationPreferences(preferences) {
    try {
      const response = await authAPI.updateNotificationPreferences(preferences);
      toast.success('Notification preferences updated');
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      const message = error.response?.data?.message || 'Failed to update preferences';
      toast.error(message);
      throw error;
    }
  },

  // Deactivate account
  async deactivateAccount(reason) {
    try {
      const response = await authAPI.deactivateAccount({ reason });
      toast.success('Account deactivated successfully');
      return response.data;
    } catch (error) {
      console.error('Error deactivating account:', error);
      const message = error.response?.data?.message || 'Failed to deactivate account';
      toast.error(message);
      throw error;
    }
  }
};

export default profileService;