import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ManageEventsView from '@/components/organizer/ManageEventsView';

const ManageEventsPage = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'organizer') return <Navigate to="/login" />;
  return <AppLayout><ManageEventsView /></AppLayout>;
};

export default ManageEventsPage;
