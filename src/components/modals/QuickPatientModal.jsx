import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { patientAPI } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const QuickPatientModal = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    insurance_provider: '',
    insurance_policy_number: '',
    insurance_group_number: '',
    primary_physician: '',
    assigned_therapist: '',
    medical_conditions: '',
    current_medications: '',
    allergies: '',
    blood_type: '',
    height: '',
    weight: '',
    therapy_type: '',
    therapy_goals: '',
    therapy_notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadPatients();
    }
  }, [isOpen]);

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    if (patientId === 'new') {
      setIsNewPatient(true);
      // Reset form for new patient
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        insurance_provider: '',
        insurance_policy_number: '',
        insurance_group_number: '',
        primary_physician: '',
        assigned_therapist: '',
        medical_conditions: '',
        current_medications: '',
        allergies: '',
        blood_type: '',
        height: '',
        weight: '',
        therapy_type: '',
        therapy_goals: '',
        therapy_notes: ''
      });
    } else if (patientId) {
      setIsNewPatient(false);
      const selectedPatient = patients.find(p => p.id.toString() === patientId);
      if (selectedPatient) {
        // Pre-populate form with existing patient data
        setFormData({
          first_name: selectedPatient.first_name || '',
          last_name: selectedPatient.last_name || '',
          email: selectedPatient.email || '',
          phone: selectedPatient.phone || '',
          date_of_birth: selectedPatient.date_of_birth || '',
          gender: selectedPatient.gender || '',
          address: selectedPatient.address || '',
          city: selectedPatient.city || '',
          state: selectedPatient.state || '',
          zip_code: selectedPatient.zip_code || '',
          emergency_contact_name: selectedPatient.emergency_contact_name || '',
          emergency_contact_phone: selectedPatient.emergency_contact_phone || '',
          emergency_contact_relationship: selectedPatient.emergency_contact_relationship || '',
          insurance_provider: selectedPatient.insurance_provider || '',
          insurance_policy_number: selectedPatient.insurance_policy_number || '',
          insurance_group_number: selectedPatient.insurance_group_number || '',
          primary_physician: selectedPatient.primary_physician || '',
          assigned_therapist: selectedPatient.assigned_therapist || '',
          medical_conditions: selectedPatient.medical_conditions || '',
          current_medications: selectedPatient.current_medications || '',
          allergies: selectedPatient.allergies || '',
          blood_type: selectedPatient.blood_type || '',
          height: selectedPatient.height || '',
          weight: selectedPatient.weight || '',
          therapy_type: selectedPatient.therapy_type || '',
          therapy_goals: selectedPatient.therapy_goals || '',
          therapy_notes: selectedPatient.therapy_notes || ''
        });
      }
    } else {
      setIsNewPatient(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedPatientId) {
      newErrors.patient_selection = 'Please select a patient or choose to create new';
      setErrors(newErrors);
      return false;
    }

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isNewPatient) {
        // Create new patient
        response = await patientAPI.create(formData);
        toast.success('Patient record created successfully!');
      } else {
        // Update existing patient
        response = await patientAPI.update(selectedPatientId, formData);
        toast.success('Patient record updated successfully!');
      }
      
      const patient = response.data.data || response.data;
      onSuccess?.(patient);
      
      // Navigate to the patient's record
      navigate(`/app/patients/${patient.id}`);
      onClose();
      
      // Reset form
      setSelectedPatientId('');
      setIsNewPatient(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        insurance_provider: '',
        insurance_policy_number: '',
        insurance_group_number: '',
        primary_physician: '',
        assigned_therapist: '',
        medical_conditions: '',
        current_medications: '',
        allergies: '',
        blood_type: '',
        height: '',
        weight: '',
        therapy_type: '',
        therapy_goals: '',
        therapy_notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error(error.response?.data?.message || `Failed to ${isNewPatient ? 'create' : 'update'} patient record`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {isNewPatient ? 'Create New Patient Record' : selectedPatientId ? 'Complete Patient Record' : 'Patient Record Management'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Patient Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Patient <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.patient_selection ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loadingPatients}
                >
                  <option value="">
                    {loadingPatients ? 'Loading patients...' : 'Select a patient or create new'}
                  </option>
                  <option value="new">➕ Create New Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} ({patient.email})
                    </option>
                  ))}
                </select>
                {errors.patient_selection && <p className="text-red-500 text-xs mt-1">{errors.patient_selection}</p>}
              </div>

              {selectedPatientId && (
                <div className="max-h-96 overflow-y-auto pr-2">
                  {/* Personal Information */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.first_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter first name"
                        />
                        {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.last_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter last name"
                        />
                        {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter email address"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
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
                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Address Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter street address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter state"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          name="zip_code"
                          value={formData.zip_code}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter ZIP code"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Emergency Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                        <input
                          type="text"
                          name="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter contact name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          name="emergency_contact_phone"
                          value={formData.emergency_contact_phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter contact phone"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                        <input
                          type="text"
                          name="emergency_contact_relationship"
                          value={formData.emergency_contact_relationship}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Spouse, Parent, Sibling"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Insurance Information */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Insurance Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                        <input
                          type="text"
                          name="insurance_provider"
                          value={formData.insurance_provider}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter insurance provider"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                        <input
                          type="text"
                          name="insurance_policy_number"
                          value={formData.insurance_policy_number}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter policy number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
                        <input
                          type="text"
                          name="insurance_group_number"
                          value={formData.insurance_group_number}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter group number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Healthcare Providers */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Healthcare Providers
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Physician</label>
                        <input
                          type="text"
                          name="primary_physician"
                          value={formData.primary_physician}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter physician name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Therapist</label>
                        <input
                          type="text"
                          name="assigned_therapist"
                          value={formData.assigned_therapist}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter therapist name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Medical Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                        <select
                          name="blood_type"
                          value={formData.blood_type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select blood type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter height"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter weight"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Therapy Type</label>
                        <select
                          name="therapy_type"
                          value={formData.therapy_type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select therapy type</option>
                          <option value="physical_therapy">Physical Therapy</option>
                          <option value="occupational_therapy">Occupational Therapy</option>
                          <option value="speech_therapy">Speech Therapy</option>
                          <option value="mental_health">Mental Health Therapy</option>
                          <option value="family_therapy">Family Therapy</option>
                          <option value="group_therapy">Group Therapy</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                        <textarea
                          name="medical_conditions"
                          value={formData.medical_conditions}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="List any medical conditions..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                        <textarea
                          name="current_medications"
                          value={formData.current_medications}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="List current medications..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                        <textarea
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="List any allergies..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Therapy Goals</label>
                        <textarea
                          name="therapy_goals"
                          value={formData.therapy_goals}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter therapy goals..."
                        />
                      </div>
                    </div>

                    {/* Therapy Notes */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Therapy Notes</label>
                      <textarea
                        name="therapy_notes"
                        value={formData.therapy_notes}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter any therapy-related notes..."
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                {selectedPatientId && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        {isNewPatient ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      isNewPatient ? 'Create Patient Record' : 'Update Patient Record'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickPatientModal;