import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  VideoCameraIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ComputerDesktopIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { parseConsultationLink, getMeetingData, formatMeetingTime, isLinkExpired } from '../utils/consultationUtils';

const JoinConsultation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceTests, setDeviceTests] = useState({
    camera: null,
    microphone: null,
    speakers: null
  });
  const [isJoining, setIsJoining] = useState(false);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    loadMeetingData();
  }, [location.search]);

  const loadMeetingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parse the consultation link
      const linkData = parseConsultationLink(window.location.href);
      
      if (!linkData || !linkData.room) {
        setError('Invalid consultation link. Please check the URL and try again.');
        return;
      }

      // Get meeting data
      const meeting = getMeetingData(linkData.room);
      
      if (!meeting) {
        setError('Consultation not found. The link may have expired or been cancelled.');
        return;
      }

      // Check if link has expired
      if (isLinkExpired(meeting.expiresAt)) {
        setError('This consultation link has expired. Please contact your healthcare provider for a new link.');
        return;
      }

      // Check if consultation time has passed
      const consultationTime = new Date(meeting.scheduledTime);
      const now = new Date();
      const timeDiff = consultationTime.getTime() - now.getTime();
      
      // Allow joining 15 minutes before and up to 1 hour after scheduled time
      const fifteenMinutesBefore = -15 * 60 * 1000;
      const oneHourAfter = 60 * 60 * 1000;
      
      if (timeDiff < fifteenMinutesBefore) {
        setError('This consultation has ended. Please contact your healthcare provider if you need to reschedule.');
        return;
      }

      if (timeDiff > oneHourAfter) {
        const timeUntilMeeting = Math.ceil(timeDiff / (1000 * 60));
        setError(`This consultation is not available yet. Please return ${timeUntilMeeting} minutes before your scheduled time: ${formatMeetingTime(meeting.scheduledTime)}`);
        return;
      }

      setMeetingData(meeting);
      setPatientName(meeting.patientName || '');
      
    } catch (err) {
      console.error('Error loading meeting data:', err);
      setError('Failed to load consultation details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setDeviceTests(prev => ({ ...prev, camera: 'success' }));
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Camera test failed:', error);
      setDeviceTests(prev => ({ ...prev, camera: 'failed' }));
    }
  };

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setDeviceTests(prev => ({ ...prev, microphone: 'success' }));
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Microphone test failed:', error);
      setDeviceTests(prev => ({ ...prev, microphone: 'failed' }));
    }
  };

  const testSpeakers = () => {
    // Simple speaker test - play a brief tone
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      setDeviceTests(prev => ({ ...prev, speakers: 'success' }));
    } catch (error) {
      console.error('Speaker test failed:', error);
      setDeviceTests(prev => ({ ...prev, speakers: 'failed' }));
    }
  };

  const joinConsultation = async () => {
    if (!meetingData) return;
    
    setIsJoining(true);
    
    // Simulate joining process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to video consultation with meeting data
    navigate('/app/telehealth/consultation', { 
      state: { 
        meetingData,
        patientMode: true,
        patientName: patientName 
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading consultation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Join Consultation</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={loadMeetingData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-500">
              Need help? Contact support at support@ehreezy.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <VideoCameraIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Video Consultation</h1>
            <p className="text-lg text-gray-600">You're about to join a consultation with {meetingData?.doctorName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consultation Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Consultation Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Doctor</p>
                  <p className="text-sm text-gray-600">{meetingData?.doctorName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Scheduled Time</p>
                  <p className="text-sm text-gray-600">{formatMeetingTime(meetingData?.scheduledTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <VideoCameraIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Meeting Type</p>
                  <p className="text-sm text-gray-600 capitalize">{meetingData?.type} • {meetingData?.duration} minutes</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ComputerDesktopIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Meeting ID</p>
                  <p className="text-sm font-mono text-gray-600">{meetingData?.id}</p>
                </div>
              </div>
            </div>

            {/* Patient Name Input */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name (as it will appear to the doctor)
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Device Tests & Join */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Device Check</h2>
            
            <div className="space-y-4 mb-6">
              {/* Camera Test */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <VideoCameraIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Camera</span>
                </div>
                <div className="flex items-center space-x-2">
                  {deviceTests.camera === 'success' && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                  {deviceTests.camera === 'failed' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  )}
                  <button
                    onClick={testCamera}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Microphone Test */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MicrophoneIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Microphone</span>
                </div>
                <div className="flex items-center space-x-2">
                  {deviceTests.microphone === 'success' && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                  {deviceTests.microphone === 'failed' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  )}
                  <button
                    onClick={testMicrophone}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Speakers Test */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SpeakerWaveIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Speakers</span>
                </div>
                <div className="flex items-center space-x-2">
                  {deviceTests.speakers === 'success' && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                  {deviceTests.speakers === 'failed' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  )}
                  <button
                    onClick={testSpeakers}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <button
              onClick={joinConsultation}
              disabled={!patientName.trim() || isJoining}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2"
            >
              {isJoining ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <PhoneIcon className="w-5 h-5" />
                  <span>Join Consultation</span>
                </>
              )}
            </button>

            {!patientName.trim() && (
              <p className="text-xs text-red-600 mt-2">Please enter your name before joining</p>
            )}

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Before You Join:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Find a quiet, well-lit location</li>
                <li>• Test your camera and microphone</li>
                <li>• Have your ID and insurance ready</li>
                <li>• Close other video call applications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinConsultation;