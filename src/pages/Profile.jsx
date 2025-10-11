import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile Settings</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <p className="mt-1 text-sm text-gray-900">{user?.first_name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <p className="mt-1 text-sm text-gray-900">{user?.last_name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600">Profile editing functionality will be implemented here.</p>
        <div className="mt-4">
          <h3 className="font-medium text-gray-900">Features to include:</h3>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
            <li>Edit personal information</li>
            <li>Change password</li>
            <li>Upload profile picture</li>
            <li>Notification preferences</li>
            <li>Privacy settings</li>
            <li>Account deactivation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;