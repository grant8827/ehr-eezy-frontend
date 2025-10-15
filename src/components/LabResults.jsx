import React, { useState } from 'react';
import {
  BeakerIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const LabResults = ({ labResults }) => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Filter and sort lab results
  const filteredResults = labResults
    .filter(result => {
      if (filterCategory === 'all') return true;
      return result.testType.category.toLowerCase() === filterCategory.toLowerCase();
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.resultDate - a.resultDate;
      } else if (sortBy === 'test') {
        return a.testType.name.localeCompare(b.testType.name);
      }
      return 0;
    });

  // Get unique categories for filter
  const categories = [...new Set(labResults.map(result => result.testType.category))];

  // Check if a result is abnormal
  const isAbnormal = (result) => {
    const { testType, results } = result;
    
    for (const [key, value] of Object.entries(results)) {
      const normalRange = testType.normalRanges[key];
      if (normalRange) {
        const numValue = parseFloat(value);
        if (numValue < normalRange.min || numValue > normalRange.max) {
          return true;
        }
      }
    }
    return false;
  };

  // Get result status
  const getResultStatus = (result) => {
    if (isAbnormal(result)) {
      return { status: 'abnormal', color: 'text-red-600', bgColor: 'bg-red-100', icon: ExclamationTriangleIcon };
    }
    return { status: 'normal', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircleIcon };
  };

  // Format result value with normal range
  const formatResultWithRange = (value, normalRange, unit = '') => {
    const numValue = parseFloat(value);
    const isOutOfRange = numValue < normalRange.min || numValue > normalRange.max;
    
    return (
      <div className="space-y-1">
        <div className={`font-medium ${isOutOfRange ? 'text-red-600' : 'text-gray-900'}`}>
          {value} {unit}
          {isOutOfRange && (
            <ExclamationTriangleIcon className="inline w-4 h-4 ml-1 text-red-500" />
          )}
        </div>
        <div className="text-xs text-gray-500">
          Normal: {normalRange.min}-{normalRange.max} {normalRange.unit}
        </div>
      </div>
    );
  };

  // Generate trend data for a specific test type
  const getTrendData = (testName) => {
    const testResults = labResults
      .filter(result => result.testType.name === testName)
      .sort((a, b) => a.resultDate - b.resultDate);
    
    if (testResults.length < 2) return null;

    // Simple trend calculation
    const latest = testResults[testResults.length - 1];
    const previous = testResults[testResults.length - 2];
    
    // For demo, we'll just compare the first result value
    const latestValue = parseFloat(Object.values(latest.results)[0]);
    const previousValue = parseFloat(Object.values(previous.results)[0]);
    
    const change = latestValue - previousValue;
    const percentChange = ((change / previousValue) * 100).toFixed(1);
    
    return {
      change,
      percentChange,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  // Group results by test type for trends
  const testTypes = [...new Set(labResults.map(result => result.testType.name))];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Laboratory Results</h3>
          <p className="text-sm text-gray-500">
            Complete lab test results and trending analysis
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
          
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="test">Sort by Test</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BeakerIcon className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Results</p>
              <p className="text-lg font-bold text-blue-900">{labResults.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Normal Results</p>
              <p className="text-lg font-bold text-green-900">
                {labResults.filter(result => !isAbnormal(result)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Abnormal Results</p>
              <p className="text-lg font-bold text-red-900">
                {labResults.filter(result => isAbnormal(result)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Test Types</p>
              <p className="text-lg font-bold text-purple-900">{testTypes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Test Trends</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testTypes.slice(0, 6).map(testName => {
            const trend = getTrendData(testName);
            if (!trend) return null;
            
            return (
              <div key={testName} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{testName}</p>
                    <p className="text-xs text-gray-500">Latest vs Previous</p>
                  </div>
                  <div className="flex items-center">
                    {trend.trend === 'up' && (
                      <ArrowTrendingUpIcon className="w-5 h-5 text-red-500" />
                    )}
                    {trend.trend === 'down' && (
                      <ArrowTrendingDownIcon className="w-5 h-5 text-green-500" />
                    )}
                    <span className={`ml-1 text-sm font-medium ${
                      trend.trend === 'up' ? 'text-red-600' : 
                      trend.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {trend.percentChange}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lab Results Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Laboratory Results</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test & Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Results
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => {
                const statusInfo = getResultStatus(result);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BeakerIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {result.testType.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.resultDate.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {result.testType.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {Object.entries(result.results).map(([key, value]) => {
                          const normalRange = result.testType.normalRanges[key];
                          return (
                            <div key={key} className="text-sm">
                              <span className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>{' '}
                              {normalRange ? (
                                formatResultWithRange(value, normalRange)
                              ) : (
                                <span className="text-gray-900">{value}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className={`h-5 w-5 ${statusInfo.color} mr-2`} />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.status}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.provider}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setSelectedTest(result)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 flex items-center">
                          <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Result Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedTest.testType.name} - Detailed Results
                </h3>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Test Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Test Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Test Name:</span> {selectedTest.testType.name}</div>
                    <div><span className="font-medium">Test Code:</span> {selectedTest.testType.code}</div>
                    <div><span className="font-medium">Category:</span> {selectedTest.testType.category}</div>
                    <div><span className="font-medium">Order Date:</span> {selectedTest.orderDate.toLocaleDateString()}</div>
                    <div><span className="font-medium">Collection Date:</span> {selectedTest.collectionDate.toLocaleDateString()}</div>
                    <div><span className="font-medium">Result Date:</span> {selectedTest.resultDate.toLocaleDateString()}</div>
                    <div><span className="font-medium">Provider:</span> {selectedTest.provider}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Test Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900">{selectedTest.status}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">
                        This test was completed on {selectedTest.resultDate.toLocaleDateString()} 
                        and reviewed by {selectedTest.provider}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Detailed Results</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedTest.results).map(([key, value]) => {
                      const normalRange = selectedTest.testType.normalRanges[key];
                      const isOutOfRange = normalRange && 
                        (parseFloat(value) < normalRange.min || parseFloat(value) > normalRange.max);
                      
                      return (
                        <div key={key} className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            {isOutOfRange && (
                              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div className={`text-lg font-bold ${isOutOfRange ? 'text-red-600' : 'text-green-600'}`}>
                            {value} {normalRange?.unit || ''}
                          </div>
                          {normalRange && (
                            <div className="text-sm text-gray-500 mt-1">
                              Normal: {normalRange.min}-{normalRange.max} {normalRange.unit}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedTest(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredResults.length === 0 && (
        <div className="text-center py-12">
          <BeakerIcon className="mx-auto h-24 w-24 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No lab results found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterCategory === 'all' 
              ? 'No laboratory results recorded for this patient.'
              : `No ${filterCategory} results found. Try adjusting your filter.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default LabResults;