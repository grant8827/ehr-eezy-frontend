import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TelehealthAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days'); // 7days, 30days, 90days, 1year
  const [selectedMetric, setSelectedMetric] = useState('consultations'); // consultations, revenue, patients, satisfaction

  // Mock analytics data
  const analyticsData = {
    '7days': {
      consultations: {
        total: 42,
        completed: 38,
        cancelled: 3,
        noShow: 1,
        change: 12.5,
        trend: 'up'
      },
      revenue: {
        total: 6300,
        average: 150,
        change: 8.3,
        trend: 'up'
      },
      patients: {
        total: 35,
        new: 8,
        returning: 27,
        change: 15.2,
        trend: 'up'
      },
      satisfaction: {
        average: 4.7,
        responses: 34,
        change: 2.1,
        trend: 'up'
      }
    },
    '30days': {
      consultations: {
        total: 156,
        completed: 142,
        cancelled: 10,
        noShow: 4,
        change: 18.7,
        trend: 'up'
      },
      revenue: {
        total: 23400,
        average: 150,
        change: 22.4,
        trend: 'up'
      },
      patients: {
        total: 98,
        new: 25,
        returning: 73,
        change: 28.6,
        trend: 'up'
      },
      satisfaction: {
        average: 4.6,
        responses: 142,
        change: -1.2,
        trend: 'down'
      }
    }
  };

  // Chart data for different metrics
  const chartData = {
    consultations: [
      { day: 'Mon', value: 8 },
      { day: 'Tue', value: 12 },
      { day: 'Wed', value: 6 },
      { day: 'Thu', value: 9 },
      { day: 'Fri', value: 15 },
      { day: 'Sat', value: 4 },
      { day: 'Sun', value: 2 }
    ],
    revenue: [
      { day: 'Mon', value: 1200 },
      { day: 'Tue', value: 1800 },
      { day: 'Wed', value: 900 },
      { day: 'Thu', value: 1350 },
      { day: 'Fri', value: 2250 },
      { day: 'Sat', value: 600 },
      { day: 'Sun', value: 300 }
    ]
  };

  const currentData = analyticsData[selectedPeriod] || analyticsData['7days'];

  // Performance metrics
  const performanceMetrics = [
    {
      title: 'Average Session Duration',
      value: '28 min',
      change: '+3.2%',
      trend: 'up',
      icon: ClockIcon,
      color: 'blue'
    },
    {
      title: 'Connection Quality',
      value: '96.8%',
      change: '+1.1%',
      trend: 'up',
      icon: VideoCameraIcon,
      color: 'green'
    },
    {
      title: 'Response Time',
      value: '45 sec',
      change: '-12.3%',
      trend: 'up',
      icon: ChatBubbleLeftRightIcon,
      color: 'purple'
    },
    {
      title: 'Completion Rate',
      value: '92.3%',
      change: '+2.8%',
      trend: 'up',
      icon: CheckCircleIcon,
      color: 'emerald'
    }
  ];

  // Popular consultation times
  const consultationTimes = [
    { time: '9:00 AM', count: 12, percentage: 85 },
    { time: '10:00 AM', count: 18, percentage: 100 },
    { time: '11:00 AM', count: 15, percentage: 83 },
    { time: '2:00 PM', count: 21, percentage: 95 },
    { time: '3:00 PM', count: 16, percentage: 89 },
    { time: '4:00 PM', count: 14, percentage: 78 }
  ];

  // Patient feedback
  const recentFeedback = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent experience! The video quality was great and the doctor was very professional.',
      date: '2025-10-12',
      consultationType: 'Follow-up'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      rating: 4,
      comment: 'Good consultation, minor audio issues but overall satisfied with the service.',
      date: '2025-10-11',
      consultationType: 'Initial'
    },
    {
      id: 3,
      patientName: 'Emily Rodriguez',
      rating: 5,
      comment: 'Very convenient and efficient. Will definitely use telehealth again.',
      date: '2025-10-10',
      consultationType: 'Medication Review'
    }
  ];

  // Get trend icon and color
  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
    );
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Telehealth Analytics</h1>
            <p className="text-gray-600">Performance insights and consultation metrics</p>
          </div>
          
          {/* Period Selector */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Consultations</p>
              <p className="text-3xl font-bold text-gray-900">{currentData.consultations.total}</p>
              <div className="flex items-center space-x-1 mt-2">
                {getTrendIcon(currentData.consultations.trend)}
                <span className={`text-sm font-medium ${getTrendColor(currentData.consultations.trend)}`}>
                  {currentData.consultations.change}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <VideoCameraIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${currentData.revenue.total.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-2">
                {getTrendIcon(currentData.revenue.trend)}
                <span className={`text-sm font-medium ${getTrendColor(currentData.revenue.trend)}`}>
                  {currentData.revenue.change}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Patients Served</p>
              <p className="text-3xl font-bold text-gray-900">{currentData.patients.total}</p>
              <div className="flex items-center space-x-1 mt-2">
                {getTrendIcon(currentData.patients.trend)}
                <span className={`text-sm font-medium ${getTrendColor(currentData.patients.trend)}`}>
                  {currentData.patients.change}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfaction Score</p>
              <p className="text-3xl font-bold text-gray-900">{currentData.satisfaction.average}</p>
              <div className="flex items-center space-x-1 mt-2">
                {getTrendIcon(currentData.satisfaction.trend)}
                <span className={`text-sm font-medium ${getTrendColor(currentData.satisfaction.trend)}`}>
                  {Math.abs(currentData.satisfaction.change)}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Consultation Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Consultations</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedMetric('consultations')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'consultations'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Consultations
              </button>
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'revenue'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Revenue
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {chartData[selectedMetric]?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{item.day}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${selectedMetric === 'revenue' ? (item.value / 2250) * 100 : (item.value / 15) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                  {selectedMetric === 'revenue' ? `$${item.value}` : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{metric.title}</h4>
                      <p className="text-xs text-gray-500">Current period</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-xs font-medium ${getTrendColor(metric.trend)}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Consultation Times */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Consultation Times</h3>
          
          <div className="space-y-4">
            {consultationTimes.map((slot, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{slot.time}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${slot.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{slot.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patient Feedback */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Patient Feedback</h3>
          
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{feedback.patientName}</span>
                    <span className="text-xs text-gray-500">{feedback.consultationType}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{feedback.comment}</p>
                <p className="text-xs text-gray-500">{feedback.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelehealthAnalytics;