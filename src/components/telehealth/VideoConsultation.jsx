import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  VideoCameraIcon,
  VideoCameraSlashIcon,
  MicrophoneIcon,
  XMarkIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShareIcon,
  Cog6ToothIcon,
  UserIcon,
  ClockIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  CameraIcon,
  ComputerDesktopIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const VideoConsultation = () => {
  const { user, isPatient, isDoctor } = useAuth();
  const location = useLocation();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('excellent'); // excellent, good, poor
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [availablePatients, setAvailablePatients] = useState([
    { id: 'PAT-001', name: 'John Smith', appointmentTime: '10:00 AM', status: 'waiting' },
    { id: 'PAT-002', name: 'Sarah Johnson', appointmentTime: '10:30 AM', status: 'ready' },
    { id: 'PAT-003', name: 'Michael Brown', appointmentTime: '11:00 AM', status: 'scheduled' }
  ]);
  const [patientInfo, setPatientInfo] = useState({
    name: 'John Smith',
    age: 45,
    id: 'PAT-001',
    condition: 'Follow-up consultation',
    lastVisit: '2025-09-15',
    allergies: ['Penicillin'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg']
  });
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  
  // Transcription states
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callStartTime = useRef(null);
  const localStream = useRef(null);
  const recognitionRef = useRef(null);

  // Camera access and stream management
  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user' // Front-facing camera
        },
        audio: true
      });
      
      console.log('Camera access granted, setting up stream...');
      localStream.current = stream;
      
      // Wait for video element to be available and set stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Stream assigned to video element');
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, playing video...');
          videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
        };
      }
      
      // Update audio/video state based on actual stream tracks
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      
      if (videoTrack) {
        setIsVideoOn(videoTrack.enabled);
        console.log('Video track enabled:', videoTrack.enabled);
      }
      if (audioTrack) {
        setIsAudioOn(audioTrack.enabled);
        console.log('Audio track enabled:', audioTrack.enabled);
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera device found.';
      } else {
        errorMessage += 'Please check your camera and try again.';
      }
      alert(errorMessage);
      return null;
    }
  };

  const stopCamera = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        track.stop();
      });
      localStream.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Speech Recognition / Transcription functions
  const startTranscription = async () => {
    // First check and request microphone permissions
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted for transcription');
      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Microphone access is required for transcription. Please allow microphone permissions and try again.');
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Enhanced configuration
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log('✅ Transcription started successfully');
        setIsTranscribing(true);
        // Add a visual indicator that transcription is working
        setTranscript('🎤 Listening... Speak now to test transcription.');
      };
      
      recognition.onaudiostart = () => {
        console.log('🎤 Audio detection started');
      };

      recognition.onsoundstart = () => {
        console.log('🔊 Sound detected');
        setTranscript('🔊 Sound detected - processing speech...');
      };

      recognition.onspeechstart = () => {
        console.log('🗣️ Speech detected');
        setTranscript('🗣️ Speech detected - converting to text...');
      };
      
      recognition.onresult = (event) => {
        console.log('📝 Speech recognition result received');
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          console.log(`Result ${i}: "${transcriptPart}" (confidence: ${confidence}, final: ${event.results[i].isFinal})`);
          
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        // Update current transcript
        const currentText = finalTranscript + interimTranscript;
        setTranscript(currentText || '🎤 Keep speaking...');
        
        // Add to history when final
        if (finalTranscript.trim()) {
          const timestamp = new Date().toLocaleTimeString();
          console.log('✅ Adding final transcript to history:', finalTranscript.trim());
          setTranscriptHistory(prev => [...prev, {
            id: Date.now(),
            text: finalTranscript.trim(),
            timestamp,
            speaker: 'Doctor' // In a real app, you'd detect speaker
          }]);
          // Clear interim transcript after adding to history
          setTranscript('🎤 Listening...');
        }
      };
      
      recognition.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        let errorMessage = 'Transcription error: ';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage += 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'no-speech':
            errorMessage += 'No speech detected. Please speak louder or check your microphone.';
            setTranscript('🔇 No speech detected. Please speak louder...');
            return; // Don't show alert for no-speech, just update UI
          case 'audio-capture':
            errorMessage += 'Audio capture failed. Please check your microphone connection.';
            break;
          case 'network':
            errorMessage += 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage += event.error;
        }
        
        alert(errorMessage);
        setIsTranscribing(false);
      };
      
      recognition.onend = () => {
        console.log('🔴 Transcription session ended');
        setIsTranscribing(false);
        
        // Auto-restart if still in call and not manually stopped
        if (isCallActive && recognitionRef.current) {
          console.log('🔄 Auto-restarting transcription...');
          setTimeout(() => {
            if (recognitionRef.current && isCallActive) {
              try {
                recognition.start();
              } catch (error) {
                console.error('Failed to restart recognition:', error);
              }
            }
          }, 1000);
        } else {
          setTranscript('');
        }
      };
      
      recognitionRef.current = recognition;
      
      try {
        recognition.start();
        console.log('🚀 Starting speech recognition...');
      } catch (error) {
        console.error('Failed to start recognition:', error);
        alert('Failed to start transcription. Please try again.');
        setIsTranscribing(false);
      }
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for transcription features.');
    }
  };

  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsTranscribing(false);
    setTranscript('');
  };

  const toggleTranscription = () => {
    if (isTranscribing) {
      stopTranscription();
    } else {
      startTranscription();
    }
  };

  const clearTranscript = () => {
    setTranscriptHistory([]);
    setTranscript('');
  };

  const exportTranscript = () => {
    const transcriptText = transcriptHistory.map(entry => 
      `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`
    ).join('\n');
    
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle video track
  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    } else {
      setIsVideoOn(!isVideoOn);
    }
  };

  // Toggle audio track
  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    } else {
      setIsAudioOn(!isAudioOn);
    }
  };

  // Simulate call duration
  useEffect(() => {
    let interval;
    if (isCallActive) {
      callStartTime.current = Date.now();
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime.current) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Auto-start consultation for patients
  useEffect(() => {
    // Check if user came from join consultation link
    const navigationState = location.state;
    const isFromJoinLink = navigationState?.patientMode && navigationState?.meetingData;
    
    if (isFromJoinLink && !isCallActive && !selectedPatient) {
      console.log('Starting consultation from join link:', navigationState);
      
      // Create patient object from meeting data
      const patientData = {
        id: navigationState.meetingData.id || 'PATIENT-' + Date.now(),
        name: navigationState.patientName || navigationState.meetingData.patientName || 'Patient',
        type: navigationState.meetingData.type || 'Consultation',
        time: new Date().toLocaleTimeString(),
        status: 'active',
        meetingData: navigationState.meetingData
      };
      
      // Auto-start consultation from join link
      startConsultation(patientData);
    } else if (user && isPatient && !isCallActive && !selectedPatient && !isFromJoinLink) {
      console.log('Auto-starting consultation for logged-in patient:', user);
      
      // Create patient object from user data
      const patientData = {
        id: user.id || 'PATIENT-' + user.id,
        name: `${user.first_name} ${user.last_name}`,
        type: 'Patient Consultation',
        time: new Date().toLocaleTimeString(),
        status: 'active'
      };
      
      // Auto-start consultation for the patient
      startConsultation(patientData);
    }
  }, [user, isPatient, isCallActive, selectedPatient, location.state]);

  // Ensure video element gets the stream when video is turned on
  useEffect(() => {
    if (isVideoOn && localStream.current && videoRef.current) {
      if (videoRef.current.srcObject !== localStream.current) {
        videoRef.current.srcObject = localStream.current;
        console.log('Re-assigned stream to video element');
      }
    }
  }, [isVideoOn, isCallActive]);

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle starting/ending calls
  const handleCallToggle = () => {
    setIsCallActive(!isCallActive);
    if (!isCallActive) {
      // Reset call state when starting
      setCallDuration(0);
      setIsRecording(false);
      setIsScreenSharing(false);
    }
  };

  // Handle chat
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'doctor',
        timestamp: new Date(),
        senderName: 'Dr. Smith'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  // Add prescription
  const addPrescription = () => {
    const prescription = {
      id: Date.now(),
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setPrescriptions([...prescriptions, prescription]);
  };

  // Start consultation
  const startConsultation = async (patient) => {
    setSelectedPatient(patient);
    
    // Set patient info based on user role and meeting data
    const navigationState = location.state;
    const isFromJoinLink = navigationState?.patientMode && navigationState?.meetingData;
    
    if (isFromJoinLink) {
      // For patients coming from join link, use meeting data
      setPatientInfo({
        name: navigationState.patientName || navigationState.meetingData.patientName || patient.name,
        age: 'Not specified',
        id: navigationState.meetingData.id || patient.id,
        condition: `${navigationState.meetingData.type} Consultation` || 'Telehealth Consultation',
        lastVisit: 'Consultation via link',
        allergies: ['None specified'],
        medications: ['None specified']
      });
    } else if (isPatient && user) {
      // For logged-in patients, use their own information
      setPatientInfo({
        name: `${user.first_name} ${user.last_name}`,
        age: user.age || 'Not specified',
        id: user.id || `PAT-${user.id}`,
        condition: 'Telehealth Consultation',
        lastVisit: user.last_visit || 'First visit',
        allergies: user.allergies || ['None specified'],
        medications: user.medications || ['None specified']
      });
    } else {
      // For staff/doctors, use the selected patient info
      setPatientInfo({
        name: patient.name,
        age: Math.floor(Math.random() * 40) + 25, // Random age for demo
        id: patient.id,
        condition: 'Consultation',
        lastVisit: '2025-10-01',
        allergies: ['None known'],
        medications: ['As prescribed']
      });
    }
    
    // Start camera when consultation begins
    const stream = await startCamera();
    if (stream) {
      setIsCallActive(true);
      setShowStartDialog(false);
      console.log('Camera started successfully for consultation');
    } else {
      // If camera fails, still allow consultation but show warning
      setIsCallActive(true);
      setShowStartDialog(false);
      setIsVideoOn(false);
    }
  };

  // End consultation
  const endConsultation = () => {
    // Stop camera and transcription when consultation ends
    stopCamera();
    stopTranscription();
    
    setIsCallActive(false);
    setSelectedPatient(null);
    setCallDuration(0);
    setIsRecording(false);
    setIsScreenSharing(false);
    setChatMessages([]);
    setIsVideoOn(true);
    setIsAudioOn(true);
  };

  // Connection quality indicator
  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent':
        return <SignalIcon className="w-4 h-4 text-green-500" />;
      case 'good':
        return <SignalIcon className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <SignalIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Start Consultation Dialog - Only show for doctors/staff */}
      {showStartDialog && (isDoctor || !isPatient) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Start Video Consultation</h3>
            <div className="space-y-4">
              {availablePatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                        <span className="text-xs text-gray-500">#{patient.id}</span>
                      </div>
                      <p className="text-sm text-gray-600">{patient.type} - {patient.time}</p>
                      <div className="flex items-center mt-2 space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.status === 'waiting' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {patient.status}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Waiting: {Math.floor(Math.random() * 15) + 5}min
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <ClipboardDocumentListIcon className="h-3 w-3 mr-1" />
                          Reason: {patient.type === 'Follow-up' ? 'Follow-up appointment' : 'Initial consultation'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <button
                        onClick={() => startConsultation(patient)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                      >
                        <VideoCameraIcon className="h-4 w-4" />
                        <span>Video Call</span>
                      </button>
                      <button
                        onClick={() => startConsultation(patient)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                      >
                        <PhoneIcon className="h-4 w-4" />
                        <span>Audio Only</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowStartDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Consultation Interface (when no active call) */}
      {!isCallActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            {isPatient ? (
              /* Patient View - Loading/Waiting state */
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <VideoCameraIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Welcome, {user?.first_name}!
                </h2>
                <p className="text-gray-300 mb-6">
                  Setting up your consultation...
                </p>
                <div className="flex items-center justify-center space-x-2 text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            ) : (
              /* Staff/Doctor View - Full controls */
              <div className="space-y-4">
                <button
                  onClick={() => {
                    // Start consultation with default patient or first available patient
                    const defaultPatient = availablePatients[0] || {
                      id: 'P001',
                      name: 'John Doe',
                      type: 'Consultation',
                      time: '2:00 PM',
                      status: 'waiting'
                    };
                    startConsultation(defaultPatient);
                  }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-3 text-lg mx-auto"
                >
                  <VideoCameraIcon className="h-6 w-6" />
                  <span>Start Video Consultation</span>
                </button>
                
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={() => setShowStartDialog(true)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Select Patient</span>
                  </button>
                  
                  <button
                    onClick={async () => {
                      const stream = await startCamera();
                      if (stream) {
                        setTimeout(() => stopCamera(), 3000); // Preview for 3 seconds
                        alert('Camera test successful! Camera will be enabled when you start consultation.');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <CameraIcon className="h-4 w-4" />
                    <span>Test Camera</span>
                  </button>
                </div>
                
                <p className="text-gray-400 mt-4 text-sm">
                  Start immediately or choose a specific patient
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Patient) */}
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          {isCallActive ? (
            <div className="relative w-full h-full">
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
              />
              {/* Patient Info Overlay */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5" />
                  <span className="font-medium">{patientInfo.name}</span>
                  <span className="text-sm text-gray-300">ID: {patientInfo.id}</span>
                </div>
              </div>
              
              {/* Connection Quality */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  {getConnectionIcon()}
                  <span className="text-sm capitalize">{connectionQuality}</span>
                </div>
              </div>
              
              {/* Call Duration */}
              <div className="absolute top-16 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm">{formatDuration(callDuration)}</span>
                </div>
              </div>
              
              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-28 right-4 bg-red-600 text-white p-2 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm">REC</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-white">
              <VideoCameraSlashIcon className="w-24 h-24 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">No Active Consultation</p>
              <p className="text-gray-400 mb-6">Start a video call with your patient</p>
              <button
                onClick={() => setShowStartDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto"
              >
                <VideoCameraIcon className="w-5 h-5" />
                <span>Start Consultation</span>
              </button>
            </div>
          )}
        </div>

        {/* Local Video (Doctor) */}
        {isCallActive && (
          <div className="absolute bottom-20 right-4 w-64 h-48 bg-gray-700 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            {isVideoOn ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover transform scale-x-[-1]"
                  autoPlay
                  muted
                  playsInline
                />
                {/* "You" label */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  You
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <VideoCameraSlashIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Camera Off</p>
                </div>
              </div>
            )}
            {/* Audio muted indicator - positioned at bottom left */}
            {!isAudioOn && (
              <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                <XMarkIcon className="w-3 h-3" />
                <span>Muted</span>
              </div>
            )}
          </div>
        )}

        {/* Control Bar */}
        {isCallActive && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-4 p-4">
              {/* Video Toggle */}
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? <VideoCameraIcon className="w-6 h-6" /> : <VideoCameraSlashIcon className="w-6 h-6" />}
              </button>

              {/* Audio Toggle */}
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full ${isAudioOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
                title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isAudioOn ? <MicrophoneIcon className="w-6 h-6" /> : <XMarkIcon className="w-6 h-6" />}
              </button>

              {/* Screen Share */}
              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                <ComputerDesktopIcon className="w-6 h-6" />
              </button>

              {/* Recording */}
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-full ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                {isRecording ? <StopIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
              </button>

              {/* Chat Toggle */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`p-3 rounded-full ${isChatOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white relative`}
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                {chatMessages.length > 0 && !isChatOpen && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {chatMessages.length}
                  </div>
                )}
              </button>

              {/* Patient Info - Only show for doctors/staff */}
              {(isDoctor || !isPatient) && (
                <button
                  onClick={() => setShowPatientInfo(!showPatientInfo)}
                  className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 text-white"
                  title="Patient Information"
                >
                  <ClipboardDocumentListIcon className="w-6 h-6" />
                </button>
              )}

              {/* Transcription Toggle */}
              <button
                onClick={toggleTranscription}
                className={`p-3 rounded-full ${isTranscribing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
                title={isTranscribing ? 'Stop Transcription' : 'Start Transcription'}
              >
                <DocumentTextIcon className="w-6 h-6" />
                {isTranscribing && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Transcript Panel Toggle */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`p-3 rounded-full ${showTranscript ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
                title="View Transcript"
              >
                <ClipboardDocumentIcon className="w-6 h-6" />
                {transcriptHistory.length > 0 && !showTranscript && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center">
                    {transcriptHistory.length}
                  </div>
                )}
              </button>

              {/* Fullscreen */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 text-white"
              >
                {isFullscreen ? <ArrowsPointingInIcon className="w-6 h-6" /> : <ArrowsPointingOutIcon className="w-6 h-6" />}
              </button>

              {/* End Consultation */}
              <button
                onClick={endConsultation}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white ml-8"
              >
                <PhoneIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id} className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  {message.senderName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Info Panel - Only show for doctors/staff */}
      {showPatientInfo && (isDoctor || !isPatient) && (
        <div className="absolute left-0 top-0 bottom-0 w-96 bg-white shadow-xl border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
              <button
                onClick={() => setShowPatientInfo(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Name:</span> {patientInfo.name}</div>
                <div><span className="font-medium">Age:</span> {patientInfo.age}</div>
                <div><span className="font-medium">Patient ID:</span> {patientInfo.id}</div>
                <div><span className="font-medium">Last Visit:</span> {patientInfo.lastVisit}</div>
              </div>
            </div>

            {/* Medical Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Medical Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Allergies:</span>
                  <div className="mt-1">
                    {patientInfo.allergies.map((allergy, index) => (
                      <span key={index} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs mr-1">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Current Medications:</span>
                  <div className="mt-1 space-y-1">
                    {patientInfo.medications.map((medication, index) => (
                      <div key={index} className="text-xs bg-blue-50 p-2 rounded">
                        {medication}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Notes */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Consultation Notes</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter consultation notes..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Diagnosis */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Diagnosis</h4>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Prescriptions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Prescriptions</h4>
                <button
                  onClick={addPrescription}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {prescriptions.map((prescription, index) => (
                  <div key={prescription.id} className="border border-gray-200 rounded-lg p-3">
                    <input
                      type="text"
                      placeholder="Medication name"
                      className="w-full text-sm p-2 border border-gray-300 rounded mb-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Dosage"
                        className="text-xs p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        className="text-xs p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Save Consultation
            </button>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Send Prescriptions
            </button>
          </div>
        </div>
      )}

      {/* Transcript Panel */}
      {showTranscript && (
        <div className="absolute top-4 left-4 w-96 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-40">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">Live Transcript</h3>
              {isTranscribing && (
                <div className="flex items-center space-x-1 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Recording</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {transcriptHistory.length > 0 && (
                <>
                  <button
                    onClick={exportTranscript}
                    className="p-1 hover:bg-gray-200 rounded text-blue-600"
                    title="Export Transcript"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearTranscript}
                    className="p-1 hover:bg-gray-200 rounded text-red-600"
                    title="Clear Transcript"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => setShowTranscript(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {/* Current transcript */}
            {transcript && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-sm text-gray-700">{transcript}</p>
              </div>
            )}

            {/* Microphone test section */}
            {!isTranscribing && transcriptHistory.length === 0 && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Transcription Setup</h4>
                <p className="text-xs text-yellow-700 mb-3">
                  Before starting transcription, make sure:
                </p>
                <ul className="text-xs text-yellow-700 space-y-1 mb-3 ml-4">
                  <li>• Your microphone is connected and working</li>
                  <li>• Browser has microphone permissions</li>
                  <li>• You're using Chrome, Edge, or Safari</li>
                  <li>• Your internet connection is stable</li>
                </ul>
                <button
                  onClick={async () => {
                    try {
                      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                      alert('✅ Microphone test successful! You can now start transcription.');
                      stream.getTracks().forEach(track => track.stop());
                    } catch (error) {
                      alert('❌ Microphone test failed. Please check permissions and try again.');
                    }
                  }}
                  className="w-full py-2 px-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs font-medium"
                >
                  Test Microphone
                </button>
              </div>
            )}
            
            {/* Transcript history */}
            <div className="space-y-3">
              {transcriptHistory.length === 0 && !isTranscribing ? (
                <div className="text-center text-gray-500 py-4">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No transcript available</p>
                  <p className="text-xs mb-4">Start transcription to capture speech</p>
                  
                  {/* Troubleshooting tips */}
                  <div className="text-left bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                    <p className="font-medium mb-2">Troubleshooting Tips:</p>
                    <div className="space-y-1">
                      <p>• Speak clearly and loudly into your microphone</p>
                      <p>• Check browser console (F12) for error messages</p>
                      <p>• Try refreshing the page and allowing permissions</p>
                      <p>• Ensure you're using a supported browser (Chrome/Edge/Safari)</p>
                      <p>• Check if other applications are using your microphone</p>
                    </div>
                  </div>
                </div>
              ) : transcriptHistory.length === 0 && isTranscribing ? (
                <div className="text-center text-blue-600 py-8">
                  <div className="animate-pulse">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">Listening for speech...</p>
                    <p className="text-xs">Speak now to test transcription</p>
                  </div>
                </div>
              ) : (
                transcriptHistory.map((entry) => (
                  <div key={entry.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">{entry.speaker}</span>
                      <span className="text-xs text-gray-400">{entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-800">{entry.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Transcript Controls */}
          <div className="p-3 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={toggleTranscription}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isTranscribing 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isTranscribing ? 'Stop Recording' : 'Start Recording'}
                </button>
                {transcriptHistory.length > 0 && (
                  <button
                    onClick={exportTranscript}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Export
                  </button>
                )}
              </div>
              
              {/* Debug info */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <div className="flex justify-between">
                  <span>Browser Support:</span>
                  <span className={
                    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) 
                      ? 'text-green-600' : 'text-red-600'
                  }>
                    {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) 
                      ? '✅ Supported' : '❌ Not Supported'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={isTranscribing ? 'text-green-600' : 'text-gray-600'}>
                    {isTranscribing ? '🟢 Active' : '⚪ Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Entries:</span>
                  <span>{transcriptHistory.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultation;