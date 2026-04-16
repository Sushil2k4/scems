import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ReportsView from '@/components/admin/ReportsView';

const ReportsPage = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  return <AppLayout><ReportsView /></AppLayout>;
};

export default ReportsPage;
