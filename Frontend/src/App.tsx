import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import WardSearch from './pages/WardSearch';
import WardMembers from './pages/WardMembers';
import WardMemberDetail from './pages/WardMemberDetail';
import LocationFinder from './pages/LocationFinder';
import LocalCulture from './pages/LocalCulture';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminWardMembers from './pages/admin/AdminWardMembers';
import AdminMunicipalityMembers from './pages/admin/AdminMunicipalityMembers';
import NotFound from './pages/NotFound';

// Layout
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ward-search" element={<WardSearch />} />
            <Route path="ward-members" element={<WardMembers />} />
            <Route path="ward-members/:id" element={<WardMemberDetail />} />
            <Route path="location-finder" element={<LocationFinder />} />
            <Route path="local-culture" element={<LocalCulture />} />
            
            {/* Admin Routes */}
            <Route 
              path="admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="admin/ward-members" 
              element={
                <AdminRoute>
                  <AdminWardMembers />
                </AdminRoute>
              } 
            />
            <Route 
              path="admin/municipality-members" 
              element={
                <AdminRoute>
                  <AdminMunicipalityMembers />
                </AdminRoute>
              } 
            />
          </Route>

          {/* Redirect root to login if not authenticated */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;