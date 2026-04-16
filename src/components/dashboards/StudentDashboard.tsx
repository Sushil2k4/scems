import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, X, CalendarCheck } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { events, getUserRegistrations, cancelRegistration } = useData();

  const myRegistrations = getUserRegistrations(user!.id);
  const myEvents = myRegistrations.map(r => ({ ...r, event: events.find(e => e.id === r.eventId) })).filter(r => r.event);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display">My Registered Events</h2>
        <p className="text-muted-foreground">Events you've signed up for</p>
      </div>

      {myEvents.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CalendarCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No registrations yet</h3>
          <p className="text-muted-foreground">Browse events to find something interesting!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {myEvents.map(({ event, ...reg }, i) => (
            <motion.div key={reg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <h3 className="font-display font-bold text-lg mb-2">{event!.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event!.description}</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" />{event!.date}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" />{event!.time}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" />{event!.venue}</div>
              </div>
              <button onClick={() => cancelRegistration(event!.id, user!.id)} className="w-full py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
                <X className="w-4 h-4" /> Cancel Registration
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
