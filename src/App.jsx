import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import Home from './pages/Home';
import PatientSetup from './pages/PatientSetup';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Billing from './pages/Billing';
import Messages from './pages/Messages';
import TelehealthDashboard from './pages/TelehealthDashboard';
import Profile from './pages/Profile';
import Staff from './pages/Staff';
import JoinConsultation from './pages/JoinConsultation';
import PatientInvitations from './pages/PatientInvitations';
import PharmacyDashboard from './components/pharmacy/PharmacyDashboard';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import StaffProtectedRoute from './components/StaffProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/patient-setup" element={<PatientSetup />} />
            
            {/* Consultation join pages (public for patients) */}
            <Route path="/join/*" element={<JoinConsultation />} />
            <Route path="/app/telehealth/join" element={<JoinConsultation />} />
            
            {/* Pharmacy Dashboard - Only for pharmacy users */}
            <Route path="/pharmacy" element={
              <ProtectedRoute>
                <PharmacyDashboard />
              </ProtectedRoute>
            } />
            
            {/* Patient Portal (public access for patients) */}
            <Route path="/patient-portal/*" element={
              <ProtectedRoute allowPatients={true}>
                <Layout />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - Staff only (no pharmacy access) */}
            <Route path="/app" element={
              <StaffProtectedRoute>
                <Layout />
              </StaffProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="patients/*" element={<Patients />} />
              <Route path="appointments/*" element={<Appointments />} />
              <Route path="medical-records/*" element={<MedicalRecords />} />
              <Route path="billing/*" element={<Billing />} />
              <Route path="messages/*" element={<Messages />} />
              <Route path="telehealth/*" element={<TelehealthDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="staff/*" element={<Staff />} />
              <Route path="patient-invitations" element={<PatientInvitations />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;