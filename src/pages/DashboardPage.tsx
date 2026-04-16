import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import OrganizerDashboard from '@/components/dashboards/OrganizerDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const DashboardPage = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  return (
    <AppLayout>
      {user.role === 'student' && <StudentDashboard />}
      {user.role === 'organizer' && <OrganizerDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </AppLayout>
  );
};

export default DashboardPage;
