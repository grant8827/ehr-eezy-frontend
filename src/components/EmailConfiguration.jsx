import React, { useState, useEffect } from 'react';
import { emailService, emailQueue, validateEmail } from '../utils/emailService';

const EmailConfiguration = () => {
  const [config, setConfig] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpSecure: false,
    smtpUser: '',
    smtpPassword: '',
    fromName: 'EHR Eezy System',
    fromEmail: '',
    clinicName: '',
    clinicPhone: '',
    clinicEmail: '',
    clinicAddress: ''
  });

  const [testEmail, setTestEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queueStats, setQueueStats] = useState({ pending: 0, sent: 0, failed: 0 });

  useEffect(() => {
    // Load configuration from localStorage or API
    const savedConfig = localStorage.getItem('emailConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    // Update queue stats periodically
    const interval = setInterval(() => {
      setQueueStats(emailQueue.getQueueStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const saveConfiguration = () => {
    localStorage.setItem('emailConfig', JSON.stringify(config));
    setEmailStatus({ type: 'success', message: 'Email configuration saved successfully!' });
    setTimeout(() => setEmailStatus(null), 3000);
  };

  const testEmailConnection = async () => {
    if (!validateEmail(testEmail)) {
      setEmailStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    try {
      const result = await emailService.sendPasswordReset({
        name: 'Test User',
        email: testEmail,
        resetLink: `${window.location.origin}/reset-password?token=test123`
      });

      if (result.success) {
        setEmailStatus({ type: 'success', message: 'Test email sent successfully!' });
      } else {
        setEmailStatus({ type: 'error', message: `Failed to send test email: ${result.error}` });
      }
    } catch (error) {
      setEmailStatus({ type: 'error', message: `Email test failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const sendSampleInvitation = async () => {
    if (!validateEmail(testEmail)) {
      setEmailStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    try {
      const result = await emailService.sendPatientInvitation({
        name: 'John Doe',
        email: testEmail,
        portalLink: `${window.location.origin}/patient-portal`,
        tempPassword: 'TempPass123!',
        clinicPhone: config.clinicPhone || '(555) 123-4567',
        clinicEmail: config.clinicEmail || 'support@ehrEezy.com'
      });

      if (result.success) {
        setEmailStatus({ type: 'success', message: 'Sample patient invitation sent successfully!' });
      } else {
        setEmailStatus({ type: 'error', message: `Failed to send invitation: ${result.error}` });
      }
    } catch (error) {
      setEmailStatus({ type: 'error', message: `Invitation sending failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Configuration</h1>
          <p className="text-gray-600 mt-1">Configure SMTP settings and email templates</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={saveConfiguration}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>💾</span>
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Status Message */}
      {emailStatus && (
        <div className={`p-4 rounded-lg ${
          emailStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {emailStatus.message}
        </div>
      )}

      {/* Email Queue Stats */}
      <div className="medical-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Queue Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-600 text-2xl font-bold">{queueStats.pending}</p>
            <p className="text-yellow-600 text-sm font-medium">Pending</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-green-600 text-2xl font-bold">{queueStats.sent}</p>
            <p className="text-green-600 text-sm font-medium">Sent</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-2xl font-bold">{queueStats.failed}</p>
            <p className="text-red-600 text-sm font-medium">Failed</p>
          </div>
        </div>
      </div>

      {/* SMTP Configuration */}
      <div className="medical-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">SMTP Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host *
            </label>
            <input
              type="text"
              value={config.smtpHost}
              onChange={(e) => handleConfigChange('smtpHost', e.target.value)}
              placeholder="smtp.gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port *
            </label>
            <input
              type="number"
              value={config.smtpPort}
              onChange={(e) => handleConfigChange('smtpPort', e.target.value)}
              placeholder="587"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Username *
            </label>
            <input
              type="email"
              value={config.smtpUser}
              onChange={(e) => handleConfigChange('smtpUser', e.target.value)}
              placeholder="your-email@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Password *
            </label>
            <input
              type="password"
              value={config.smtpPassword}
              onChange={(e) => handleConfigChange('smtpPassword', e.target.value)}
              placeholder="App password or regular password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.smtpSecure}
                onChange={(e) => handleConfigChange('smtpSecure', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Use SSL/TLS Security</span>
            </label>
          </div>
        </div>
      </div>

      {/* Sender Information */}
      <div className="medical-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sender Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Name *
            </label>
            <input
              type="text"
              value={config.fromName}
              onChange={(e) => handleConfigChange('fromName', e.target.value)}
              placeholder="EHR Eezy System"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email *
            </label>
            <input
              type="email"
              value={config.fromEmail}
              onChange={(e) => handleConfigChange('fromEmail', e.target.value)}
              placeholder="noreply@ehrEezy.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Clinic Information */}
      <div className="medical-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Clinic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Name
            </label>
            <input
              type="text"
              value={config.clinicName}
              onChange={(e) => handleConfigChange('clinicName', e.target.value)}
              placeholder="Your Clinic Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Phone
            </label>
            <input
              type="tel"
              value={config.clinicPhone}
              onChange={(e) => handleConfigChange('clinicPhone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Email
            </label>
            <input
              type="email"
              value={config.clinicEmail}
              onChange={(e) => handleConfigChange('clinicEmail', e.target.value)}
              placeholder="support@yourclinic.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Address
            </label>
            <input
              type="text"
              value={config.clinicAddress}
              onChange={(e) => handleConfigChange('clinicAddress', e.target.value)}
              placeholder="123 Main St, City, State 12345"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Email Testing */}
      <div className="medical-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Email Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={testEmailConnection}
              disabled={loading || !testEmail}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>🔧</span>
              )}
              <span>Test Connection</span>
            </button>

            <button
              onClick={sendSampleInvitation}
              disabled={loading || !testEmail}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>📧</span>
              )}
              <span>Send Sample Invitation</span>
            </button>
          </div>
        </div>
      </div>

      {/* SMTP Setup Guide */}
      <div className="medical-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📚 SMTP Setup Guide</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Gmail Setup:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Host: smtp.gmail.com, Port: 587</li>
              <li>Enable 2-factor authentication on your Google account</li>
              <li>Generate an "App Password" in your Google Account settings</li>
              <li>Use your email and the App Password as credentials</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">SendGrid Setup:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Host: smtp.sendgrid.net, Port: 587</li>
              <li>Username: apikey (literally "apikey")</li>
              <li>Password: Your SendGrid API key</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Office 365 Setup:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Host: smtp.office365.com, Port: 587</li>
              <li>Use your Office 365 email and password</li>
              <li>Enable SMTP AUTH in your Office 365 admin panel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfiguration;