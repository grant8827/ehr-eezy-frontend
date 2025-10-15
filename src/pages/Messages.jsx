import React, { useState, useEffect, useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  VideoCameraIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  LockClosedIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { format, isToday, isYesterday, formatDistance } from 'date-fns';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data for conversations
  const [conversations, setConversations] = useState([
    {
      id: 1,
      patientName: 'Sarah Johnson',
      patientId: 'P12345',
      lastMessage: 'Thank you for the prescription. When should I schedule the follow-up?',
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      unread: 2,
      priority: 'normal',
      status: 'active',
      encrypted: true
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      patientId: 'P12346',
      lastMessage: 'The medication is helping with the symptoms. Much better now.',
      timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      unread: 0,
      priority: 'normal',
      status: 'active',
      encrypted: true
    },
    {
      id: 3,
      patientName: 'Emma Wilson',
      patientId: 'P12347',
      lastMessage: 'Experiencing some side effects. Should I continue the medication?',
      timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      unread: 1,
      priority: 'urgent',
      status: 'active',
      encrypted: true
    },
    {
      id: 4,
      patientName: 'David Rodriguez',
      patientId: 'P12348',
      lastMessage: 'Appointment confirmation received. See you tomorrow at 2 PM.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
      unread: 0,
      priority: 'normal',
      status: 'active',
      encrypted: true
    }
  ]);

  // Mock data for messages in active chat
  const [messages, setMessages] = useState({
    1: [
      {
        id: 1,
        senderId: 'P12345',
        senderName: 'Sarah Johnson',
        senderType: 'patient',
        content: 'Hi Dr. Smith, I received the prescription you sent. Thank you!',
        timestamp: new Date(Date.now() - 45 * 60000),
        status: 'delivered',
        encrypted: true
      },
      {
        id: 2,
        senderId: 'provider-1',
        senderName: 'Dr. Smith',
        senderType: 'provider',
        content: 'You\'re welcome! Please take it as directed - twice daily with meals. Let me know if you have any questions.',
        timestamp: new Date(Date.now() - 30 * 60000),
        status: 'read',
        encrypted: true
      },
      {
        id: 3,
        senderId: 'P12345',
        senderName: 'Sarah Johnson',
        senderType: 'patient',
        content: 'Thank you for the prescription. When should I schedule the follow-up?',
        timestamp: new Date(Date.now() - 15 * 60000),
        status: 'sent',
        encrypted: true
      }
    ],
    2: [
      {
        id: 1,
        senderId: 'provider-1',
        senderName: 'Dr. Smith',
        senderType: 'provider',
        content: 'Hello Michael, how are you feeling with the new medication?',
        timestamp: new Date(Date.now() - 3 * 60 * 60000),
        status: 'read',
        encrypted: true
      },
      {
        id: 2,
        senderId: 'P12346',
        senderName: 'Michael Chen',
        senderType: 'patient',
        content: 'The medication is helping with the symptoms. Much better now.',
        timestamp: new Date(Date.now() - 2 * 60 * 60000),
        status: 'delivered',
        encrypted: true
      }
    ],
    3: [
      {
        id: 1,
        senderId: 'P12347',
        senderName: 'Emma Wilson',
        senderType: 'patient',
        content: 'Experiencing some side effects. Should I continue the medication?',
        timestamp: new Date(Date.now() - 24 * 60 * 60000),
        status: 'sent',
        encrypted: true
      }
    ]
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  // Format timestamp for display
  const formatMessageTime = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'h:mm a');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM d');
    }
  };

  // Send message
  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      senderId: 'provider-1',
      senderName: 'Dr. Smith',
      senderType: 'provider',
      content: message,
      timestamp: new Date(),
      status: 'sent',
      encrypted: true
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === activeChat 
        ? { ...conv, lastMessage: message, timestamp: new Date() }
        : conv
    ));

    setMessage('');
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Start new conversation
  const startNewConversation = (patientData) => {
    const newConversation = {
      id: Date.now(),
      patientName: patientData.name,
      patientId: patientData.id,
      lastMessage: '',
      timestamp: new Date(),
      unread: 0,
      priority: 'normal',
      status: 'active',
      encrypted: true
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveChat(newConversation.id);
    setMessages(prev => ({ ...prev, [newConversation.id]: [] }));
    setShowNewChatModal(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ChatBubbleLeftRightIcon className="w-8 h-8 mr-3 text-blue-600" />
              Secure Messaging
            </h1>
            <p className="text-gray-600 mt-1">HIPAA-compliant patient communication</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <ShieldCheckIcon className="w-5 h-5" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {/* Search and New Chat */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveChat(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeChat === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.patientName}
                      </h3>
                      {conversation.priority === 'urgent' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                      <LockClosedIcon className="w-4 h-4 text-green-500" title="Encrypted" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">ID: {conversation.patientId}</p>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(conversation.timestamp)}
                      </span>
                      {conversation.unread > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No conversations found</p>
                <p className="text-sm mt-1">Start a new conversation with a patient</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {conversations.find(c => c.id === activeChat)?.patientName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {conversations.find(c => c.id === activeChat)?.patientName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {conversations.find(c => c.id === activeChat)?.patientId}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <LockClosedIcon className="w-4 h-4" />
                      <span className="text-xs">Encrypted</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <PhoneIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <VideoCameraIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages[activeChat]?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderType === 'provider' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.senderType === 'provider'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div className={`flex items-center justify-between mt-1 text-xs ${
                        msg.senderType === 'provider' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{format(msg.timestamp, 'h:mm a')}</span>
                        <div className="flex items-center space-x-1">
                          <LockClosedIcon className="w-3 h-3" />
                          {msg.senderType === 'provider' && (
                            <span className="capitalize">{msg.status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                    <PaperClipIcon className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                    <FaceSmileIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* HIPAA Notice */}
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <InformationCircleIcon className="w-4 h-4 mr-1" />
                  <span>All messages are HIPAA-compliant and end-to-end encrypted</span>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="w-24 h-24 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p>Choose a patient conversation to start messaging</p>
                <p className="text-sm mt-2 flex items-center justify-center">
                  <ShieldCheckIcon className="w-4 h-4 mr-1 text-green-500" />
                  All communications are encrypted and HIPAA-compliant
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Start New Conversation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  placeholder="Search or enter patient name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient ID
                </label>
                <input
                  type="text"
                  placeholder="Enter patient ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => startNewConversation({ name: 'New Patient', id: 'P' + Date.now() })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;