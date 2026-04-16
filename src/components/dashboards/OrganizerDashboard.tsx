import React from 'react';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Calendar, Users, ClipboardList, TrendingUp } from 'lucide-react';

const OrganizerDashboard = () => {
  const { events, registrations } = useData();

  const totalEvents = events.length;
  const totalRegs = registrations.length;
  const avgAttendance = totalEvents > 0 ? Math.round(totalRegs / totalEvents) : 0;

  const stats = [
    { label: 'Total Events', value: totalEvents, icon: Calendar, color: 'gradient-primary' },
    { label: 'Total Registrations', value: totalRegs, icon: Users, color: 'gradient-accent' },
    { label: 'Avg. per Event', value: avgAttendance, icon: TrendingUp, color: 'gradient-primary' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display">Organizer Dashboard</h2>
        <p className="text-muted-foreground">Overview of your events and registrations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

      <div className="glass-card p-5">
        <h3 className="font-display font-bold mb-4">Recent Events</h3>
        <div className="space-y-3">
          {events.slice(-5).reverse().map(e => (
            <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <div>
                <p className="font-medium text-sm">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.date} • {e.venue}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{e.seatsAvailable}/{e.capacity} seats</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
