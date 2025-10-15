// Email service utility for EHR system
// This handles all email communications including invitations, notifications, and reports

import { api } from '../services/apiService';
import toast from 'react-hot-toast';

export const emailConfig = {
  // Configuration will be loaded from environment variables or backend API
  smtp: {
    host: '',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: ''
    }
  },
  from: {
    name: 'EHR Eezy System',
    email: 'noreply@ehreezy.com'
  }
};

// Email templates for different types of communications
export const emailTemplates = {
  patientInvitation: {
    subject: 'Welcome to EHR Eezy - Your Patient Portal Access',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <h2 style="color: #1e40af; margin-bottom: 20px;">Welcome to EHR Eezy</h2>
          <p>Dear {{patientName}},</p>
          <p>You have been invited to access your patient portal. This secure portal allows you to:</p>
          <ul>
            <li>View your medical records and test results</li>
            <li>Schedule and manage appointments</li>
            <li>Communicate with your healthcare team</li>
            <li>Access billing information and make payments</li>
          </ul>
          <div style="margin: 30px 0;">
            <a href="{{portalLink}}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Your Portal
            </a>
          </div>
          <p><strong>Your Login Information:</strong></p>
          <p>Username: {{username}}<br>
          Temporary Password: {{tempPassword}}</p>
          <p style="color: #ef4444; font-size: 14px;">
            <strong>Important:</strong> Please change your password after your first login for security.
          </p>
          <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            If you have any questions, please contact us at {{clinicPhone}} or reply to this email.
          </p>
        </div>
      </div>
    `
  },

  appointmentReminder: {
    subject: 'Appointment Reminder - {{appointmentDate}}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <h2 style="color: #1e40af; margin-bottom: 20px;">📅 Appointment Reminder</h2>
          <p>Dear {{patientName}},</p>
          <p>This is a friendly reminder about your upcoming appointment:</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Date & Time:</strong> {{appointmentDate}} at {{appointmentTime}}</p>
            <p><strong>Provider:</strong> {{providerName}}</p>
            <p><strong>Location:</strong> {{clinicAddress}}</p>
            <p><strong>Appointment Type:</strong> {{appointmentType}}</p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>Please arrive 15 minutes early</strong> to complete check-in procedures.
            </p>
          </div>

          <p><strong>What to bring:</strong></p>
          <ul>
            <li>Photo ID and insurance card</li>
            <li>Current medication list</li>
            <li>Any relevant medical records</li>
          </ul>

          <div style="margin: 30px 0;">
            <a href="{{rescheduleLink}}" style="background: #6b7280; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              Reschedule
            </a>
            <a href="{{confirmLink}}" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Confirm Appointment
            </a>
          </div>

          <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            Questions? Contact us at {{clinicPhone}} | {{clinicEmail}}
          </p>
        </div>
      </div>
    `
  },

  labResults: {
    subject: 'Lab Results Available - {{testName}}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
          <h2 style="color: #059669; margin-bottom: 20px;">🔬 Lab Results Ready</h2>
          <p>Dear {{patientName}},</p>
          <p>Your lab results are now available in your patient portal.</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Test:</strong> {{testName}}</p>
            <p><strong>Ordered by:</strong> {{providerName}}</p>
            <p><strong>Date Collected:</strong> {{collectionDate}}</p>
            <p><strong>Results Date:</strong> {{resultsDate}}</p>
          </div>

          <div style="margin: 30px 0;">
            <a href="{{portalLink}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Results
            </a>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>Note:</strong> Please review your results and contact your healthcare provider if you have any questions or concerns.
            </p>
          </div>

          <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  },

  invoiceNotification: {
    subject: 'Invoice {{invoiceNumber}} - Amount Due: ${{amount}}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #fef7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #a855f7;">
          <h2 style="color: #7c3aed; margin-bottom: 20px;">💳 Invoice Notification</h2>
          <p>Dear {{patientName}},</p>
          <p>We have generated a new invoice for your recent healthcare services.</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Invoice Number:</strong> {{invoiceNumber}}</p>
            <p><strong>Invoice Date:</strong> {{invoiceDate}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
            <p><strong>Amount Due:</strong> <span style="color: #dc2626; font-size: 18px; font-weight: bold;">${{amount}}</span></p>
          </div>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #374151;">Services Provided:</h4>
            {{servicesList}}
          </div>

          <div style="margin: 30px 0;">
            <a href="{{paymentLink}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              Pay Now
            </a>
            <a href="{{invoiceLink}}" style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Invoice
            </a>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>Payment Options:</strong> Online portal, phone, or mail. Insurance claims are processed automatically.
            </p>
          </div>

          <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            Questions about your bill? Contact our billing department at {{billingPhone}} | {{billingEmail}}
          </p>
        </div>
      </div>
    `
  },

  passwordReset: {
    subject: 'Reset Your EHR Eezy Password',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
          <h2 style="color: #dc2626; margin-bottom: 20px;">🔐 Password Reset Request</h2>
          <p>Hello {{userName}},</p>
          <p>We received a request to reset your password for your EHR Eezy account.</p>
          
          <div style="margin: 30px 0;">
            <a href="{{resetLink}}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <div style="background: #fee2e2; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b;">
              <strong>Security Notice:</strong> This link will expire in 1 hour for your security.
            </p>
          </div>

          <p>If you didn't request this password reset, please ignore this email or contact our support team immediately.</p>

          <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            For security reasons, never share this email or click suspicious links.
          </p>
        </div>
      </div>
    `
  }
};

// Email sending functions
export const emailService = {
  // Send patient invitation
  sendPatientInvitation: async (patientData) => {
    const template = emailTemplates.patientInvitation;
    const htmlContent = template.template
      .replace(/{{patientName}}/g, patientData.name)
      .replace(/{{portalLink}}/g, patientData.portalLink || `${window.location.origin}/patient-portal`)
      .replace(/{{username}}/g, patientData.email)
      .replace(/{{tempPassword}}/g, patientData.tempPassword)
      .replace(/{{clinicPhone}}/g, patientData.clinicPhone || '(555) 123-4567')
      .replace(/{{clinicEmail}}/g, patientData.clinicEmail || 'support@ehrEezy.com');

    return await sendEmail({
      to: patientData.email,
      subject: template.subject,
      html: htmlContent
    });
  },

  // Send appointment reminder
  sendAppointmentReminder: async (appointmentData) => {
    const template = emailTemplates.appointmentReminder;
    const htmlContent = template.template
      .replace(/{{patientName}}/g, appointmentData.patientName)
      .replace(/{{appointmentDate}}/g, appointmentData.date)
      .replace(/{{appointmentTime}}/g, appointmentData.time)
      .replace(/{{providerName}}/g, appointmentData.provider)
      .replace(/{{clinicAddress}}/g, appointmentData.address)
      .replace(/{{appointmentType}}/g, appointmentData.type)
      .replace(/{{rescheduleLink}}/g, appointmentData.rescheduleLink)
      .replace(/{{confirmLink}}/g, appointmentData.confirmLink)
      .replace(/{{clinicPhone}}/g, appointmentData.phone)
      .replace(/{{clinicEmail}}/g, appointmentData.email);

    const subject = template.subject
      .replace(/{{appointmentDate}}/g, appointmentData.date);

    return await sendEmail({
      to: appointmentData.patientEmail,
      subject: subject,
      html: htmlContent
    });
  },

  // Send lab results notification
  sendLabResultsNotification: async (resultsData) => {
    const template = emailTemplates.labResults;
    const htmlContent = template.template
      .replace(/{{patientName}}/g, resultsData.patientName)
      .replace(/{{testName}}/g, resultsData.testName)
      .replace(/{{providerName}}/g, resultsData.providerName)
      .replace(/{{collectionDate}}/g, resultsData.collectionDate)
      .replace(/{{resultsDate}}/g, resultsData.resultsDate)
      .replace(/{{portalLink}}/g, resultsData.portalLink);

    const subject = template.subject
      .replace(/{{testName}}/g, resultsData.testName);

    return await sendEmail({
      to: resultsData.patientEmail,
      subject: subject,
      html: htmlContent
    });
  },

  // Send invoice notification
  sendInvoiceNotification: async (invoiceData) => {
    const template = emailTemplates.invoiceNotification;
    const servicesList = invoiceData.services.map(service => 
      `<p style="margin: 5px 0;">• ${service.description} - $${service.amount.toFixed(2)}</p>`
    ).join('');

    const htmlContent = template.template
      .replace(/{{patientName}}/g, invoiceData.patientName)
      .replace(/{{invoiceNumber}}/g, invoiceData.invoiceNumber)
      .replace(/{{invoiceDate}}/g, invoiceData.invoiceDate)
      .replace(/{{dueDate}}/g, invoiceData.dueDate)
      .replace(/{{amount}}/g, invoiceData.amount.toFixed(2))
      .replace(/{{servicesList}}/g, servicesList)
      .replace(/{{paymentLink}}/g, invoiceData.paymentLink)
      .replace(/{{invoiceLink}}/g, invoiceData.invoiceLink)
      .replace(/{{billingPhone}}/g, invoiceData.billingPhone)
      .replace(/{{billingEmail}}/g, invoiceData.billingEmail);

    const subject = template.subject
      .replace(/{{invoiceNumber}}/g, invoiceData.invoiceNumber)
      .replace(/{{amount}}/g, invoiceData.amount.toFixed(2));

    return await sendEmail({
      to: invoiceData.patientEmail,
      subject: subject,
      html: htmlContent
    });
  },

  // Send password reset
  sendPasswordReset: async (userData) => {
    const template = emailTemplates.passwordReset;
    const htmlContent = template.template
      .replace(/{{userName}}/g, userData.name)
      .replace(/{{resetLink}}/g, userData.resetLink);

    return await sendEmail({
      to: userData.email,
      subject: template.subject,
      html: htmlContent
    });
  }
};

// Core email sending function (will connect to backend API)
const sendEmail = async (emailData) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        from: emailConfig.from
      })
    });

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Bulk email functions
export const bulkEmailService = {
  // Send appointment reminders for multiple patients
  sendBulkAppointmentReminders: async (appointments) => {
    const results = [];
    for (const appointment of appointments) {
      const result = await emailService.sendAppointmentReminder(appointment);
      results.push({ appointmentId: appointment.id, ...result });
    }
    return results;
  },

  // Send payment reminders
  sendPaymentReminders: async (overdueInvoices) => {
    const results = [];
    for (const invoice of overdueInvoices) {
      const result = await emailService.sendInvoiceNotification(invoice);
      results.push({ invoiceId: invoice.id, ...result });
    }
    return results;
  }
};

// Email validation utility
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Email queue management (for high volume)
export const emailQueue = {
  queue: [],
  
  addToQueue: (emailData) => {
    emailQueue.queue.push({
      id: Date.now(),
      ...emailData,
      status: 'pending',
      attempts: 0,
      createdAt: new Date()
    });
  },

  processQueue: async () => {
    const pendingEmails = emailQueue.queue.filter(email => 
      email.status === 'pending' && email.attempts < 3
    );

    for (const email of pendingEmails) {
      try {
        const result = await sendEmail(email);
        if (result.success) {
          email.status = 'sent';
        } else {
          email.attempts++;
          if (email.attempts >= 3) {
            email.status = 'failed';
          }
        }
      } catch (error) {
        email.attempts++;
        if (email.attempts >= 3) {
          email.status = 'failed';
        }
      }
    }
  },

  getQueueStatus: () => {
    const stats = {
      pending: emailQueue.queue.filter(e => e.status === 'pending').length,
      sent: emailQueue.queue.filter(e => e.status === 'sent').length,
      failed: emailQueue.queue.filter(e => e.status === 'failed').length
    };
    return stats;
  }
};

// API-based email service functions
export const emailAPI = {
  // Send patient invitation
  async sendPatientInvitation(patientId, message = null, portalUrl = null) {
    try {
      const response = await api.post('/emails/patient-invitation', {
        patient_id: patientId,
        message,
        portal_url: portalUrl
      });
      
      toast.success('Patient invitation sent successfully');
      return response.data;
    } catch (error) {
      console.error('Error sending patient invitation:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to send patient invitation');
      }
      throw error;
    }
  },

  // Send appointment reminder
  async sendAppointmentReminder(appointmentId, customMessage = null) {
    try {
      const response = await api.post('/emails/appointment-reminder', {
        appointment_id: appointmentId,
        custom_message: customMessage
      });
      
      toast.success('Appointment reminder sent successfully');
      return response.data;
    } catch (error) {
      console.error('Error sending appointment reminder:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to send appointment reminder');
      }
      throw error;
    }
  },

  // Send billing notification
  async sendBillingNotification(billId, type, customMessage = null) {
    try {
      const response = await api.post('/emails/billing-notification', {
        bill_id: billId,
        type, // 'invoice', 'payment_reminder', 'payment_confirmation'
        custom_message: customMessage
      });
      
      toast.success('Billing notification sent successfully');
      return response.data;
    } catch (error) {
      console.error('Error sending billing notification:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to send billing notification');
      }
      throw error;
    }
  },

  // Send custom email
  async sendCustomEmail(recipientEmail, subject, message, patientId = null) {
    try {
      const response = await api.post('/emails/custom', {
        recipient_email: recipientEmail,
        subject,
        message,
        patient_id: patientId
      });
      
      toast.success('Email sent successfully');
      return response.data;
    } catch (error) {
      console.error('Error sending custom email:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(msg => toast.error(msg));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to send email');
      }
      throw error;
    }
  },

  // Test SMTP configuration
  async testSmtpConfiguration(smtpConfig, testEmail) {
    try {
      const response = await api.post('/emails/test-smtp', {
        test_email: testEmail,
        smtp_host: smtpConfig.host,
        smtp_port: smtpConfig.port,
        smtp_username: smtpConfig.username,
        smtp_password: smtpConfig.password,
        smtp_encryption: smtpConfig.encryption
      });
      
      if (response.data.success) {
        toast.success('SMTP configuration test successful');
      }
      return response.data;
    } catch (error) {
      console.error('SMTP test error:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('SMTP configuration test failed');
      }
      throw error;
    }
  },

  // Get email templates from backend
  async getEmailTemplates() {
    try {
      const response = await api.get('/emails/templates');
      return response.data.templates;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      toast.error('Failed to load email templates');
      throw error;
    }
  }
};

// Export both the original emailService functions and the new API functions
export default {
  ...emailService,
  ...emailAPI
};