import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import PharmacyOverview from './PharmacyOverview';
import PharmacyMessages from './PharmacyMessages';
import PharmacyPrescriptions from './PharmacyPrescriptions';
import PharmacyStaff from './PharmacyStaff';

const PharmacyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Load pharmacy info from localStorage
  const getPharmacyInfo = () => {
    const pharmacy = localStorage.getItem('pharmacy');
    if (pharmacy) {
      const data = JSON.parse(pharmacy);
      return {
        name: data.name || 'Pharmacy',
        address: data.address ? `${data.address}, ${data.city}, ${data.state} ${data.zip_code}` : '',
        phone: data.phone || '',
        email: data.email || '',
      };
    }
    return {
      name: 'CVS Pharmacy - Main Street',
      address: '123 Main St, Springfield, IL 62701',
      phone: '(217) 555-0123',
      email: 'pharmacy@cvs.com',
    };
  };
  
  const [pharmacyInfo, setPharmacyInfo] = useState(getPharmacyInfo());

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
    { id: 'prescriptions', name: 'Prescriptions', icon: ClipboardDocumentListIcon },
    { id: 'messages', name: 'Messages', icon: EnvelopeIcon },
    { id: 'staff', name: 'Staff', icon: UsersIcon },
  ];

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PharmacyOverview />;
      case 'prescriptions':
        return <PharmacyPrescriptions />;
      case 'messages':
        return <PharmacyMessages />;
      case 'staff':
        return <PharmacyStaff />;
      default:
        return <PharmacyOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Rx</span>
              </div>
              <span className="font-semibold text-gray-900">Pharmacy</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <Bars3Icon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Pharmacy Info */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {pharmacyInfo.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 truncate">{pharmacyInfo.address}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  sidebarOpen ? 'px-3' : 'justify-center'
                } py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                {sidebarOpen && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              sidebarOpen ? 'px-3' : 'justify-center'
            } py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors`}
          >
            <ArrowRightOnRectangleIcon
              className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''}`}
            />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {navigation.find((item) => item.id === activeTab)?.name}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {pharmacyInfo.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
