import React, { useState } from 'react';
import {
  BeakerIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  PrinterIcon,
  EyeIcon,
  PlusIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Prescriptions = ({ prescriptions, allergies }) => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter and sort prescriptions
  const filteredPrescriptions = prescriptions
    .filter(prescription => {
      if (filterStatus === 'all') return true;
      return prescription.status.toLowerCase() === filterStatus.toLowerCase();
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.prescribedDate - a.prescribedDate;
      } else if (sortBy === 'medication') {
        return a.medication.name.localeCompare(b.medication.name);
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircleIcon };
      case 'discontinued':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: XMarkIcon };
      case 'completed':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircleIcon };
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: ClockIcon };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: InformationCircleIcon };
    }
  };

  // Check for drug interactions
  const checkDrugInteractions = (medication) => {
    const activeMedications = prescriptions
      .filter(p => p.status === 'Active' && p.id !== medication.id)
      .map(p => p.medication.name.toLowerCase());
    
    // Simple interaction check (in real app, this would be comprehensive)
    const commonInteractions = {
      'warfarin': ['aspirin', 'ibuprofen'],
      'metformin': ['alcohol'],
      'lisinopril': ['potassium'],
      'amoxicillin': ['methotrexate']
    };
    
    const currentMed = medication.medication.name.toLowerCase();
    const interactions = [];
    
    if (commonInteractions[currentMed]) {
      commonInteractions[currentMed].forEach(interactingDrug => {
        if (activeMedications.some(med => med.includes(interactingDrug))) {
          interactions.push(interactingDrug);
        }
      });
    }
    
    return interactions;
  };

  // Check for allergies
  const checkAllergies = (medication) => {
    if (!allergies || !allergies.length) return [];
    
    const medName = medication.medication.name.toLowerCase();
    return allergies.filter(allergy => 
      allergy.allergen.toLowerCase().includes(medName) ||
      medName.includes(allergy.allergen.toLowerCase())
    );
  };

  // Calculate days remaining
  const getDaysRemaining = (prescription) => {
    if (prescription.status !== 'Active') return null;
    
    const startDate = prescription.prescribedDate;
    const daysSupply = prescription.daysSupply || 30;
    const endDate = new Date(startDate.getTime() + (daysSupply * 24 * 60 * 60 * 1000));
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    return daysLeft;
  };

  // Group prescriptions by category
  const prescriptionsByCategory = filteredPrescriptions.reduce((acc, prescription) => {
    const category = prescription.medication.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(prescription);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Prescriptions</h3>
          <p className="text-sm text-gray-500">
            Current and past medications, dosages, and prescription history
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="discontinued">Discontinued</option>
            <option value="completed">Completed</option>
          </select>
          
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="medication">Sort by Medication</option>
            <option value="status">Sort by Status</option>
          </select>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Prescription
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-lg font-bold text-green-900">
                {prescriptions.filter(p => p.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-lg font-bold text-yellow-900">
                {prescriptions.filter(p => p.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BeakerIcon className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Meds</p>
              <p className="text-lg font-bold text-blue-900">{prescriptions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Expiring Soon</p>
              <p className="text-lg font-bold text-red-900">
                {prescriptions.filter(p => {
                  const daysLeft = getDaysRemaining(p);
                  return daysLeft !== null && daysLeft <= 7;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Medications Alert */}
      {prescriptions.filter(p => {
        const daysLeft = getDaysRemaining(p);
        return daysLeft !== null && daysLeft <= 7;
      }).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-amber-800">Medications Expiring Soon</h4>
              <p className="text-sm text-amber-700 mt-1">
                You have medications that will expire within the next 7 days. Please contact your pharmacy for refills.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prescriptions by Category */}
      <div className="space-y-6">
        {Object.entries(prescriptionsByCategory).map(([category, categoryPrescriptions]) => (
          <div key={category} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h4 className="text-lg font-medium text-gray-900">{category}</h4>
              <p className="text-sm text-gray-500">{categoryPrescriptions.length} medications</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {categoryPrescriptions.map((prescription) => {
                const statusStyle = getStatusStyle(prescription.status);
                const StatusIcon = statusStyle.icon;
                const daysLeft = getDaysRemaining(prescription);
                const interactions = checkDrugInteractions(prescription);
                const allergyWarnings = checkAllergies(prescription);
                
                return (
                  <div key={prescription.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <BeakerIcon className="h-8 w-8 text-blue-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <h5 className="text-lg font-medium text-gray-900">
                                {prescription.medication.name}
                              </h5>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusStyle.bg} ${statusStyle.color}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {prescription.status}
                              </span>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Dosage:</span> {prescription.dosage}
                              </div>
                              <div>
                                <span className="font-medium">Frequency:</span> {prescription.frequency}
                              </div>
                              <div>
                                <span className="font-medium">Prescribed:</span> {prescription.prescribedDate.toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Provider:</span> {prescription.provider}
                              </div>
                            </div>
                            
                            {prescription.instructions && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-gray-700">Instructions:</span>
                                <p className="text-sm text-gray-600 mt-1">{prescription.instructions}</p>
                              </div>
                            )}
                            
                            {/* Warnings and Alerts */}
                            <div className="mt-3 space-y-2">
                              {daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && (
                                <div className="flex items-center text-amber-700 text-sm">
                                  <ClockIcon className="w-4 h-4 mr-1" />
                                  Expires in {daysLeft} days - Refill needed soon
                                </div>
                              )}
                              
                              {interactions.length > 0 && (
                                <div className="flex items-center text-red-700 text-sm">
                                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                                  Potential interaction with: {interactions.join(', ')}
                                </div>
                              )}
                              
                              {allergyWarnings.length > 0 && (
                                <div className="flex items-center text-red-700 text-sm font-medium">
                                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                                  ALLERGY WARNING: Patient allergic to {allergyWarnings.map(a => a.allergen).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedPrescription(prescription)}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-2"
                          title="Request Refill"
                        >
                          <ArrowPathIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-2"
                          title="Print"
                        >
                          <PrinterIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Prescription Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Prescription Details - {selectedPrescription.medication.name}
                </h3>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Medication Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Medication Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Generic Name:</span>
                      <span>{selectedPrescription.medication.genericName || selectedPrescription.medication.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Brand Name:</span>
                      <span>{selectedPrescription.medication.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span>{selectedPrescription.medication.category}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">NDC Number:</span>
                      <span>{selectedPrescription.ndc || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Prescription Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Dosage:</span>
                      <span>{selectedPrescription.dosage}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Frequency:</span>
                      <span>{selectedPrescription.frequency}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Days Supply:</span>
                      <span>{selectedPrescription.daysSupply || 'N/A'} days</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-gray-700">Refills Remaining:</span>
                      <span>{selectedPrescription.refillsRemaining || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescriber Information */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Prescriber Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium">Provider:</span>
                      <span className="ml-2">{selectedPrescription.provider}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium">Prescribed:</span>
                      <span className="ml-2">{selectedPrescription.prescribedDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {selectedPrescription.instructions && (
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {selectedPrescription.instructions}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                  Request Refill
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Print Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPrescriptions.length === 0 && (
        <div className="text-center py-12">
          <BeakerIcon className="mx-auto h-24 w-24 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No prescriptions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterStatus === 'all' 
              ? 'No prescriptions recorded for this patient.'
              : `No ${filterStatus} prescriptions found. Try adjusting your filter.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;