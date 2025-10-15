import { appointmentAPI } from './apiService';
import toast from 'react-hot-toast';
import { format, parseISO, isToday, isFuture, isPast } from 'date-fns';

// Appointment service to handle all appointment-related operations
export const appointmentService = {
  // Get all appointments with optional filters
  async getAllAppointments(filters = {}) {
    try {
      const params = {};
      
      if (filters.date) {
        params.date = filters.date;
      }
      if (filters.staff_id) {
        params.staff_id = filters.staff_id;
      }
      if (filters.patient_id) {
        params.patient_id = filters.patient_id;
      }
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.type) {
        params.type = filters.type;
      }
      if (filters.start_date && filters.end_date) {
        params.start_date = filters.start_date;
        params.end_date = filters.end_date;
      }
      if (filters.perPage) {
        params.per_page = filters.perPage;
      }

      const response = await appointmentAPI.getAll(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      throw error;
    }
  },

  // Get a single appointment by ID
  async getAppointmentById(id) {
    try {
      const response = await appointmentAPI.getById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      toast.error('Failed to load appointment details');
      throw error;
    }
  },

  // Create a new appointment
  async createAppointment(appointmentData) {
    try {
      const response = await appointmentAPI.create(appointmentData);
      toast.success('Appointment created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create appointment');
      }
      throw error;
    }
  },

  // Update an existing appointment
  async updateAppointment(id, appointmentData) {
    try {
      const response = await appointmentAPI.update(id, appointmentData);
      toast.success('Appointment updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to update appointment');
      }
      throw error;
    }
  },

  // Delete an appointment
  async deleteAppointment(id) {
    try {
      await appointmentAPI.delete(id);
      toast.success('Appointment deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
      throw error;
    }
  },

  // Check availability for scheduling
  async checkAvailability(staffId, date, durationMinutes = 60) {
    try {
      const params = {
        staff_id: staffId,
        date: date,
        duration_minutes: durationMinutes
      };
      
      const response = await appointmentAPI.checkAvailability(params);
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check availability');
      throw error;
    }
  },

  // Update appointment status
  async updateAppointmentStatus(id, status, cancellationReason = null) {
    try {
      const data = { status };
      if (cancellationReason) {
        data.cancellation_reason = cancellationReason;
      }
      
      const response = await appointmentAPI.updateStatus(id, data);
      toast.success(`Appointment ${status} successfully`);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
      throw error;
    }
  },

  // Get today's appointments
  async getTodayAppointments() {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      return await this.getAllAppointments({ date: today });
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      return { data: [] };
    }
  },

  // Get upcoming appointments
  async getUpcomingAppointments() {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'); // 30 days from now
      
      return await this.getAllAppointments({
        start_date: today,
        end_date: endDate,
        status: 'scheduled'
      });
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      return { data: [] };
    }
  },

  // Get appointment statistics
  async getAppointmentStats() {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const startOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
      const endOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd');

      // Get today's appointments
      const todayResponse = await this.getAllAppointments({ date: today });
      const todayAppointments = todayResponse.data || [];

      // Get this month's appointments
      const monthResponse = await this.getAllAppointments({
        start_date: startOfMonth,
        end_date: endOfMonth
      });
      const monthAppointments = monthResponse.data || [];

      return {
        today: {
          total: todayAppointments.length,
          completed: todayAppointments.filter(apt => apt.status === 'completed').length,
          cancelled: todayAppointments.filter(apt => apt.status === 'cancelled').length,
          pending: todayAppointments.filter(apt => apt.status === 'scheduled').length,
        },
        thisMonth: {
          total: monthAppointments.length,
          completed: monthAppointments.filter(apt => apt.status === 'completed').length,
          cancelled: monthAppointments.filter(apt => apt.status === 'cancelled').length,
        }
      };
    } catch (error) {
      console.error('Error getting appointment stats:', error);
      return {
        today: { total: 0, completed: 0, cancelled: 0, pending: 0 },
        thisMonth: { total: 0, completed: 0, cancelled: 0 }
      };
    }
  },

  // Format appointment time for display
  formatAppointmentTime(appointment) {
    if (!appointment.start_time || !appointment.end_time) {
      return 'Time TBA';
    }
    
    return appointment.formatted_time || `${appointment.start_time} - ${appointment.end_time}`;
  },

  // Format appointment date for display
  formatAppointmentDate(appointment) {
    if (!appointment.appointment_date) {
      return 'Date TBA';
    }
    
    return appointment.formatted_date || format(parseISO(appointment.appointment_date), 'MMM d, yyyy');
  },

  // Get appointment status color
  getStatusColor(status) {
    const colors = {
      'scheduled': 'blue',
      'confirmed': 'green',
      'in_progress': 'yellow',
      'completed': 'green',
      'cancelled': 'red',
      'no_show': 'gray',
      'rescheduled': 'purple'
    };
    
    return colors[status] || 'gray';
  },

  // Get appointment status display text
  getStatusText(status) {
    const texts = {
      'scheduled': 'Scheduled',
      'confirmed': 'Confirmed',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'no_show': 'No Show',
      'rescheduled': 'Rescheduled'
    };
    
    return texts[status] || status;
  },

  // Check if appointment can be cancelled
  canBeCancelled(appointment) {
    const appointmentDate = new Date(appointment.appointment_date);
    const now = new Date();
    
    // Can't cancel past appointments or appointments already cancelled/completed
    if (isPast(appointmentDate) || ['cancelled', 'completed', 'no_show'].includes(appointment.status)) {
      return false;
    }
    
    // Can cancel if appointment is more than 24 hours away
    const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilAppointment > 24;
  },

  // Check if appointment can be rescheduled
  canBeRescheduled(appointment) {
    return this.canBeCancelled(appointment) && appointment.status !== 'cancelled';
  },

  // Validate appointment data before submission
  validateAppointmentData(appointmentData) {
    const errors = {};

    // Required fields
    if (!appointmentData.patient_id) {
      errors.patient_id = 'Patient is required';
    }
    if (!appointmentData.staff_id) {
      errors.staff_id = 'Staff member is required';
    }
    if (!appointmentData.appointment_date) {
      errors.appointment_date = 'Appointment date is required';
    }
    if (!appointmentData.start_time) {
      errors.start_time = 'Start time is required';
    }
    if (!appointmentData.end_time) {
      errors.end_time = 'End time is required';
    }
    if (!appointmentData.type) {
      errors.type = 'Appointment type is required';
    }
    if (!appointmentData.duration_minutes || appointmentData.duration_minutes < 15) {
      errors.duration_minutes = 'Duration must be at least 15 minutes';
    }

    // Date validations
    if (appointmentData.appointment_date) {
      const appointmentDate = new Date(appointmentData.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (appointmentDate < today) {
        errors.appointment_date = 'Appointment date cannot be in the past';
      }
    }

    // Time validations
    if (appointmentData.start_time && appointmentData.end_time) {
      if (appointmentData.start_time >= appointmentData.end_time) {
        errors.end_time = 'End time must be after start time';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Generate time slots for scheduling
  generateTimeSlots(startHour = 9, endHour = 17, intervalMinutes = 30) {
    const slots = [];
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = format(new Date(`2000-01-01 ${time}`), 'h:mm a');
        
        slots.push({
          value: time,
          label: displayTime
        });
      }
    }
    
    return slots;
  },
};

export default appointmentService;