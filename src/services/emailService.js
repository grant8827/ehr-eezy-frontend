// Email service for sending consultation invitations and notifications

/**
 * Email service configuration
 */
const EMAIL_CONFIG = {
  // In production, these would be environment variables
  apiBaseUrl: process.env.REACT_APP_EMAIL_API_URL || '/api/email',
  templatePath: '/templates',
  fromEmail: process.env.REACT_APP_FROM_EMAIL || 'noreply@ehreezy.com',
  fromName: process.env.REACT_APP_FROM_NAME || 'EHR-Eezy Telehealth',
  supportEmail: 'support@ehreezy.com'
};

/**
 * Send consultation invitation email to patient
 * @param {object} emailData - Email data including recipient and meeting details
 * @returns {Promise<object>} Response from email service
 */
export const sendConsultationInvitation = async (emailData) => {
  try {
    console.log('Sending consultation invitation email...', emailData);
    
    // In a real application, this would be an API call to your backend
    // For demonstration, we'll simulate the email service
    
    const emailPayload = {
      to: emailData.to,
      from: {
        email: EMAIL_CONFIG.fromEmail,
        name: EMAIL_CONFIG.fromName
      },
      subject: emailData.subject,
      template: 'consultation-invitation',
      templateData: {
        ...emailData.data,
        companyName: 'EHR-Eezy',
        supportEmail: EMAIL_CONFIG.supportEmail,
        currentYear: new Date().getFullYear()
      },
      metadata: {
        meetingId: emailData.data.meetingId,
        patientEmail: emailData.to,
        sentAt: new Date().toISOString()
      }
    };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, we'll use different methods to "send" the email
    if (window.confirm('Choose email method:\nOK = Open default email client\nCancel = Log to console only')) {
      // Method 1: Use mailto: to open default email client
      const mailtoBody = generatePlainTextEmail(emailPayload.templateData);
      const mailtoUrl = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(mailtoBody)}`;
      window.open(mailtoUrl);
    } else {
      // Method 2: Log the email content to console
      console.log('📧 Email Content:', {
        to: emailPayload.to,
        subject: emailPayload.subject,
        body: generatePlainTextEmail(emailPayload.templateData)
      });
    }
    
    // Log email activity (in production, save to backend)
    logEmailActivity(emailPayload);
    
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
      recipient: emailData.to,
      status: 'sent'
    };
    
  } catch (error) {
    console.error('Failed to send consultation invitation:', error);
    throw new Error('Failed to send email invitation. Please try again.');
  }
};

/**
 * Send consultation reminder email
 * @param {object} meetingData - Meeting data
 * @param {number} hoursBeforeMeeting - Hours before meeting to send reminder
 * @returns {Promise<object>} Response from email service
 */
export const sendConsultationReminder = async (meetingData, hoursBeforeMeeting = 24) => {
  try {
    const reminderData = {
      to: meetingData.patientEmail,
      subject: `Reminder: Video Consultation Tomorrow with ${meetingData.doctorName}`,
      data: {
        patientName: meetingData.patientName,
        doctorName: meetingData.doctorName,
        consultationDate: meetingData.scheduledTime,
        consultationLink: meetingData.link,
        meetingId: meetingData.id,
        isReminder: true,
        hoursUntilMeeting: hoursBeforeMeeting
      }
    };
    
    return await sendEmail(reminderData, 'consultation-reminder');
    
  } catch (error) {
    console.error('Failed to send consultation reminder:', error);
    throw error;
  }
};

/**
 * Send consultation cancellation email
 * @param {object} meetingData - Meeting data
 * @param {string} reason - Cancellation reason
 * @returns {Promise<object>} Response from email service
 */
export const sendConsultationCancellation = async (meetingData, reason = '') => {
  try {
    const cancellationData = {
      to: meetingData.patientEmail,
      subject: `Consultation Cancelled - ${meetingData.doctorName}`,
      data: {
        patientName: meetingData.patientName,
        doctorName: meetingData.doctorName,
        consultationDate: meetingData.scheduledTime,
        reason: reason,
        supportEmail: EMAIL_CONFIG.supportEmail,
        rescheduleLink: `${window.location.origin}/reschedule/${meetingData.id}`
      }
    };
    
    return await sendEmail(cancellationData, 'consultation-cancellation');
    
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
    throw error;
  }
};

/**
 * Send follow-up email after consultation
 * @param {object} consultationData - Consultation data including notes and prescriptions
 * @returns {Promise<object>} Response from email service
 */
export const sendConsultationFollowUp = async (consultationData) => {
  try {
    const followUpData = {
      to: consultationData.patientEmail,
      subject: `Consultation Summary - ${consultationData.doctorName}`,
      data: {
        patientName: consultationData.patientName,
        doctorName: consultationData.doctorName,
        consultationDate: consultationData.completedAt,
        summary: consultationData.notes,
        prescriptions: consultationData.prescriptions,
        nextAppointment: consultationData.nextAppointment,
        followUpInstructions: consultationData.followUpInstructions
      }
    };
    
    return await sendEmail(followUpData, 'consultation-follow-up');
    
  } catch (error) {
    console.error('Failed to send follow-up email:', error);
    throw error;
  }
};

/**
 * Generic email sending function
 * @param {object} emailData - Email data
 * @param {string} template - Email template name
 * @returns {Promise<object>} Response from email service
 */
const sendEmail = async (emailData, template) => {
  // In production, this would make an actual API call
  const payload = {
    ...emailData,
    template,
    from: {
      email: EMAIL_CONFIG.fromEmail,
      name: EMAIL_CONFIG.fromName
    }
  };
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`📧 Sending ${template} email:`, payload);
  
  return {
    success: true,
    messageId: `msg_${Date.now()}`,
    timestamp: new Date().toISOString(),
    recipient: emailData.to,
    template: template,
    status: 'sent'
  };
};

/**
 * Generate plain text email body for consultation invitation
 * @param {object} data - Email template data
 * @returns {string} Plain text email body
 */
const generatePlainTextEmail = (data) => {
  return `
Dear ${data.patientName},

You have been scheduled for a video consultation with ${data.doctorName}.

CONSULTATION DETAILS:
• Date & Time: ${data.consultationDate}
• Duration: ${data.duration}
• Meeting ID: ${data.meetingId}

JOIN YOUR CONSULTATION:
${data.consultationLink}

Quick Join Link: ${data.shortLink}

BEFORE YOUR CONSULTATION:
${data.instructions.map(instruction => `• ${instruction}`).join('\n')}

TECHNICAL SUPPORT:
If you experience any technical difficulties, please contact us at:
Email: ${data.supportContact}
Phone: (555) 123-4567

CANCELLATION/RESCHEDULING:
If you need to cancel or reschedule this appointment, please visit:
${data.cancelLink}

Thank you for choosing ${data.companyName || 'EHR-Eezy'} for your healthcare needs.

Best regards,
${data.doctorName}
${data.companyName || 'EHR-Eezy'} Telehealth Team

---
This is an automated message. Please do not reply to this email.
For support, contact ${data.supportContact}
`.trim();
};

/**
 * Generate HTML email template for consultation invitation
 * @param {object} data - Email template data
 * @returns {string} HTML email body
 */
export const generateHTMLEmailTemplate = (data) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video Consultation Invitation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
    .consultation-details { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .instructions { background: #fef3cd; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Video Consultation Invitation</h1>
      <p>You have been scheduled for a consultation with ${data.doctorName}</p>
    </div>
    
    <div class="content">
      <p>Dear ${data.patientName},</p>
      
      <div class="consultation-details">
        <h3>Consultation Details</h3>
        <ul>
          <li><strong>Date & Time:</strong> ${data.consultationDate}</li>
          <li><strong>Duration:</strong> ${data.duration}</li>
          <li><strong>Doctor:</strong> ${data.doctorName}</li>
          <li><strong>Meeting ID:</strong> ${data.meetingId}</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="${data.consultationLink}" class="cta-button">Join Video Consultation</a>
        <p><small>Or copy this link: ${data.shortLink}</small></p>
      </div>
      
      <div class="instructions">
        <h4>Before Your Consultation:</h4>
        <ul>
          ${data.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ul>
      </div>
      
      <p>If you have any questions or need to reschedule, please contact us at <a href="mailto:${data.supportContact}">${data.supportContact}</a></p>
    </div>
    
    <div class="footer">
      <p>&copy; ${data.currentYear} ${data.companyName || 'EHR-Eezy'}. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Log email activity for tracking and analytics
 * @param {object} emailData - Email data to log
 */
const logEmailActivity = (emailData) => {
  const activity = {
    id: `activity_${Date.now()}`,
    type: 'email_sent',
    template: emailData.template,
    recipient: emailData.to,
    subject: emailData.subject,
    meetingId: emailData.metadata?.meetingId,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };
  
  // Store in localStorage for demo (in production, send to backend)
  const activities = JSON.parse(localStorage.getItem('emailActivities') || '[]');
  activities.push(activity);
  localStorage.setItem('emailActivities', JSON.stringify(activities));
  
  console.log('📊 Email activity logged:', activity);
};

/**
 * Get email activity history
 * @param {string} meetingId - Meeting ID to filter by (optional)
 * @returns {array} Array of email activities
 */
export const getEmailActivity = (meetingId = null) => {
  const activities = JSON.parse(localStorage.getItem('emailActivities') || '[]');
  
  if (meetingId) {
    return activities.filter(activity => activity.meetingId === meetingId);
  }
  
  return activities;
};

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Schedule automatic email reminders
 * @param {object} meetingData - Meeting data
 * @returns {object} Scheduled reminder info
 */
export const scheduleEmailReminders = (meetingData) => {
  // In a real application, this would schedule background jobs
  // For demo, we'll just log the scheduling
  
  const reminders = [
    { hours: 24, type: '24-hour reminder' },
    { hours: 2, type: '2-hour reminder' },
    { hours: 0.25, type: '15-minute reminder' }
  ];
  
  console.log('📅 Scheduling email reminders for meeting:', meetingData.id, reminders);
  
  return {
    meetingId: meetingData.id,
    reminders: reminders.map(reminder => ({
      ...reminder,
      scheduledAt: new Date(new Date(meetingData.scheduledTime).getTime() - (reminder.hours * 60 * 60 * 1000)).toISOString()
    }))
  };
};

// Export the email service object
export default {
  sendConsultationInvitation,
  sendConsultationReminder,
  sendConsultationCancellation,
  sendConsultationFollowUp,
  generateHTMLEmailTemplate,
  getEmailActivity,
  isValidEmail,
  scheduleEmailReminders
};