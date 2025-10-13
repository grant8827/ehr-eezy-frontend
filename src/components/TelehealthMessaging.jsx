import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  CheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';

const TelehealthMessaging = () => {
  const { user, isDoctor, isPatient } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Mock data
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        participant: {
          name: isDoctor ? 'Sarah Johnson' : 'Dr. Michael Chen',
          avatar: isDoctor 
            ? 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100&h=100&fit=crop&crop=face'
            : 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
          role: isDoctor ? 'Patient' : 'Doctor',
          specialty: isDoctor ? null : 'Cardiology',
          status: 'online',
        },
        lastMessage: {
          text: 'Thank you for the prescription. When should I start taking the medication?',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          unread: !isDoctor,
        },
        appointmentDate: '2024-10-15T14:30:00',
      },
      {
        id: 2,
        participant: {
          name: isDoctor ? 'James Wilson' : 'Dr. Emily Rodriguez',
          avatar: isDoctor 
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
            : 'https://images.unsplash.com/photo-1594824248441-6425c470cb9f?w=100&h=100&fit=crop&crop=face',
          role: isDoctor ? 'Patient' : 'Doctor',
          specialty: isDoctor ? null : 'Family Medicine',
          status: 'away',
        },
        lastMessage: {
          text: 'Your lab results came back normal. No further action needed.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          unread: false,
        },
        appointmentDate: '2024-10-16T10:00:00',
      },
      {
        id: 3,
        participant: {
          name: isDoctor ? 'Maria Garcia' : 'Dr. Sarah Johnson',
          avatar: isDoctor 
            ? 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
            : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
          role: isDoctor ? 'Patient' : 'Doctor',
          specialty: isDoctor ? null : 'Internal Medicine',
          status: 'offline',
        },
        lastMessage: {
          text: 'Can we reschedule tomorrow\'s appointment?',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          unread: isDoctor,
        },
        appointmentDate: '2024-10-17T15:30:00',
      },
    ];
    
    setConversations(mockConversations);
    setSelectedConversation(mockConversations[0]);
  }, [isDoctor]);

  useEffect(() => {
    if (selectedConversation) {
      const mockMessages = [
        {
          id: 1,
          senderId: isDoctor ? selectedConversation.participant.name : user.name,
          senderName: isDoctor ? selectedConversation.participant.name : user.name,
          text: 'Hi Dr. Chen, I wanted to follow up on our appointment yesterday.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'delivered',
          isOwn: !isDoctor,
        },
        {
          id: 2,
          senderId: isDoctor ? user.name : selectedConversation.participant.name,
          senderName: isDoctor ? user.name : selectedConversation.participant.name,
          text: 'Hello Sarah! How are you feeling today? Any side effects from the medication?',
          timestamp: new Date(Date.now() - 90 * 60 * 1000),
          status: 'delivered',
          isOwn: isDoctor,
        },
        {
          id: 3,
          senderId: isDoctor ? selectedConversation.participant.name : user.name,
          senderName: isDoctor ? selectedConversation.participant.name : user.name,
          text: 'I\'m feeling much better, thank you! No side effects so far. The medication seems to be working well.',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          status: 'read',
          isOwn: !isDoctor,
        },
        {
          id: 4,
          senderId: isDoctor ? user.name : selectedConversation.participant.name,
          senderName: isDoctor ? user.name : selectedConversation.participant.name,
          text: 'That\'s great to hear! Please continue taking it as prescribed. I\'m sending you a prescription for a refill.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: 'delivered',
          isOwn: isDoctor,
        },
        {
          id: 5,
          senderId: isDoctor ? selectedConversation.participant.name : user.name,
          senderName: isDoctor ? selectedConversation.participant.name : user.name,
          text: 'Thank you for the prescription. When should I start taking the medication?',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          status: 'delivered',
          isOwn: !isDoctor,
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedConversation, isDoctor, user.name]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: user.name,
        senderName: user.name,
        text: newMessage,
        timestamp: new Date(),
        status: 'sent',
        isOwn: true,
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageTime = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatTime(timestamp);
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckIcon className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckIcon className="w-4 h-4 text-gray-600" />;
      case 'read':
        return <CheckCircleIcon className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-white flex">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <div className="mt-3 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={conversation.participant.avatar}
                    alt={conversation.participant.name}
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    conversation.participant.status === 'online' ? 'bg-green-400' :
                    conversation.participant.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.participant.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {conversation.participant.role}
                        {conversation.participant.specialty && ` • ${conversation.participant.specialty}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(conversation.lastMessage.timestamp)}
                      </span>
                      {conversation.lastMessage.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={selectedConversation.participant.avatar}
                  alt={selectedConversation.participant.name}
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedConversation.participant.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.participant.role}
                    {selectedConversation.participant.specialty && ` • ${selectedConversation.participant.specialty}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <PhoneIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <VideoCameraIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <InformationCircleIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                  {!message.isOwn && (
                    <div className="flex items-center mb-1">
                      <span className="text-xs text-gray-600 font-medium">
                        {message.senderName}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  
                  <div className={`flex items-center mt-1 space-x-1 ${
                    message.isOwn ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.isOwn && (
                      <div className="ml-1">
                        {getStatusIcon(message.status)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="px-4 py-4 border-t border-gray-200 bg-white">
            <form onSubmit={sendMessage} className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${selectedConversation.participant.name}...`}
                    rows={1}
                    className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                  />
                  
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <PaperClipIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <FaceSmileIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No conversation selected
            </h3>
            <p className="text-gray-500">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelehealthMessaging;