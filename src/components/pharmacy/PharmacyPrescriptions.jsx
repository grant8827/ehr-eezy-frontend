import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const PharmacyPrescriptions = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: 'Sarah Johnson',
      patientDOB: '1985-03-15',
      medication: 'Lisinopril',
      dosage: '10mg',
      quantity: 30,
      prescriber: 'Dr. Smith',
      status: 'pending',
      receivedAt: '2025-11-20 14:30',
      instructions: 'Take once daily with water',
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      patientDOB: '1978-11-22',
      medication: 'Metformin',
      dosage: '500mg',
      quantity: 60,
      prescriber: 'Dr. Williams',
      status: 'received',
      receivedAt: '2025-11-20 12:15',
      instructions: 'Take twice daily with meals',
    },
    {
      id: 3,
      patientName: 'Emma Wilson',
      patientDOB: '1992-07-08',
      medication: 'Amoxicillin',
      dosage: '875mg',
      quantity: 20,
      prescriber: 'Dr. Johnson',
      status: 'filled',
      receivedAt: '2025-11-20 10:00',
      instructions: 'Complete full course',
    },
    {
      id: 4,
      patientName: 'James Brown',
      patientDOB: '1965-05-12',
      medication: 'Atorvastatin',
      dosage: '20mg',
      quantity: 30,
      prescriber: 'Dr. Davis',
      status: 'picked_up',
      receivedAt: '2025-11-19 16:45',
      instructions: 'Take at bedtime',
    },
  ]);

  const filters = [
    { id: 'all', label: 'All', count: prescriptions.length },
    {
      id: 'pending',
      label: 'Pending',
      count: prescriptions.filter((p) => p.status === 'pending').length,
    },
    {
      id: 'received',
      label: 'In Progress',
      count: prescriptions.filter((p) => p.status === 'received').length,
    },
    {
      id: 'filled',
      label: 'Ready',
      count: prescriptions.filter((p) => p.status === 'filled').length,
    },
    {
      id: 'picked_up',
      label: 'Completed',
      count: prescriptions.filter((p) => p.status === 'picked_up').length,
    },
  ];

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesFilter =
      activeFilter === 'all' || prescription.status === activeFilter;
    const matchesSearch =
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'filled':
        return 'bg-green-100 text-green-800';
      case 'picked_up':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updatePrescriptionStatus = (id, newStatus) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    setSelectedPrescription(null);
  };

  return (
    <div className="p-6">
      {/* Header with Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter Tabs */}
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

      {/* Prescriptions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {prescription.patientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      DOB: {prescription.patientDOB}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {prescription.medication}
                    </div>
                    <div className="text-sm text-gray-500">
                      {prescription.dosage}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {prescription.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prescription.prescriber}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => setSelectedPrescription(prescription)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Prescription Details</h3>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Patient Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrescription.patientName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrescription.patientDOB}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Medication
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrescription.medication}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Dosage
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrescription.dosage}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Quantity
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrescription.quantity}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Prescriber
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrescription.prescriber}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Instructions
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedPrescription.instructions}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedPrescription.status
                    )}`}
                  >
                    {selectedPrescription.status}
                  </span>
                </div>
                <div className="space-x-2">
                  {selectedPrescription.status === 'pending' && (
                    <button
                      onClick={() =>
                        updatePrescriptionStatus(
                          selectedPrescription.id,
                          'received'
                        )
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Accept & Start Filling
                    </button>
                  )}
                  {selectedPrescription.status === 'received' && (
                    <button
                      onClick={() =>
                        updatePrescriptionStatus(selectedPrescription.id, 'filled')
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Mark as Filled
                    </button>
                  )}
                  {selectedPrescription.status === 'filled' && (
                    <button
                      onClick={() =>
                        updatePrescriptionStatus(
                          selectedPrescription.id,
                          'picked_up'
                        )
                      }
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Mark as Picked Up
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyPrescriptions;
