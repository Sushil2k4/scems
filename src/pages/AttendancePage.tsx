import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AttendanceView from '@/components/organizer/AttendanceView';

const AttendancePage = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'organizer') return <Navigate to="/login" />;
  return <AppLayout><AttendanceView /></AppLayout>;
};

export default AttendancePage;
