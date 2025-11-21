import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const PharmacyStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const [staff, setStaff] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@cvs.com',
      phone: '(217) 555-0101',
      role: 'pharmacist',
      licenseNumber: 'PH12345',
      licenseExpiry: '2025-12-31',
      status: 'active',
      hireDate: '2020-01-15',
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@cvs.com',
      phone: '(217) 555-0102',
      role: 'pharmacist',
      licenseNumber: 'PH12346',
      licenseExpiry: '2025-06-30',
      status: 'active',
      hireDate: '2019-05-20',
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@cvs.com',
      phone: '(217) 555-0103',
      role: 'pharmacy_technician',
      licenseNumber: 'PT12345',
      licenseExpiry: '2026-03-15',
      status: 'active',
      hireDate: '2021-03-10',
    },
    {
      id: 4,
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma.wilson@cvs.com',
      phone: '(217) 555-0104',
      role: 'pharmacy_technician',
      licenseNumber: 'PT12346',
      licenseExpiry: '2025-11-30',
      status: 'active',
      hireDate: '2022-07-01',
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@cvs.com',
      phone: '(217) 555-0105',
      role: 'pharmacy_assistant',
      licenseNumber: null,
      licenseExpiry: null,
      status: 'active',
      hireDate: '2023-01-15',
    },
  ]);

  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'pharmacy_assistant',
    licenseNumber: '',
    licenseExpiry: '',
    hireDate: '',
  });

  const roleLabels = {
    pharmacist: 'Pharmacist',
    pharmacy_technician: 'Pharmacy Technician',
    pharmacy_assistant: 'Pharmacy Assistant',
    manager: 'Manager',
  };

  const filters = [
    { id: 'all', label: 'All Staff', count: staff.length },
    {
      id: 'pharmacist',
      label: 'Pharmacists',
      count: staff.filter((s) => s.role === 'pharmacist').length,
    },
    {
      id: 'pharmacy_technician',
      label: 'Technicians',
      count: staff.filter((s) => s.role === 'pharmacy_technician').length,
    },
    {
      id: 'pharmacy_assistant',
      label: 'Assistants',
      count: staff.filter((s) => s.role === 'pharmacy_assistant').length,
    },
  ];

  const filteredStaff = staff.filter((member) => {
    const matchesFilter = activeFilter === 'all' || member.role === activeFilter;
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const isLicenseExpiring = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  };

  const handleAddStaff = () => {
    const staff_member = {
      ...newStaff,
      id: Date.now(),
      status: 'active',
    };
    setStaff((prev) => [staff_member, ...prev]);
    setNewStaff({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'pharmacy_assistant',
      licenseNumber: '',
      licenseExpiry: '',
      hireDate: '',
    });
    setShowAddStaff(false);
  };

  const handleUpdateStaff = () => {
    setStaff((prev) =>
      prev.map((s) => (s.id === selectedStaff.id ? selectedStaff : s))
    );
    setSelectedStaff(null);
  };

  const handleDeleteStaff = (id) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'pharmacist':
        return 'bg-blue-100 text-blue-800';
      case 'pharmacy_technician':
        return 'bg-green-100 text-green-800';
      case 'pharmacy_assistant':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Staff Management</h2>
          <p className="text-sm text-gray-500">{staff.length} total staff members</p>
        </div>
        <button
          onClick={() => setShowAddStaff(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Staff</span>
        </button>
      </div>

      {/* License Expiry Alert */}
      {staff.some((s) => isLicenseExpiring(s.licenseExpiry)) && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                License Expiration Warning
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {staff.filter((s) => isLicenseExpiring(s.licenseExpiry)).length}{' '}
                staff member(s) have licenses expiring within 30 days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.label}
              <span className="ml-2 text-sm">({filter.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        member.role
                      )}`}
                    >
                      {roleLabels[member.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.licenseNumber ? (
                      <div>
                        <div className="text-sm text-gray-900">
                          {member.licenseNumber}
                        </div>
                        <div
                          className={`text-sm ${
                            isLicenseExpiring(member.licenseExpiry)
                              ? 'text-red-600 font-medium'
                              : 'text-gray-500'
                          }`}
                        >
                          Expires: {member.licenseExpiry}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => setSelectedStaff(member)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Add Staff Member</h3>
              <button
                onClick={() => setShowAddStaff(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={newStaff.firstName}
                    onChange={(e) =>
                      setNewStaff((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={newStaff.lastName}
                    onChange={(e) =>
                      setNewStaff((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) =>
                      setNewStaff((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) =>
                      setNewStaff((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={newStaff.role}
                  onChange={(e) =>
                    setNewStaff((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pharmacy_assistant">Pharmacy Assistant</option>
                  <option value="pharmacy_technician">Pharmacy Technician</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={newStaff.licenseNumber}
                    onChange={(e) =>
                      setNewStaff((prev) => ({
                        ...prev,
                        licenseNumber: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Expiry
                  </label>
                  <input
                    type="date"
                    value={newStaff.licenseExpiry}
                    onChange={(e) =>
                      setNewStaff((prev) => ({
                        ...prev,
                        licenseExpiry: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hire Date
                </label>
                <input
                  type="date"
                  value={newStaff.hireDate}
                  onChange={(e) =>
                    setNewStaff((prev) => ({ ...prev, hireDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowAddStaff(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  disabled={
                    !newStaff.firstName || !newStaff.lastName || !newStaff.email
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Staff Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Edit Staff Member</h3>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={selectedStaff.firstName}
                    onChange={(e) =>
                      setSelectedStaff((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={selectedStaff.lastName}
                    onChange={(e) =>
                      setSelectedStaff((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={selectedStaff.email}
                    onChange={(e) =>
                      setSelectedStaff((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={selectedStaff.phone}
                    onChange={(e) =>
                      setSelectedStaff((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={selectedStaff.role}
                  onChange={(e) =>
                    setSelectedStaff((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pharmacy_assistant">Pharmacy Assistant</option>
                  <option value="pharmacy_technician">Pharmacy Technician</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={selectedStaff.licenseNumber || ''}
                    onChange={(e) =>
                      setSelectedStaff((prev) => ({
                        ...prev,
                        licenseNumber: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Expiry
                  </label>
                  <input
                    type="date"
                    value={selectedStaff.licenseExpiry || ''}
                    onChange={(e) =>
                      setSelectedStaff((prev) => ({
                        ...prev,
                        licenseExpiry: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStaff}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Staff Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyStaff;
