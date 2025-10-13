// Utility functions for consultation management and link generation

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique consultation room ID
 * @returns {string} Unique consultation room ID
 */
export const generateConsultationId = () => {
  return `cons_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
};

/**
 * Generate a secure consultation link
 * @param {string} consultationId - The consultation room ID
 * @param {object} options - Additional options for the link
 * @returns {string} Complete consultation link
 */
export const generateConsultationLink = (consultationId, options = {}) => {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams();
  
  // Add consultation ID
  params.append('room', consultationId);
  
  // Add optional parameters
  if (options.patientId) params.append('patient', options.patientId);
  if (options.doctorId) params.append('doctor', options.doctorId);
  if (options.scheduled) params.append('scheduled', options.scheduled);
  if (options.type) params.append('type', options.type);
  
  return `${baseUrl}/app/telehealth/join?${params.toString()}`;
};

/**
 * Generate a shareable meeting link with token
 * @param {object} meetingData - Meeting information
 * @returns {object} Meeting link data
 */
export const generateMeetingLink = (meetingData = {}) => {
  const consultationId = generateConsultationId();
  const token = generateSecureToken();
  
  const meeting = {
    id: consultationId,
    token: token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString(), // 24 hours
    doctorId: meetingData.doctorId || 'doc_001',
    patientId: meetingData.patientId,
    patientName: meetingData.patientName,
    patientEmail: meetingData.patientEmail,
    scheduledTime: meetingData.scheduledTime,
    duration: meetingData.duration || 30,
    type: meetingData.type || 'consultation',
    status: 'scheduled'
  };
  
  // Generate the link
  const link = generateConsultationLink(consultationId, {
    patientId: meeting.patientId,
    doctorId: meeting.doctorId,
    scheduled: meeting.scheduledTime,
    type: meeting.type
  });
  
  return {
    ...meeting,
    link: link,
    shortLink: generateShortLink(consultationId)
  };
};

/**
 * Generate a secure token for meeting authentication
 * @returns {string} Secure token
 */
const generateSecureToken = () => {
  return btoa(uuidv4() + Date.now()).replace(/[/+=]/g, '').substring(0, 24);
};

/**
 * Generate a shortened link for easier sharing
 * @param {string} consultationId - The consultation ID
 * @returns {string} Shortened link
 */
const generateShortLink = (consultationId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/join/${consultationId.substring(5, 13)}`;
};

/**
 * Validate consultation link and extract data
 * @param {string} link - The consultation link to validate
 * @returns {object|null} Parsed link data or null if invalid
 */
export const parseConsultationLink = (link) => {
  try {
    const url = new URL(link);
    const params = new URLSearchParams(url.search);
    
    return {
      room: params.get('room'),
      patientId: params.get('patient'),
      doctorId: params.get('doctor'),
      scheduled: params.get('scheduled'),
      type: params.get('type') || 'consultation'
    };
  } catch (error) {
    console.error('Invalid consultation link:', error);
    return null;
  }
};

/**
 * Format meeting time for display
 * @param {string|Date} dateTime - The date/time to format
 * @returns {string} Formatted date/time string
 */
export const formatMeetingTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

/**
 * Calculate meeting duration in minutes
 * @param {string|Date} startTime - Meeting start time
 * @param {string|Date} endTime - Meeting end time
 * @returns {number} Duration in minutes
 */
export const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end - start) / (1000 * 60));
};

/**
 * Check if a meeting link has expired
 * @param {string} expiresAt - Expiration timestamp
 * @returns {boolean} True if expired
 */
export const isLinkExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

/**
 * Generate email template data for consultation invitation
 * @param {object} meetingData - Meeting information
 * @returns {object} Email template data
 */
export const generateEmailTemplate = (meetingData) => {
  return {
    subject: `Video Consultation Invitation - ${formatMeetingTime(meetingData.scheduledTime)}`,
    patientName: meetingData.patientName,
    doctorName: meetingData.doctorName || 'Dr. Smith',
    consultationDate: formatMeetingTime(meetingData.scheduledTime),
    duration: `${meetingData.duration} minutes`,
    consultationLink: meetingData.link,
    shortLink: meetingData.shortLink,
    meetingId: meetingData.id,
    instructions: generateJoinInstructions(),
    supportContact: 'support@ehreezy.com',
    cancelLink: `${window.location.origin}/cancel/${meetingData.token}`
  };
};

/**
 * Generate instructions for joining the consultation
 * @returns {array} Array of instruction strings
 */
const generateJoinInstructions = () => {
  return [
    'Click the consultation link 5-10 minutes before your appointment time',
    'Make sure you have a stable internet connection',
    'Use Chrome, Firefox, Safari, or Edge browser for best experience',
    'Allow camera and microphone permissions when prompted',
    'Have your ID and insurance information ready if needed',
    'Ensure you\'re in a quiet, private location for the consultation'
  ];
};

/**
 * Store meeting data (in a real app, this would be saved to backend)
 * @param {object} meetingData - Meeting data to store
 * @returns {Promise<object>} Stored meeting data
 */
export const storeMeetingData = async (meetingData) => {
  // For demo purposes, store in localStorage
  // In production, this should be sent to your backend API
  const meetings = JSON.parse(localStorage.getItem('consultationMeetings') || '[]');
  meetings.push(meetingData);
  localStorage.setItem('consultationMeetings', JSON.stringify(meetings));
  
  console.log('Meeting stored:', meetingData);
  return meetingData;
};

/**
 * Retrieve meeting data by ID
 * @param {string} meetingId - Meeting ID to retrieve
 * @returns {object|null} Meeting data or null if not found
 */
export const getMeetingData = (meetingId) => {
  const meetings = JSON.parse(localStorage.getItem('consultationMeetings') || '[]');
  return meetings.find(meeting => meeting.id === meetingId) || null;
};

/**
 * Get all scheduled meetings for a doctor
 * @param {string} doctorId - Doctor ID
 * @returns {array} Array of scheduled meetings
 */
export const getDoctorMeetings = (doctorId) => {
  const meetings = JSON.parse(localStorage.getItem('consultationMeetings') || '[]');
  return meetings.filter(meeting => meeting.doctorId === doctorId);
};