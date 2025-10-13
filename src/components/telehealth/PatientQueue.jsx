import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  ClockIcon,
  PhoneIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  HeartIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const PatientQueue = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      patientId: 'PAT-001',
      appointmentTime: '2:00 PM',
      waitTime: 15,
      status: 'waiting', // waiting, called, in-consultation, completed
      priority: 'normal', // normal, urgent, emergency
      reason: 'Follow-up consultation',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c000?w=100&h=100&fit=crop&crop=face',
      lastVisit: '2025-09-15',
      age: 34,
      phone: '+1 (555) 123-4567',
      notes: 'Patient has been experiencing mild symptoms'
    },
    {
      id: 2,
      name: 'Michael Chen',
      patientId: 'PAT-002',
      appointmentTime: '2:15 PM',
      waitTime: 8,
      status: 'waiting',
      priority: 'urgent',
      reason: 'Urgent care consultation',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      lastVisit: '2025-10-01',
      age: 42,
      phone: '+1 (555) 987-6543',
      notes: 'Requires immediate attention for chest pain'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      patientId: 'PAT-003',
      appointmentTime: '2:30 PM',
      waitTime: 5,
      status: 'called',
      priority: 'normal',
      reason: 'Medication review',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      lastVisit: '2025-09-20',
      age: 28,
      phone: '+1 (555) 456-7890',
      notes: 'Regular medication check-up'
    },
    {
      id: 4,
      name: 'David Thompson',
      patientId: 'PAT-004',
      appointmentTime: '2:45 PM',
      waitTime: 0,
      status: 'waiting',
      priority: 'normal',
      reason: 'General consultation',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      lastVisit: '2025-08-30',
      age: 55,
      phone: '+1 (555) 234-5678',
      notes: 'New patient consultation'
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [queueFilter, setQueueFilter] = useState('all'); // all, waiting, called, urgent

  // Update wait times every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setPatients(prevPatients =>
        prevPatients.map(patient => ({
          ...patient,
          waitTime: patient.status === 'waiting' ? patient.waitTime + 1 : patient.waitTime
        }))
      );
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Filter patients based on selected filter
  const filteredPatients = patients.filter(patient => {
    switch (queueFilter) {
      case 'waiting':
        return patient.status === 'waiting';
      case 'called':
        return patient.status === 'called';
      case 'urgent':
        return patient.priority === 'urgent' || patient.priority === 'emergency';
      default:
        return true;
    }
  });

  // Update patient status
  const updatePatientStatus = (patientId, newStatus) => {
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === patientId ? { ...patient, status: newStatus } : patient
      )
    );
  };

  // Start consultation
  const startConsultation = (patient) => {
    updatePatientStatus(patient.id, 'in-consultation');
    // Navigate to video consultation with patient data
    console.log('Starting consultation with:', patient.name);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'called':
        return 'bg-blue-100 text-blue-800';
      case 'in-consultation':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Queue statistics
  const queueStats = {
    total: patients.length,
    waiting: patients.filter(p => p.status === 'waiting').length,
    inConsultation: patients.filter(p => p.status === 'in-consultation').length,
    avgWaitTime: Math.round(
      patients.filter(p => p.status === 'waiting').reduce((acc, p) => acc + p.waitTime, 0) /
      patients.filter(p => p.status === 'waiting').length || 0
    ),
    urgent: patients.filter(p => p.priority === 'urgent' || p.priority === 'emergency').length
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Queue</h1>
        <p className="text-gray-600">Manage waiting patients and consultation schedule</p>
      </div>

      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{queueStats.total}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Waiting</p>
              <p className="text-2xl font-bold text-yellow-600">{queueStats.waiting}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Consultation</p>
              <p className="text-2xl font-bold text-green-600">{queueStats.inConsultation}</p>
            </div>
            <VideoCameraIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{queueStats.urgent}</p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Wait Time</p>
              <p className="text-2xl font-bold text-purple-600">{queueStats.avgWaitTime}m</p>
            </div>
            <ClockIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setQueueFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            queueFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Patients ({patients.length})
        </button>
        <button
          onClick={() => setQueueFilter('waiting')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            queueFilter === 'waiting'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Waiting ({queueStats.waiting})
        </button>
        <button
          onClick={() => setQueueFilter('urgent')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            queueFilter === 'urgent'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Urgent ({queueStats.urgent})
        </button>
      </div>

      {/* Patient Queue List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Current Queue</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Patient Avatar */}
                  <div className="relative">
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {patient.priority === 'urgent' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
                        {patient.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <IdentificationIcon className="w-4 h-4" />
                        <span>{patient.patientId}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span>{patient.appointmentTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>Waiting {patient.waitTime}m</span>
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">{patient.reason}</p>
                      {patient.notes && (
                        <p className="text-xs text-gray-500 mt-1">{patient.notes}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="View Details"
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    title="Send Message"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                    title="Call Patient"
                    onClick={() => updatePatientStatus(patient.id, 'called')}
                  >
                    <PhoneIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => startConsultation(patient)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <VideoCameraIcon className="w-5 h-5" />
                    <span>Start</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
            <p className="text-gray-600">All patients have been seen or there are no scheduled appointments.</p>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Patient Details</h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={selectedPatient.avatar}
                  alt={selectedPatient.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-gray-600">{selectedPatient.patientId}</p>
                  <p className="text-sm text-gray-500">Age: {selectedPatient.age}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <p className="text-sm text-gray-600 mb-1">Phone: {selectedPatient.phone}</p>
                  <p className="text-sm text-gray-600">Last Visit: {selectedPatient.lastVisit}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Appointment Details</h4>
                  <p className="text-sm text-gray-600 mb-1">Time: {selectedPatient.appointmentTime}</p>
                  <p className="text-sm text-gray-600 mb-1">Reason: {selectedPatient.reason}</p>
                  <p className="text-sm text-gray-600">Wait Time: {selectedPatient.waitTime} minutes</p>
                </div>
              </div>

              {selectedPatient.notes && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedPatient.notes}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    startConsultation(selectedPatient);
                    setSelectedPatient(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <VideoCameraIcon className="w-5 h-5" />
                  <span>Start Consultation</span>
                </button>
                
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientQueue;