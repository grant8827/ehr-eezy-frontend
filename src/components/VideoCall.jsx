import React, { useState, useEffect, useRef } from 'react';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  PhoneXMarkIcon,
  ChatBubbleBottomCenterTextIcon,
  ShareIcon,
  DocumentTextIcon,
  SignalIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import {
  VideoCameraIcon as VideoCameraIconSolid,
  MicrophoneIcon as MicrophoneIconSolid,
} from '@heroicons/react/24/solid';

const VideoCall = ({ appointment, onEndCall, isDoctor }) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Simulate call timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    // Here you would implement actual video toggle logic
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    // Here you would implement actual audio toggle logic
  };

  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
    // Here you would implement screen sharing logic
  };

  const toggleRecording = () => {
    setRecording(!recording);
    // Here you would implement recording logic
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: isDoctor ? 'Doctor' : 'Patient',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const getConnectionColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative">
        {/* Remote video (main) */}
        <div className="absolute inset-0 bg-gray-800">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          {/* Placeholder when no video */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                {isDoctor ? appointment?.patient?.name : appointment?.doctor?.name}
              </h3>
              <p className="text-gray-300">
                {appointment?.type} • {appointment?.duration} minutes
              </p>
              {!videoEnabled && (
                <p className="text-sm text-gray-400 mt-2">Camera is turned off</p>
              )}
            </div>
          </div>
        </div>

        {/* Top bar with connection info and controls */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex justify-between items-center">
            {/* Connection status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionQuality === 'excellent' ? 'bg-green-400' : 
                  connectionQuality === 'good' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <SignalIcon className={`w-4 h-4 ${getConnectionColor(connectionQuality)}`} />
                <span className="text-white text-sm capitalize">{connectionQuality}</span>
              </div>
              
              {recording && (
                <div className="flex items-center space-x-2 bg-red-600/80 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-sm">Recording</span>
                </div>
              )}
            </div>

            {/* Call timer and participant info */}
            <div className="text-center">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-white text-lg font-mono">{formatDuration(callDuration)}</div>
                <div className="text-gray-300 text-xs">
                  {isDoctor ? appointment?.patient?.name : appointment?.doctor?.name}
                </div>
              </div>
            </div>

            {/* Additional controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-24 right-4 w-64 h-48 bg-gray-700 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover mirror"
            autoPlay
            playsInline
            muted
          />
          {/* Placeholder for local video */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <UserGroupIcon className="w-8 h-8" />
              </div>
              <p className="text-xs">You</p>
            </div>
          </div>
          {!videoEnabled && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <VideoCameraIconSolid className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Chat panel */}
        {showChat && (
          <div className="absolute right-4 top-16 bottom-24 w-80 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Chat</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.sender === (isDoctor ? 'Doctor' : 'Patient')
                      ? 'bg-blue-600 text-white self-end'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {message.sender} • {message.timestamp}
                  </span>
                </div>
              ))}
            </div>
            
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Settings panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Call Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camera
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>Default Camera</option>
                  <option>External Camera</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Microphone
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>Default Microphone</option>
                  <option>External Microphone</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>Default Speaker</option>
                  <option>Headphones</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call controls */}
      <div className="bg-gray-800 p-6">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-colors ${
              audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
            title={audioEnabled ? 'Mute' : 'Unmute'}
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
            title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {videoEnabled ? (
              <VideoCameraIcon className="w-6 h-6 text-white" />
            ) : (
              <VideoCameraIconSolid className="w-6 h-6 text-white" />
            )}
          </button>

          <button 
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Speaker settings"
          >
            <SpeakerWaveIcon className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-colors ${
              screenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Share screen"
          >
            <ComputerDesktopIcon className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-full transition-colors ${
              showChat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Chat"
          >
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={toggleRecording}
            className={`p-4 rounded-full transition-colors ${
              recording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={recording ? 'Stop recording' : 'Start recording'}
          >
            <PlayCircleIcon className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            title="End call"
          >
            <PhoneXMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* Connection info */}
        <div className="flex justify-center mt-4">
          <div className="text-center text-gray-400 text-sm">
            <p>Connection: <span className={getConnectionColor(connectionQuality)}>{connectionQuality}</span></p>
            {isDoctor && (
              <p>Patient ID: {appointment?.patient?.id || 'N/A'}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* CSS styles for mirror effect */}
      <style>
        {`
          .mirror {
            transform: scaleX(-1);
          }
        `}
      </style>
    </div>
  );
};

export default VideoCall;