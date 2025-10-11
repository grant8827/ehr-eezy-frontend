import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, CalendarIcon, DocumentIcon, CreditCardIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import PatientRegistrationForm from './PatientRegistrationForm';

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await axios.get(`/api/patients/${id}`);
      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    fetchPatient(); // Refresh patient data
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Patient not found</h2>
        <Link to="/app/patients" className="text-blue-600 hover:text-blue-500">
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/app/patients"
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Patients
          </Link>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowEditForm(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Patient
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {patient.first_name?.[0]}{patient.last_name?.[0]}
                </span>
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-white">
                {patient.first_name} {patient.last_name}
              </h1>
              <p className="text-blue-100">
                Patient ID: {patient.patient_id || `PAT${String(patient.id).padStart(6, '0')}`}
              </p>
              <div className="flex items-center mt-2 space-x-4 text-blue-100">
                {patient.date_of_birth && (
                  <span>{calculateAge(patient.date_of_birth)} years old</span>
                )}
                {patient.gender && <span>• {patient.gender}</span>}
                {patient.blood_type && <span>• Blood Type: {patient.blood_type}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-6">
            {patient.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4 mr-2" />
                {patient.phone}
              </div>
            )}
            {patient.email && (
              <div className="flex items-center text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                {patient.email}
              </div>
            )}
            {patient.address && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-2" />
                {patient.address}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'medical', name: 'Medical History' },
              { id: 'appointments', name: 'Appointments' },
              { id: 'records', name: 'Medical Records' },
              { id: 'billing', name: 'Billing' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Full Name:</span>
                      <span className="text-sm text-gray-900">{patient.first_name} {patient.last_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                      <span className="text-sm text-gray-900">
                        {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Gender:</span>
                      <span className="text-sm text-gray-900">{patient.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Blood Type:</span>
                      <span className="text-sm text-gray-900">{patient.blood_type || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Contact Name:</span>
                      <span className="text-sm text-gray-900">{patient.emergency_contact_name || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Contact Phone:</span>
                      <span className="text-sm text-gray-900">{patient.emergency_contact_phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Insurance Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Provider:</span>
                      <span className="text-sm text-gray-900">{patient.insurance_provider || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Policy Number:</span>
                      <span className="text-sm text-gray-900">{patient.insurance_policy_number || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>Last appointment: {patient.last_appointment || 'No appointments yet'}</p>
                      <p className="mt-1">Last visit: {patient.last_visit || 'No visits recorded'}</p>
                      <p className="mt-1">Account created: {new Date(patient.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Medical History</h3>
                  <p className="text-sm text-gray-600">
                    {patient.medical_history || 'No medical history recorded'}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Current Medications</h3>
                  <p className="text-sm text-gray-600">
                    {patient.current_medications || 'No current medications'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Allergies</h3>
                  <p className="text-sm text-gray-600">
                    {patient.allergies || 'No known allergies'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content */}
          {activeTab === 'appointments' && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Appointments functionality will be integrated here</p>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="text-center py-12">
              <DocumentIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Medical records functionality will be integrated here</p>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="text-center py-12">
              <CreditCardIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Billing functionality will be integrated here</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Patient Form */}
      <PatientRegistrationForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        patient={patient}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default PatientProfile;