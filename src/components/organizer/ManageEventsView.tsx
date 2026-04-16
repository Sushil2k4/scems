import React, { useState } from 'react';
import { useData, CampusEvent } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = { title: '', description: '', date: '', time: '', venue: '', capacity: '' };

const ManageEventsView = () => {
  const { user } = useAuth();
  const { events, createEvent, updateEvent, cancelEvent } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.time) e.time = 'Required';
    if (!form.venue.trim()) e.venue = 'Required';
    if (!form.capacity || Number(form.capacity) <= 0) e.capacity = 'Must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingId) {
      updateEvent(editingId, { title: form.title, description: form.description, date: form.date, time: form.time, venue: form.venue, capacity: Number(form.capacity) });
      toast.success('Event updated');
    } else {
      createEvent({ title: form.title, description: form.description, date: form.date, time: form.time, venue: form.venue, capacity: Number(form.capacity), organizerId: user!.id });
      toast.success('Event created');
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (event: CampusEvent) => {
    setForm({ title: event.title, description: event.description, date: event.date, time: event.time, venue: event.venue, capacity: String(event.capacity) });
    setEditingId(event.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    cancelEvent(id);
    toast.success('Event cancelled and removed');
  };

  const inputClass = (field: string) => `w-full px-4 py-2.5 rounded-xl border ${errors[field] ? 'border-destructive' : 'border-input'} bg-card focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display">Manage Events</h2>
          <p className="text-muted-foreground">Create, edit, and manage your events</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); setErrors({}); }} className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md">
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg glass-card p-6 z-50 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-lg">{editingId ? 'Edit Event' : 'Create Event'}</h3>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass('title')} placeholder="Event title" />
                  {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass('description')} placeholder="Event description" />
                  {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass('date')} />
                    {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className={inputClass('time')} />
                    {errors.time && <p className="text-xs text-destructive mt-1">{errors.time}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Venue</label>
                  <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className={inputClass('venue')} placeholder="Event venue" />
                  {errors.venue && <p className="text-xs text-destructive mt-1">{errors.venue}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seat Capacity</label>
                  <input type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className={inputClass('capacity')} placeholder="e.g. 50" />
                  {errors.capacity && <p className="text-xs text-destructive mt-1">{errors.capacity}</p>}
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 shadow-md">
                  {editingId ? 'Update Event' : 'Create Event'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Events list */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground">Create your first event to get started</p>
          </div>
        ) : (
          events.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{event.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.venue}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{event.seatsAvailable}/{event.capacity}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(event)} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageEventsView;
