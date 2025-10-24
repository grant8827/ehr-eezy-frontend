import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { appointmentAPI, patientAPI, staffAPI } from '../../services/apiService';
import toast from 'react-hot-toast';
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
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mockAppointments] = useState([
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

  // Load real appointments from backend
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        
        // Get all appointments from the API (same as main appointments page)
        const response = await appointmentAPI.getAll({
          per_page: 100 // Get more appointments for calendar view
        });
        
        const appointmentsData = response.data.data || [];
        
        // Transform API appointments to match the component's expected format
        const transformedAppointments = appointmentsData.map((appointment) => ({
          id: appointment.id,
          patientName: appointment.patient ? 
            `${appointment.patient.first_name || ''} ${appointment.patient.last_name || ''}`.trim() : 
            'Unknown Patient',
          patientId: appointment.patient?.patient_id || `PAT-${appointment.id.toString().padStart(6, '0')}`,
          date: appointment.appointment_date,
          startTime: appointment.start_time || '09:00',
          endTime: appointment.end_time || '10:00',
          type: appointment.type || 'in-person',
          status: appointment.status === 'scheduled' ? 'pending' : appointment.status,
          reason: appointment.reason_for_visit || 'Consultation',
          notes: appointment.notes || '',
          phone: appointment.patient?.phone || 'No phone provided',
          email: appointment.patient?.email || 'No email provided',
          fee: appointment.fee || 150,
          insuranceProvider: 'Insurance on file',
          avatar: appointment.patient ? 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.first_name || 'P')}+${encodeURIComponent(appointment.patient.last_name || 'P')}&background=3B82F6&color=fff&size=100` :
            'https://ui-avatars.com/api/?name=P+P&background=3B82F6&color=fff&size=100',
          // Keep original appointment data for reference
          originalAppointment: appointment
        }));
        
        setAppointments(transformedAppointments);
        
        // Also load patients for new appointment creation
        const patientsResponse = await patientAPI.getAll();
        // Handle different response formats (same as PatientList component)
        const patientsData = Array.isArray(patientsResponse.data) ? 
          patientsResponse.data : 
          (patientsResponse.data?.data ? patientsResponse.data.data : []);
        console.log('Loaded patients:', patientsData); // Debug log
        setPatients(patientsData);
        
      } catch (error) {
        console.error('Error loading appointments or patients:', error);
        toast.error('Failed to load appointments or patients');
        setAppointments(mockAppointments); // Fallback to mock data
        
        // Try to load patients separately if appointments fail
        try {
          const patientsResponse = await patientAPI.getAll();
          // Handle different response formats
          const patientsData = Array.isArray(patientsResponse.data) ? 
            patientsResponse.data : 
            (patientsResponse.data?.data ? patientsResponse.data.data : []);
          console.log('Loaded patients (fallback):', patientsData); // Debug log
          setPatients(patientsData);
        } catch (patientError) {
          console.error('Error loading patients:', patientError);
          toast.error('Failed to load patients');
        }
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

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

  // Handle appointment creation using real API
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    
    console.log('=== APPOINTMENT CREATION DEBUG ===');
    console.log('Form state:', newAppointment);
    console.log('Available patients:', patients);
    
    try {
      // Safety check
      if (!patients || patients.length === 0) {
        console.error('No patients available');
        toast.error('No patients available. Please add patients first.');
        return;
      }

      // Find the selected patient from the patients list
      const selectedPatient = patients.find(p => 
        p.id.toString() === newAppointment.patientId
      );

      console.log('Selected patient ID:', newAppointment.patientId);
      console.log('Found patient:', selectedPatient);

      if (!selectedPatient) {
        console.error('Patient not found in patients list');
        toast.error('Please select a valid patient');
        return;
      }

      // Validate required fields
      if (!newAppointment.date) {
        toast.error('Please select a date');
        return;
      }
      if (!newAppointment.startTime) {
        toast.error('Please select a start time');
        return;
      }
      if (!newAppointment.duration || newAppointment.duration < 15) {
        toast.error('Duration must be at least 15 minutes');
        return;
      }

      // Get a valid staff member - this is required by the backend validation
      console.log('Fetching staff members for validation...');
      const staffResponse = await staffAPI.getAll({ per_page: 1 });
      console.log('Staff response:', staffResponse);
      
      if (!staffResponse.data || !staffResponse.data.data || staffResponse.data.data.length === 0) {
        console.error('No staff members available');
        toast.error('No staff members available. Please add staff members first.');
        return;
      }
      
      const staffId = staffResponse.data.data[0].id;
      console.log('Using staff ID:', staffId);

      const appointmentData = {
        patient_id: parseInt(selectedPatient.id),
        staff_id: parseInt(staffId),
        appointment_date: newAppointment.date,
        start_time: newAppointment.startTime,
        end_time: addMinutesToTime(newAppointment.startTime, newAppointment.duration),
        duration_minutes: parseInt(newAppointment.duration),
        type: newAppointment.type,
        reason_for_visit: newAppointment.reason || 'Telehealth consultation',
        notes: newAppointment.notes || '',
        fee: parseFloat(newAppointment.fee) || 150
      };

      console.log('Appointment data payload:', appointmentData);
      console.log('Making API call to create appointment...');

      const response = await appointmentAPI.create(appointmentData);
      console.log('API Response:', response);
      toast.success('Appointment created successfully');
      
      // Reload appointments to show the new one
      const appointmentsResponse = await appointmentAPI.getAll({ per_page: 100 });
      const appointmentsData = appointmentsResponse.data.data || [];
      
      const transformedAppointments = appointmentsData.map((appointment) => ({
        id: appointment.id,
        patientName: appointment.patient ? 
          `${appointment.patient.first_name || ''} ${appointment.patient.last_name || ''}`.trim() : 
          'Unknown Patient',
        patientId: appointment.patient?.patient_id || `PAT-${appointment.id.toString().padStart(6, '0')}`,
        date: appointment.appointment_date,
        startTime: appointment.start_time || '09:00',
        endTime: appointment.end_time || '10:00',
        type: appointment.type || 'in-person',
        status: appointment.status === 'scheduled' ? 'pending' : appointment.status,
        reason: appointment.reason_for_visit || 'Consultation',
        notes: appointment.notes || '',
        phone: appointment.patient?.phone || 'No phone provided',
        email: appointment.patient?.email || 'No email provided',
        fee: appointment.fee || 150,
        insuranceProvider: 'Insurance on file',
        avatar: appointment.patient ? 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.first_name || 'P')}+${encodeURIComponent(appointment.patient.last_name || 'P')}&background=3B82F6&color=fff&size=100` :
          'https://ui-avatars.com/api/?name=P+P&background=3B82F6&color=fff&size=100',
        originalAppointment: appointment
      }));
      
      setAppointments(transformedAppointments);
      
    } catch (error) {
      console.error('=== APPOINTMENT CREATION ERROR ===');
      console.error('Full error object:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        
        // Show specific error message if available
        if (error.response.data && error.response.data.message) {
          toast.error(`Failed to create appointment: ${error.response.data.message}`);
        } else if (error.response.data && error.response.data.errors) {
          // Laravel validation errors
          const firstError = Object.values(error.response.data.errors)[0][0];
          toast.error(`Validation error: ${firstError}`);
        } else {
          toast.error(`Server error (${error.response.status}): Failed to create appointment`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        toast.error('Network error: Could not reach server');
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
        toast.error(`Request error: ${error.message}`);
      }
    }

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

  // Update appointment status using real API
  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, { status });
      toast.success(`Appointment ${status} successfully`);
      
      // Update local state
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto m-4">
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
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Patient *
                  </label>
                  {patients && patients.length === 0 && !loading && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const patientsResponse = await patientAPI.getAll();
                          // Handle different response formats
                          const patientsData = Array.isArray(patientsResponse.data) ? 
                            patientsResponse.data : 
                            (patientsResponse.data?.data ? patientsResponse.data.data : []);
                          setPatients(patientsData);
                          toast.success(`Loaded ${patientsData.length} patients`);
                        } catch (error) {
                          console.error('Error loading patients:', error);
                          toast.error('Failed to load patients');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Reload Patients
                    </button>
                  )}
                </div>
                <select
                  required
                  value={newAppointment.patientId}
                  onChange={(e) => {
                    const selectedPatient = patients.find(p => p.id.toString() === e.target.value);
                    setNewAppointment({
                      ...newAppointment, 
                      patientId: e.target.value,
                      patientName: selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : '',
                      phone: selectedPatient?.phone || '',
                      email: selectedPatient?.email || ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Patient</option>
                  {patients && patients.length > 0 ? (
                    patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name} - {patient.phone || 'No phone'}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {loading ? 'Loading patients...' : 'No patients found'}
                    </option>
                  )}
                </select>
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
                    <option value="">Select Time</option>
                    {availableSlots && availableSlots.length > 0 ? (
                      availableSlots.filter(slot => slot.available).map(slot => (
                        <option key={slot.time} value={slot.time}>
                          {slot.displayTime}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No available slots for this date</option>
                    )}
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