import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  seatsAvailable: number;
  organizerId: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  registeredAt: string;
  attendance: 'present' | 'absent' | 'unmarked';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  eventId: string;
  createdAt: string;
  read: boolean;
}

interface DataContextType {
  events: CampusEvent[];
  registrations: Registration[];
  notifications: Notification[];
  createEvent: (event: Omit<CampusEvent, 'id' | 'createdAt' | 'seatsAvailable'>) => void;
  updateEvent: (id: string, updates: Partial<CampusEvent>) => void;
  registerForEvent: (eventId: string, userId: string, userName: string) => { success: boolean; error?: string };
  cancelRegistration: (eventId: string, userId: string) => void;
  isRegistered: (eventId: string, userId: string) => boolean;
  getEventRegistrations: (eventId: string) => Registration[];
  getUserRegistrations: (userId: string) => Registration[];
  getUserNotifications: (userId: string) => Notification[];
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  updateAttendance: (registrationId: string, status: 'present' | 'absent') => void;
  cancelEvent: (eventId: string) => void;
}

const SEED_EVENTS: CampusEvent[] = [
  { id: 'e1', title: 'AI & Machine Learning Workshop', description: 'Hands-on workshop covering neural networks, deep learning, and practical AI applications.', date: '2026-05-10', time: '10:00', venue: 'Tech Hall A', capacity: 50, seatsAvailable: 48, organizerId: 'u2', createdAt: '2026-04-01' },
  { id: 'e2', title: 'Campus Music Festival', description: 'Annual music festival featuring student bands, solo performances, and DJ sets.', date: '2026-05-15', time: '18:00', venue: 'Open Air Theater', capacity: 200, seatsAvailable: 195, organizerId: 'u2', createdAt: '2026-04-02' },
  { id: 'e3', title: 'Startup Pitch Competition', description: 'Present your startup ideas to a panel of investors and industry experts.', date: '2026-05-20', time: '14:00', venue: 'Business Center', capacity: 30, seatsAvailable: 30, organizerId: 'u2', createdAt: '2026-04-03' },
  { id: 'e4', title: 'Sports Day 2026', description: 'Inter-department sports competition including cricket, football, badminton, and athletics.', date: '2026-06-01', time: '08:00', venue: 'Sports Complex', capacity: 300, seatsAvailable: 290, organizerId: 'u2', createdAt: '2026-04-04' },
  { id: 'e5', title: 'Photography Exhibition', description: 'Student photography showcase with themes on nature, urban life, and abstract art.', date: '2026-05-25', time: '11:00', venue: 'Art Gallery', capacity: 2, seatsAvailable: 0, organizerId: 'u2', createdAt: '2026-04-05' },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

function loadState<T>(key: string, fallback: T): T {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<CampusEvent[]>(() => loadState('campus_events', SEED_EVENTS));
  const [registrations, setRegistrations] = useState<Registration[]>(() => loadState('campus_registrations', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadState('campus_notifications', []));

  useEffect(() => { localStorage.setItem('campus_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('campus_registrations', JSON.stringify(registrations)); }, [registrations]);
  useEffect(() => { localStorage.setItem('campus_notifications', JSON.stringify(notifications)); }, [notifications]);

  const addNotification = useCallback((userId: string, message: string, eventId: string) => {
    setNotifications(prev => [...prev, { id: `n${Date.now()}_${Math.random()}`, userId, message, eventId, createdAt: new Date().toISOString(), read: false }]);
  }, []);

  const createEvent = useCallback((event: Omit<CampusEvent, 'id' | 'createdAt' | 'seatsAvailable'>) => {
    const newEvent: CampusEvent = { ...event, id: `e${Date.now()}`, createdAt: new Date().toISOString(), seatsAvailable: event.capacity };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CampusEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    // Notify registered students
    const eventRegs = registrations.filter(r => r.eventId === id);
    const event = events.find(e => e.id === id);
    eventRegs.forEach(r => {
      addNotification(r.userId, `Event "${event?.title || ''}" has been updated. Please check the latest details.`, id);
    });
  }, [registrations, events, addNotification]);

  const cancelEvent = useCallback((eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const eventRegs = registrations.filter(r => r.eventId === eventId);
    eventRegs.forEach(r => {
      addNotification(r.userId, `Event "${event?.title || ''}" has been cancelled.`, eventId);
    });
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setRegistrations(prev => prev.filter(r => r.eventId !== eventId));
  }, [events, registrations, addNotification]);

  const registerForEvent = useCallback((eventId: string, userId: string, userName: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found' };
    if (event.seatsAvailable <= 0) return { success: false, error: 'Event is full' };
    if (registrations.some(r => r.eventId === eventId && r.userId === userId)) return { success: false, error: 'Already registered' };

    setRegistrations(prev => [...prev, { id: `r${Date.now()}`, eventId, userId, userName, registeredAt: new Date().toISOString(), attendance: 'unmarked' }]);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, seatsAvailable: e.seatsAvailable - 1 } : e));
    return { success: true };
  }, [events, registrations]);

  const cancelRegistration = useCallback((eventId: string, userId: string) => {
    setRegistrations(prev => prev.filter(r => !(r.eventId === eventId && r.userId === userId)));
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, seatsAvailable: e.seatsAvailable + 1 } : e));
  }, []);

  const isRegistered = useCallback((eventId: string, userId: string) => {
    return registrations.some(r => r.eventId === eventId && r.userId === userId);
  }, [registrations]);

  const getEventRegistrations = useCallback((eventId: string) => registrations.filter(r => r.eventId === eventId), [registrations]);
  const getUserRegistrations = useCallback((userId: string) => registrations.filter(r => r.userId === userId), [registrations]);
  const getUserNotifications = useCallback((userId: string) => notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [notifications]);
  const markNotificationRead = useCallback((notifId: string) => setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n)), []);
  const markAllNotificationsRead = useCallback((userId: string) => setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n)), []);
  const updateAttendance = useCallback((registrationId: string, status: 'present' | 'absent') => setRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, attendance: status } : r)), []);

  return (
    <DataContext.Provider value={{ events, registrations, notifications, createEvent, updateEvent, registerForEvent, cancelRegistration, isRegistered, getEventRegistrations, getUserRegistrations, getUserNotifications, markNotificationRead, markAllNotificationsRead, updateAttendance, cancelEvent }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
