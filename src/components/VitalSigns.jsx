import React, { useState, useMemo } from 'react';
import {
  HeartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const VitalSigns = ({ vitalSigns, history }) => {
  const [selectedVital, setSelectedVital] = useState(null);
  const [dateRange, setDateRange] = useState('3months');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter vitals by date range
  const filteredVitals = useMemo(() => {
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return vitalSigns;
    }
    
    return vitalSigns.filter(vital => vital.date >= startDate);
  }, [vitalSigns, dateRange]);

  // Get latest vitals
  const latestVitals = useMemo(() => {
    if (!vitalSigns || vitalSigns.length === 0) return null;
    
    const sorted = [...vitalSigns].sort((a, b) => b.date - a.date);
    return sorted[0];
  }, [vitalSigns]);

  // Calculate trends for each vital sign
  const calculateTrend = (vitalType) => {
    const recentVitals = filteredVitals
      .filter(vital => vital[vitalType] !== undefined)
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
    
    if (recentVitals.length < 2) return { trend: 'stable', change: 0, percentage: 0 };
    
    const latest = recentVitals[0][vitalType];
    const previous = recentVitals[1][vitalType];
    
    let latestValue, previousValue;
    
    // Handle blood pressure (systolic/diastolic)
    if (typeof latest === 'object' && latest.systolic !== undefined) {
      latestValue = latest.systolic;
      previousValue = previous.systolic;
    } else if (typeof latest === 'number') {
      latestValue = latest;
      previousValue = previous;
    } else {
      return { trend: 'stable', change: 0, percentage: 0 };
    }
    
    const change = latestValue - previousValue;
    const percentage = ((change / previousValue) * 100).toFixed(1);
    
    let trend = 'stable';
    if (Math.abs(change) > 0.1) {
      trend = change > 0 ? 'up' : 'down';
    }
    
    return { trend, change: change.toFixed(1), percentage };
  };

  // Check if vitals are within normal ranges
  const isVitalNormal = (vital, type) => {
    const normalRanges = {
      bloodPressure: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },
      heartRate: { min: 60, max: 100 },
      temperature: { min: 97.0, max: 99.5 },
      respiratoryRate: { min: 12, max: 20 },
      oxygenSaturation: { min: 95, max: 100 },
      weight: null, // Weight doesn't have abnormal ranges typically
      height: null,
      bmi: { min: 18.5, max: 24.9 }
    };
    
    const range = normalRanges[type];
    if (!range) return true;
    
    if (type === 'bloodPressure') {
      const systolicNormal = vital.systolic >= range.systolic.min && vital.systolic <= range.systolic.max;
      const diastolicNormal = vital.diastolic >= range.diastolic.min && vital.diastolic <= range.diastolic.max;
      return systolicNormal && diastolicNormal;
    }
    
    return vital >= range.min && vital <= range.max;
  };

  // Format vital values for display
  const formatVitalValue = (value, type) => {
    if (value === undefined || value === null) return 'N/A';
    
    switch (type) {
      case 'bloodPressure':
        return `${value.systolic}/${value.diastolic} mmHg`;
      case 'heartRate':
        return `${value} bpm`;
      case 'temperature':
        return `${value}°F`;
      case 'respiratoryRate':
        return `${value} breaths/min`;
      case 'oxygenSaturation':
        return `${value}%`;
      case 'weight':
        return `${value} lbs`;
      case 'height':
        return `${Math.floor(value / 12)}'${value % 12}"`;
      case 'bmi':
        return `${value} kg/m²`;
      default:
        return value.toString();
    }
  };

  // Get trend icon and color
  const getTrendDisplay = (trend) => {
    switch (trend.trend) {
      case 'up':
        return {
          icon: ArrowTrendingUpIcon,
          color: 'text-red-500',
          text: `+${trend.percentage}%`
        };
      case 'down':
        return {
          icon: ArrowTrendingDownIcon,
          color: 'text-green-500',
          text: `${trend.percentage}%`
        };
      default:
        return {
          icon: null,
          color: 'text-gray-500',
          text: 'Stable'
        };
    }
  };

  // Vital sign metrics
  const vitalMetrics = [
    { key: 'bloodPressure', name: 'Blood Pressure', icon: HeartIcon, unit: 'mmHg' },
    { key: 'heartRate', name: 'Heart Rate', icon: HeartIcon, unit: 'bpm' },
    { key: 'temperature', name: 'Temperature', icon: ChartBarIcon, unit: '°F' },
    { key: 'respiratoryRate', name: 'Respiratory Rate', icon: ChartBarIcon, unit: '/min' },
    { key: 'oxygenSaturation', name: 'Oxygen Saturation', icon: ChartBarIcon, unit: '%' },
    { key: 'weight', name: 'Weight', icon: ChartBarIcon, unit: 'lbs' },
    { key: 'bmi', name: 'BMI', icon: ChartBarIcon, unit: 'kg/m²' }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Vital Signs</h3>
          <p className="text-sm text-gray-500">
            Track and monitor patient vital signs and measurements over time
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          
          {/* Metric Filter */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Metrics</option>
            {vitalMetrics.map(metric => (
              <option key={metric.key} value={metric.key}>{metric.name}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Record Vitals
          </button>
        </div>
      </div>

      {/* Latest Vitals Summary */}
      {latestVitals && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Latest Vitals</h4>
            <div className="text-sm text-gray-500">
              {latestVitals.date.toLocaleDateString()} at {latestVitals.date.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vitalMetrics.map(metric => {
              if (selectedMetric !== 'all' && selectedMetric !== metric.key) return null;
              
              const value = latestVitals[metric.key];
              const isNormal = isVitalNormal(value, metric.key);
              const trend = calculateTrend(metric.key);
              const trendDisplay = getTrendDisplay(trend);
              const TrendIcon = trendDisplay.icon;
              
              return (
                <div key={metric.key} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <metric.icon className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                    </div>
                    <div className="flex items-center">
                      {isNormal ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`text-lg font-semibold ${isNormal ? 'text-gray-900' : 'text-red-600'}`}>
                      {formatVitalValue(value, metric.key)}
                    </div>
                    
                    {TrendIcon && (
                      <div className="flex items-center text-xs">
                        <TrendIcon className={`w-3 h-3 mr-1 ${trendDisplay.color}`} />
                        <span className={trendDisplay.color}>{trendDisplay.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vital Signs History Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Vital Signs History</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Pressure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heart Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resp. Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O2 Sat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVitals.slice(0, 10).map((vital) => (
                <tr key={vital.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{vital.date.toLocaleDateString()}</div>
                      <div className="text-gray-500">{vital.date.toLocaleTimeString()}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={isVitalNormal(vital.bloodPressure, 'bloodPressure') ? 'text-gray-900' : 'text-red-600 font-medium'}>
                      {formatVitalValue(vital.bloodPressure, 'bloodPressure')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={isVitalNormal(vital.heartRate, 'heartRate') ? 'text-gray-900' : 'text-red-600 font-medium'}>
                      {formatVitalValue(vital.heartRate, 'heartRate')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={isVitalNormal(vital.temperature, 'temperature') ? 'text-gray-900' : 'text-red-600 font-medium'}>
                      {formatVitalValue(vital.temperature, 'temperature')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={isVitalNormal(vital.respiratoryRate, 'respiratoryRate') ? 'text-gray-900' : 'text-red-600 font-medium'}>
                      {formatVitalValue(vital.respiratoryRate, 'respiratoryRate')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={isVitalNormal(vital.oxygenSaturation, 'oxygenSaturation') ? 'text-gray-900' : 'text-red-600 font-medium'}>
                      {formatVitalValue(vital.oxygenSaturation, 'oxygenSaturation')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatVitalValue(vital.weight, 'weight')}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedVital(vital)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 flex items-center">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredVitals.length > 10 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Showing 10 of {filteredVitals.length} records
          </div>
        )}
      </div>

      {/* Detailed Vital Modal */}
      {selectedVital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Vital Signs - {selectedVital.date.toLocaleString()}
                </h3>
                <button
                  onClick={() => setSelectedVital(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Detailed Vitals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vitalMetrics.map(metric => {
                  const value = selectedVital[metric.key];
                  const isNormal = isVitalNormal(value, metric.key);
                  
                  if (value === undefined || value === null) return null;
                  
                  return (
                    <div key={metric.key} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <metric.icon className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium text-gray-900">{metric.name}</span>
                        </div>
                        <div className="flex items-center">
                          {isNormal ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          ) : (
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className={`text-xl font-bold ${isNormal ? 'text-gray-900' : 'text-red-600'}`}>
                        {formatVitalValue(value, metric.key)}
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-1">
                        {isNormal ? 'Within normal range' : 'Outside normal range'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Information */}
              {selectedVital.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {selectedVital.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedVital(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredVitals.length === 0 && (
        <div className="text-center py-12">
          <HeartIcon className="mx-auto h-24 w-24 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No vital signs recorded</h3>
          <p className="mt-1 text-sm text-gray-500">
            {dateRange === 'all' 
              ? 'No vital signs have been recorded for this patient.'
              : `No vital signs found in the selected time period. Try adjusting your date range.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default VitalSigns;