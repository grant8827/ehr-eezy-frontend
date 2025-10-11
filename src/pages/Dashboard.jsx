import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, isDoctor, isPatient, isAdmin, isReceptionist, isNurse } = useAuth();

  // Mock data - in real app, this would come from API
  const stats = {
    totalPatients: 1247,
    todayAppointments: 8,
    pendingRecords: 12,
    monthlyRevenue: 45670,
    unreadMessages: 5,
    upcomingAppointments: 15,
  };

  const recentAppointments = [
    {
      id: 1,
      patient: 'John Doe',
      time: '09:00 AM',
      type: 'Regular Checkup',
      status: 'confirmed',
    },
    {
      id: 2,
      patient: 'Jane Smith',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'pending',
    },
    {
      id: 3,
      patient: 'Mike Johnson',
      time: '02:00 PM',
      type: 'Telehealth',
      status: 'confirmed',
    },
  ];

  const recentMessages = [
    {
      id: 1,
      from: 'Dr. Sarah Wilson',
      subject: 'Patient consultation follow-up',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      from: 'Reception',
      subject: 'Appointment confirmation',
      time: '4 hours ago',
      unread: false,
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getDashboardStats = () => {
    if (isDoctor) {
      return [
        {
          name: "Today's Appointments",
          stat: stats.todayAppointments,
          icon: CalendarDaysIcon,
          change: '+2',
          changeType: 'increase',
        },
        {
          name: 'Total Patients',
          stat: stats.totalPatients,
          icon: UserGroupIcon,
          change: '+12',
          changeType: 'increase',
        },
        {
          name: 'Pending Records',
          stat: stats.pendingRecords,
          icon: DocumentTextIcon,
          change: '-3',
          changeType: 'decrease',
        },
        {
          name: 'Unread Messages',
          stat: stats.unreadMessages,
          icon: ChatBubbleLeftRightIcon,
          change: '+2',
          changeType: 'increase',
        },
      ];
    }

    if (isPatient) {
      return [
        {
          name: 'Upcoming Appointments',
          stat: 2,
          icon: CalendarDaysIcon,
          change: '+1',
          changeType: 'increase',
        },
        {
          name: 'Medical Records',
          stat: 15,
          icon: DocumentTextIcon,
          change: '+1',
          changeType: 'increase',
        },
        {
          name: 'Unread Messages',
          stat: 3,
          icon: ChatBubbleLeftRightIcon,
          change: '+1',
          changeType: 'increase',
        },
        {
          name: 'Prescriptions',
          stat: 8,
          icon: ClockIcon,
          change: '0',
          changeType: 'same',
        },
      ];
    }

    // Default admin/receptionist/nurse stats
    return [
      {
        name: 'Total Patients',
        stat: stats.totalPatients,
        icon: UserGroupIcon,
        change: '+12',
        changeType: 'increase',
      },
      {
        name: "Today's Appointments",
        stat: stats.todayAppointments,
        icon: CalendarDaysIcon,
        change: '+2',
        changeType: 'increase',
      },
      {
        name: 'Monthly Revenue',
        stat: `$${stats.monthlyRevenue.toLocaleString()}`,
        icon: CurrencyDollarIcon,
        change: '+8.2%',
        changeType: 'increase',
      },
      {
        name: 'Pending Records',
        stat: stats.pendingRecords,
        icon: DocumentTextIcon,
        change: '-3',
        changeType: 'decrease',
      },
    ];
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {getGreeting()}, {user?.first_name}! 👋
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Here's what's happening with your {isPatient ? 'health records' : 'practice'} today.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {getDashboardStats().map((item) => (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{item.stat}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span
                    className={`font-medium ${
                      item.changeType === 'increase'
                        ? 'text-green-600'
                        : item.changeType === 'decrease'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.change}
                  </span>
                  <span className="text-gray-500"> from last week</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Appointments */}
        {!isPatient && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Today's Appointments
              </h3>
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentAppointments.map((appointment) => (
                    <li key={appointment.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {appointment.status === 'confirmed' ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-400" />
                          ) : (
                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {appointment.patient}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {appointment.type} • {appointment.time}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View all appointments
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Recent Messages */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Messages</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentMessages.map((message) => (
                  <li key={message.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{message.from}</p>
                        <p className="text-sm text-gray-500 truncate">{message.subject}</p>
                        <p className="text-xs text-gray-400">{message.time}</p>
                      </div>
                      {message.unread && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="#"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all messages
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions for Patients */}
        {isPatient && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <CalendarDaysIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-blue-900">Book Appointment</span>
                </button>
                <button className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-green-900">View Medical Records</span>
                </button>
                <button className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-purple-900">Send Message</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Health Tips for Patients */}
      {isPatient && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Health Tip of the Day</h3>
          <p className="text-gray-700">
            Remember to stay hydrated! Aim for at least 8 glasses of water daily to maintain optimal health and support your body's natural functions.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;