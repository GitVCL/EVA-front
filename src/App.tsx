import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import BookingPage from './pages/booking/BookingPage';
import BookingConfirmationPage from './pages/booking/BookingConfirmationPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ClassesPage from './pages/admin/ClassesPage';
import SchedulesPage from './pages/admin/SchedulesPage';
import AppointmentsPage from './pages/admin/AppointmentsPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/agendar" element={<BookingPage />} />
      <Route path="/agendar/confirmacao" element={<BookingConfirmationPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aulas"
        element={
          <ProtectedRoute>
            <ClassesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/horarios"
        element={
          <ProtectedRoute>
            <SchedulesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agendamentos"
        element={
          <ProtectedRoute>
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
