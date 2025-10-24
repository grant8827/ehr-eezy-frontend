import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { patientService } from '../services/patientService';
import { getPatientMedicalRecords, getMedicalRecordsSummary } from '../utils/medicalRecordsData';
import PatientHistory from '../components/PatientHistory';
import LabResults from '../components/LabResults';
import Prescriptions from '../components/Prescriptions';
import VitalSigns from '../components/VitalSigns';
import Documents from '../components/Documents';
import AddVisit from '../components/AddVisit';
import QuickPatientModal from '../components/modals/QuickPatientModal';
import {
  MagnifyingGlassIcon,
  UserIcon,
  DocumentTextIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  FolderIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  CalendarDaysIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const MedicalRecords = () => {
  const { user, isDoctor, isPatient } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [medicalRecords, setMedicalRecords] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [showQuickPatientModal, setShowQuickPatientModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load patients from backend API
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const patientsData = await patientService.getAllPatients();
        
        // Transform backend patients to match expected format
        const transformedPatients = (patientsData || []).map(patient => ({
          id: patient.id,
          name: `${patient.first_name} ${patient.last_name}`,
          age: patient.age || Math.floor(Math.random() * 50) + 20,
          email: patient.email,
          phone: patient.phone || '+1 (555) 123-4567',
          avatar: `https://images.unsplash.com/photo-${1494790108755 + patient.id}?w=100&h=100&fit=crop&crop=face`,
          status: 'active',
          lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          nextAppointment: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          medicalConditions: ['General Health'],
          preferredContactMethod: 'email'
        }));
        
        setPatients(transformedPatients);
      } catch (error) {
        console.error('Error loading patients:', error);
        setPatients([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  // Load summary statistics
  useEffect(() => {
    setSummary(getMedicalRecordsSummary());
  }, [patients]);

  // Load patient medical records when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      const records = getPatientMedicalRecords(selectedPatient.id);
      setMedicalRecords(records);
    }
  }, [selectedPatient]);

  // Auto-select patient if logged in as patient
  useEffect(() => {
    if (isPatient && user && patients.length > 0) {
      // Find patient record based on user email or use first patient
      const patientRecord = patients.find(p => p.email === user.email) || patients[0];
      setSelectedPatient(patientRecord);
    }
  }, [isPatient, user, patients]);

  // Filter patients based on search
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle patient creation success
  const handlePatientCreationSuccess = (newPatient) => {
    // Refresh patients list
    loadPatients();
    // The navigation to patient details will be handled by the modal
  };

  // Handle adding a new visit
  const handleAddVisit = (newVisitData) => {
    if (selectedPatient && medicalRecords) {
      // Add to medical history
      const updatedHistory = [newVisitData, ...medicalRecords.medicalHistory];
      
      // Add vital signs if provided
      const updatedVitalSigns = newVisitData.vitalSigns && Object.keys(newVisitData.vitalSigns).some(key => 
        key !== 'id' && key !== 'date' && newVisitData.vitalSigns[key]
      ) ? [newVisitData.vitalSigns, ...medicalRecords.vitalSigns] : medicalRecords.vitalSigns;
      
      // Add documents if provided
      const updatedDocuments = newVisitData.documents && newVisitData.documents.length > 0
        ? [...newVisitData.documents, ...medicalRecords.documents]
        : medicalRecords.documents;

      // Update medical records
      setMedicalRecords(prev => ({
        ...prev,
        medicalHistory: updatedHistory,
        vitalSigns: updatedVitalSigns,
        documents: updatedDocuments
      }));

      // If we're on the history tab, stay there to see the new visit
      // Otherwise, switch to history tab to show the newly added visit
      if (activeTab !== 'history') {
        setActiveTab('history');
      }
    }
  };

  // Navigation tabs
  const tabs = [
    { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
    { id: 'history', name: 'Medical History', icon: ClipboardDocumentListIcon },
    { id: 'labs', name: 'Lab Results', icon: BeakerIcon },
    { id: 'prescriptions', name: 'Prescriptions', icon: ClipboardDocumentListIcon },
    { id: 'vitals', name: 'Vital Signs', icon: HeartIcon },
    { id: 'documents', name: 'Documents', icon: FolderIcon }
  ];

  const renderTabContent = () => {
    if (!medicalRecords) return null;

    switch (activeTab) {
      case 'history':
        return <PatientHistory medicalHistory={medicalRecords.medicalHistory} />;
      case 'labs':
        return <LabResults labResults={medicalRecords.labResults} />;
      case 'prescriptions':
        return <Prescriptions prescriptions={medicalRecords.prescriptions} allergies={medicalRecords.allergies} />;
      case 'vitals':
        return <VitalSigns vitalSigns={medicalRecords.vitalSigns} history={medicalRecords.medicalHistory} />;
      case 'documents':
        return <Documents documents={medicalRecords.documents} patientId={selectedPatient?.id} />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => {
    if (!medicalRecords) return null;

    const { patient, medicalHistory, labResults, prescriptions, allergies } = medicalRecords;
    const recentVisit = medicalHistory[0];
    const activePrescriptions = prescriptions.filter(rx => rx.status === 'active');
    const recentLabResults = labResults.slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Patient Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="medical-card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Visits</p>
                <p className="text-2xl font-semibold text-gray-900">{medicalHistory.length}</p>
              </div>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BeakerIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Lab Results</p>
                <p className="text-2xl font-semibold text-gray-900">{labResults.length}</p>
              </div>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Medications</p>
                <p className="text-2xl font-semibold text-gray-900">{activePrescriptions.length}</p>
              </div>
            </div>
          </div>

          {/* Quick Add Visit Card */}
          {isDoctor && (
            <div className="medical-card p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 cursor-pointer hover:from-blue-100 hover:to-indigo-200 transition-all duration-300" onClick={() => setShowAddVisit(true)}>
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0">
                  <PlusIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4 text-center">
                  <p className="text-sm font-medium text-blue-700">Quick Action</p>
                  <p className="text-lg font-semibold text-blue-900">Add Visit</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Allergies Alert */}
        {allergies.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Allergies</h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside space-y-1">
                    {allergies.map((allergy) => (
                      <li key={allergy.id}>
                        <strong>{allergy.allergen}</strong> ({allergy.type}) - {allergy.reaction}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Visit */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Most Recent Visit</h3>
            </div>
            <div className="p-6">
              {recentVisit ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{recentVisit.type}</p>
                      <p className="text-sm text-gray-500">{recentVisit.date.toLocaleDateString()}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {recentVisit.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Provider:</strong> {recentVisit.provider}</p>
                    <p className="text-sm text-gray-600"><strong>Chief Complaint:</strong> {recentVisit.chiefComplaint}</p>
                    <p className="text-sm text-gray-600"><strong>Diagnosis:</strong> {recentVisit.diagnosis}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No recent visits</p>
              )}
            </div>
          </div>

          {/* Active Medications */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Active Medications</h3>
            </div>
            <div className="p-6">
              {activePrescriptions.length > 0 ? (
                <div className="space-y-3">
                  {activePrescriptions.slice(0, 3).map((prescription) => (
                    <div key={prescription.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{prescription.medication.name}</p>
                        <p className="text-sm text-gray-500">
                          {prescription.medication.dosage} - {prescription.medication.frequency}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {prescription.refillsRemaining} refills
                      </span>
                    </div>
                  ))}
                  {activePrescriptions.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{activePrescriptions.length - 3} more medications
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No active medications</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Lab Results */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Lab Results</h3>
          </div>
          <div className="p-6">
            {recentLabResults.length > 0 ? (
              <div className="space-y-4">
                {recentLabResults.map((lab) => (
                  <div key={lab.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{lab.testType.name}</p>
                      <p className="text-sm text-gray-500">
                        {lab.resultDate.toLocaleDateString()} - {lab.provider}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-600">Normal</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent lab results</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Medical Records</h1>
            <p className="text-gray-600">
              {isPatient ? 'Your complete medical history and records' : 'Comprehensive patient medical records management'}
            </p>
          </div>
          
          {/* Create New Patient Record Button (for providers only) */}
          {!isPatient && (
            <button
              onClick={() => setShowQuickPatientModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Create New Patient Record
            </button>
          )}
        </div>
        
        {/* Summary Stats for Providers */}
        {!isPatient && summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Patients</p>
                  <p className="text-2xl font-bold text-blue-900">{summary.totalPatients}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Active Records</p>
                  <p className="text-2xl font-bold text-green-900">{summary.activeRecords}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600">Pending Results</p>
                  <p className="text-2xl font-bold text-yellow-900">{summary.pendingResults}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ArrowUpTrayIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Recent Uploads</p>
                  <p className="text-2xl font-bold text-purple-900">{summary.recentUploads}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Selection Sidebar (for providers only) */}
        {!isPatient && (
          <div className="lg:col-span-1">
            <div className="patient-sidebar shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Patient</h3>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Patient List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`patient-item p-3 ${
                      selectedPatient?.id === patient.id ? 'selected' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={patient.avatar}
                        alt={patient.name}
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-500">ID: {patient.id}</p>
                        <p className="text-xs text-gray-500">Age: {patient.age}</p>
                      </div>
                      {selectedPatient?.id === patient.id && (
                        <ChevronRightIcon className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`${!isPatient ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {selectedPatient ? (
            <div className="bg-white shadow rounded-lg">
              {/* Patient Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                      src={selectedPatient.avatar}
                      alt={selectedPatient.name}
                    />
                    <div className="ml-4">
                      <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                      <p className="text-sm text-gray-500">Patient ID: {selectedPatient.id}</p>
                      <p className="text-sm text-gray-500">Age: {selectedPatient.age} years</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last Visit</p>
                      <p className="font-medium">{selectedPatient.lastVisit?.toLocaleDateString() || 'No visits'}</p>
                    </div>
                    
                    {/* Add Visit Button */}
                    {isDoctor && (
                      <button
                        onClick={() => setShowAddVisit(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Visit
                      </button>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <CalendarDaysIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <ArrowUpTrayIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="nav-tabs overflow-x-auto">
                <nav className="-mb-px flex space-x-2 md:space-x-8 px-6 min-w-max">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-tab whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'active' : ''}`}
                      >
                        <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base">{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <UserIcon className="mx-auto h-24 w-24 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {isPatient ? 'Loading your medical records...' : 'Select a Patient'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isPatient 
                  ? 'Please wait while we load your medical information.'
                  : 'Choose a patient from the sidebar to view their medical records.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Visit Modal */}
      <AddVisit
        isOpen={showAddVisit}
        onClose={() => setShowAddVisit(false)}
        onSave={handleAddVisit}
        patientId={selectedPatient?.id}
        patientName={selectedPatient?.name}
      />

      {/* Quick Patient Modal */}
      <QuickPatientModal
        isOpen={showQuickPatientModal}
        onClose={() => setShowQuickPatientModal(false)}
        onSuccess={handlePatientCreationSuccess}
      />
    </div>
  );
};

export default MedicalRecords;