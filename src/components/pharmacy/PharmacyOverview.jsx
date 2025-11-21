import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const PharmacyOverview = () => {
  const [stats, setStats] = useState({
    pending: 12,
    received: 8,
    filled: 45,
    readyForPickup: 15,
    staffCount: 8,
    activeStaff: 6,
  });

  const [recentPrescriptions, setRecentPrescriptions] = useState([
    {
      id: 1,
      patientName: 'Sarah Johnson',
      medication: 'Lisinopril 10mg',
      prescriber: 'Dr. Smith',
      status: 'pending',
      receivedAt: '2 hours ago',
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      medication: 'Metformin 500mg',
      prescriber: 'Dr. Williams',
      status: 'received',
      receivedAt: '4 hours ago',
    },
    {
      id: 3,
      patientName: 'Emma Wilson',
      medication: 'Amoxicillin 875mg',
      prescriber: 'Dr. Johnson',
      status: 'filled',
      receivedAt: '6 hours ago',
    },
  ]);

  const statCards = [
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: ClockIcon,
      color: 'bg-yellow-50 text-yellow-600',
      iconBg: 'bg-yellow-100',
    },
    {
      title: 'Being Filled',
      value: stats.received,
      icon: ChartBarIcon,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Ready for Pickup',
      value: stats.readyForPickup,
      icon: CheckCircleIcon,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Active Staff',
      value: `${stats.activeStaff}/${stats.staffCount}`,
      icon: UsersIcon,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'filled':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-lg p-6 border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Prescriptions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Prescriptions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {prescription.patientName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {prescription.medication}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {prescription.prescriber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        prescription.status
                      )}`}
                    >
                      {prescription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prescription.receivedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Staffing Alert
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              2 staff members have licenses expiring within 30 days. Please review
              and update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyOverview;
