import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BellIcon,
  PhoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);

  // Mock data for patient dashboard
  const [dashboardData] = useState({
    upcomingAppointments: [
      {
        id: 1,
        date: '2025-10-25',
        time: '10:00 AM',
        doctor: 'Dr. Sarah Johnson',
        type: 'Routine Checkup',
        location: 'Room 101',
        status: 'confirmed'
      },
      {
        id: 2,
        date: '2025-11-01',
        time: '2:30 PM',
        doctor: 'Dr. Michael Chen',
        type: 'Follow-up',
        location: 'Telehealth',
        status: 'pending'
      }
    ],
    recentMessages: [
      {
        id: 1,
        from: 'Dr. Sarah Johnson',
        subject: 'Lab Results Available',
        preview: 'Your recent lab results are now available for review...',
        time: '2 hours ago',
        unread: true,
        urgent: false
      },
      {
        id: 2,
        from: 'EHReezy Team',
        subject: 'Appointment Reminder',
        preview: 'Don\'t forget your appointment tomorrow at 10:00 AM...',
        time: '1 day ago',
        unread: false,
        urgent: false
      }
    ],
    healthMetrics: {
      lastVisit: '2025-10-15',
      nextAppointment: '2025-10-25',
      prescriptions: 3,
      labResults: 2
    },
    healthTips: [
      {
        title: 'Stay Hydrated',
        content: 'Aim for 8 glasses of water daily to maintain optimal health.'
      },
      {
        title: 'Regular Exercise',
        content: 'At least 30 minutes of moderate exercise 5 times a week.'
      },
      {
        title: 'Balanced Diet',
        content: 'Include plenty of fruits, vegetables, and whole grains in your meals.'
      }
    ]
  });

  useEffect(() => {
    // Simulate loading patient data
    const loadPatientData = async () => {
      try {
        // In a real app, fetch patient-specific data from API
        setPatientData({
          id: user?.id,
          name: `${user?.first_name} ${user?.last_name}`,
          email: user?.email,
          phone: user?.phone || 'Not provided',
          dateOfBirth: user?.date_of_birth || 'Not provided',
          patientId: `PAT${String(user?.id).padStart(6, '0')}`
        });
      } catch (error) {
        console.error('Error loading patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {getGreeting()}, {user?.first_name}! 👋
            </h1>
            <p className="text-gray-600">Welcome to your patient portal</p>
            <p className="text-sm text-gray-500">Patient ID: {patientData?.patientId}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Appointment</p>
              <p className="text-lg font-semibold text-gray-900">Oct 25</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Prescriptions</p>
              <p className="text-lg font-semibold text-gray-900">{dashboardData.healthMetrics.prescriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">New Messages</p>
              <p className="text-lg font-semibold text-gray-900">
                {dashboardData.recentMessages.filter(m => m.unread).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lab Results</p>
              <p className="text-lg font-semibold text-gray-900">{dashboardData.healthMetrics.labResults}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{appointment.type}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.doctor}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time} • {appointment.location}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {appointment.location === 'Telehealth' ? (
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <VideoCameraIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <PhoneIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/app/appointments')}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                View All Appointments
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/app/appointments?book=true')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Book Appointment</span>
              </button>
              
              <button 
                onClick={() => navigate('/app/medical-records')}
                className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <DocumentTextIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">View Medical Records</span>
              </button>
              
              <button 
                onClick={() => navigate('/app/messages')}
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Send Message</span>
              </button>
              
              <button 
                onClick={() => navigate('/app/telehealth/consultation')}
                className="w-full flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <VideoCameraIcon className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">Join Telehealth</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Messages & Health Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recentMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{message.from}</p>
                      {message.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{message.subject}</p>
                    <p className="text-xs text-gray-500 truncate">{message.preview}</p>
                    <p className="text-xs text-gray-400">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/app/messages')}
                className="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                View All Messages
              </button>
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Health Tips</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.healthTips.map((tip, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;