import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import AppointmentList from '../components/AppointmentList';
import AppointmentCalendar from '../components/AppointmentCalendar';
import { 
  ListBulletIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline';

const Appointments = () => {
  const location = useLocation();
  
  const tabs = [
    { name: 'List', href: '/app/appointments', icon: ListBulletIcon },
    { name: 'Calendar', href: '/app/appointments/calendar', icon: CalendarIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.href || 
              (tab.href === '/app/appointments' && location.pathname === '/app/appointments/');
            
            return (
              <Link
                key={tab.name}
                to={tab.href}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon
                  className={`-ml-0.5 mr-2 h-5 w-5 ${
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <Routes>
        <Route index element={<AppointmentList />} />
        <Route path="calendar" element={<AppointmentCalendar />} />
        <Route path="*" element={<Navigate to="/app/appointments" replace />} />
      </Routes>
    </div>
  );
};

export default Appointments;