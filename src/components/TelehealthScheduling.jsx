import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  CalendarDaysIcon,
  ClockIcon,
  VideoCameraIcon,
  UserGroupIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

const TelehealthScheduling = () => {
  const { isDoctor } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [patientNotes, setPatientNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Mock data
  useEffect(() => {
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Family Medicine',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
        nextAvailable: 'Today 2:30 PM',
        rating: 4.9,
        telehealth: true,
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Cardiology',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
        nextAvailable: 'Tomorrow 10:00 AM',
        rating: 4.8,
        telehealth: true,
      },
      {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrics',
        avatar: 'https://images.unsplash.com/photo-1594824248441-6425c470cb9f?w=100&h=100&fit=crop&crop=face',
        nextAvailable: 'Today 4:15 PM',
        rating: 4.9,
        telehealth: true,
      },
    ];
    setDoctors(mockDoctors);

    // Mock available time slots
    const mockSlots = [
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
    ];
    setAvailableSlots(mockSlots);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmAppointment = () => {
    // Here you would submit the appointment data to your backend
    console.log('Appointment confirmed:', {
      date: selectedDate,
      time: selectedTime,
      doctor: selectedDoctor,
      type: appointmentType,
      duration: appointmentDuration,
      notes: patientNotes,
    });
    
    // Reset form or redirect
    setShowConfirmation(false);
    // You might want to redirect to appointments list or show success message
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Confirm Your Telehealth Appointment
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-medium text-gray-900 mb-4">Appointment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">
                      {doctors.find(d => d.id === parseInt(selectedDoctor))?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{appointmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{appointmentDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium flex items-center">
                      <VideoCameraIcon className="w-4 h-4 mr-1 text-blue-600" />
                      Video Call
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Before Your Video Appointment
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Test your camera and microphone</li>
                      <li>• Ensure stable internet connection</li>
                      <li>• Find a quiet, private space</li>
                      <li>• Have your insurance card ready</li>
                      <li>• Prepare list of current medications</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Edit
                </button>
                <button
                  onClick={confirmAppointment}
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Confirm Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Schedule Telehealth Appointment</h1>
          <p className="mt-2 text-gray-600">
            Book a virtual consultation with one of our healthcare providers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointment Details</h2>
              
              {/* Doctor Selection */}
              {!isDoctor && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Healthcare Provider
                  </label>
                  <div className="space-y-3">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedDoctor === doctor.id.toString()
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedDoctor(doctor.id.toString())}
                      >
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={doctor.avatar}
                            alt={doctor.name}
                          />
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900">
                                {doctor.name}
                              </h3>
                              <div className="flex items-center">
                                <VideoCameraIcon className="w-4 h-4 text-green-600 mr-1" />
                                <span className="text-xs text-green-600">Telehealth Available</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Next available: {doctor.nextAvailable}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                        selectedTime === slot
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointment Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="consultation">General Consultation</option>
                  <option value="follow-up">Follow-up Visit</option>
                  <option value="mental-health">Mental Health</option>
                  <option value="prescription">Prescription Review</option>
                  <option value="urgent-care">Urgent Care</option>
                </select>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  value={appointmentDuration}
                  onChange={(e) => setAppointmentDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              {/* Patient Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit (Optional)
                </label>
                <textarea
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your symptoms or reason for the appointment..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || (!isDoctor && !selectedDoctor)}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <CalendarDaysIcon className="w-5 h-5 mr-2" />
                Schedule Appointment
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Telehealth Benefits */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Why Choose Telehealth?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <ComputerDesktopIcon className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Convenient</h4>
                    <p className="text-sm text-gray-600">
                      See your doctor from the comfort of your home
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ClockIcon className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Time-Saving</h4>
                    <p className="text-sm text-gray-600">
                      No travel time or waiting rooms
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Accessible</h4>
                    <p className="text-sm text-gray-600">
                      Use any device with internet connection
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">
                Technical Requirements
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Stable internet connection (minimum 1 Mbps)</li>
                <li>• Device with camera and microphone</li>
                <li>• Updated web browser (Chrome, Firefox, Safari)</li>
                <li>• Quiet, private environment</li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is available to help with technical issues or scheduling questions.
              </p>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelehealthScheduling;