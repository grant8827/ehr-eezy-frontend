import React, { useState, useEffect, useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { messagesAPI } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const MessagingSystem = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
    loadUnreadCount();
    loadAvailableUsers();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  const loadConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // Load conversation messages
  const loadConversationMessages = async (participantId) => {
    try {
      setLoading(true);
      const response = await messagesAPI.getAll({ conversation_with: participantId });
      if (response.data.success) {
        setMessages(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load available users for messaging
  const loadAvailableUsers = async (search = '') => {
    try {
      const response = await messagesAPI.getAvailableUsers({ search });
      if (response.data.success) {
        setAvailableUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error loading available users:', error);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await messagesAPI.getUnreadCount();
      if (response.data.success) {
        setUnreadCount(response.data.data.count);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  // Select conversation
  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    loadConversationMessages(conversation.participant_id);
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || (!activeConversation && !selectedUser)) return;

    try {
      const receiverId = activeConversation ? activeConversation.participant_id : selectedUser.id;
      
      const response = await messagesAPI.create({
        receiver_id: receiverId,
        subject: subject,
        body: newMessage,
        priority: 'normal'
      });

      if (response.data.success) {
        setNewMessage('');
        setSubject('');
        
        if (activeConversation) {
          // Reload messages for active conversation
          loadConversationMessages(activeConversation.participant_id);
        } else {
          // Close new message modal and refresh conversations
          setShowNewMessage(false);
          setSelectedUser(null);
          loadConversations();
        }
        
        loadUnreadCount();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };

  // Start new conversation
  const startNewConversation = () => {
    setShowNewMessage(true);
    setActiveConversation(null);
    setMessages([]);
    loadAvailableUsers();
  };

  // Search users
  const handleUserSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    loadAvailableUsers(value);
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      doctor: 'Doctor',
      admin: 'Administrator',
      staff: 'Staff',
      patient: 'Patient',
      nurse: 'Nurse',
      therapist: 'Therapist',
      receptionist: 'Receptionist'
    };
    return roleNames[role] || role;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversations Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
              Messages
            </h2>
            <button
              onClick={startNewConversation}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="New Message"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          {unreadCount > 0 && (
            <div className="flex items-center text-sm text-blue-600 mb-3">
              <EnvelopeIcon className="w-4 h-4 mr-1" />
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new conversation to begin messaging</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.participant_id}
                onClick={() => selectConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeConversation?.participant_id === conversation.participant_id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <UserIcon className="w-8 h-8 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.participant.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {getRoleDisplayName(conversation.participant.role)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 truncate">
                      {conversation.latest_message.body}
                    </p>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(conversation.latest_message.created_at)}
                    </span>
                    {conversation.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 mt-1">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <UserIcon className="w-8 h-8 text-gray-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {activeConversation.participant.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getRoleDisplayName(activeConversation.participant.role)}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No messages in this conversation</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      {message.subject && (
                        <p className={`font-medium text-sm mb-1 ${
                          message.sender_id === user.id ? 'text-blue-100' : 'text-gray-700'
                        }`}>
                          {message.subject}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap">{message.body}</p>
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        message.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{formatMessageTime(message.created_at)}</span>
                        {message.sender_id === user.id && (
                          <span className="flex items-center">
                            {message.is_read ? (
                              <CheckCircleIcon className="w-4 h-4" />
                            ) : (
                              <ClockIcon className="w-4 h-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${activeConversation.participant.name}...`}
                    rows={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : showNewMessage ? (
          /* New Message Form */
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">New Message</h3>
                <button
                  onClick={() => {
                    setShowNewMessage(false);
                    setSelectedUser(null);
                    setSubject('');
                    setNewMessage('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 bg-gray-50">
              <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                {/* User Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To:
                  </label>
                  {selectedUser ? (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <UserIcon className="w-6 h-6 text-blue-600 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedUser.name}</p>
                          <p className="text-sm text-gray-500">
                            {getRoleDisplayName(selectedUser.role)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-2">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={handleUserSearch}
                          placeholder="Search users..."
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                        {availableUsers.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center">
                              <UserIcon className="w-6 h-6 text-gray-400 mr-3" />
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">
                                  {getRoleDisplayName(user.role)} • {user.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {availableUsers.length === 0 && (
                          <div className="p-3 text-gray-500 text-center">
                            No users found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject (optional):
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message:
                  </label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Send Button */}
                <div className="flex justify-end">
                  <button
                    onClick={sendMessage}
                    disabled={!selectedUser || !newMessage.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Messages</h3>
              <p className="text-gray-500 mb-4">
                Select a conversation or start a new message to begin
              </p>
              <button
                onClick={startNewConversation}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;