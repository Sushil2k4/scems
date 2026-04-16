import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, LayoutDashboard, Calendar, Users, BarChart3, ClipboardList, LogOut, Bell, Menu, X, ChevronDown } from 'lucide-react';

const navItems = {
  student: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Browse Events', path: '/browse-events', icon: Calendar },
  ],
  organizer: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Manage Events', path: '/manage-events', icon: ClipboardList },
    { label: 'Attendance', path: '/attendance', icon: Users },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
  ],
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { getUserNotifications, markAllNotificationsRead } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  if (!user) return null;

  const items = navItems[user.role];
  const notifications = getUserNotifications(user.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen gradient-bg flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 glass-card m-3 mr-0 p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold font-display text-sm">Smart Campus</h2>
            <p className="text-xs text-muted-foreground capitalize">{user.role} Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {items.map(item => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path ? 'gradient-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-primary-foreground text-sm font-bold">{user.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 w-full rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="fixed left-0 top-0 bottom-0 w-72 glass z-50 p-4 flex flex-col lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold font-display text-sm">Smart Campus</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex-1 space-y-1">
                {items.map(item => (
                  <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <item.icon className="w-5 h-5" /> {item.label}
                  </Link>
                ))}
              </nav>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="glass m-3 mb-0 rounded-2xl px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1"><Menu className="w-6 h-6" /></button>
          <h1 className="font-display font-bold text-lg hidden lg:block">{items.find(i => i.path === location.pathname)?.label || 'Dashboard'}</h1>
          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            {user.role === 'student' && (
              <div className="relative">
                <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && unreadCount > 0) markAllNotificationsRead(user.id); }} className="relative p-2 rounded-xl hover:bg-secondary transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 top-12 w-80 glass-card p-4 z-50 max-h-96 overflow-y-auto">
                      <h3 className="font-display font-bold text-sm mb-3">Notifications</h3>
                      {notifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
                      ) : (
                        <div className="space-y-2">
                          {notifications.slice(0, 10).map(n => (
                            <div key={n.id} className={`p-3 rounded-xl text-sm ${n.read ? 'bg-secondary/50' : 'bg-primary/5 border border-primary/10'}`}>
                              <p>{n.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">{user.name.charAt(0)}</div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} key={location.pathname}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
