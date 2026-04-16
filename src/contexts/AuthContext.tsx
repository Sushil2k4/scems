import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'organizer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const DEMO_USERS: { email: string; password: string; user: User }[] = [
  { email: 'student@test.com', password: '123456', user: { id: 'u1', email: 'student@test.com', name: 'Alex Student', role: 'student' } },
  { email: 'organizer@test.com', password: '123456', user: { id: 'u2', email: 'organizer@test.com', name: 'Jordan Organizer', role: 'organizer' } },
  { email: 'admin@test.com', password: '123456', user: { id: 'u3', email: 'admin@test.com', name: 'Sam Admin', role: 'admin' } },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('campus_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('campus_user', JSON.stringify(user));
    else localStorage.removeItem('campus_user');
  }, [user]);

  const login = (email: string, password: string) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found.user);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
