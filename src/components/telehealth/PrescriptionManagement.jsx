import React, { useState, useEffect } from 'react';
import {
  RectangleStackIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  InformationCircleIcon,
  UserIcon,
  CalendarDaysIcon,
  BeakerIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { format, addDays, parseISO } from 'date-fns';

const PrescriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('active'); // active, pending, history, templates
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDrugInteractionAlert, setShowDrugInteractionAlert] = useState(false);

  // Mock prescription data
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: 'Sarah Johnson',
      patientId: 'P12345',
      patientDOB: '1985-03-15',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      quantity: 30,
      refills: 3,
      prescribedDate: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
      expiryDate: addDays(new Date(), 363),
      status: 'active',
      diagnosis: 'Hypertension',
      instructions: 'Take with water, preferably in the morning',
      pharmacy: 'CVS Pharmacy - Main St',
      prescribedBy: 'Dr. Smith',
      ndc: '0591-0405-01',
      dea: 'AS1234567'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      patientId: 'P12346',
      patientDOB: '1978-11-22',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      quantity: 60,
      refills: 5,
      prescribedDate: new Date(Date.now() - 5 * 24 * 60 * 60000), // 5 days ago
      expiryDate: addDays(new Date(), 360),
      status: 'active',
      diagnosis: 'Type 2 Diabetes',
      instructions: 'Take with meals to reduce stomach upset',
      pharmacy: 'Walgreens - Oak Ave',
      prescribedBy: 'Dr. Smith',
      ndc: '0093-1075-01',
      dea: 'AS1234567'
    },
    {
      id: 3,
      patientName: 'Emma Wilson',
      patientId: 'P12347',
      patientDOB: '1992-07-08',
      medication: 'Amoxicillin',
      dosage: '875mg',
      frequency: 'Twice daily',
      quantity: 20,
      refills: 0,
      prescribedDate: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      expiryDate: addDays(new Date(), 9), // 10-day course
      status: 'pending',
      diagnosis: 'Bacterial Infection',
      instructions: 'Complete the full course even if feeling better',
      pharmacy: 'Rite Aid - Center St',
      prescribedBy: 'Dr. Smith',
      ndc: '0074-3967-50',
      dea: 'AS1234567'
    }
  ]);

  // Mock drug templates
  const [drugTemplates, setDrugTemplates] = useState([
    {
      id: 1,
      name: 'Lisinopril 10mg',
      category: 'ACE Inhibitor',
      commonDosages: ['5mg', '10mg', '20mg'],
      commonFrequencies: ['Once daily', 'Twice daily'],
      indications: ['Hypertension', 'Heart Failure'],
      contraindications: ['Pregnancy', 'Angioedema'],
      interactions: ['Potassium supplements', 'NSAIDs']
    },
    {
      id: 2,
      name: 'Metformin 500mg',
      category: 'Biguanide',
      commonDosages: ['500mg', '850mg', '1000mg'],
      commonFrequencies: ['Once daily', 'Twice daily', 'Three times daily'],
      indications: ['Type 2 Diabetes'],
      contraindications: ['Kidney disease', 'Heart failure'],
      interactions: ['Contrast agents', 'Alcohol']
    }
  ]);

  // New prescription form state
  const [newPrescription, setNewPrescription] = useState({
    patientName: '',
    patientId: '',
    medication: '',
    dosage: '',
    frequency: '',
    quantity: '',
    refills: 0,
    diagnosis: '',
    instructions: '',
    pharmacy: ''
  });

  // Filter prescriptions based on active tab and search term
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesTab = activeTab === 'active' ? prescription.status === 'active' :
                      activeTab === 'pending' ? prescription.status === 'pending' :
                      activeTab === 'history' ? prescription.status === 'completed' || prescription.status === 'expired' :
                      true;
    
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medication.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Handle prescription creation
  const createPrescription = () => {
    const prescription = {
      ...newPrescription,
      id: Date.now(),
      prescribedDate: new Date(),
      expiryDate: addDays(new Date(), 365),
      status: 'pending',
      prescribedBy: 'Dr. Smith',
      dea: 'AS1234567'
    };

    setPrescriptions(prev => [prescription, ...prev]);
    setNewPrescription({
      patientName: '',
      patientId: '',
      medication: '',
      dosage: '',
      frequency: '',
      quantity: '',
      refills: 0,
      diagnosis: '',
      instructions: '',
      pharmacy: ''
    });
    setShowNewPrescription(false);
  };

  // Handle prescription status update
  const updatePrescriptionStatus = (id, status) => {
    setPrescriptions(prev => prev.map(prescription => 
      prescription.id === id ? { ...prescription, status } : prescription
    ));
  };

  // Print prescription
  const printPrescription = (prescription) => {
    // In a real app, this would generate a proper prescription format
    window.print();
  };

  // Check for drug interactions
  const checkDrugInteractions = (medication) => {
    // Mock interaction check
    const riskMedications = ['warfarin', 'digoxin', 'lithium'];
    return riskMedications.some(med => 
      medication.toLowerCase().includes(med) || 
      prescriptions.some(p => p.medication.toLowerCase().includes(med) && p.status === 'active')
    );
  };

  const tabs = [
    { id: 'active', name: 'Active', count: prescriptions.filter(p => p.status === 'active').length },
    { id: 'pending', name: 'Pending', count: prescriptions.filter(p => p.status === 'pending').length },
    { id: 'history', name: 'History', count: prescriptions.filter(p => p.status === 'completed' || p.status === 'expired').length },
    { id: 'templates', name: 'Templates', count: drugTemplates.length }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <RectangleStackIcon className="w-8 h-8 mr-3 text-blue-600" />
              Prescription Management
            </h1>
            <p className="text-gray-600 mt-1">Manage patient prescriptions and e-prescribing</p>
          </div>
          <button
            onClick={() => setShowNewPrescription(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Prescription</span>
          </button>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'templates' ? (
        /* Drug Templates */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drugTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.category}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Common Dosages</p>
                  <div className="flex flex-wrap gap-1">
                    {template.commonDosages.map((dosage, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {dosage}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Indications</p>
                  <p className="text-sm text-gray-600">{template.indications.join(', ')}</p>
                </div>

                {template.interactions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1 flex items-center">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                      Key Interactions
                    </p>
                    <p className="text-sm text-red-600">{template.interactions.join(', ')}</p>
                  </div>
                )}
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                Use Template
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Prescriptions List */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredPrescriptions.length > 0 ? (
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
                      Dosage & Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prescribed
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
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {prescription.patientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {prescription.patientId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {prescription.medication}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prescription.diagnosis}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {prescription.dosage}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prescription.frequency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(prescription.prescribedDate, 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {prescription.prescribedBy}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prescription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : prescription.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {prescription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedPrescription(prescription)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => printPrescription(prescription)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                        {prescription.status === 'pending' && (
                          <button
                            onClick={() => updatePrescriptionStatus(prescription.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <RectangleStackIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No prescriptions found</p>
              <p className="text-sm mt-1">Create a new prescription to get started</p>
            </div>
          )}
        </div>
      )}

      {/* New Prescription Modal */}
      {showNewPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">New Prescription</h3>
              <button
                onClick={() => setShowNewPrescription(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Patient Information
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={newPrescription.patientName}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    value={newPrescription.patientId}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, patientId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    value={newPrescription.diagnosis}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Primary diagnosis"
                  />
                </div>
              </div>

              {/* Medication Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <BeakerIcon className="w-5 h-5 mr-2" />
                  Medication Details
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication *
                  </label>
                  <input
                    type="text"
                    value={newPrescription.medication}
                    onChange={(e) => {
                      setNewPrescription(prev => ({ ...prev, medication: e.target.value }));
                      if (checkDrugInteractions(e.target.value)) {
                        setShowDrugInteractionAlert(true);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter medication name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={newPrescription.dosage}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, dosage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10mg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency *
                    </label>
                    <select
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={newPrescription.quantity}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refills
                    </label>
                    <select
                      value={newPrescription.refills}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, refills: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Instructions and Pharmacy */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions for Patient
                  </label>
                  <textarea
                    value={newPrescription.instructions}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Special instructions for taking this medication..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Pharmacy
                  </label>
                  <select
                    value={newPrescription.pharmacy}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, pharmacy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select pharmacy</option>
                    <option value="CVS Pharmacy - Main St">CVS Pharmacy - Main St</option>
                    <option value="Walgreens - Oak Ave">Walgreens - Oak Ave</option>
                    <option value="Rite Aid - Center St">Rite Aid - Center St</option>
                    <option value="Local Pharmacy - Downtown">Local Pharmacy - Downtown</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drug Interaction Alert */}
            {showDrugInteractionAlert && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-red-800">
                      Potential Drug Interaction Detected
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      This medication may interact with the patient's current prescriptions. 
                      Please review the patient's medication history before prescribing.
                    </p>
                    <button
                      onClick={() => setShowDrugInteractionAlert(false)}
                      className="text-red-600 hover:text-red-800 text-sm underline mt-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewPrescription(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createPrescription}
                disabled={!newPrescription.patientName || !newPrescription.medication || !newPrescription.dosage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Prescription
              </button>
            </div>
          </div>
        </div>
      )}

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

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-2 font-medium">{selectedPrescription.patientName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Patient ID:</span>
                      <span className="ml-2">{selectedPrescription.patientId}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">DOB:</span>
                      <span className="ml-2">{selectedPrescription.patientDOB}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Prescription Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Medication:</span>
                      <span className="ml-2 font-medium">{selectedPrescription.medication}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Dosage:</span>
                      <span className="ml-2">{selectedPrescription.dosage}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Frequency:</span>
                      <span className="ml-2">{selectedPrescription.frequency}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2">{selectedPrescription.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Refills:</span>
                      <span className="ml-2">{selectedPrescription.refills}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Instructions</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedPrescription.instructions}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Prescriber Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Prescribed by:</span>
                      <span className="ml-2">{selectedPrescription.prescribedBy}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">DEA #:</span>
                      <span className="ml-2">{selectedPrescription.dea}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2">{format(selectedPrescription.prescribedDate, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Pharmacy</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Pharmacy:</span>
                      <span className="ml-2">{selectedPrescription.pharmacy}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">NDC:</span>
                      <span className="ml-2">{selectedPrescription.ndc}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => printPrescription(selectedPrescription)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <PrinterIcon className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManagement;