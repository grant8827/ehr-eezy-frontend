import React, { useState } from 'react';
import {
  PlusIcon,
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  HeartIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const AddVisit = ({ isOpen, onClose, onSave, patientId, patientName }) => {
  const [visitData, setVisitData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: 'routine',
    provider: '',
    chiefComplaint: '',
    presentIllness: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    followUp: '',
    status: 'completed'
  });

  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    bmi: ''
  });

  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeSection, setActiveSection] = useState('visit-info');

  // Calculate BMI when weight or height changes
  React.useEffect(() => {
    const weight = parseFloat(vitalSigns.weight);
    const height = parseFloat(vitalSigns.height);
    
    if (weight && height) {
      const heightInMeters = height * 0.0254; // inches to meters
      const weightInKg = weight * 0.453592; // pounds to kg
      const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      
      setVitalSigns(prev => ({
        ...prev,
        bmi: bmi
      }));
    }
  }, [vitalSigns.weight, vitalSigns.height]);

  const handleVisitDataChange = (field, value) => {
    setVisitData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVitalSignsChange = (field, value) => {
    if (field === 'bloodPressure') {
      setVitalSigns(prev => ({
        ...prev,
        bloodPressure: value
      }));
    } else {
      setVitalSigns(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateVitalSigns = () => {
    const errors = [];
    
    // Blood Pressure validation
    const systolic = parseInt(vitalSigns.bloodPressure.systolic);
    const diastolic = parseInt(vitalSigns.bloodPressure.diastolic);
    
    if (systolic && (systolic < 70 || systolic > 200)) {
      errors.push('Systolic blood pressure seems unusual (70-200 mmHg expected)');
    }
    
    if (diastolic && (diastolic < 40 || diastolic > 120)) {
      errors.push('Diastolic blood pressure seems unusual (40-120 mmHg expected)');
    }

    // Heart Rate validation
    const heartRate = parseInt(vitalSigns.heartRate);
    if (heartRate && (heartRate < 40 || heartRate > 150)) {
      errors.push('Heart rate seems unusual (40-150 bpm expected)');
    }

    // Temperature validation
    const temperature = parseFloat(vitalSigns.temperature);
    if (temperature && (temperature < 95.0 || temperature > 106.0)) {
      errors.push('Temperature seems unusual (95-106°F expected)');
    }

    return errors;
  };

  const handleSave = () => {
    const validationErrors = validateVitalSigns();
    
    if (validationErrors.length > 0) {
      alert('Please check the following:\n' + validationErrors.join('\n'));
      return;
    }

    const newVisit = {
      id: Date.now().toString(),
      date: new Date(`${visitData.date}T${visitData.time}`),
      ...visitData,
      patientId,
      vitalSigns: {
        ...vitalSigns,
        id: Date.now().toString(),
        date: new Date(`${visitData.date}T${visitData.time}`)
      },
      documents: selectedFiles.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        uploadedBy: visitData.provider || 'Current User',
        category: 'Visit Documents',
        description: `Document from ${visitData.type} visit on ${visitData.date}`,
        file: file
      }))
    };

    onSave(newVisit);
    onClose();
  };

  const sections = [
    { id: 'visit-info', name: 'Visit Information', icon: DocumentTextIcon },
    { id: 'vital-signs', name: 'Vital Signs', icon: HeartIcon },
    { id: 'documents', name: 'Documents', icon: ClipboardDocumentListIcon }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PlusIcon className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Add New Visit</h3>
                <p className="text-sm text-gray-600">Patient: {patientName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Navigation Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {section.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'visit-info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date and Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visit Date
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={visitData.date}
                        onChange={(e) => handleVisitDataChange('date', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visit Time
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={visitData.time}
                        onChange={(e) => handleVisitDataChange('time', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Visit Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visit Type
                    </label>
                    <select
                      value={visitData.type}
                      onChange={(e) => handleVisitDataChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="routine">Routine Check-up</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="urgent">Urgent Care</option>
                      <option value="emergency">Emergency</option>
                      <option value="consultation">Consultation</option>
                      <option value="procedure">Procedure</option>
                      <option value="lab">Lab Work</option>
                    </select>
                  </div>

                  {/* Provider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={visitData.provider}
                        onChange={(e) => handleVisitDataChange('provider', e.target.value)}
                        placeholder="Dr. Smith, Nurse Johnson, etc."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Chief Complaint */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chief Complaint
                  </label>
                  <textarea
                    rows={3}
                    value={visitData.chiefComplaint}
                    onChange={(e) => handleVisitDataChange('chiefComplaint', e.target.value)}
                    placeholder="Primary reason for visit..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Present Illness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    History of Present Illness
                  </label>
                  <textarea
                    rows={4}
                    value={visitData.presentIllness}
                    onChange={(e) => handleVisitDataChange('presentIllness', e.target.value)}
                    placeholder="Detailed description of current symptoms and timeline..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </label>
                  <textarea
                    rows={3}
                    value={visitData.diagnosis}
                    onChange={(e) => handleVisitDataChange('diagnosis', e.target.value)}
                    placeholder="Primary and secondary diagnoses..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Treatment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Plan
                  </label>
                  <textarea
                    rows={3}
                    value={visitData.treatment}
                    onChange={(e) => handleVisitDataChange('treatment', e.target.value)}
                    placeholder="Prescribed treatments, medications, procedures..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Follow Up */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={visitData.followUp}
                    onChange={(e) => handleVisitDataChange('followUp', e.target.value)}
                    placeholder="Next appointment, monitoring instructions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={visitData.notes}
                    onChange={(e) => handleVisitDataChange('notes', e.target.value)}
                    placeholder="Any additional observations or notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {activeSection === 'vital-signs' && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Vital Signs Recording</h4>
                  <p className="text-sm text-blue-700">
                    Record vital signs taken during this visit. All fields are optional.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blood Pressure */}
                  <div className="medical-card p-4">
                    <div className="flex items-center mb-3">
                      <HeartIcon className="w-5 h-5 text-red-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Blood Pressure</label>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Systolic"
                        value={vitalSigns.bloodPressure.systolic}
                        onChange={(e) => handleVitalSignsChange('bloodPressure', {
                          ...vitalSigns.bloodPressure,
                          systolic: e.target.value
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="flex items-center text-gray-500">/</span>
                      <input
                        type="number"
                        placeholder="Diastolic"
                        value={vitalSigns.bloodPressure.diastolic}
                        onChange={(e) => handleVitalSignsChange('bloodPressure', {
                          ...vitalSigns.bloodPressure,
                          diastolic: e.target.value
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">mmHg</p>
                  </div>

                  {/* Heart Rate */}
                  <div className="medical-card p-4">
                    <div className="flex items-center mb-3">
                      <HeartIcon className="w-5 h-5 text-red-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Heart Rate</label>
                    </div>
                    <input
                      type="number"
                      placeholder="72"
                      value={vitalSigns.heartRate}
                      onChange={(e) => handleVitalSignsChange('heartRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">beats per minute</p>
                  </div>

                  {/* Temperature */}
                  <div className="medical-card p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      value={vitalSigns.temperature}
                      onChange={(e) => handleVitalSignsChange('temperature', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">°F</p>
                  </div>

                  {/* Respiratory Rate */}
                  <div className="medical-card p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Respiratory Rate
                    </label>
                    <input
                      type="number"
                      placeholder="16"
                      value={vitalSigns.respiratoryRate}
                      onChange={(e) => handleVitalSignsChange('respiratoryRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">breaths per minute</p>
                  </div>

                  {/* Oxygen Saturation */}
                  <div className="medical-card p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oxygen Saturation
                    </label>
                    <input
                      type="number"
                      placeholder="98"
                      min="0"
                      max="100"
                      value={vitalSigns.oxygenSaturation}
                      onChange={(e) => handleVitalSignsChange('oxygenSaturation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">%</p>
                  </div>

                  {/* Weight */}
                  <div className="medical-card p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="150"
                      value={vitalSigns.weight}
                      onChange={(e) => handleVitalSignsChange('weight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">lbs</p>
                  </div>

                  {/* Height */}
                  <div className="medical-card p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height
                    </label>
                    <input
                      type="number"
                      placeholder="68"
                      value={vitalSigns.height}
                      onChange={(e) => handleVitalSignsChange('height', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">inches</p>
                  </div>

                  {/* BMI (calculated) */}
                  <div className="medical-card p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BMI (calculated)
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600">
                      {vitalSigns.bmi || 'Enter weight and height'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">kg/m²</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'documents' && (
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Visit Documents</h4>
                  <p className="text-sm text-green-700">
                    Upload any documents, images, or files related to this visit.
                  </p>
                </div>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-base font-medium text-blue-600 hover:text-blue-500">
                        Upload files
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi"
                      />
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, Word, Images, Videos up to 10MB each
                    </p>
                  </div>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Selected Files ({selectedFiles.length})</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <DocumentTextIcon className="w-6 h-6 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            All information will be saved to the patient's medical record
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!visitData.type || !visitData.date || !visitData.provider}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVisit;