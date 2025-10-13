import React, { useState } from 'react';
import {
  Cog6ToothIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  BellIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  WifiIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TelehealthSettings = () => {
  const [activeTab, setActiveTab] = useState('general'); // general, audio-video, notifications, security, billing
  const [settings, setSettings] = useState({
    general: {
      defaultSessionDuration: 30,
      autoRecordSessions: false,
      allowScreenSharing: true,
      waitingRoomEnabled: true,
      maxPatientsInQueue: 10,
      sessionBufferTime: 5
    },
    audioVideo: {
      videoQuality: 'HD',
      audioQuality: 'High',
      enableNoiseReduction: true,
      autoMuteParticipants: false,
      defaultCameraState: 'on',
      defaultMicState: 'on'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      sessionStartNotification: true,
      patientJoinedNotification: true,
      reminderTimeBeforeAppointment: 60
    },
    security: {
      endToEndEncryption: true,
      requirePatientVerification: true,
      sessionTimeout: 30,
      allowGuestUsers: false,
      hipaaCompliance: true,
      auditLogging: true
    },
    billing: {
      defaultConsultationFee: 150,
      allowInsuranceBilling: true,
      requirePaymentBeforeSession: false,
      automaticInvoiceGeneration: true,
      taxRate: 8.5
    }
  });

  const [testResults, setTestResults] = useState({
    camera: null,
    microphone: null,
    speakers: null,
    internet: null,
    bandwidth: null
  });

  const [isTestingDevices, setIsTestingDevices] = useState(false);

  // Handle setting changes
  const updateSetting = (category, key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [key]: value
      }
    }));
  };

  // Test devices
  const testDevices = async () => {
    setIsTestingDevices(true);
    
    // Simulate device testing
    setTimeout(() => {
      setTestResults({
        camera: 'passed',
        microphone: 'passed',
        speakers: 'passed',
        internet: 'passed',
        bandwidth: '25.3 Mbps'
      });
      setIsTestingDevices(false);
    }, 3000);
  };

  // Get test result icon
  const getTestIcon = (result) => {
    if (result === 'passed') {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    } else if (result === 'failed') {
      return <XMarkIcon className="w-5 h-5 text-red-500" />;
    } else if (result === 'warning') {
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    }
    return <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />;
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'audio-video', name: 'Audio & Video', icon: VideoCameraIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CurrencyDollarIcon }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Telehealth Settings</h1>
        <p className="text-gray-600">Configure your telehealth platform preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <nav className="space-y-1 p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Device Test */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">System Test</h3>
              <button
                onClick={testDevices}
                disabled={isTestingDevices}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingDevices ? 'Testing...' : 'Test Devices'}
              </button>
              
              {Object.keys(testResults).some(key => testResults[key]) && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Camera</span>
                    {getTestIcon(testResults.camera)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Microphone</span>
                    {getTestIcon(testResults.microphone)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Speakers</span>
                    {getTestIcon(testResults.speakers)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Internet</span>
                    {getTestIcon(testResults.internet)}
                  </div>
                  {testResults.bandwidth && (
                    <div className="text-xs text-gray-500 mt-2">
                      Bandwidth: {testResults.bandwidth}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Session Duration (minutes)
                    </label>
                    <select
                      value={settings.general.defaultSessionDuration}
                      onChange={(e) => updateSetting('general', 'defaultSessionDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Buffer Time (minutes)
                    </label>
                    <select
                      value={settings.general.sessionBufferTime}
                      onChange={(e) => updateSetting('general', 'sessionBufferTime', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No buffer</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Patients in Queue
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={settings.general.maxPatientsInQueue}
                      onChange={(e) => updateSetting('general', 'maxPatientsInQueue', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Auto-record Sessions</label>
                        <p className="text-xs text-gray-500">Automatically start recording when session begins</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.general.autoRecordSessions}
                        onChange={(e) => updateSetting('general', 'autoRecordSessions', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Allow Screen Sharing</label>
                        <p className="text-xs text-gray-500">Enable screen sharing during consultations</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.general.allowScreenSharing}
                        onChange={(e) => updateSetting('general', 'allowScreenSharing', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Waiting Room</label>
                        <p className="text-xs text-gray-500">Enable virtual waiting room for patients</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.general.waitingRoomEnabled}
                        onChange={(e) => updateSetting('general', 'waitingRoomEnabled', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audio & Video Settings */}
            {activeTab === 'audio-video' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Audio & Video Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Quality
                      </label>
                      <select
                        value={settings.audioVideo.videoQuality}
                        onChange={(e) => updateSetting('audioVideo', 'videoQuality', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SD">Standard (480p)</option>
                        <option value="HD">High Definition (720p)</option>
                        <option value="FHD">Full HD (1080p)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audio Quality
                      </label>
                      <select
                        value={settings.audioVideo.audioQuality}
                        onChange={(e) => updateSetting('audioVideo', 'audioQuality', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Standard">Standard</option>
                        <option value="High">High Quality</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Camera State
                      </label>
                      <select
                        value={settings.audioVideo.defaultCameraState}
                        onChange={(e) => updateSetting('audioVideo', 'defaultCameraState', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="on">Camera On</option>
                        <option value="off">Camera Off</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Microphone State
                      </label>
                      <select
                        value={settings.audioVideo.defaultMicState}
                        onChange={(e) => updateSetting('audioVideo', 'defaultMicState', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="on">Microphone On</option>
                        <option value="off">Microphone Off</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable Noise Reduction</label>
                        <p className="text-xs text-gray-500">Reduce background noise during calls</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.audioVideo.enableNoiseReduction}
                        onChange={(e) => updateSetting('audioVideo', 'enableNoiseReduction', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Auto-mute Participants</label>
                        <p className="text-xs text-gray-500">Automatically mute participants when they join</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.audioVideo.autoMuteParticipants}
                        onChange={(e) => updateSetting('audioVideo', 'autoMuteParticipants', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Time Before Appointment (minutes)
                    </label>
                    <select
                      value={settings.notifications.reminderTimeBeforeAppointment}
                      onChange={(e) => updateSetting('notifications', 'reminderTimeBeforeAppointment', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={1440}>24 hours</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                        <p className="text-xs text-gray-500">Send notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                        <p className="text-xs text-gray-500">Send notifications via text message</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Appointment Reminders</label>
                        <p className="text-xs text-gray-500">Automatic reminders before appointments</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.appointmentReminders}
                        onChange={(e) => updateSetting('notifications', 'appointmentReminders', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Session Start Notifications</label>
                        <p className="text-xs text-gray-500">Notify when consultation session starts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.sessionStartNotification}
                        onChange={(e) => updateSetting('notifications', 'sessionStartNotification', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Patient Joined Notifications</label>
                        <p className="text-xs text-gray-500">Notify when patient joins the session</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.patientJoinedNotification}
                        onChange={(e) => updateSetting('notifications', 'patientJoinedNotification', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">End-to-End Encryption</label>
                        <p className="text-xs text-gray-500">Encrypt all communications between participants</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Enabled</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">HIPAA Compliance</label>
                        <p className="text-xs text-gray-500">Ensure HIPAA compliant handling of data</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Compliant</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Require Patient Verification</label>
                        <p className="text-xs text-gray-500">Verify patient identity before joining session</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.requirePatientVerification}
                        onChange={(e) => updateSetting('security', 'requirePatientVerification', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Allow Guest Users</label>
                        <p className="text-xs text-gray-500">Allow patients to join without creating an account</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.allowGuestUsers}
                        onChange={(e) => updateSetting('security', 'allowGuestUsers', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Audit Logging</label>
                        <p className="text-xs text-gray-500">Log all system activities for compliance</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.auditLogging}
                        onChange={(e) => updateSetting('security', 'auditLogging', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Consultation Fee ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.billing.defaultConsultationFee}
                        onChange={(e) => updateSetting('billing', 'defaultConsultationFee', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.billing.taxRate}
                        onChange={(e) => updateSetting('billing', 'taxRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Allow Insurance Billing</label>
                        <p className="text-xs text-gray-500">Enable insurance claims processing</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.billing.allowInsuranceBilling}
                        onChange={(e) => updateSetting('billing', 'allowInsuranceBilling', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Require Payment Before Session</label>
                        <p className="text-xs text-gray-500">Require payment confirmation before consultation</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.billing.requirePaymentBeforeSession}
                        onChange={(e) => updateSetting('billing', 'requirePaymentBeforeSession', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Automatic Invoice Generation</label>
                        <p className="text-xs text-gray-500">Generate invoices automatically after sessions</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.billing.automaticInvoiceGeneration}
                        onChange={(e) => updateSetting('billing', 'automaticInvoiceGeneration', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Reset to Defaults
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelehealthSettings;