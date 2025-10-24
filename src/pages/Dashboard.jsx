import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../services/patientService';
import dashboardService from '../services/dashboardService';
import QuickPatientModal from '../components/modals/QuickPatientModal';
import QuickPrescriptionModal from '../components/modals/QuickPrescriptionModal';
import QuickReportModal from '../components/modals/QuickReportModal';
import PatientDashboard from './PatientDashboard';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, isDoctor, isPatient, isAdmin, isReceptionist, isNurse } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [realPatientCount, setRealPatientCount] = useState(0);
  
  // Modal states
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [dashboardStats, setDashboardStats] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  // Load dashboard data from backend
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userRole = getUserRole();
        const userId = user?.id;

        // Load dashboard stats
        const stats = await dashboardService.getFormattedStats(userRole, userId);
        setDashboardStats(stats);

        // Load today's appointments
        const appointments = await dashboardService.getTodaysAppointments(userId, userRole);
        setTodaysAppointments(appointments);

        // Load recent messages
        const messages = dashboardService.getRecentMessages(5);
        setRecentMessages(messages);

        // Get real patient count for fallback
        const patientsData = await patientService.getAllPatients();
        setRealPatientCount(patientsData?.length || 0);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setRealPatientCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Get user role helper
  const getUserRole = () => {
    if (isDoctor) return 'doctor';
    if (isPatient) return 'patient';
    return 'admin'; // Default for admin/receptionist/nurse
  };
  
  // Recent appointments are now loaded in useEffect as todaysAppointments
  // Recent messages are now loaded in useEffect as recentMessages

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick action handlers
  const handleCreatePatient = () => {
    setShowPatientModal(true);
  };

  const handleSendPrescription = () => {
    setShowPrescriptionModal(true);
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  const handleScheduleAppointment = () => {
    navigate('/app/appointments?create=true');
  };

  // Map icon names to actual icon components
  const getIconComponent = (iconName) => {
    const iconMap = {
      CalendarDaysIcon,
      UserGroupIcon,
      DocumentTextIcon,
      CurrencyDollarIcon,
      ChatBubbleLeftRightIcon,
      ClockIcon
    };
    return iconMap[iconName] || CalendarDaysIcon;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Debug role detection
  console.log('🔍 Dashboard Role Debug:', {
    user,
    isPatient,
    isDoctor,
    isAdmin,
    userRole: user?.role
  });

  // Show patient dashboard for patients
  if (isPatient) {
    console.log('✅ Showing PatientDashboard for patient');
    return <PatientDashboard />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {getGreeting()}, {user?.first_name}! 👋
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Here's what's happening with your {isPatient ? 'health records' : 'practice'} today.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            return (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{item.stat}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span
                      className={`font-medium ${
                        item.changeType === 'increase'
                          ? 'text-green-600'
                          : item.changeType === 'decrease'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.change}
                    </span>
                    <span className="text-gray-500"> from last week</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`mt-8 grid grid-cols-1 gap-8 ${isPatient ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
        {/* Recent Appointments */}
        {!isPatient && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Today's Appointments
              </h3>
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {todaysAppointments.slice(0, 3).map((appointment) => (
                    <li key={appointment.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={appointment.patient.avatar}
                            alt={appointment.patient.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {appointment.patient.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {appointment.type} • {appointment.time}
                          </p>
                          <p className="text-xs text-gray-400">
                            {appointment.location} • {appointment.duration} min
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : appointment.status === 'waiting'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View all appointments
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Recent Messages */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Messages</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentMessages.map((message) => (
                  <li key={message.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          message.fromType === 'doctor' ? 'bg-blue-100' :
                          message.fromType === 'patient' ? 'bg-green-100' :
                          'bg-purple-100'
                        }`}>
                          <ChatBubbleLeftRightIcon className={`h-5 w-5 ${
                            message.fromType === 'doctor' ? 'text-blue-600' :
                            message.fromType === 'patient' ? 'text-green-600' :
                            'text-purple-600'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{message.from}</p>
                          {message.isUrgent && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{message.subject}</p>
                        <p className="text-xs text-gray-400 truncate">{message.preview}</p>
                        <p className="text-xs text-gray-400">{message.time}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {message.unread && (
                          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        )}
                        {message.hasAttachment && (
                          <div className="text-gray-400">📎</div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="#"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all messages
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions for Doctors and Admins */}
        {!isPatient && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={handleCreatePatient}
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <UserGroupIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-blue-900">Create New Patient Record</span>
                </button>
                <button 
                  onClick={handleSendPrescription}
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-green-900">Send Prescription</span>
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <CurrencyDollarIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-purple-900">Generate Report</span>
                </button>
                <button 
                  onClick={handleScheduleAppointment}
                  className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <CalendarDaysIcon className="h-6 w-6 text-indigo-600 mr-3" />
                  <span className="text-sm font-medium text-indigo-900">Schedule Appointment</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions for Patients */}
        {isPatient && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <CalendarDaysIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-blue-900">Book Appointment</span>
                </button>
                <button className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-green-900">View Medical Records</span>
                </button>
                <button className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-purple-900">Send Message</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Health Tips for Patients */}
      {isPatient && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Health Tip of the Day</h3>
          <p className="text-gray-700">
            Remember to stay hydrated! Aim for at least 8 glasses of water daily to maintain optimal health and support your body's natural functions.
          </p>
        </div>
      )}

      {/* Quick Action Modals */}
      <QuickPatientModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSuccess={() => {
          // Refresh patient count or show success message
          console.log('Patient created successfully');
        }}
      />

      <QuickPrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        onSuccess={() => {
          console.log('Prescription sent successfully');
        }}
      />

      <QuickReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSuccess={() => {
          console.log('Report generated successfully');
        }}
      />
    </div>
  );
};

export default Dashboard;