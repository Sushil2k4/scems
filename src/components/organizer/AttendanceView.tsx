import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Check, X, Users } from 'lucide-react';
import { toast } from 'sonner';

const AttendanceView = () => {
  const { events, getEventRegistrations, updateAttendance } = useData();
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');

  const registrations = getEventRegistrations(selectedEventId);
  const selectedEvent = events.find(e => e.id === selectedEventId);

  const handleAttendance = (regId: string, status: 'present' | 'absent') => {
    updateAttendance(regId, status);
    toast.success(`Marked as ${status}`);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display">Attendance Tracking</h2>
        <p className="text-muted-foreground">Mark attendance for registered students</p>
      </div>

      {/* Event selector */}
      <div className="glass-card p-4 mb-4">
        <label className="block text-sm font-medium mb-2">Select Event</label>
        <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring text-sm">
          {events.map(e => <option key={e.id} value={e.id}>{e.title} — {e.date}</option>)}
        </select>
      </div>

      {registrations.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No registrations</h3>
          <p className="text-muted-foreground">No students have registered for this event yet</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium p-4">Student</th>
                  <th className="text-left text-sm font-medium p-4">Registered</th>
                  <th className="text-center text-sm font-medium p-4">Status</th>
                  <th className="text-center text-sm font-medium p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, i) => (
                  <motion.tr key={reg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{reg.userName.charAt(0)}</div>
                        <span className="text-sm font-medium">{reg.userName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${reg.attendance === 'present' ? 'bg-success/10 text-success' : reg.attendance === 'absent' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'}`}>
                        {reg.attendance === 'unmarked' ? 'Unmarked' : reg.attendance.charAt(0).toUpperCase() + reg.attendance.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleAttendance(reg.id, 'present')} className={`p-2 rounded-lg transition-colors ${reg.attendance === 'present' ? 'bg-success text-success-foreground' : 'bg-success/10 text-success hover:bg-success/20'}`}>
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAttendance(reg.id, 'absent')} className={`p-2 rounded-lg transition-colors ${reg.attendance === 'absent' ? 'bg-destructive text-destructive-foreground' : 'bg-destructive/10 text-destructive hover:bg-destructive/20'}`}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceView;
