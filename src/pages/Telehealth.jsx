import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TelehealthScheduling from '../components/TelehealthScheduling';
import TelehealthMessaging from '../components/TelehealthMessaging';
import VideoCall from '../components/VideoCall';
import EmailInvitation from '../components/EmailInvitation';
import InvitationTracker from '../components/InvitationTracker';
import { initializeDemoData, generateSampleInvitations, clearSampleData } from '../utils/demoData';
import { 
  getTelehealthStats, 
  getTodaysAppointments, 
  getDashboardStats 
} from '../utils/dashboardData';
import {
  VideoCameraIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  SignalIcon,
  CameraIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  PhoneXMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  EnvelopeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  VideoCameraIcon as VideoCameraIconSolid,
  MicrophoneIcon as MicrophoneIconSolid,
} from '@heroicons/react/24/solid';

const TelehealthDashboard = () => {
  const { user, isDoctor, isPatient } = useAuth();
  
  // Debug authentication status
  console.log('TelehealthDashboard - Auth Status:', { user, isDoctor, isPatient });
  
  const [activeCall, setActiveCall] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showEmailInvitation, setShowEmailInvitation] = useState(false);
  const [selectedPatientForEmail, setSelectedPatientForEmail] = useState(null);
  const [invitationStats, setInvitationStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    todaysSent: 0
  });

  // Load invitation statistics and initialize demo data
  useEffect(() => {
    if (isDoctor) {
      initializeDemoData().then(() => {
        loadInvitationStats();
      });
    }
  }, [isDoctor]);

  const loadInvitationStats = () => {
    try {
      const meetings = JSON.parse(localStorage.getItem('consultationMeetings') || '[]');
      const doctorMeetings = meetings.filter(meeting => meeting.doctorId === 'doc_001');
      
      const today = new Date().toDateString();
      const todaysMeetings = doctorMeetings.filter(meeting => 
        new Date(meeting.createdAt).toDateString() === today
      );
      
      const pendingCount = doctorMeetings.filter(meeting => {
        const meetingTime = new Date(meeting.scheduledTime);
        return meetingTime > new Date() && !meeting.patientJoined;
      }).length;
      
      const confirmedCount = doctorMeetings.filter(meeting => 
        meeting.patientJoined || meeting.status === 'confirmed'
      ).length;
      
      setInvitationStats({
        total: doctorMeetings.length,
        pending: pendingCount,
        confirmed: confirmedCount,
        todaysSent: todaysMeetings.length
      });
    } catch (error) {
      console.error('Error loading invitation stats:', error);
    }
  };

  // Load consistent appointment data
  useEffect(() => {
    // Get appointments from shared data utility
    const todaysAppointments = getTodaysAppointments();
    setUpcomingAppointments(todaysAppointments);
  }, []);

  const startCall = (appointment) => {
    setActiveCall(appointment);
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sendEmailInvitation = (patientData = null) => {
    setSelectedPatientForEmail(patientData);
    setShowEmailInvitation(true);
  };

  const handleEmailInvitationSent = (meetingData) => {
    console.log('Email invitation sent:', meetingData);
    
    // Add the new appointment to the list
    const newAppointment = {
      id: meetingData.id,
      patient: {
        name: meetingData.patientName,
        email: meetingData.patientEmail,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100&h=100&fit=crop&crop=face',
      },
      doctor: {
        name: meetingData.doctorName,
        specialty: 'General Practice',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      },
      time: new Date(meetingData.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(meetingData.scheduledTime).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : 'Tomorrow',
      status: 'scheduled',
      type: meetingData.type || 'General Consultation',
      duration: meetingData.duration,
      emailSent: true,
      meetingData: meetingData
    };
    
    setUpcomingAppointments(prev => [newAppointment, ...prev]);
    setShowEmailInvitation(false);
    
    // Refresh invitation statistics
    loadInvitationStats();
    
    // Show success message
    setTimeout(() => {
      alert(`✅ Consultation invitation sent successfully to ${meetingData.patientEmail}!\n\nMeeting ID: ${meetingData.id}\nScheduled: ${new Date(meetingData.scheduledTime).toLocaleString()}`);
    }, 500);
  };

  if (activeCall) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Video Call Interface */}
        <div className="flex-1 relative">
          {/* Main video area */}
          <div className="absolute inset-0 bg-gray-800">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {isDoctor ? activeCall.patient.name : activeCall.doctor.name}
                </h3>
                <p className="text-gray-300">
                  {activeCall.type} • {activeCall.duration} minutes
                </p>
              </div>
            </div>
          </div>

          {/* Connection status */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400' : 
              connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <span className="text-white text-sm capitalize">{connectionStatus}</span>
            <SignalIcon className="w-4 h-4 text-white" />
          </div>

          {/* Call timer */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <span className="text-white text-sm font-mono">15:23</span>
          </div>

          {/* Picture-in-picture for own video */}
          <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white/20">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Call controls */}
        <div className="bg-gray-800 p-6">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-colors ${
                audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {audioEnabled ? (
                <MicrophoneIcon className="w-6 h-6 text-white" />
              ) : (
                <MicrophoneIconSolid className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {videoEnabled ? (
                <VideoCameraIcon className="w-6 h-6 text-white" />
              ) : (
                <VideoCameraIconSolid className="w-6 h-6 text-white" />
              )}
            </button>

            <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <SpeakerWaveIcon className="w-6 h-6 text-white" />
            </button>

            <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            >
              <PhoneXMarkIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Telehealth</h1>
              <p className="mt-1 text-sm text-gray-500">
                {isDoctor ? 'Manage virtual consultations' : 'Join your appointments'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>System Online</span>
              </div>
              
              {/* Debug Info */}
              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                Role: {user?.role || 'No Role'} | Doctor: {isDoctor ? 'Yes' : 'No'}
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => sendEmailInvitation()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  Send Email Invitation
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <CalendarDaysIcon className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {getTelehealthStats().map((stat, index) => {
            const iconColors = {
              blue: 'text-blue-600',
              green: 'text-green-600',
              purple: 'text-purple-600',
              orange: 'text-orange-600'
            };
            
            const IconComponent = {
              CalendarDaysIcon,
              PaperAirplaneIcon,
              EnvelopeIcon,
              CheckCircleIcon
            }[stat.icon] || CalendarDaysIcon;

            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <IconComponent className={`h-8 w-8 ${iconColors[stat.color]}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.stat}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invitation Tracker - Full Width */}
        {isDoctor && (
          <div className="mb-8">
            <InvitationTracker 
              onResendInvitation={(meeting) => {
                console.log('Invitation resent:', meeting);
                // Could update appointment list here if needed
              }}
              onCancelInvitation={(meeting) => {
                console.log('Invitation cancelled:', meeting);
                // Remove from appointments list
                setUpcomingAppointments(prev => 
                  prev.filter(apt => apt.meetingData?.id !== meeting.id)
                );
              }}
            />
          </div>
        )}

        {/* SEND EMAIL INVITATION - Main Action Button */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Send Video Consultation Invitation</h3>
                <p className="text-blue-100">Invite patients to join video consultations via email</p>
              </div>
              <button 
                onClick={() => sendEmailInvitation()}
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-lg font-semibold"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Send Email Invitation
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {isDoctor ? 'Patient Queue' : 'Your Appointments'}
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={isDoctor ? appointment.patient.avatar : appointment.doctor.avatar}
                          alt=""
                        />
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {isDoctor ? appointment.patient.name : appointment.doctor.name}
                          </h4>
                          <div className="flex items-center mt-1 space-x-2">
                            <p className="text-sm text-gray-500">{appointment.type}</p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm text-gray-500">{appointment.duration} min</p>
                          </div>
                          {isDoctor && (
                            <p className="text-xs text-gray-400 mt-1">
                              ID: {appointment.patient.id} • Age: {appointment.patient.age}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.date} at {appointment.time}
                            </p>
                            {appointment.emailSent && (
                              <EnvelopeIcon className="w-4 h-4 text-green-500" title="Email invitation sent" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{appointment.location}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          {appointment.status === 'scheduled' && !appointment.emailSent && (
                            <button
                              onClick={() => sendEmailInvitation({
                                name: appointment.patient.name,
                                email: appointment.patient.email || 'patient@example.com'
                              })}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                              <PaperAirplaneIcon className="w-3 h-3 mr-1" />
                              Send Link
                            </button>
                          )}
                          {appointment.status === 'waiting' && (
                            <button
                              onClick={() => startCall(appointment)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                              <VideoCameraIcon className="w-4 h-4 mr-1" />
                              Join
                            </button>
                          )}
                          {appointment.status === 'upcoming' && (
                            <button
                              onClick={() => startCall(appointment)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <VideoCameraIcon className="w-4 h-4 mr-1" />
                              Start
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions and system status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              
              {/* Big Test Button */}
              <div className="mb-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg">
                <button 
                  onClick={() => {
                    alert('Email invitation button is working!');
                    sendEmailInvitation();
                  }}
                  className="w-full flex items-center justify-center px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg text-lg font-bold"
                >
                  🚨 TEST: SEND EMAIL INVITATION 🚨
                </button>
                <p className="text-xs text-red-600 mt-2 text-center">
                  If you can see this red button, click it to test the invitation system!
                </p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <VideoCameraIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Start Instant Meeting
                </button>
                <button 
                  onClick={() => sendEmailInvitation()}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium"
                >
                  <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                  Send Email Invitation
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <CalendarDaysIcon className="w-5 h-5 mr-2 text-green-600" />
                  Schedule Appointment
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Send Message
                </button>
                
                {/* SEND EMAIL INVITATION - Prominently placed under Send Message */}
                <button 
                  onClick={() => sendEmailInvitation()}
                  className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-lg text-sm font-bold border-2 border-orange-500"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  📧 SEND EMAIL INVITATION
                </button>
                
                {/* Demo Data Management */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Demo Data</p>
                  <div className="space-y-2">
                    <button 
                      onClick={async () => {
                        await generateSampleInvitations();
                        loadInvitationStats();
                        alert('Sample invitations generated!');
                      }}
                      className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add Sample Data
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Clear all invitation data?')) {
                          clearSampleData();
                          loadInvitationStats();
                          alert('All data cleared!');
                        }
                      }}
                      className="w-full flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-white hover:bg-red-50"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Video Service</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Audio Service</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-700">Screen Sharing</span>
                  </div>
                  <span className="text-sm text-yellow-600 font-medium">Degraded</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Recording</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Operational</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Telehealth Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure good lighting and camera position</li>
                    <li>• Test audio/video before patient calls</li>
                    <li>• Have backup communication ready</li>
                    <li>• Keep patient records accessible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Invitation Modal */}
      <EmailInvitation 
        isOpen={showEmailInvitation}
        onClose={() => {
          setShowEmailInvitation(false);
          setSelectedPatientForEmail(null);
        }}
        patientData={selectedPatientForEmail}
        onSent={handleEmailInvitationSent}
      />
    </div>
  );
};

const Telehealth = () => {
  const location = useLocation();
  
  // Sub-navigation items
  const navigation = [
    { name: 'Dashboard', href: '/app/telehealth', exact: true },
    { name: 'Schedule', href: '/app/telehealth/schedule' },
    { name: 'Messages', href: '/app/telehealth/messages' },
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sub-navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive(item.href, item.exact)
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<TelehealthDashboard />} />
          <Route path="/schedule" element={<TelehealthScheduling />} />
          <Route path="/messages" element={<TelehealthMessaging />} />
        </Routes>
      </div>
    </div>
  );
};

export default Telehealth;