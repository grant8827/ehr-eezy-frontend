import React, { useState, useEffect } from 'react';
import {
  PaperAirplaneIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { 
  generateMeetingLink, 
  generateEmailTemplate, 
  storeMeetingData, 
  formatMeetingTime 
} from '../utils/consultationUtils';

const EmailInvitation = ({ isOpen, onClose, patientData = null, onSent }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: '30',
    consultationType: 'general',
    notes: ''
  });
  
  const [generatedLink, setGeneratedLink] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  
  // Pre-fill form if patient data is provided
  useEffect(() => {
    if (patientData) {
      setFormData(prev => ({
        ...prev,
        patientName: patientData.name || '',
        patientEmail: patientData.email || '',
        patientPhone: patientData.phone || ''
      }));
    }
  }, [patientData]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEmailSent(false);
      setLinkCopied(false);
      setGeneratedLink(null);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }
    
    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = 'Patient email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) {
      newErrors.patientEmail = 'Please enter a valid email address';
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Consultation date is required';
    }
    
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Consultation time is required';
    }
    
    // Check if scheduled time is in the future
    if (formData.scheduledDate && formData.scheduledTime) {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      if (scheduledDateTime <= new Date()) {
        newErrors.scheduledDateTime = 'Consultation must be scheduled for a future date/time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateLink = async () => {
    console.log('Generate link clicked');
    console.log('Form data:', formData);
    
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    console.log('Validation errors:', errors);
    
    if (!isValid) {
      console.log('Form validation failed, stopping link generation');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const meetingData = {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        scheduledTime: new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString(),
        duration: parseInt(formData.duration),
        type: formData.consultationType,
        notes: formData.notes,
        doctorId: 'doc_001', // In real app, get from auth context
        doctorName: 'Dr. Smith' // In real app, get from auth context
      };
      
      const linkData = generateMeetingLink(meetingData);
      
      // Store meeting data
      await storeMeetingData(linkData);
      
      setGeneratedLink(linkData);
    } catch (error) {
      console.error('Error generating link:', error);
      setErrors({ general: 'Failed to generate consultation link. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!generatedLink) return;
    
    setIsSending(true);
    
    try {
      // Generate email template
      const emailTemplate = generateEmailTemplate(generatedLink);
      
      // In a real application, you would send this to your backend API
      // For demo purposes, we'll simulate the email sending
      const emailData = {
        to: formData.patientEmail,
        subject: emailTemplate.subject,
        template: 'consultation-invitation',
        data: emailTemplate
      };
      
      console.log('Sending email:', emailData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, we'll use mailto: link to open default email client
      const mailtoLink = `mailto:${formData.patientEmail}?subject=${encodeURIComponent(emailTemplate.subject)}&body=${encodeURIComponent(generateEmailBody(emailTemplate))}`;
      window.open(mailtoLink);
      
      setEmailSent(true);
      if (onSent) onSent(generatedLink);
      
    } catch (error) {
      console.error('Error sending email:', error);
      setErrors({ general: 'Failed to send email. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  const generateEmailBody = (template) => {
    return `Dear ${template.patientName},

You have been scheduled for a video consultation with ${template.doctorName}.

Consultation Details:
- Date & Time: ${template.consultationDate}
- Duration: ${template.duration}
- Meeting ID: ${template.meetingId}

JOIN YOUR CONSULTATION:
${template.consultationLink}

Quick Join (Short Link):
${template.shortLink}

IMPORTANT INSTRUCTIONS:
${template.instructions.map(instruction => `• ${instruction}`).join('\n')}

If you need to cancel or reschedule, please contact us at ${template.supportContact} or visit: ${template.cancelLink}

Thank you,
EHR-Eezy Telehealth Team`;
  };

  const copyLink = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink.link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareLink = () => {
    if (!generatedLink) return;
    
    if (navigator.share) {
      navigator.share({
        title: `Video Consultation with Dr. Smith`,
        text: `Join your scheduled consultation: ${formatMeetingTime(generatedLink.scheduledTime)}`,
        url: generatedLink.link
      });
    } else {
      copyLink();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Send Consultation Invitation</h2>
            <p className="text-sm text-gray-600 mt-1">Generate and email consultation link to patient</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {/* Success Message */}
          {emailSent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Email invitation sent successfully!</p>
                <p className="text-xs text-green-600 mt-1">Patient will receive the consultation link at {formData.patientEmail}</p>
              </div>
            </div>
          )}

          {!generatedLink ? (
            <>
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Patient Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.patientName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter patient's full name"
                    />
                    {errors.patientName && <p className="text-xs text-red-600 mt-1">{errors.patientName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.patientEmail}
                      onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.patientEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="patient@email.com"
                    />
                    {errors.patientEmail && <p className="text-xs text-red-600 mt-1">{errors.patientEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Type
                    </label>
                    <select
                      value={formData.consultationType}
                      onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General Consultation</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="specialist">Specialist Consultation</option>
                      <option value="emergency">Emergency Consultation</option>
                      <option value="therapy">Therapy Session</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scheduling Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CalendarDaysIcon className="w-5 h-5 mr-2" />
                  Consultation Schedule
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.scheduledDate && <p className="text-xs text-red-600 mt-1">{errors.scheduledDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.scheduledTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.scheduledTime && <p className="text-xs text-red-600 mt-1">{errors.scheduledTime}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                    </select>
                  </div>
                </div>

                {errors.scheduledDateTime && (
                  <p className="text-xs text-red-600">{errors.scheduledDateTime}</p>
                )}
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special instructions or notes for the patient..."
                />
              </div>
            </>
          ) : (
            /* Generated Link Display */
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Consultation Link Generated
                </h3>
                <div className="space-y-3 text-sm">
                  <p><span className="font-medium">Patient:</span> {generatedLink.patientName}</p>
                  <p><span className="font-medium">Email:</span> {generatedLink.patientEmail}</p>
                  <p><span className="font-medium">Scheduled:</span> {formatMeetingTime(generatedLink.scheduledTime)}</p>
                  <p><span className="font-medium">Duration:</span> {generatedLink.duration} minutes</p>
                  <p><span className="font-medium">Meeting ID:</span> {generatedLink.id}</p>
                </div>
              </div>

              {/* Generated Links */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Consultation Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={generatedLink.link}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={copyLink}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        linkCopied 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {linkCopied ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <DocumentDuplicateIcon className="w-4 h-4 inline mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Link (Easier to Share)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={generatedLink.shortLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={shareLink}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      <ShareIcon className="w-4 h-4 inline mr-1" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {!generatedLink && (
              <span>* Required fields</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {emailSent ? 'Done' : 'Cancel'}
            </button>
            
            {!generatedLink ? (
              <div className="flex space-x-2">
                <button
                  onClick={generateLink}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isGenerating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <LinkIcon className="w-4 h-4" />
                  <span>{isGenerating ? 'Generating...' : 'Generate Link'}</span>
                </button>
                
                <button
                  onClick={async () => {
                    console.log('Test link generation');
                    setIsGenerating(true);
                    
                    const testData = {
                      patientName: 'Test Patient',
                      patientEmail: 'test@example.com',
                      patientPhone: '555-1234',
                      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                      duration: 30,
                      type: 'general',
                      notes: 'Test consultation',
                      doctorId: 'doc_001',
                      doctorName: 'Dr. Smith'
                    };
                    
                    try {
                      const linkData = generateMeetingLink(testData);
                      console.log('Generated link data:', linkData);
                      await storeMeetingData(linkData);
                      setGeneratedLink(linkData);
                    } catch (error) {
                      console.error('Error in test generation:', error);
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                >
                  🧪 Test Generate
                </button>
              </div>
            ) : (
              !emailSent && (
                <button
                  onClick={sendEmail}
                  disabled={isSending}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>{isSending ? 'Sending...' : 'Send Email Invitation'}</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailInvitation;