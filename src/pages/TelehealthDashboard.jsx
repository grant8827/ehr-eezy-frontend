import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailInvitation from '../components/EmailInvitation';
import {
  VideoCameraIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PhoneIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  HeartIcon,
  SignalIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import {
  VideoCameraIcon as VideoCameraIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  ChartBarIcon as ChartBarIconSolid
} from '@heroicons/react/24/solid';

// Import telehealth components
import VideoConsultation from '../components/telehealth/VideoConsultation';
import TelehealthScheduling from '../components/telehealth/TelehealthScheduling';
import SecureMessaging from '../components/telehealth/SecureMessaging';
import PatientQueue from '../components/telehealth/PatientQueue';
import TelehealthAnalytics from '../components/telehealth/TelehealthAnalytics';
import TelehealthSettings from '../components/telehealth/TelehealthSettings';

const TelehealthDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activePatients, setActivePatients] = useState(0);
  const [waitingPatients, setWaitingPatients] = useState(3);
  const [systemStatus, setSystemStatus] = useState('online');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEmailInvitation, setShowEmailInvitation] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for dashboard stats
  const dashboardStats = {
    today: {
      appointments: 12,
      completed: 8,
      cancelled: 1,
      noShow: 0,
      revenue: 2400
    },
    thisWeek: {
      appointments: 47,
      completed: 38,
      avgDuration: 25,
      patientSatisfaction: 4.8
    },
    activeConsultations: 2,
    waitingRoom: 3,
    nextAppointment: '2:30 PM',
    systemHealth: 98.5
  };

  // Navigation items
  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/app/telehealth',
      icon: ChartBarIcon,
      activeIcon: ChartBarIconSolid,
      exact: true
    },
    {
      name: 'Video Consultation',
      path: '/app/telehealth/consultation',
      icon: VideoCameraIcon,
      activeIcon: VideoCameraIconSolid
    },
    {
      name: 'Scheduling',
      path: '/app/telehealth/scheduling',
      icon: CalendarDaysIcon,
      activeIcon: CalendarDaysIconSolid
    },
    {
      name: 'Messages',
      path: '/app/telehealth/messages',
      icon: ChatBubbleLeftRightIcon,
      activeIcon: ChatBubbleLeftRightIconSolid
    },
    {
      name: 'Patient Queue',
      path: '/app/telehealth/queue',
      icon: UserGroupIcon,
      activeIcon: UserGroupIcon
    },
    {
      name: 'Analytics',
      path: '/app/telehealth/analytics',
      icon: ChartBarIcon,
      activeIcon: ChartBarIconSolid
    },
    {
      name: 'Settings',
      path: '/app/telehealth/settings',
      icon: Cog6ToothIcon,
      activeIcon: Cog6ToothIcon
    }
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'online': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'offline': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const handleEmailInvitation = () => {
    setShowEmailInvitation(true);
  };

  const handleEmailInvitationSent = (meetingData) => {
    console.log('Email invitation sent:', meetingData);
    setShowEmailInvitation(false);
    // Show success message
    setTimeout(() => {
      alert(`✅ Consultation invitation sent successfully to ${meetingData.patientEmail}!\n\nMeeting ID: ${meetingData.id}\nScheduled: ${new Date(meetingData.scheduledTime).toLocaleString()}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Telehealth</h1>
              <p className="text-sm text-gray-500">Healthcare Platform</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 ${getSystemStatusColor()} rounded-full animate-pulse`}></div>
              <span className="text-sm font-medium text-gray-700">System Status</span>
            </div>
            <WifiIcon className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1 capitalize">{systemStatus} - All systems operational</p>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{activePatients}</div>
              <div className="text-xs text-blue-500">Active Now</div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="text-xl font-bold text-amber-600">{waitingPatients}</div>
              <div className="text-xs text-amber-500">Waiting</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.path, item.exact);
              const Icon = isActive ? item.activeIcon : item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {user?.first_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {location.pathname === '/app/telehealth' ? 'Dashboard Overview' :
                 location.pathname.includes('consultation') ? 'Video Consultation' :
                 location.pathname.includes('scheduling') ? 'Appointment Scheduling' :
                 location.pathname.includes('messages') ? 'Secure Messaging' :
                 location.pathname.includes('queue') ? 'Patient Queue' :
                 location.pathname.includes('analytics') ? 'Analytics & Reports' :
                 location.pathname.includes('settings') ? 'Telehealth Settings' :
                 'Telehealth'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Current Time */}
              <div className="flex items-center space-x-2 text-gray-600">
                <ClockIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {/* Emergency Button */}
              <button className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                <PhoneIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Emergency</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* Dashboard Overview */}
            <Route path="/" element={
              <div className="p-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Link to="/app/telehealth/consultation" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <VideoCameraIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Start Consultation</h3>
                        <p className="text-sm text-gray-500">Begin video call</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/app/telehealth/scheduling" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CalendarDaysIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Schedule Appointment</h3>
                        <p className="text-sm text-gray-500">Book new session</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/app/telehealth/messages" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Secure Messages</h3>
                        <p className="text-sm text-gray-500">Patient communication</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/app/telehealth/queue" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Patient Queue</h3>
                        <p className="text-sm text-gray-500">{waitingPatients} waiting</p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Today's Stats */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Appointments</span>
                        <span className="font-semibold">{dashboardStats.today.appointments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-semibold text-green-600">{dashboardStats.today.completed}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Revenue</span>
                        <span className="font-semibold text-blue-600">${dashboardStats.today.revenue}</span>
                      </div>
                    </div>
                  </div>

                  {/* System Health */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Uptime</span>
                        <span className="font-semibold text-green-600">{dashboardStats.systemHealth}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Active Consultations</span>
                        <span className="font-semibold">{dashboardStats.activeConsultations}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Next Appointment</span>
                        <span className="font-semibold text-blue-600">{dashboardStats.nextAppointment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                        <DocumentTextIcon className="w-4 h-4" />
                        <span>Create New Patient Record</span>
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                        <ClipboardDocumentIcon className="w-4 h-4" />
                        <span>Send Prescription</span>
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                        <ChartBarIcon className="w-4 h-4" />
                        <span>Generate Report</span>
                      </button>
                      <button 
                        onClick={handleEmailInvitation}
                        className="w-full text-left px-3 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg flex items-center space-x-2 font-semibold transition-colors"
                      >
                        <VideoCameraIcon className="w-4 h-4" />
                        <span>📧 SEND EMAIL INVITATION</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Consultation completed with John Doe</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New appointment scheduled for 3:00 PM</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New message from Sarah Johnson</p>
                        <p className="text-xs text-gray-500">10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* Route Components */}
            <Route path="/consultation/*" element={<VideoConsultation />} />
            <Route path="/scheduling/*" element={<TelehealthScheduling />} />
            <Route path="/messages/*" element={<SecureMessaging />} />
            <Route path="/queue/*" element={<PatientQueue />} />
            <Route path="/analytics/*" element={<TelehealthAnalytics />} />
            <Route path="/settings/*" element={<TelehealthSettings />} />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/app/telehealth" replace />} />
          </Routes>
        </main>
      </div>
      
      {/* Email Invitation Modal */}
      <EmailInvitation 
        isOpen={showEmailInvitation}
        onClose={() => setShowEmailInvitation(false)}
        patientData={null}
        onSent={handleEmailInvitationSent}
      />
    </div>
  );
};

export default TelehealthDashboard;