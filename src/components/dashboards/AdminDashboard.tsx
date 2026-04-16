import React from 'react';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Calendar, Users, UserCheck, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { events, registrations } = useData();

  const totalEvents = events.length;
  const totalRegs = registrations.length;
  const activeUsers = new Set(registrations.map(r => r.userId)).size;
  const attendanceRate = registrations.length > 0 ? Math.round(registrations.filter(r => r.attendance === 'present').length / registrations.length * 100) : 0;

  const stats = [
    { label: 'Total Events', value: totalEvents, icon: Calendar, color: 'gradient-primary' },
    { label: 'Total Registrations', value: totalRegs, icon: Users, color: 'gradient-accent' },
    { label: 'Active Users', value: activeUsers, icon: UserCheck, color: 'gradient-primary' },
    { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: TrendingUp, color: 'gradient-accent' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display">Admin Dashboard</h2>
        <p className="text-muted-foreground">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold font-display">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-display font-bold mb-4">Events Overview</h3>
          <div className="space-y-3">
            {events.map(e => {
              const regs = registrations.filter(r => r.eventId === e.id).length;
              const pct = e.capacity > 0 ? Math.round(regs / e.capacity * 100) : 0;
              return (
                <div key={e.id} className="p-3 rounded-xl bg-secondary/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-sm">{e.title}</p>
                    <span className="text-xs text-muted-foreground">{regs}/{e.capacity}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display font-bold mb-4">Recent Registrations</h3>
          <div className="space-y-2">
            {registrations.slice(-8).reverse().map(r => {
              const event = events.find(e => e.id === r.eventId);
              return (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div>
                    <p className="font-medium text-sm">{r.userName}</p>
                    <p className="text-xs text-muted-foreground">{event?.title}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(r.registeredAt).toLocaleDateString()}</span>
                </div>
              );
            })}
            {registrations.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No registrations yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
