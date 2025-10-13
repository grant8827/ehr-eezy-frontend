// Demo data generator for testing the invitation system

import { generateMeetingLink, storeMeetingData } from './consultationUtils';

/**
 * Generate sample consultation invitations for testing
 */
export const generateSampleInvitations = async () => {
  const samplePatients = [
    {
      patientName: 'Sarah Johnson',
      patientEmail: 'sarah.johnson@email.com',
      patientPhone: '(555) 123-4567',
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      duration: 30,
      type: 'general',
      doctorName: 'Dr. Smith'
    },
    {
      patientName: 'Michael Chen',
      patientEmail: 'michael.chen@email.com',
      patientPhone: '(555) 234-5678',
      scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      duration: 45,
      type: 'follow-up',
      doctorName: 'Dr. Smith'
    },
    {
      patientName: 'Emma Williams',
      patientEmail: 'emma.williams@email.com',
      patientPhone: '(555) 345-6789',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      duration: 60,
      type: 'specialist',
      doctorName: 'Dr. Smith'
    },
    {
      patientName: 'James Brown',
      patientEmail: 'james.brown@email.com',
      patientPhone: '(555) 456-7890',
      scheduledTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago (expired)
      duration: 30,
      type: 'general',
      doctorName: 'Dr. Smith'
    }
  ];

  const invitations = [];

  for (const patient of samplePatients) {
    try {
      const meetingData = generateMeetingLink(patient);
      await storeMeetingData(meetingData);
      invitations.push(meetingData);
      
      // Simulate some email activity
      const emailActivity = {
        id: `activity_${Date.now()}_${Math.random()}`,
        type: 'email_sent',
        template: 'consultation-invitation',
        recipient: patient.patientEmail,
        subject: `Video Consultation Invitation - ${patient.patientName}`,
        meetingId: meetingData.id,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      
      const activities = JSON.parse(localStorage.getItem('emailActivities') || '[]');
      activities.push(emailActivity);
      localStorage.setItem('emailActivities', JSON.stringify(activities));
      
    } catch (error) {
      console.error('Error generating sample invitation:', error);
    }
  }

  return invitations;
};

/**
 * Clear all sample data
 */
export const clearSampleData = () => {
  localStorage.removeItem('consultationMeetings');
  localStorage.removeItem('emailActivities');
  console.log('Sample data cleared');
};

/**
 * Initialize demo data if none exists
 */
export const initializeDemoData = async () => {
  const existingMeetings = JSON.parse(localStorage.getItem('consultationMeetings') || '[]');
  
  if (existingMeetings.length === 0) {
    console.log('Generating sample invitation data...');
    await generateSampleInvitations();
    console.log('Sample data initialized');
  }
};

export default {
  generateSampleInvitations,
  clearSampleData,
  initializeDemoData
};