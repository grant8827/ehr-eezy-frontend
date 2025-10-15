import React, { useState } from 'react';
import {
  CalendarIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  EyeIcon,
  HeartIcon,
  BeakerIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const PatientHistory = ({ medicalHistory }) => {
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Filter visits based on type
  const filteredHistory = medicalHistory.filter(visit => {
    if (filterType === 'all') return true;
    return visit.type.toLowerCase().includes(filterType.toLowerCase());
  });

  // Group visits by year for better organization
  const groupedHistory = filteredHistory.reduce((groups, visit) => {
    const year = visit.date.getFullYear();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(visit);
    return groups;
  }, {});

  const toggleExpandVisit = (visitId) => {
    setExpandedVisit(expandedVisit === visitId ? null : visitId);
  };

  const getVisitTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'annual physical':
        return <HeartIcon className="w-5 h-5 text-blue-500" />;
      case 'sick visit':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'follow-up visit':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'preventive care':
        return <HeartIcon className="w-5 h-5 text-purple-500" />;
      case 'consultation':
        return <UserIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatVitalSigns = (vitalSigns) => {
    if (!vitalSigns) return 'Not recorded';
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div>
          <span className="font-medium">BP:</span> {vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic}
        </div>
        <div>
          <span className="font-medium">HR:</span> {vitalSigns.heartRate} bpm
        </div>
        <div>
          <span className="font-medium">Temp:</span> {vitalSigns.temperature.toFixed(1)}°F
        </div>
        <div>
          <span className="font-medium">O2:</span> {vitalSigns.oxygenSaturation}%
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Medical History</h3>
          <p className="text-sm text-gray-500">
            Complete chronological record of patient visits and treatments
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Visit Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Visits</option>
            <option value="annual">Annual Physical</option>
            <option value="follow-up">Follow-up</option>
            <option value="sick">Sick Visit</option>
            <option value="preventive">Preventive Care</option>
            <option value="consultation">Consultation</option>
          </select>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <PlusCircleIcon className="w-4 h-4 mr-2" />
            Add Visit
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Visits</p>
              <p className="text-lg font-bold text-blue-900">{medicalHistory.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <HeartIcon className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Annual Physicals</p>
              <p className="text-lg font-bold text-green-900">
                {medicalHistory.filter(v => v.type === 'Annual Physical').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Follow-ups</p>
              <p className="text-lg font-bold text-purple-900">
                {medicalHistory.filter(v => v.type === 'Follow-up Visit').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">Sick Visits</p>
              <p className="text-lg font-bold text-orange-900">
                {medicalHistory.filter(v => v.type === 'Sick Visit').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History Timeline */}
      <div className="space-y-8">
        {Object.keys(groupedHistory)
          .sort((a, b) => b - a)
          .map(year => (
            <div key={year} className="relative">
              {/* Year Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-2 mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                  {year}
                  <span className="ml-2 text-sm text-gray-500">
                    ({groupedHistory[year].length} visits)
                  </span>
                </h4>
              </div>

              {/* Visits for this year */}
              <div className="space-y-4">
                {groupedHistory[year].map((visit, index) => (
                  <div
                    key={visit.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Visit Header */}
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleExpandVisit(visit.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getVisitTypeIcon(visit.type)}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">
                              {visit.type}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {visit.date.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-gray-400">
                              Provider: {visit.provider}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {visit.chiefComplaint}
                            </p>
                            <p className="text-xs text-gray-500">
                              {visit.diagnosis}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                            {visit.status}
                          </span>
                          <EyeIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Visit Details */}
                    {expandedVisit === visit.id && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Visit Information */}
                          <div className="space-y-4">
                            <div>
                              <h6 className="text-sm font-medium text-gray-900 mb-2">
                                Visit Details
                              </h6>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Chief Complaint:</span>
                                  <p className="text-gray-600">{visit.chiefComplaint}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Diagnosis:</span>
                                  <p className="text-gray-600">{visit.diagnosis}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Treatment:</span>
                                  <p className="text-gray-600">{visit.treatment}</p>
                                </div>
                              </div>
                            </div>

                            {/* Provider Notes */}
                            <div>
                              <h6 className="text-sm font-medium text-gray-900 mb-2">
                                Provider Notes
                              </h6>
                              <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                                {visit.notes}
                              </p>
                            </div>
                          </div>

                          {/* Vital Signs */}
                          <div className="space-y-4">
                            <div>
                              <h6 className="text-sm font-medium text-gray-900 mb-2">
                                Vital Signs
                              </h6>
                              <div className="bg-white p-3 rounded border">
                                {formatVitalSigns(visit.vitalSigns)}
                              </div>
                            </div>

                            {/* Additional Information */}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div className="bg-white p-3 rounded border">
                                <span className="font-medium text-gray-700">Visit Type:</span>
                                <p className="text-gray-600">{visit.type}</p>
                              </div>
                              <div className="bg-white p-3 rounded border">
                                <span className="font-medium text-gray-700">Status:</span>
                                <p className="text-gray-600 capitalize">{visit.status}</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3 pt-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                <DocumentTextIcon className="w-4 h-4 mr-1" />
                                View Full Report
                              </button>
                              <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                                <BeakerIcon className="w-4 h-4 mr-1" />
                                Lab Results
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="mx-auto h-24 w-24 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No visits found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterType === 'all' 
              ? 'No medical visits recorded for this patient.'
              : `No ${filterType} visits found. Try adjusting your filter.`
            }
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Record New Visit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;