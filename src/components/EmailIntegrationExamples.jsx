import React, { useState } from 'react';
import { emailService } from '../utils/emailService';

const EmailIntegrationExamples = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Example 1: Send patient invitation from patient management
  const handleInvitePatient = async (patientData) => {
    setLoading(true);
    try {
      const result = await emailService.sendPatientInvitation({
        name: patientData.name,
        email: patientData.email,
        portalLink: `${window.location.origin}/patient-portal`,
        tempPassword: generateTempPassword(),
        clinicPhone: '(555) 123-4567',
        clinicEmail: 'support@ehrEezy.com'
      });

      if (result.success) {
        setStatus({ type: 'success', message: 'Patient invitation sent successfully!' });
      } else {
        setStatus({ type: 'error', message: 'Failed to send invitation: ' + result.error });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error sending invitation: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Send appointment reminder
  const handleSendAppointmentReminder = async (appointmentData) => {
    setLoading(true);
    try {
      const result = await emailService.sendAppointmentReminder({
        patientName: appointmentData.patientName,
        patientEmail: appointmentData.patientEmail,
        date: appointmentData.date,
        time: appointmentData.time,
        provider: appointmentData.providerName,
        address: '123 Medical Center Drive, City, State 12345',
        type: appointmentData.type,
        rescheduleLink: `${window.location.origin}/reschedule/${appointmentData.id}`,
        confirmLink: `${window.location.origin}/confirm/${appointmentData.id}`,
        phone: '(555) 123-4567',
        email: 'appointments@ehrEezy.com'
      });

      if (result.success) {
        setStatus({ type: 'success', message: 'Appointment reminder sent!' });
      } else {
        setStatus({ type: 'error', message: 'Failed to send reminder: ' + result.error });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error sending reminder: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Example 3: Send invoice notification from billing
  const handleSendInvoiceNotification = async (invoiceData) => {
    setLoading(true);
    try {
      const result = await emailService.sendInvoiceNotification({
        patientName: invoiceData.patientName,
        patientEmail: invoiceData.patientEmail,
        invoiceNumber: invoiceData.id,
        invoiceDate: new Date(invoiceData.invoiceDate).toLocaleDateString(),
        dueDate: new Date(invoiceData.dueDate).toLocaleDateString(),
        amount: invoiceData.total,
        services: invoiceData.services,
        paymentLink: `${window.location.origin}/payment/${invoiceData.id}`,
        invoiceLink: `${window.location.origin}/invoice/${invoiceData.id}`,
        billingPhone: '(555) 123-4567',
        billingEmail: 'billing@ehrEezy.com'
      });

      if (result.success) {
        setStatus({ type: 'success', message: 'Invoice notification sent!' });
      } else {
        setStatus({ type: 'error', message: 'Failed to send notification: ' + result.error });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error sending notification: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Example 4: Send lab results notification
  const handleSendLabResults = async (labData) => {
    setLoading(true);
    try {
      const result = await emailService.sendLabResultsNotification({
        patientName: labData.patientName,
        patientEmail: labData.patientEmail,
        testName: labData.testName,
        providerName: labData.providerName,
        collectionDate: new Date(labData.collectionDate).toLocaleDateString(),
        resultsDate: new Date().toLocaleDateString(),
        portalLink: `${window.location.origin}/patient-portal/lab-results`
      });

      if (result.success) {
        setStatus({ type: 'success', message: 'Lab results notification sent!' });
      } else {
        setStatus({ type: 'error', message: 'Failed to send notification: ' + result.error });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error sending notification: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Utility function to generate temporary password
  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Email Integration Examples</h2>
      
      {status && (
        <div className={`p-4 rounded-lg ${
          status.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Invitation */}
        <div className="medical-card p-6">
          <h3 className="text-lg font-semibold mb-4">Patient Invitation</h3>
          <p className="text-gray-600 mb-4">Send portal access invitation to new patients</p>
          <button
            onClick={() => handleInvitePatient({
              name: 'John Doe',
              email: 'john.doe@example.com'
            })}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>

        {/* Appointment Reminder */}
        <div className="medical-card p-6">
          <h3 className="text-lg font-semibold mb-4">Appointment Reminder</h3>
          <p className="text-gray-600 mb-4">Send reminder 24 hours before appointment</p>
          <button
            onClick={() => handleSendAppointmentReminder({
              patientName: 'Jane Smith',
              patientEmail: 'jane.smith@example.com',
              date: 'December 15, 2024',
              time: '2:00 PM',
              providerName: 'Dr. Johnson',
              type: 'Annual Physical',
              id: 'apt-123'
            })}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Reminder'}
          </button>
        </div>

        {/* Invoice Notification */}
        <div className="medical-card p-6">
          <h3 className="text-lg font-semibold mb-4">Invoice Notification</h3>
          <p className="text-gray-600 mb-4">Email invoice to patient for payment</p>
          <button
            onClick={() => handleSendInvoiceNotification({
              patientName: 'Bob Johnson',
              patientEmail: 'bob.johnson@example.com',
              id: 'INV-001-002',
              invoiceDate: new Date(),
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              total: 250.00,
              services: [
                { description: 'Office Visit - Established Patient', amount: 150.00 },
                { description: 'Lab Work - CBC', amount: 45.00 },
                { description: 'Processing Fee', amount: 15.00 }
              ]
            })}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Invoice'}
          </button>
        </div>

        {/* Lab Results */}
        <div className="medical-card p-6">
          <h3 className="text-lg font-semibold mb-4">Lab Results Ready</h3>
          <p className="text-gray-600 mb-4">Notify patient when lab results are available</p>
          <button
            onClick={() => handleSendLabResults({
              patientName: 'Alice Williams',
              patientEmail: 'alice.williams@example.com',
              testName: 'Comprehensive Metabolic Panel',
              providerName: 'Dr. Smith',
              collectionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            })}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </div>

      {/* Integration Code Examples */}
      <div className="medical-card p-6">
        <h3 className="text-lg font-semibold mb-4">🔧 Integration Examples</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">In AddPatient Component:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// After creating patient record
const newPatient = await createPatient(patientData);
if (newPatient.email) {
  await emailService.sendPatientInvitation({
    name: newPatient.name,
    email: newPatient.email,
    // ... other data
  });
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">In Scheduling Component:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// When creating appointment
const appointment = await createAppointment(appointmentData);
// Schedule reminder email
setTimeout(() => {
  emailService.sendAppointmentReminder(appointment);
}, calculateReminderDelay(appointment.dateTime));`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">In Billing Component:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// After creating invoice
const invoice = await createInvoice(invoiceData);
if (sendEmailNotification) {
  await emailService.sendInvoiceNotification(invoice);
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailIntegrationExamples;