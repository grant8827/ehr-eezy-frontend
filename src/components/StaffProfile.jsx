import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import StaffRegistrationForm from './StaffRegistrationForm';
import { staffAPI } from '../services/apiService';

const StaffProfile = () => {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const fetchStaff = async () => {
    try {
      const response = await staffAPI.getById(id);
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff member details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    fetchStaff();
    setShowEditForm(false);
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'nurse': return 'bg-green-100 text-green-800';
      case 'therapist': return 'bg-teal-100 text-teal-800';
      case 'receptionist': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Staff Member Not Found</h2>
        <p className="mt-2 text-gray-600">The requested staff member could not be found.</p>
        <Link to="/app/staff" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          ← Back to Staff List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            to="/app/staff"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {staff.first_name} {staff.last_name}
            </h1>
            <p className="text-gray-600">Staff Profile</p>
          </div>
        </div>
        <button
          onClick={() => setShowEditForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-medium text-blue-600">
                  {staff.first_name?.[0]}{staff.last_name?.[0]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {staff.first_name} {staff.last_name}
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeColor(staff.role)}`}>
                    {staff.role?.charAt(0).toUpperCase() + staff.role?.slice(1)}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    staff.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {staff.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {staff.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {staff.phone || 'Not provided'}
                </div>
                {staff.address && (
                  <div className="flex items-center text-sm text-gray-600 md:col-span-2">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {staff.address}, {staff.city}, {staff.state} {staff.zip_code}
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information */}
            {(staff.role === 'doctor' || staff.role === 'nurse' || staff.role === 'therapist') && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.license_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Number</label>
                      <p className="text-sm text-gray-900">{staff.license_number}</p>
                    </div>
                  )}
                  {staff.specialization && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialization</label>
                      <p className="text-sm text-gray-900">{staff.specialization}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {(staff.emergency_contact_name || staff.emergency_contact_phone) && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.emergency_contact_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                      <p className="text-sm text-gray-900">{staff.emergency_contact_name}</p>
                    </div>
                  )}
                  {staff.emergency_contact_phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                      <p className="text-sm text-gray-900">{staff.emergency_contact_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Employment Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <p className="text-sm text-gray-900">
                  {staff.employee_id || `EMP${String(staff.id).padStart(4, '0')}`}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="text-sm text-gray-900">{staff.department || 'General'}</p>
              </div>
              {staff.hire_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(staff.hire_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                View Schedule
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Assign Patients
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Performance Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <StaffRegistrationForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        staff={staff}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default StaffProfile;