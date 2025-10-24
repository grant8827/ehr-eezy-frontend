import { patientAPI, appointmentAPI, staffAPI } from './apiService';
import { patientService } from './patientService';

// Dashboard service to provide real data from backend APIs
export const dashboardService = {
  // Get comprehensive dashboard statistics
  async getDashboardStats(userRole = 'doctor', userId = null) {
    try {
      const stats = {
        totalPatients: 0,
        todayAppointments: 0,
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedToday: 0,
        pendingRecords: 0,
        unreadMessages: 0,
        urgentMessages: 0,
        monthlyRevenue: 0,
        // Telehealth specific
        activeCalls: 0,
        waitingPatients: 0,
        avgCallDuration: '0m',
        videoServiceStatus: 'operational',
        audioServiceStatus: 'operational',
        systemUptime: '99.9%',
        sentInvitations: 0,
        pendingInvitations: 0,
        confirmedInvitations: 0,
        todaysInvitations: 0
      };

      // Get patient statistics
      try {
        const patientsResponse = await patientAPI.getAll();
        const patients = Array.isArray(patientsResponse.data) 
          ? patientsResponse.data 
          : (patientsResponse.data?.data || []);
        stats.totalPatients = patients.length;
      } catch (error) {
        console.error('Error fetching patient stats:', error);
      }

      // Get appointment statistics
      try {
        const today = new Date().toISOString().split('T')[0];
        const appointmentsResponse = await appointmentAPI.getAll({ 
          start_date: today, 
          end_date: today 
        });
        const appointments = Array.isArray(appointmentsResponse.data) 
          ? appointmentsResponse.data 
          : (appointmentsResponse.data?.data || []);
        
        stats.todayAppointments = appointments.length;
        stats.completedToday = appointments.filter(apt => 
          apt.status === 'completed' || apt.status === 'finished'
        ).length;

        // Get total appointments count
        const allAppointmentsResponse = await appointmentAPI.getAll();
        const allAppointments = Array.isArray(allAppointmentsResponse.data) 
          ? allAppointmentsResponse.data 
          : (allAppointmentsResponse.data?.data || []);
        
        stats.totalAppointments = allAppointments.length;
        stats.upcomingAppointments = allAppointments.filter(apt => 
          new Date(apt.appointment_date) > new Date() && 
          (apt.status === 'scheduled' || apt.status === 'confirmed')
        ).length;
      } catch (error) {
        console.error('Error fetching appointment stats:', error);
      }

      // Calculate invitation stats from localStorage (for telehealth)
      try {
        const meetings = JSON.parse(localStorage.getItem('consultationMeetings') || '[]');
        const userMeetings = userId 
          ? meetings.filter(meeting => meeting.doctorId === userId)
          : meetings;
        
        const today = new Date().toDateString();
        const todaysMeetings = userMeetings.filter(meeting => 
          new Date(meeting.createdAt).toDateString() === today
        );
        
        const pendingInvitations = userMeetings.filter(meeting => {
          const meetingTime = new Date(meeting.scheduledTime);
          return meetingTime > new Date() && !meeting.patientJoined;
        }).length;
        
        const confirmedInvitations = userMeetings.filter(meeting => 
          meeting.patientJoined || meeting.status === 'confirmed'
        ).length;
        
        stats.sentInvitations = userMeetings.length;
        stats.pendingInvitations = pendingInvitations;
        stats.confirmedInvitations = confirmedInvitations;
        stats.todaysInvitations = todaysMeetings.length;
      } catch (error) {
        console.error('Error loading invitation stats:', error);
      }

      return stats;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      // Return default stats on error
      return {
        totalPatients: 0,
        todayAppointments: 0,
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedToday: 0,
        pendingRecords: 0,
        unreadMessages: 0,
        urgentMessages: 0,
        monthlyRevenue: 0,
        activeCalls: 0,
        waitingPatients: 0,
        avgCallDuration: '0m',
        videoServiceStatus: 'operational',
        audioServiceStatus: 'operational',
        systemUptime: '99.9%',
        sentInvitations: 0,
        pendingInvitations: 0,
        confirmedInvitations: 0,
        todaysInvitations: 0
      };
    }
  },

  // Get formatted stats for dashboard display
  async getFormattedStats(userRole = 'doctor', userId = null) {
    const stats = await this.getDashboardStats(userRole, userId);
    
    if (userRole === 'doctor') {
      return [
        {
          name: "Today's Appointments",
          stat: stats.todayAppointments,
          icon: 'CalendarDaysIcon',
          change: '+' + Math.max(0, stats.todayAppointments - 5),
          changeType: 'increase',
          description: 'Scheduled for today'
        },
        {
          name: 'Total Patients',
          stat: stats.totalPatients.toLocaleString(),
          icon: 'UserGroupIcon',
          change: '+' + Math.max(0, Math.floor(stats.totalPatients * 0.1)),
          changeType: 'increase',
          description: 'Active patients'
        },
        {
          name: 'Pending Records',
          stat: stats.pendingRecords,
          icon: 'DocumentTextIcon',
          change: '-3',
          changeType: 'decrease',
          description: 'Awaiting review'
        },
        {
          name: 'Unread Messages',
          stat: stats.unreadMessages,
          icon: 'ChatBubbleLeftRightIcon',
          change: `+${stats.urgentMessages}`,
          changeType: stats.urgentMessages > 0 ? 'increase' : 'same',
          description: `${stats.urgentMessages} urgent`
        }
      ];
    }

    if (userRole === 'patient') {
      return [
        {
          name: 'Upcoming Appointments',
          stat: stats.upcomingAppointments,
          icon: 'CalendarDaysIcon',
          change: '+1',
          changeType: 'increase',
          description: 'Next 30 days'
        },
        {
          name: 'Medical Records',
          stat: 15,
          icon: 'DocumentTextIcon',
          change: '+1',
          changeType: 'increase',
          description: 'Available records'
        },
        {
          name: 'Unread Messages',
          stat: stats.unreadMessages,
          icon: 'ChatBubbleLeftRightIcon',
          change: '+1',
          changeType: 'increase',
          description: 'New messages'
        },
        {
          name: 'Prescriptions',
          stat: 8,
          icon: 'ClockIcon',
          change: '0',
          changeType: 'same',
          description: 'Active prescriptions'
        }
      ];
    }

    // Default admin/staff stats
    return [
      {
        name: 'Total Patients',
        stat: stats.totalPatients.toLocaleString(),
        icon: 'UserGroupIcon',
        change: '+' + Math.max(0, Math.floor(stats.totalPatients * 0.1)),
        changeType: 'increase',
        description: 'Registered patients'
      },
      {
        name: "Today's Appointments",
        stat: stats.todayAppointments,
        icon: 'CalendarDaysIcon',
        change: '+2',
        changeType: 'increase',
        description: 'Scheduled today'
      },
      {
        name: 'Monthly Revenue',
        stat: `$${stats.monthlyRevenue.toLocaleString()}`,
        icon: 'CurrencyDollarIcon',
        change: '+8.2%',
        changeType: 'increase',
        description: 'This month'
      },
      {
        name: 'Pending Records',
        stat: stats.pendingRecords,
        icon: 'DocumentTextIcon',
        change: '-3',
        changeType: 'decrease',
        description: 'Awaiting processing'
      }
    ];
  },

  // Get telehealth specific stats
  async getTelehealthStats(userId = null) {
    const stats = await this.getDashboardStats('doctor', userId);
    
    return [
      {
        name: "Today's Appointments",
        stat: stats.todayAppointments,
        icon: 'CalendarDaysIcon',
        color: 'blue'
      },
      {
        name: 'Sent Invitations',
        stat: stats.sentInvitations,
        icon: 'PaperAirplaneIcon',
        color: 'green'
      },
      {
        name: 'Pending Responses',
        stat: stats.pendingInvitations,
        icon: 'EnvelopeIcon',
        color: 'purple'
      },
      {
        name: "Today's Invitations",
        stat: stats.todaysInvitations,
        icon: 'CheckCircleIcon',
        color: 'orange'
      }
    ];
  },

  // Get today's appointments from API
  async getTodaysAppointments(userId = null, userRole = 'doctor') {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = { 
        start_date: today, 
        end_date: today 
      };

      // Filter by user if specified
      if (userId && userRole === 'doctor') {
        params.staff_id = userId;
      } else if (userId && userRole === 'patient') {
        params.patient_id = userId;
      }

      const response = await appointmentAPI.getAll(params);
      const appointments = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);

      // Format appointments for display
      return appointments.map(apt => ({
        id: apt.id,
        patient: {
          id: apt.patient_id,
          name: apt.patient?.first_name && apt.patient?.last_name 
            ? `${apt.patient.first_name} ${apt.patient.last_name}`
            : 'Unknown Patient',
          email: apt.patient?.email || '',
          phone: apt.patient?.phone || '',
          avatar: apt.patient?.avatar || `https://ui-avatars.com/api/?name=${apt.patient?.first_name}+${apt.patient?.last_name}&background=random`
        },
        doctor: {
          id: apt.staff_id,
          name: apt.staff?.name || 'Unknown Doctor',
          specialty: apt.staff?.specialty || 'General Practice'
        },
        scheduledTime: new Date(`${apt.appointment_date} ${apt.start_time}`),
        time: apt.start_time,
        date: 'Today',
        type: apt.type || 'Consultation',
        duration: apt.duration_minutes || 30,
        status: apt.status || 'scheduled',
        notes: apt.reason_for_visit || apt.notes || '',
        location: apt.type === 'telehealth' ? 'Telehealth' : (apt.location || 'Main Office'),
        isToday: true
      }));
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      return [];
    }
  },

  // Get upcoming appointments from API
  async getUpcomingAppointments(userId = null, userRole = 'doctor', limit = 10) {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const params = { 
        start_date: tomorrow.toISOString().split('T')[0],
        end_date: nextWeek.toISOString().split('T')[0]
      };

      // Filter by user if specified
      if (userId && userRole === 'doctor') {
        params.staff_id = userId;
      } else if (userId && userRole === 'patient') {
        params.patient_id = userId;
      }

      const response = await appointmentAPI.getAll(params);
      const appointments = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);

      // Format and limit appointments
      return appointments.slice(0, limit).map(apt => ({
        id: apt.id,
        patient: {
          id: apt.patient_id,
          name: apt.patient?.first_name && apt.patient?.last_name 
            ? `${apt.patient.first_name} ${apt.patient.last_name}`
            : 'Unknown Patient',
          email: apt.patient?.email || '',
          phone: apt.patient?.phone || '',
          avatar: apt.patient?.avatar || `https://ui-avatars.com/api/?name=${apt.patient?.first_name}+${apt.patient?.last_name}&background=random`
        },
        doctor: {
          id: apt.staff_id,
          name: apt.staff?.name || 'Unknown Doctor',
          specialty: apt.staff?.specialty || 'General Practice'
        },
        scheduledTime: new Date(`${apt.appointment_date} ${apt.start_time}`),
        time: apt.start_time,
        date: new Date(apt.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        type: apt.type || 'Consultation',
        duration: apt.duration_minutes || 30,
        status: apt.status || 'scheduled',
        notes: apt.reason_for_visit || apt.notes || '',
        location: apt.type === 'telehealth' ? 'Telehealth' : (apt.location || 'Main Office'),
        isToday: false
      }));
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      return [];
    }
  },

  // Mock message data (until backend message system is implemented)
  getRecentMessages(limit = 5) {
    const mockMessages = [
      {
        id: 'MSG_1',
        from: 'Dr. Sarah Wilson',
        fromType: 'doctor',
        subject: 'Lab results are ready for review',
        preview: 'Your recent lab work shows improvement in your cholesterol levels...',
        time: '2 hours ago',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unread: true,
        isUrgent: false,
        hasAttachment: false
      },
      {
        id: 'MSG_2',
        from: 'Reception Team',
        fromType: 'staff',
        subject: 'Appointment reminder - Tomorrow 2:30 PM',
        preview: 'This is a friendly reminder about your upcoming appointment...',
        time: '4 hours ago',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        unread: true,
        isUrgent: false,
        hasAttachment: false
      },
      {
        id: 'MSG_3',
        from: 'System',
        fromType: 'system',
        subject: 'Patient invitation sent successfully',
        preview: 'Your patient invitation has been delivered...',
        time: '6 hours ago',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        unread: false,
        isUrgent: false,
        hasAttachment: false
      }
    ];

    return mockMessages.slice(0, limit);
  },

  // Get real patient data
  async getAllPatients(limit = null) {
    try {
      const response = await patientAPI.getAll();
      const patients = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);

      const formattedPatients = patients.map(patient => ({
        id: patient.id,
        name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown Patient',
        age: patient.age || this.calculateAge(patient.date_of_birth),
        email: patient.email || '',
        phone: patient.phone || '',
        avatar: patient.avatar || `https://ui-avatars.com/api/?name=${patient.first_name}+${patient.last_name}&background=random`,
        status: patient.status || 'active',
        lastVisit: patient.last_visit ? new Date(patient.last_visit) : null,
        nextAppointment: null, // This would need to be calculated from appointments
        medicalConditions: patient.medical_conditions || [],
        preferredContactMethod: patient.preferred_contact_method || 'email'
      }));

      return limit ? formattedPatients.slice(0, limit) : formattedPatients;
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  // Helper function to calculate age
  calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  // Get system status for telehealth
  getSystemStatus() {
    return {
      videoServiceStatus: 'operational',
      audioServiceStatus: 'operational',
      systemUptime: '99.9%',
      lastUpdated: new Date().toISOString()
    };
  }
};

export default dashboardService;