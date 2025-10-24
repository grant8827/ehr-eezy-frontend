import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  HeartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UsersIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const Layout = () => {
  const { user, logout, isAdmin, isPatient } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Different navigation based on user role
  const navigation = isPatient ? [
    // Patient-specific navigation - simplified (telehealth consultation direct link)
    { name: 'Telehealth', href: '/app/telehealth/consultation', icon: HeartIcon },
    { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Medical Records', href: '/app/medical-records', icon: DocumentTextIcon },
    { name: 'Appointments', href: '/app/appointments', icon: CalendarDaysIcon },
    { name: 'Billing', href: '/app/billing', icon: CurrencyDollarIcon },
  ] : [
    // Doctor/Staff navigation
    { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
    { name: 'Patients', href: '/app/patients', icon: UserGroupIcon },
    { name: 'Patient Invitations', href: '/app/patient-invitations', icon: EnvelopeIcon },
    { name: 'Appointments', href: '/app/appointments', icon: CalendarDaysIcon },
    { name: 'Medical Records', href: '/app/medical-records', icon: DocumentTextIcon },
    { name: 'Billing', href: '/app/billing', icon: CurrencyDollarIcon },
    { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Healthcare Platform', href: '/app/telehealth', icon: HeartIcon },
    // Admin-only navigation
    ...(isAdmin ? [{ name: 'Staff Management', href: '/app/staff', icon: UsersIcon }] : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-blue-600">EHReezy</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-blue-600">EHReezy</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=3b82f6&color=fff`}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  {/* Search can be added here */}
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <Link to="/app/profile" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
                    <UserCircleIcon className="h-6 w-6" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;