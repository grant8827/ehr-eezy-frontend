import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const AppointmentForm = ({ isOpen, onClose, appointment, initialDate, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: '',
    staff_id: '',
    appointment_date: '',
    start_time: '',
    end_time: '',
    duration_minutes: 30,
    type: 'in-person',
    status: 'scheduled',
    reason_for_visit: '',
    notes: '',
    fee: '',
    requires_insurance_verification: false,
    send_reminder: true,
    reminder_hours_before: 24
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      fetchStaff();
      
      if (appointment) {
        setFormData({
          patient_id: appointment.patient_id || '',
          staff_id: appointment.staff_id || '',
          appointment_date: appointment.appointment_date || '',
          start_time: appointment.start_time || '',
          end_time: appointment.end_time || '',
          duration_minutes: appointment.duration_minutes || 30,
          type: appointment.type || 'in-person',
          status: appointment.status || 'scheduled',
          reason_for_visit: appointment.reason_for_visit || '',
          notes: appointment.notes || '',
          fee: appointment.fee || '',
          requires_insurance_verification: appointment.requires_insurance_verification || false,
          send_reminder: appointment.send_reminder !== false,
          reminder_hours_before: appointment.reminder_hours_before || 24
        });
      } else {
        setFormData({
          patient_id: '',
          staff_id: user?.role === 'staff' ? user.id : '',
          appointment_date: initialDate ? initialDate.toISOString().split('T')[0] : '',
          start_time: '',
          end_time: '',
          duration_minutes: 30,
          type: 'in-person',
          status: 'scheduled',
          reason_for_visit: '',
          notes: '',
          fee: '',
          requires_insurance_verification: false,
          send_reminder: true,
          reminder_hours_before: 24
        });
      }
    }
  }, [isOpen, appointment, user]);

  // Check availability when date, staff, or duration changes
  useEffect(() => {
    if (formData.appointment_date && formData.staff_id && formData.duration_minutes) {
      checkAvailability();
    }
  }, [formData.appointment_date, formData.staff_id, formData.duration_minutes]);

  // Update end_time when start_time or duration changes
  useEffect(() => {
    if (formData.start_time && formData.duration_minutes) {
      const [hours, minutes] = formData.start_time.split(':');
      const startTime = new Date();
      startTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      const endTime = new Date(startTime.getTime() + (formData.duration_minutes * 60000));
      const endTimeString = endTime.toTimeString().slice(0, 5);
      
      setFormData(prev => ({ ...prev, end_time: endTimeString }));
    }
  }, [formData.start_time, formData.duration_minutes]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients');
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/staff');
      setStaff(response.data.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff');
    }
  };

  const checkAvailability = async () => {
    try {
      setCheckingAvailability(true);
      console.log('Checking availability with params:', {
        staff_id: formData.staff_id,
        date: formData.appointment_date,
        duration_minutes: formData.duration_minutes,
        exclude_appointment_id: appointment?.id
      });
      
      const response = await axios.get(`/api/appointments/availability/check`, {
        params: {
          staff_id: formData.staff_id,
          date: formData.appointment_date,
          duration_minutes: parseInt(formData.duration_minutes),
          exclude_appointment_id: appointment?.id
        }
      });
      
      console.log('Availability response:', response.data);
      setAvailableSlots(response.data.available_slots || []);
    } catch (error) {
      console.error('Error checking availability:', error);
      console.error('Error details:', error.response?.data || error.message);
      setAvailableSlots([]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === 'checkbox' ? checked : value;
    
    // Convert numeric fields to numbers
    if (name === 'duration_minutes' || name === 'fee' || name === 'reminder_hours_before') {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_id) newErrors.patient_id = 'Patient is required';
    if (!formData.staff_id) newErrors.staff_id = 'Staff member is required';
    if (!formData.appointment_date) newErrors.appointment_date = 'Date is required';
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.duration_minutes || formData.duration_minutes < 15) {
      newErrors.duration_minutes = 'Duration must be at least 15 minutes';
    }
    if (!formData.reason_for_visit) newErrors.reason_for_visit = 'Reason for visit is required';

    // Check if selected time slot is available
    if (formData.start_time && availableSlots.length > 0) {
      const isAvailable = availableSlots.some(slot => 
        slot.start_time === formData.start_time
      );
      if (!isAvailable) {
        newErrors.start_time = 'Selected time slot is not available';
      }
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.appointment_date = 'Date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const submitData = { ...formData };
      
      // Convert fee to number if provided
      if (submitData.fee) {
        submitData.fee = parseFloat(submitData.fee);
      }
      


      if (appointment) {
        await axios.put(`/api/appointments/${appointment.id}`, submitData);
        toast.success('Appointment updated successfully');
      } else {
        await axios.post('/api/appointments', submitData);
        toast.success('Appointment scheduled successfully');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving appointment:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error('Please fix the validation errors');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to save appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            {appointment ? 'Edit Appointment' : 'Schedule New Appointment'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient and Staff Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.patient_id ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.phone}
                  </option>
                ))}
              </select>
              {errors.patient_id && (
                <p className="mt-1 text-sm text-red-600">{errors.patient_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider *
              </label>
              <select
                name="staff_id"
                value={formData.staff_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.staff_id ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Provider</option>
                {staff.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name} ({member.role})
                  </option>
                ))}
              </select>
              {errors.staff_id && (
                <p className="mt-1 text-sm text-red-600">{errors.staff_id}</p>
              )}
            </div>
          </div>

          {/* Date, Time and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.appointment_date ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.appointment_date && (
                <p className="mt-1 text-sm text-red-600">{errors.appointment_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <select
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
              {errors.duration_minutes && (
                <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="in-person">In-Person</option>
                <option value="telehealth">Telehealth</option>
              </select>
            </div>
          </div>

          {/* Available Time Slots */}
          {formData.appointment_date && formData.staff_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots *
              </label>
              {checkingAvailability ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Checking availability...</span>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-md">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No available slots</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Please select a different date or provider.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, start_time: slot.start_time }))}
                      className={`p-3 text-sm rounded-md border-2 transition-colors ${
                        formData.start_time === slot.start_time
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {slot.start_time} - {slot.end_time}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {errors.start_time && (
                <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
              )}
            </div>
          )}

          {/* Reason and Notes */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit *
              </label>
              <input
                type="text"
                name="reason_for_visit"
                value={formData.reason_for_visit}
                onChange={handleChange}
                placeholder="e.g., Annual checkup, Follow-up appointment"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.reason_for_visit ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.reason_for_visit && (
                <p className="mt-1 text-sm text-red-600">{errors.reason_for_visit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes or special instructions"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fee and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee ($)
              </label>
              <input
                type="number"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="requires_insurance_verification"
                checked={formData.requires_insurance_verification}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Requires insurance verification
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="send_reminder"
                checked={formData.send_reminder}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Send appointment reminder
              </label>
            </div>

            {formData.send_reminder && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours before appointment
                </label>
                <select
                  name="reminder_hours_before"
                  value={formData.reminder_hours_before}
                  onChange={handleChange}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={24}>1 day</option>
                  <option value={48}>2 days</option>
                </select>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading || (availableSlots.length === 0 && formData.appointment_date && formData.staff_id)}
            >
              {loading ? 'Saving...' : appointment ? 'Update Appointment' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;