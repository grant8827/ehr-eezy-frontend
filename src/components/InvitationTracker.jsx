import React, { useState, useEffect } from 'react';
import {
  PaperAirplaneIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  UserIcon,
  LinkIcon,
  PhoneIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { 
  getDoctorMeetings, 
  formatMeetingTime, 
  isLinkExpired,
  generateConsultationLink
} from '../utils/consultationUtils';
import { sendConsultationInvitation, getEmailActivity } from '../services/emailService';

const InvitationTracker = ({ onResendInvitation, onCancelInvitation }) => {
  const [sentInvitations, setSentInvitations] = useState([]);
  const [emailActivities, setEmailActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, expired
  const [copiedLink, setCopiedLink] = useState(null);

  useEffect(() => {
    loadInvitations();
    loadEmailActivities();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadInvitations();
      loadEmailActivities();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadInvitations = () => {
    try {
      // Get meetings for current doctor (using demo doctor ID)
      const meetings = getDoctorMeetings('doc_001');
      
      // Add status based on current time and patient interactions
      const invitationsWithStatus = meetings.map(meeting => ({
        ...meeting,
        status: determineInvitationStatus(meeting),
        timeUntilMeeting: getTimeUntilMeeting(meeting.scheduledTime),
        linkStatus: isLinkExpired(meeting.expiresAt) ? 'expired' : 'active'
      }));
      
      setSentInvitations(invitationsWithStatus);
      setLoading(false);
    } catch (error) {
      console.error('Error loading invitations:', error);
      setLoading(false);
    }
  };

  const loadEmailActivities = () => {
    const activities = getEmailActivity();
    setEmailActivities(activities);
  };

  const determineInvitationStatus = (meeting) => {
    const now = new Date();
    const meetingTime = new Date(meeting.scheduledTime);
    const timeDiff = meetingTime.getTime() - now.getTime();
    
    if (isLinkExpired(meeting.expiresAt)) return 'expired';
    if (timeDiff < 0) return 'completed'; // Past meeting time
    if (timeDiff < 15 * 60 * 1000) return 'ready'; // Within 15 minutes
    if (meeting.patientJoined) return 'confirmed';
    if (timeDiff < 24 * 60 * 60 * 1000) return 'pending'; // Within 24 hours
    
    return 'scheduled';
  };

  const getTimeUntilMeeting = (scheduledTime) => {
    const now = new Date();
    const meetingTime = new Date(scheduledTime);
    const diff = meetingTime.getTime() - now.getTime();
    
    if (diff < 0) return 'Past due';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <CalendarDaysIcon className="w-4 h-4" />;
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'confirmed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'ready': return <VideoCameraIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'expired': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const copyInvitationLink = async (meeting) => {
    try {
      await navigator.clipboard.writeText(meeting.link);
      setCopiedLink(meeting.id);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const resendInvitation = async (meeting) => {
    try {
      // Resend the email invitation
      const emailData = {
        to: meeting.patientEmail,
        subject: `Reminder: Video Consultation with ${meeting.doctorName}`,
        data: {
          patientName: meeting.patientName,
          doctorName: meeting.doctorName,
          consultationDate: formatMeetingTime(meeting.scheduledTime),
          duration: `${meeting.duration} minutes`,
          consultationLink: meeting.link,
          shortLink: meeting.shortLink,
          meetingId: meeting.id,
          instructions: [
            'Click the consultation link 5-10 minutes before your appointment time',
            'Make sure you have a stable internet connection',
            'Use Chrome, Firefox, Safari, or Edge browser for best experience',
            'Allow camera and microphone permissions when prompted'
          ],
          supportContact: 'support@ehreezy.com'
        }
      };
      
      await sendConsultationInvitation(emailData);
      
      if (onResendInvitation) {
        onResendInvitation(meeting);
      }
      
      // Refresh data
      loadEmailActivities();
      
    } catch (error) {
      console.error('Failed to resend invitation:', error);
      alert('Failed to resend invitation. Please try again.');
    }
  };

  const cancelInvitation = (meeting) => {
    if (window.confirm(`Are you sure you want to cancel the consultation with ${meeting.patientName}?`)) {
      // Remove from local storage
      const meetings = JSON.parse(localStorage.getItem('consultationMeetings') || '[]');
      const updatedMeetings = meetings.filter(m => m.id !== meeting.id);
      localStorage.setItem('consultationMeetings', JSON.stringify(updatedMeetings));
      
      if (onCancelInvitation) {
        onCancelInvitation(meeting);
      }
      
      // Refresh data
      loadInvitations();
    }
  };

  const filteredInvitations = sentInvitations.filter(invitation => {
    if (filter === 'all') return true;
    return invitation.status === filter;
  });

  const getFilterCount = (filterType) => {
    if (filterType === 'all') return sentInvitations.length;
    return sentInvitations.filter(inv => inv.status === filterType).length;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PaperAirplaneIcon className="w-5 h-5 mr-2 text-blue-600" />
              Sent Invitations ({sentInvitations.length})
            </h3>
            <p className="text-sm text-gray-600 mt-1">Manage and track your consultation invitations</p>
          </div>
          <button 
            onClick={loadInvitations}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            title="Refresh"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All' },
            { key: 'scheduled', label: 'Scheduled' },
            { key: 'pending', label: 'Pending' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'ready', label: 'Ready' },
            { key: 'expired', label: 'Expired' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({getFilterCount(tab.key)})
            </button>
          ))}
        </div>
      </div>

      {/* Invitations List */}
      <div className="divide-y divide-gray-200">
        {filteredInvitations.length === 0 ? (
          <div className="p-8 text-center">
            <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No invitations found</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === 'all' 
                ? 'Send your first consultation invitation to get started'
                : `No ${filter} invitations at the moment`
              }
            </p>
          </div>
        ) : (
          filteredInvitations.map((invitation) => (
            <div key={invitation.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                {/* Patient Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-gray-900">{invitation.patientName}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                        {getStatusIcon(invitation.status)}
                        <span className="ml-1 capitalize">{invitation.status}</span>
                      </span>
                      {invitation.linkStatus === 'expired' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                          Link Expired
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 mr-1" />
                        {invitation.patientEmail}
                      </span>
                      <span className="flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        {formatMeetingTime(invitation.scheduledTime)}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {invitation.timeUntilMeeting}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyInvitationLink(invitation)}
                    className={`p-2 rounded-lg transition-colors ${
                      copiedLink === invitation.id 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Copy invitation link"
                  >
                    {copiedLink === invitation.id ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : (
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedInvitation(invitation);
                      setShowDetails(true);
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="View details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => resendInvitation(invitation)}
                    className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                    title="Resend invitation"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                  </button>

                  {invitation.status !== 'completed' && (
                    <button
                      onClick={() => cancelInvitation(invitation)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Cancel invitation"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Meeting ID:</span>
                  <code className="text-gray-800 font-mono text-xs">{invitation.id.substring(5, 13)}</code>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-800">{invitation.duration}min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <VideoCameraIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-800 capitalize">{invitation.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-800">{new Date(invitation.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invitation Details Modal */}
      {showDetails && selectedInvitation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Invitation Details - {selectedInvitation.patientName}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Consultation Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Patient:</span>
                    <p className="text-gray-900">{selectedInvitation.patientName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{selectedInvitation.patientEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Scheduled:</span>
                    <p className="text-gray-900">{formatMeetingTime(selectedInvitation.scheduledTime)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <p className="text-gray-900">{selectedInvitation.duration} minutes</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Invitation Links</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Link</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={selectedInvitation.link}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => copyInvitationLink(selectedInvitation)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Link</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={selectedInvitation.shortLink}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedInvitation.shortLink)}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Activity */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Email Activity</h4>
                <div className="space-y-2">
                  {emailActivities
                    .filter(activity => activity.meetingId === selectedInvitation.id)
                    .map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            Email sent to {activity.recipient}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))
                  }
                  {emailActivities.filter(activity => activity.meetingId === selectedInvitation.id).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No email activity recorded</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => resendInvitation(selectedInvitation)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Resend Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationTracker;