import React, { useState, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  EyeIcon, 
  ArrowPathIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import PatientInvitationModal from './modals/PatientInvitationModal';
import { patientInvitationService } from '../services/patientInvitationService';
import toast from 'react-hot-toast';

const InvitationManagement = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    registered: 0,
    pending: 0,
    conversionRate: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const response = await patientInvitationService.getAllInvitations();
      const invitationsData = response.data || [];
      setInvitations(invitationsData);
      
      // Calculate stats
      const statsData = patientInvitationService.getInvitationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationSent = (invitationData) => {
    console.log('New invitation sent:', invitationData);
    loadInvitations(); // Refresh the list
  };

  const handleResendInvitation = async (invitationId) => {
    try {
      await patientInvitationService.resendInvitation(invitationId);
      toast.success('Invitation resent successfully!');
      loadInvitations();
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast.error(error.message || 'Failed to resend invitation');
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    if (window.confirm('Are you sure you want to cancel this invitation?')) {
      try {
        await patientInvitationService.cancelInvitation(invitationId);
        toast.success('Invitation cancelled successfully!');
        loadInvitations();
      } catch (error) {
        console.error('Error cancelling invitation:', error);
        toast.error(error.message || 'Failed to cancel invitation');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'registered':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'expired':
        return <ExclamationCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'registered':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = 
      invitation.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || invitation.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patient Invitations</h1>
          <p className="text-gray-600">Manage and track patient invitation status</p>
        </div>
        <button
          onClick={() => setShowInvitationModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PaperAirplaneIcon className="h-4 w-4 mr-2" />
          Send Invitation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <PaperAirplaneIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sent</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Registered</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.registered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-lg font-bold text-purple-600">%</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <ArrowPathIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search invitations..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="sent">Pending</option>
              <option value="registered">Registered</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invitations Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Information
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvitations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <PaperAirplaneIcon className="w-8 h-8 text-gray-400" />
                    <p>No invitations found</p>
                    <p className="text-sm">Send your first patient invitation to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInvitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invitation.firstName} {invitation.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invitation.gender} • DOB: {invitation.dateOfBirth}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invitation.email}</div>
                    <div className="text-sm text-gray-500">{invitation.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(invitation.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(invitation.status)}`}>
                        {invitation.status || 'sent'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invitation.sent_at ? new Date(invitation.sent_at).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {invitation.status === 'sent' && (
                        <>
                          <button 
                            onClick={() => handleResendInvitation(invitation.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Resend Invitation"
                          >
                            <ArrowPathIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleCancelInvitation(invitation.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Invitation"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      <button className="text-gray-600 hover:text-gray-900" title="View Details">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Invitation Modal */}
      <PatientInvitationModal
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
        onSuccess={handleInvitationSent}
      />
    </div>
  );
};

export default InvitationManagement;