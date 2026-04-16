import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const BrowseEventsView = () => {
  const { user } = useAuth();
  const { events, registerForEvent, isRegistered, cancelRegistration } = useData();

  const handleRegister = (eventId: string) => {
    const result = registerForEvent(eventId, user!.id, user!.name);
    if (result.success) toast.success('Successfully registered!');
    else toast.error(result.error || 'Registration failed');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display">Browse Events</h2>
        <p className="text-muted-foreground">Discover and register for upcoming campus events</p>
      </div>

      {events.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No events available</h3>
          <p className="text-muted-foreground">Check back later for new events!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map((event, i) => {
            const registered = isRegistered(event.id, user!.id);
            const full = event.seatsAvailable <= 0;
            return (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card overflow-hidden">
                <div className="h-2 gradient-primary" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-lg flex-1">{event.title}</h3>
                    {full && !registered && <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium shrink-0 ml-2">Full</span>}
                    {registered && <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium shrink-0 ml-2">Registered</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 text-sm mb-5">
                    <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4 shrink-0" />{event.date}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4 shrink-0" />{event.time}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4 shrink-0" />{event.venue}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4 shrink-0" />{event.seatsAvailable} / {event.capacity} seats available</div>
                  </div>
                  {registered ? (
                    <button onClick={() => { cancelRegistration(event.id, user!.id); toast.info('Registration cancelled'); }} className="w-full py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" /> Cancel Registration
                    </button>
                  ) : (
                    <button onClick={() => handleRegister(event.id)} disabled={full} className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${full ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'gradient-primary text-primary-foreground hover:opacity-90 shadow-md'}`}>
                      <CheckCircle className="w-4 h-4" /> {full ? 'Event Full' : 'Register Now'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseEventsView;
