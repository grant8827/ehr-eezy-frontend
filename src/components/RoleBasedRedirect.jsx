import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect pharmacy users to pharmacy dashboard
  if (user?.role === 'pharmacy') {
    return <Navigate to="/pharmacy" replace />;
  }

  // Redirect other authenticated users to main app
  return <Navigate to="/app/dashboard" replace />;
};

export default RoleBasedRedirect;
