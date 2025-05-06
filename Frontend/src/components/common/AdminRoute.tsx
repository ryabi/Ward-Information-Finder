import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;