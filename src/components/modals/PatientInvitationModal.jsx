import React, { useState, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon, UserPlusIcon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { patientInvitationService } from '../../services/patientInvitationService';
import { patientAPI } from '../../services/apiService';

const PatientInvitationModal = ({ isOpen, onClose, onSuccess }) => {
  // Mode: 'select' for choosing existing patient, 'new' for entering new patient details
  const [invitationMode, setInvitationMode] = useState('select');
  
  // Patient selection
  const [existingPatients, setExistingPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [loadingPatients, setLoadingPatients] = useState(false);
  
  // Form data for new patients or invitation details
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load existing patients when modal opens
  useEffect(() => {
    if (isOpen) {
      loadExistingPatients();
      // Reset form when modal opens
      setInvitationMode('select');
      setSelectedPatient(null);
      setPatientSearchTerm('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        message: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const loadExistingPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await patientAPI.getAll();
      const patientsData = Array.isArray(response.data) ? response.data : 
                          (response.data.data ? response.data.data : []);
      setExistingPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load existing patients');
      setExistingPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    // Auto-fill some fields from selected patient
    setFormData(prev => ({
      ...prev,
      firstName: patient.first_name || '',
      lastName: patient.last_name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      dateOfBirth: patient.date_of_birth || '',
      gender: patient.gender || ''
    }));
  };

  const handleModeChange = (mode) => {
    setInvitationMode(mode);
    setSelectedPatient(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      message: ''
    });
    setErrors({});
  };

  const viewSentInvitations = () => {
    const sentInvitations = JSON.parse(localStorage.getItem('patient_invitations') || '[]');
    const emailSimulations = JSON.parse(localStorage.getItem('email_simulations') || '[]');
    
    if (sentInvitations.length === 0 && emailSimulations.length === 0) {
      alert('📧 No invitations have been sent yet.\n\nOnce you send invitations, they will appear here for demo purposes.');
      return;
    }
    
    let message = '';
    
    if (sentInvitations.length > 0) {
      const invitationsList = sentInvitations
        .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at)) // Most recent first
        .slice(0, 10) // Show last 10
        .map((invitation, index) => {
          const sentDate = new Date(invitation.sent_at).toLocaleString();
          return `${index + 1}. ${invitation.firstName} ${invitation.lastName}\n   📧 ${invitation.email}\n   📅 Sent: ${sentDate}\n   🔗 Status: ${invitation.status}`;
        })
        .join('\n\n');
      
      message += `📧 Recently Sent Invitations\n\n${invitationsList}\n\n`;
    }
    
    if (emailSimulations.length > 0) {
      const simsList = emailSimulations
        .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))
        .slice(0, 5)
        .map((sim, index) => {
          const sentDate = new Date(sim.sent_at).toLocaleString();
          return `${index + 1}. To: ${sim.to}\n   📅 ${sentDate}\n   📋 Subject: ${sim.subject}`;
        })
        .join('\n\n');
      
      message += `📧 Email Simulations (Check Console for Full Content)\n\n${simsList}\n\n💡 Tip: Open browser console (F12) to see full email content.`;
    }
    
    message += '\n💡 Note: These are demo invitations. For real emails, use grant8827@yahoo.com as the email address.';
    
    alert(message);
  };

  const filteredPatients = existingPatients.filter(patient => {
    if (!patientSearchTerm) return true;
    const searchLower = patientSearchTerm.toLowerCase();
    return (
      patient.first_name?.toLowerCase().includes(searchLower) ||
      patient.last_name?.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (invitationMode === 'select') {
      // For existing patient mode, only need to validate selected patient and message
      if (!selectedPatient) {
        newErrors.patient = 'Please select a patient to invite';
      }
    } else {
      // For new patient mode, validate all required fields
      const validation = patientInvitationService.validateInvitationData(formData);
      Object.assign(newErrors, validation.errors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let invitationData;
      
      if (invitationMode === 'select' && selectedPatient) {
        // For existing patient
        invitationData = {
          patientId: selectedPatient.id,
          firstName: selectedPatient.first_name,
          lastName: selectedPatient.last_name,
          email: selectedPatient.email,
          phone: selectedPatient.phone,
          dateOfBirth: selectedPatient.date_of_birth,
          gender: selectedPatient.gender,
          message: formData.message || `You have been invited to register for our patient portal to manage your healthcare appointments and records.`
        };
      } else {
        // For new patient
        invitationData = formData;
      }

      const invitationResult = await patientInvitationService.sendInvitation(invitationData);
      
      // Show success message
      const patientName = `${invitationData.firstName} ${invitationData.lastName}`;
      
      if (invitationResult.status === 'sent_real') {
        toast.success(`📧 REAL Email sent to ${patientName} at ${invitationData.email}! Check your inbox.`, {
          duration: 8000
        });
      } else if (invitationResult.status === 'failed_real') {
        toast.error(`❌ Failed to send real email to ${patientName}. Using demo mode instead.`, {
          duration: 6000
        });
      } else {
        toast.success(`📧 Demo Invitation "Sent" to ${patientName}! (Click "📧 View Sent Invitations" to see demo data)`, {
          duration: 5000
        });
      }
      
      if (onSuccess) {
        onSuccess(invitationResult);
      }

      // Reset form
      setSelectedPatient(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        message: ''
      });
      setErrors({});
      onClose();

    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        message: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/5 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlusIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {invitationMode === 'select' ? 'Invite Existing Patient' : 'Invite New Patient'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Mode Selection */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => handleModeChange('select')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                invitationMode === 'select'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Select Existing Patient
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('new')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                invitationMode === 'new'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Enter New Patient
            </button>
          </div>

          {invitationMode === 'select' ? (
            /* Existing Patient Selection */
            <div className="space-y-4">
              {/* Search Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Patients
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Patient List */}
              <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                {loadingPatients ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading patients...</p>
                  </div>
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient)}
                      className={`p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {patient.first_name?.[0]}{patient.last_name?.[0]}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{patient.email}</p>
                          </div>
                        </div>
                        {selectedPatient?.id === patient.id && (
                          <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">
                      {patientSearchTerm ? 'No patients found matching your search.' : 'No patients available.'}
                    </p>
                  </div>
                )}
              </div>

              {errors.patient && (
                <p className="text-sm text-red-600">{errors.patient}</p>
              )}

              {/* Selected Patient Summary */}
              {selectedPatient && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Selected Patient:</h4>
                  <div className="text-sm text-green-700">
                    <p><strong>{selectedPatient.first_name} {selectedPatient.last_name}</strong></p>
                    <p>{selectedPatient.email}</p>
                    {selectedPatient.phone && <p>{selectedPatient.phone}</p>}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* New Patient Information */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="patient@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
            </div>
          )}

          {/* Personal Message - Available for both modes */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                invitationMode === 'select' 
                  ? "Add a personal message for the patient..." 
                  : "Add a personal message to include in the invitation email..."
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={viewSentInvitations}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              📧 View Sent Invitations
            </button>
            <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>Send Invitation</span>
                </>
              )}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientInvitationModal;