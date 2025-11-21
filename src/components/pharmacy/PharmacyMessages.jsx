import React, { useState, useEffect } from 'react';
import {
  EnvelopeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const PharmacyMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [replyText, setReplyText] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Dr. Smith',
      subject: 'Question about Lisinopril dosage',
      preview:
        'Can you confirm the availability of Lisinopril 10mg for patient Sarah Johnson?',
      body:
        'Can you confirm the availability of Lisinopril 10mg for patient Sarah Johnson? She needs to refill her prescription and I want to make sure it\'s in stock before sending it over.',
      date: '2025-11-20 14:30',
      unread: true,
      type: 'doctor',
    },
    {
      id: 2,
      from: 'Sarah Johnson',
      subject: 'Prescription ready for pickup?',
      preview: 'Hi, I was wondering if my prescription is ready...',
      body:
        'Hi, I was wondering if my prescription for Metformin is ready for pickup. I received a notification yesterday that it was being filled.',
      date: '2025-11-20 12:15',
      unread: true,
      type: 'patient',
    },
    {
      id: 3,
      from: 'Dr. Williams',
      subject: 'Insurance authorization needed',
      preview: 'Patient Michael Chen needs prior authorization...',
      body:
        'Patient Michael Chen needs prior authorization for his medication. Can you help process this? The insurance company requires additional documentation.',
      date: '2025-11-20 10:00',
      unread: false,
      type: 'doctor',
    },
    {
      id: 4,
      from: 'Emma Wilson',
      subject: 'Question about medication instructions',
      preview: 'I have a question about taking Amoxicillin...',
      body:
        'I have a question about taking Amoxicillin. The label says twice daily, but I\'m not sure if I should take it with food or on an empty stomach.',
      date: '2025-11-19 16:45',
      unread: false,
      type: 'patient',
    },
  ]);

  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    body: '',
  });

  const filteredMessages = messages.filter(
    (message) =>
      message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter((m) => m.unread).length;

  const markAsRead = (id) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, unread: false } : msg))
    );
  };

  const handleSendMessage = () => {
    // Handle sending new message
    console.log('Sending message:', newMessage);
    setNewMessage({ to: '', subject: '', body: '' });
    setShowNewMessage(false);
  };

  const handleReply = () => {
    // Handle reply
    console.log('Sending reply:', replyText);
    setReplyText('');
    setSelectedMessage(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowNewMessage(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Message</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => {
                setSelectedMessage(message);
                markAsRead(message.id);
              }}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                message.unread ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-medium text-sm">
                      {message.from.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium text-gray-900 truncate ${
                          message.unread ? 'font-semibold' : ''
                        }`}
                      >
                        {message.from}
                      </p>
                      <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {new Date(message.date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        message.unread
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-600'
                      }`}
                    >
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {message.preview}
                    </p>
                  </div>
                </div>
                {message.unread && (
                  <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-medium text-sm">
                    {selectedMessage.from.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedMessage.from}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedMessage.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-900">{selectedMessage.body}</p>
              </div>

              {/* Reply Section */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your reply..."
                />
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">New Message</h3>
              <button
                onClick={() => setShowNewMessage(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  value={newMessage.to}
                  onChange={(e) =>
                    setNewMessage((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Recipient name or email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage.body}
                  onChange={(e) =>
                    setNewMessage((prev) => ({ ...prev, body: e.target.value }))
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={
                    !newMessage.to || !newMessage.subject || !newMessage.body
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyMessages;
