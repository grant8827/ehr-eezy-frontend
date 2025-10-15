// Shared Dashboard Data Utility
// Provides consistent patient, appointment, and statistics data across all dashboards

// Shared patient database
export const patients = [
  {
    id: 'P12345',
    name: 'Sarah Johnson',
    age: 34,
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60000), // 7 days ago
    nextAppointment: new Date(Date.now() + 2 * 60 * 60000), // 2 hours from now
    medicalConditions: ['Hypertension', 'Diabetes Type 2'],
    preferredContactMethod: 'email'
  },
  {
    id: 'P12346',
    name: 'Michael Chen',
    age: 45,
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60000), // 14 days ago
    nextAppointment: new Date(Date.now() + 3 * 60 * 60000), // 3 hours from now
    medicalConditions: ['Asthma'],
    preferredContactMethod: 'phone'
  },
  {
    id: 'P12347',
    name: 'Emma Wilson',
    age: 28,
    email: 'emma.wilson@email.com',
    phone: '(555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
    nextAppointment: new Date(Date.now() + 24 * 60 * 60000), // 1 day from now
    medicalConditions: ['Anxiety', 'Migraine'],
    preferredContactMethod: 'email'
  },
  {
    id: 'P12348',
    name: 'James Wilson',
    age: 52,
    email: 'james.wilson@email.com',
    phone: '(555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    lastVisit: new Date(Date.now() - 21 * 24 * 60 * 60000), // 21 days ago
    nextAppointment: new Date(Date.now() + 4 * 60 * 60000), // 4 hours from now
    medicalConditions: ['High Cholesterol'],
    preferredContactMethod: 'phone'
  },
  {
    id: 'P12349',
    name: 'Maria Garcia',
    age: 36,
    email: 'maria.garcia@email.com',
    phone: '(555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60000), // 5 days ago
    nextAppointment: new Date(Date.now() + 26 * 60 * 60000), // Tomorrow afternoon
    medicalConditions: ['Pregnancy - 2nd Trimester'],
    preferredContactMethod: 'email'
  },
  {
    id: 'P12350',
    name: 'David Rodriguez',
    age: 41,
    email: 'david.rodriguez@email.com',
    phone: '(555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    lastVisit: new Date(Date.now() - 10 * 24 * 60 * 60000), // 10 days ago
    nextAppointment: new Date(Date.now() + 48 * 60 * 60000), // 2 days from now
    medicalConditions: ['Back Pain', 'Arthritis'],
    preferredContactMethod: 'phone'
  }
];

// Shared doctors database
export const doctors = [
  {
    id: 'D001',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    email: 'dr.chen@clinic.com',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
    experience: '15 years',
    rating: 4.9
  },
  {
    id: 'D002',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Family Medicine',
    email: 'dr.rodriguez@clinic.com',
    avatar: 'https://images.unsplash.com/photo-1594824248441-6425c470cb9f?w=100&h=100&fit=crop&crop=face',
    experience: '12 years',
    rating: 4.8
  },
  {
    id: 'D003',
    name: 'Dr. Sarah Wilson',
    specialty: 'Internal Medicine',
    email: 'dr.wilson@clinic.com',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
    experience: '18 years',
    rating: 4.9
  }
];

// Generate consistent appointment data
export const generateAppointments = () => {
  const appointmentTypes = [
    'Regular Checkup',
    'Follow-up Consultation',
    'Telehealth Consultation',
    'Initial Consultation',
    'Urgent Care Visit',
    'Medication Review',
    'Lab Results Review',
    'Physical Therapy',
    'Preventive Care',
    'Specialist Consultation'
  ];

  const statuses = ['confirmed', 'pending', 'waiting', 'upcoming', 'scheduled', 'in-progress'];
  const durations = [15, 30, 45, 60];

  const appointments = [];
  const today = new Date();
  
  // Generate today's appointments
  for (let i = 0; i < 8; i++) {
    const patient = patients[i % patients.length];
    const doctor = doctors[i % doctors.length];
    const startHour = 9 + Math.floor(i * 0.75); // Spread throughout the day
    const appointmentTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, (i % 4) * 15);
    
    appointments.push({
      id: `APT_${Date.now()}_${i}`,
      patient: {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        avatar: patient.avatar,
        email: patient.email,
        phone: patient.phone
      },
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        avatar: doctor.avatar
      },
      scheduledTime: appointmentTime,
      time: appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      type: appointmentTypes[i % appointmentTypes.length],
      duration: durations[i % durations.length],
      status: statuses[i % statuses.length],
      isToday: true,
      notes: `${appointmentTypes[i % appointmentTypes.length]} for ${patient.name}`,
      location: i % 3 === 0 ? 'Telehealth' : `Room ${101 + (i % 10)}`,
      emailSent: i % 2 === 0, // Half have email invitations sent
      meetingData: i % 3 === 0 ? {
        id: `MEET_${Date.now()}_${i}`,
        patientName: patient.name,
        patientEmail: patient.email,
        doctorName: doctor.name,
        scheduledTime: appointmentTime,
        duration: durations[i % durations.length]
      } : null
    });
  }

  // Generate upcoming appointments (next few days)
  for (let day = 1; day <= 5; day++) {
    for (let j = 0; j < 4; j++) {
      const patient = patients[(day * 4 + j) % patients.length];
      const doctor = doctors[j % doctors.length];
      const appointmentDate = new Date(today.getTime() + day * 24 * 60 * 60 * 1000);
      const startHour = 9 + j * 2;
      const appointmentTime = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), startHour, 0);
      
      appointments.push({
        id: `APT_FUTURE_${day}_${j}`,
        patient: {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          avatar: patient.avatar,
          email: patient.email,
          phone: patient.phone
        },
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty,
          avatar: doctor.avatar
        },
        scheduledTime: appointmentTime,
        time: appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: day === 1 ? 'Tomorrow' : appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        type: appointmentTypes[j % appointmentTypes.length],
        duration: durations[j % durations.length],
        status: 'scheduled',
        isToday: false,
        notes: `${appointmentTypes[j % appointmentTypes.length]} for ${patient.name}`,
        location: j % 3 === 0 ? 'Telehealth' : `Room ${101 + (j % 10)}`,
        emailSent: false
      });
    }
  }

  return appointments.sort((a, b) => a.scheduledTime - b.scheduledTime);
};

// Generate consistent message data
export const generateMessages = () => {
  const messageTemplates = [
    {
      from: 'Dr. Sarah Wilson',
      fromType: 'doctor',
      subject: 'Lab results are ready for review',
      preview: 'Your recent lab work shows improvement in your cholesterol levels...',
      isUrgent: false
    },
    {
      from: 'Reception Team',
      fromType: 'staff',
      subject: 'Appointment reminder - Tomorrow 2:30 PM',
      preview: 'This is a friendly reminder about your upcoming appointment...',
      isUrgent: false
    },
    {
      from: 'Sarah Johnson',
      fromType: 'patient',
      subject: 'Question about medication side effects',
      preview: 'I\'ve been experiencing some mild side effects from the new medication...',
      isUrgent: true
    },
    {
      from: 'Dr. Michael Chen',
      fromType: 'doctor',
      subject: 'Follow-up care instructions',
      preview: 'Based on today\'s consultation, here are your next steps...',
      isUrgent: false
    },
    {
      from: 'Emma Wilson',
      fromType: 'patient',
      subject: 'Prescription refill request',
      preview: 'I need a refill on my anxiety medication prescription...',
      isUrgent: false
    },
    {
      from: 'Pharmacy Services',
      fromType: 'staff',
      subject: 'Prescription ready for pickup',
      preview: 'Your prescription for Lisinopril is ready for pickup at the main pharmacy...',
      isUrgent: false
    }
  ];

  return messageTemplates.map((template, index) => {
    const hoursAgo = Math.floor(Math.random() * 48) + 1; // 1-48 hours ago
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    
    return {
      id: `MSG_${Date.now()}_${index}`,
      from: template.from,
      fromType: template.fromType,
      subject: template.subject,
      preview: template.preview,
      time: hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`,
      timestamp: timestamp,
      unread: index < 3, // First 3 are unread
      isUrgent: template.isUrgent,
      hasAttachment: index % 4 === 0 // Every 4th message has attachment
    };
  }).sort((a, b) => b.timestamp - a.timestamp); // Most recent first
};

// Dashboard statistics
export const getDashboardStats = (userRole = 'doctor') => {
  const appointments = generateAppointments();
  const messages = generateMessages();
  const todaysAppointments = appointments.filter(apt => apt.isToday);
  const unreadMessages = messages.filter(msg => msg.unread);
  const urgentMessages = messages.filter(msg => msg.isUrgent);
  
  const baseStats = {
    totalPatients: patients.length * 17, // Simulate larger patient base
    todayAppointments: todaysAppointments.length,
    totalAppointments: appointments.length,
    upcomingAppointments: appointments.filter(apt => !apt.isToday && apt.status === 'scheduled').length,
    unreadMessages: unreadMessages.length,
    urgentMessages: urgentMessages.length,
    completedToday: todaysAppointments.filter(apt => apt.status === 'completed').length,
    pendingRecords: 12,
    monthlyRevenue: 45670,
    // Telehealth specific stats
    activeCalls: 2,
    waitingPatients: 3,
    avgCallDuration: '24m',
    videoServiceStatus: 'operational',
    audioServiceStatus: 'operational',
    systemUptime: '99.9%'
  };

  // Calculate invitation stats from localStorage
  try {
    const meetings = JSON.parse(localStorage.getItem('consultationMeetings') || '[]');
    const doctorMeetings = meetings.filter(meeting => meeting.doctorId === 'doc_001');
    
    const today = new Date().toDateString();
    const todaysMeetings = doctorMeetings.filter(meeting => 
      new Date(meeting.createdAt).toDateString() === today
    );
    
    const pendingInvitations = doctorMeetings.filter(meeting => {
      const meetingTime = new Date(meeting.scheduledTime);
      return meetingTime > new Date() && !meeting.patientJoined;
    }).length;
    
    const confirmedInvitations = doctorMeetings.filter(meeting => 
      meeting.patientJoined || meeting.status === 'confirmed'
    ).length;
    
    baseStats.sentInvitations = doctorMeetings.length;
    baseStats.pendingInvitations = pendingInvitations;
    baseStats.confirmedInvitations = confirmedInvitations;
    baseStats.todaysInvitations = todaysMeetings.length;
  } catch (error) {
    console.error('Error loading invitation stats:', error);
    baseStats.sentInvitations = 0;
    baseStats.pendingInvitations = 0;
    baseStats.confirmedInvitations = 0;
    baseStats.todaysInvitations = 0;
  }

  return baseStats;
};

// Get formatted stats for dashboard display
export const getFormattedStats = (userRole = 'doctor') => {
  const stats = getDashboardStats(userRole);
  
  if (userRole === 'doctor') {
    return [
      {
        name: "Today's Appointments",
        stat: stats.todayAppointments,
        icon: 'CalendarDaysIcon',
        change: '+2',
        changeType: 'increase',
        description: 'Scheduled for today'
      },
      {
        name: 'Total Patients',
        stat: stats.totalPatients.toLocaleString(),
        icon: 'UserGroupIcon',
        change: '+12',
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
      change: '+12',
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
};

// Telehealth specific stats
export const getTelehealthStats = () => {
  const baseStats = getDashboardStats('doctor');
  
  return [
    {
      name: "Today's Appointments",
      stat: baseStats.todayAppointments,
      icon: 'CalendarDaysIcon',
      color: 'blue'
    },
    {
      name: 'Sent Invitations',
      stat: baseStats.sentInvitations,
      icon: 'PaperAirplaneIcon',
      color: 'green'
    },
    {
      name: 'Pending Responses',
      stat: baseStats.pendingInvitations,
      icon: 'EnvelopeIcon',
      color: 'purple'
    },
    {
      name: "Today's Invitations",
      stat: baseStats.todaysInvitations,
      icon: 'CheckCircleIcon',
      color: 'orange'
    }
  ];
};

// Utility functions
export const getPatientById = (patientId) => {
  return patients.find(patient => patient.id === patientId);
};

export const getDoctorById = (doctorId) => {
  return doctors.find(doctor => doctor.id === doctorId);
};

export const getTodaysAppointments = () => {
  return generateAppointments().filter(appointment => appointment.isToday);
};

export const getUpcomingAppointments = () => {
  return generateAppointments().filter(appointment => !appointment.isToday);
};

export const getRecentMessages = (limit = 5) => {
  return generateMessages().slice(0, limit);
};

// Export default object with all utilities
const dashboardData = {
  patients,
  doctors,
  generateAppointments,
  generateMessages,
  getDashboardStats,
  getFormattedStats,
  getTelehealthStats,
  getPatientById,
  getDoctorById,
  getTodaysAppointments,
  getUpcomingAppointments,
  getRecentMessages
};

export default dashboardData;