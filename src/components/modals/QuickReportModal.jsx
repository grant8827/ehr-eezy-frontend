import React, { useState } from 'react';
import { XMarkIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { dashboardAPI, patientAPI, appointmentAPI } from '../../services/apiService';
import toast from 'react-hot-toast';

const QuickReportModal = ({ isOpen, onClose, onSuccess }) => {
  const [reportType, setReportType] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    patientId: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'patient_summary', name: 'Patient Summary Report', description: 'Overview of all patients and their status' },
    { id: 'appointments', name: 'Appointments Report', description: 'Schedule and appointment analytics' },
    { id: 'billing', name: 'Billing Report', description: 'Revenue and billing analytics' },
    { id: 'medical_records', name: 'Medical Records Report', description: 'Patient medical records summary' },
    { id: 'prescriptions', name: 'Prescriptions Report', description: 'Medication prescriptions overview' },
    { id: 'business_analytics', name: 'Business Analytics', description: 'Comprehensive business metrics' }
  ];

  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = async () => {
    if (!reportType) {
      toast.error('Please select a report type');
      return;
    }

    setLoading(true);
    try {
      // Simulate report generation - replace with actual API calls
      const reportData = await generateReportData(reportType, filters);
      
      // Create and download the report
      downloadReport(reportData, reportType);
      
      toast.success('Report generated successfully!');
      onSuccess?.();
      onClose();
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = async (type, filterData) => {
    // This would be replaced with actual API calls to generate reports
    switch (type) {
      case 'patient_summary':
        // Mock data - replace with actual API call
        return {
          title: 'Patient Summary Report',
          generated: new Date().toISOString(),
          data: {
            totalPatients: 150,
            newPatients: 25,
            activePatients: 120
          }
        };
      case 'appointments':
        return {
          title: 'Appointments Report',
          generated: new Date().toISOString(),
          filters: filterData,
          data: {
            totalAppointments: 85,
            confirmedAppointments: 70,
            cancelledAppointments: 15
          }
        };
      case 'billing':
        return {
          title: 'Billing Report',
          generated: new Date().toISOString(),
          data: {
            totalRevenue: 45670,
            pendingPayments: 8950,
            collectedPayments: 36720
          }
        };
      default:
        return {
          title: `${type.replace('_', ' ').toUpperCase()} Report`,
          generated: new Date().toISOString(),
          data: {}
        };
    }
  };

  const downloadReport = (data, type) => {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Generate Report</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Report Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Report Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => handleReportTypeChange(type.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        reportType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <h4 className="font-medium text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Filters */}
              {reportType && (
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Report Filters
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {(reportType === 'appointments' || reportType === 'medical_records') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status Filter
                        </label>
                        <select
                          name="status"
                          value={filters.status}
                          onChange={handleFilterChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Report Preview */}
              {reportType && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <DocumentArrowDownIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Report will be generated as a downloadable file
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={generateReport}
                disabled={loading || !reportType}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickReportModal;