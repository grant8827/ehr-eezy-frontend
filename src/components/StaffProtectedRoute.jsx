import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StaffProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect pharmacy users to their dashboard
  if (user?.role === 'pharmacy') {
    return <Navigate to="/pharmacy" replace />;
  }

  // Allow all other authenticated users (admin, doctor, nurse, etc.)
  return children;
};

export default StaffProtectedRoute;
