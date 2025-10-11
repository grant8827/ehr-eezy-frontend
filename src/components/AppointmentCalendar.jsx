import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AppointmentForm from './AppointmentForm';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AppointmentCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchStaff();
  }, [currentDate, viewMode, selectedStaff]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const startDate = getStartDate();
      const endDate = getEndDate();
      
      const params = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      };

      if (selectedStaff) {
        params.staff_id = selectedStaff;
      }

      const response = await axios.get('/api/appointments', { params });
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/staff');
      setStaff(response.data.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const getStartDate = () => {
    const date = new Date(currentDate);
    if (viewMode === 'month') {
      date.setDate(1);
      date.setDate(date.getDate() - date.getDay()); // Start from Sunday
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() - date.getDay()); // Start from Sunday
    }
    return date;
  };

  const getEndDate = () => {
    const date = new Date(currentDate);
    if (viewMode === 'month') {
      date.setMonth(date.getMonth() + 1);
      date.setDate(0); // Last day of current month
      date.setDate(date.getDate() + (6 - date.getDay())); // End on Saturday
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() + (6 - date.getDay())); // End on Saturday
    }
    return date;
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getCalendarDays = () => {
    const startDate = getStartDate();
    const endDate = getEndDate();
    const days = [];
    
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointment_date === dateString);
  };

  const getAppointmentsForTime = (date, hour) => {
    const dateAppointments = getAppointmentsForDate(date);
    return dateAppointments.filter(apt => {
      if (apt.start_time) {
        const aptHour = parseInt(apt.start_time.split(':')[0]);
        return aptHour === hour;
      }
      return false;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 border-blue-200 text-blue-800',
      confirmed: 'bg-green-100 border-green-200 text-green-800',
      'in_progress': 'bg-yellow-100 border-yellow-200 text-yellow-800',
      completed: 'bg-gray-100 border-gray-200 text-gray-800',
      cancelled: 'bg-red-100 border-red-200 text-red-800',
      'no_show': 'bg-red-100 border-red-200 text-red-800'
    };
    return colors[status] || 'bg-gray-100 border-gray-200 text-gray-800';
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMonthView = () => {
    const days = getCalendarDays();
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map(day => {
            const dayAppointments = getAppointmentsForDate(day);
            return (
              <div 
                key={day.toISOString()} 
                className={`min-h-32 bg-white p-2 ${!isCurrentMonth(day) ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    isToday(day) 
                      ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' 
                      : isCurrentMonth(day) ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {day.getDate()}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedAppointment(null);
                      setShowForm(true);
                    }}
                    className="text-gray-400 hover:text-blue-600 p-1"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map(appointment => (
                    <div
                      key={appointment.id}
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowForm(true);
                      }}
                      className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm ${getStatusColor(appointment.status)}`}
                    >
                      <div className="font-medium truncate">
                        {appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : 'Unknown Patient'}
                      </div>
                      {appointment.start_time && (
                        <div className="text-xs opacity-75">
                          {formatTime(appointment.start_time)}
                        </div>
                      )}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = getStartDate();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          <div className="bg-gray-50 p-2 text-center text-xs font-semibold text-gray-700"></div>
          {days.map(day => (
            <div key={day.toISOString()} className={`bg-gray-50 p-2 text-center ${isToday(day) ? 'bg-blue-50' : ''}`}>
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-medium mt-1 ${
                isToday(day) 
                  ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                  : 'text-gray-900'
              }`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Week Body */}
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="bg-white p-2 text-right text-xs text-gray-500 border-r">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
              {days.map(day => {
                const timeAppointments = getAppointmentsForTime(day, hour);
                return (
                  <div 
                    key={`${day.toISOString()}-${hour}`} 
                    className="bg-white p-1 min-h-16 border-r border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedAppointment(null);
                      setShowForm(true);
                    }}
                  >
                    <div className="space-y-1">
                      {timeAppointments.map(appointment => (
                        <div
                          key={appointment.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(appointment);
                            setShowForm(true);
                          }}
                          className={`text-xs p-1 rounded border cursor-pointer ${getStatusColor(appointment.status)}`}
                        >
                          <div className="font-medium truncate">
                            {appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : 'Unknown Patient'}
                          </div>
                          <div className="opacity-75">
                            {appointment.reason_for_visit || 'No reason provided'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
    const dayAppointments = getAppointmentsForDate(currentDate);

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {formatDate(currentDate)}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {dayAppointments.length} appointments scheduled
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {hours.map(hour => {
            const hourAppointments = getAppointmentsForTime(currentDate, hour);
            return (
              <div key={hour} className="flex">
                <div className="w-20 p-4 text-right text-sm text-gray-500 border-r">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                <div 
                  className="flex-1 p-4 min-h-16 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedDate(currentDate);
                    setSelectedAppointment(null);
                    setShowForm(true);
                  }}
                >
                  {hourAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {hourAppointments.map(appointment => (
                        <div
                          key={appointment.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(appointment);
                            setShowForm(true);
                          }}
                          className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm ${getStatusColor(appointment.status)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : 'Unknown Patient'}</div>
                              <div className="text-sm opacity-75">{appointment.reason_for_visit || 'No reason provided'}</div>
                              <div className="text-xs opacity-75 mt-1">
                                {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">{appointment.staff?.name || 'Unknown Staff'}</div>
                              <div className="text-xs opacity-75">{appointment.type}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No appointments</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">View and schedule appointments</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setSelectedAppointment(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Appointment
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {/* Navigation */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Current Date */}
          <h2 className="text-xl font-semibold text-gray-900">
            {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {viewMode === 'week' && `Week of ${getStartDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            {viewMode === 'day' && formatDate(currentDate)}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Staff Filter */}
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Providers</option>
            {staff.map(member => (
              <option key={member.id} value={member.id}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </select>

          {/* View Mode */}
          <div className="flex rounded-md shadow-sm">
            {['month', 'week', 'day'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 text-sm font-medium border ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } ${mode === 'month' ? 'rounded-l-md' : mode === 'day' ? 'rounded-r-md' : ''}`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </>
      )}

      {/* Appointment Form Modal */}
      {showForm && (
        <AppointmentForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedAppointment(null);
            setSelectedDate(null);
          }}
          appointment={selectedAppointment}
          initialDate={selectedDate}
          onSuccess={() => {
            setShowForm(false);
            setSelectedAppointment(null);
            setSelectedDate(null);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
};

export default AppointmentCalendar;