
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import ClientDashboard from './pages/client/Dashboard';
import BookAppointment from './pages/client/BookAppointment';
import CareChat from './pages/client/CareChat';

import AdminDashboard from './pages/admin/Dashboard';
import AdminArtists from './pages/admin/Artists';
import AdminSchedule from './pages/admin/Schedule';
import AdminAccounting from './pages/admin/Accounting';
import AdminSettings from './pages/admin/Settings';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-2xl font-display">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

      {/* Client Routes */}
      <Route element={<ProtectedRoute roles={['client', 'admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={user?.role === 'admin' ? <Navigate to="/admin" /> : <ClientDashboard />} />
          <Route path="/book" element={<ProtectedRoute roles={['client']}><BookAppointment /></ProtectedRoute>} />
          <Route path="/care-chat" element={<ProtectedRoute roles={['client']}><CareChat /></ProtectedRoute>} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']} />}>
         <Route element={<MainLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="artists" element={<AdminArtists />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="accounting" element={<AdminAccounting />} />
            <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/') : '/login'} />} />
    </Routes>
  );
}


export default function App() {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}
