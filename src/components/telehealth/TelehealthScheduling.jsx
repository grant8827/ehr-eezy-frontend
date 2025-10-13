import React, { useState, useEffect } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  VideoCameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  BellIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';

const TelehealthScheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week, day, month
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Sarah Johnson',
      patientId: 'PAT-001',
      date: '2025-10-13',
      startTime: '14:00',
      endTime: '14:30',
      type: 'telehealth',
      status: 'confirmed',
      reason: 'Follow-up consultation',
      notes: 'Patient doing well on current medication',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@email.com',
      fee: 150,
      insuranceProvider: 'Blue Cross',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c000?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      patientId: 'PAT-002',
      date: '2025-10-13',
      startTime: '15:00',
      endTime: '15:45',
      type: 'telehealth',
      status: 'pending',
      reason: 'Initial consultation',
      notes: 'New patient intake',
      phone: '+1 (555) 987-6543',
      email: 'michael.chen@email.com',
      fee: 200,
      insuranceProvider: 'Aetna',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      patientName: 'Emily Rodriguez',
      patientId: 'PAT-003',
      date: '2025-10-14',
      startTime: '10:00',
      endTime: '10:30',
      type: 'telehealth',
      status: 'confirmed',
      reason: 'Medication review',
      notes: 'Review current prescriptions',
      phone: '+1 (555) 456-7890',
      email: 'emily.rodriguez@email.com',
      fee: 120,
      insuranceProvider: 'Cigna',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    duration: 30,
    type: 'telehealth',
    reason: '',
    notes: '',
    phone: '',
    email: '',
    fee: 150,
    insuranceProvider: '',
    reminderEnabled: true
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Generate time slots for the day
  const generateTimeSlots = (date) => {
    const slots = [];
    const dayAppointments = appointments.filter(apt => apt.date === format(date, 'yyyy-MM-dd'));
    
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = dayAppointments.some(apt => apt.startTime === timeString);
        
        slots.push({
          time: timeString,
          available: !isBooked,
          displayTime: format(new Date(`2000-01-01T${timeString}`), 'h:mm a')
        });
      }
    }
    return slots;
  };

  useEffect(() => {
    setAvailableSlots(generateTimeSlots(selectedDate));
  }, [selectedDate, appointments]);

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => apt.date === format(date, 'yyyy-MM-dd'));
  };

  // Get week dates
  const getWeekDates = (date) => {
    const start = startOfWeek(date);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(start, i));
    }
    return dates;
  };

  // Handle appointment creation
  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const appointment = {
      id: Date.now(),
      patientName: newAppointment.patientName,
      patientId: newAppointment.patientId,
      date: newAppointment.date,
      startTime: newAppointment.startTime,
      endTime: addMinutesToTime(newAppointment.startTime, newAppointment.duration),
      type: newAppointment.type,
      status: 'pending',
      reason: newAppointment.reason,
      notes: newAppointment.notes,
      phone: newAppointment.phone,
      email: newAppointment.email,
      fee: newAppointment.fee,
      insuranceProvider: newAppointment.insuranceProvider,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    };

    setAppointments([...appointments, appointment]);
    setShowNewAppointment(false);
    setNewAppointment({
      patientName: '',
      patientId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      duration: 30,
      type: 'telehealth',
      reason: '',
      notes: '',
      phone: '',
      email: '',
      fee: 150,
      insuranceProvider: '',
      reminderEnabled: true
    });
  };

  // Helper function to add minutes to time
  const addMinutesToTime = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  // Update appointment status
  const updateAppointmentStatus = (appointmentId, status) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status } : apt
      )
    );
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Scheduling</h1>
            <p className="text-gray-600">Manage telehealth appointments and calendar</p>
          </div>
          <button
            onClick={() => setShowNewAppointment(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 rounded ${viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded ${viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded ${viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Week View */}
        {viewMode === 'week' && (
          <div className="p-4">
            <div className="grid grid-cols-7 gap-4">
              {getWeekDates(selectedDate).map((date, index) => {
                const dayAppointments = getAppointmentsForDate(date);
                const isToday = isSameDay(date, new Date());
                const isSelected = isSameDay(date, selectedDate);

                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium text-gray-600">
                        {format(date, 'EEE')}
                      </div>
                      <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {format(date, 'd')}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate"
                        >
                          {appointment.startTime} - {appointment.patientName}
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Date Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Appointments for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {getAppointmentsForDate(selectedDate).map((appointment) => (
                <div key={appointment.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={appointment.avatar}
                        alt={appointment.patientName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {appointment.patientName}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="w-3 h-3" />
                            <span>{appointment.startTime} - {appointment.endTime}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="View Details"
                      >
                        <DocumentTextIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="Start Video Call"
                      >
                        <VideoCameraIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                        title="Confirm Appointment"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {getAppointmentsForDate(selectedDate).length === 0 && (
                <div className="text-center py-8">
                  <CalendarDaysIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
                  <p className="text-gray-600 mb-4">No appointments found for this date.</p>
                  <button
                    onClick={() => setShowNewAppointment(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Schedule Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Time Slots */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Available Times</h3>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => {
                      setNewAppointment({
                        ...newAppointment,
                        date: format(selectedDate, 'yyyy-MM-dd'),
                        startTime: slot.time
                      });
                      setShowNewAppointment(true);
                    }}
                    className={`p-2 text-sm rounded-lg border ${
                      slot.available
                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.displayTime}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Appointments</span>
                <span className="font-semibold">{appointments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confirmed</span>
                <span className="font-semibold text-green-600">
                  {appointments.filter(apt => apt.status === 'confirmed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {appointments.filter(apt => apt.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-semibold text-blue-600">
                  ${appointments.reduce((sum, apt) => sum + apt.fee, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Schedule New Appointment</h2>
                <button
                  onClick={() => setShowNewAppointment(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateAppointment} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={newAppointment.patientId}
                    onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <select
                    required
                    value={newAppointment.startTime}
                    onChange={(e) => setNewAppointment({...newAppointment, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableSlots.filter(slot => slot.available).map(slot => (
                      <option key={slot.time} value={slot.time}>
                        {slot.displayTime}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={newAppointment.duration}
                    onChange={(e) => setNewAppointment({...newAppointment, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newAppointment.phone}
                    onChange={(e) => setNewAppointment({...newAppointment, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee ($)
                  </label>
                  <input
                    type="number"
                    value={newAppointment.fee}
                    onChange={(e) => setNewAppointment({...newAppointment, fee: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <input
                  type="text"
                  required
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewAppointment(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={selectedAppointment.avatar}
                  alt={selectedAppointment.patientName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedAppointment.patientName}</h3>
                  <p className="text-gray-600">{selectedAppointment.patientId}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Appointment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{format(parseISO(selectedAppointment.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span>{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="capitalize">{selectedAppointment.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span>${selectedAppointment.fee}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedAppointment.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedAppointment.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance:</span>
                      <span>{selectedAppointment.insuranceProvider}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Reason for Visit</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedAppointment.reason}
                </p>
              </div>

              {selectedAppointment.notes && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <VideoCameraIcon className="w-5 h-5" />
                  <span>Start Video Call</span>
                </button>
                
                <button
                  onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmed')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Confirm</span>
                </button>
                
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="w-5 h-5" />
                  <span>Reschedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelehealthScheduling;