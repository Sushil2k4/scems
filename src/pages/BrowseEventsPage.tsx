import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import BrowseEventsView from '@/components/student/BrowseEventsView';

const BrowseEventsPage = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><BrowseEventsView /></AppLayout>;
};

export default BrowseEventsPage;
