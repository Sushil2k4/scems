import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Shield, LogIn, Eye, EyeOff } from 'lucide-react';

const ROLES = [
  { value: 'student', label: 'Student', icon: GraduationCap, email: 'student@test.com' },
  { value: 'organizer', label: 'Organizer', icon: Users, email: 'organizer@test.com' },
  { value: 'admin', label: 'Admin', icon: Shield, email: 'admin@test.com' },
] as const;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number>(0);

  const handleRoleSelect = (index: number) => {
    setSelectedRole(index);
    setEmail(ROLES[index].email);
    setPassword('123456');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    const result = login(email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.error || 'Login failed');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/20" style={{ width: `${150 + i * 80}px`, height: `${150 + i * 80}px`, top: `${10 + i * 15}%`, left: `${-5 + i * 12}%` }} />
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-8 shadow-xl">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold font-display text-primary-foreground mb-4">Smart Campus</h1>
          <p className="text-xl text-primary-foreground/80 mb-2">Event Management System</p>
          <p className="text-primary-foreground/60 max-w-md">Discover, register, and manage campus events seamlessly. Your one-stop platform for all campus activities.</p>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 gradient-bg">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display text-gradient">Smart Campus</h1>
          </div>

          <h2 className="text-2xl font-bold font-display mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to continue to your dashboard</p>

          {/* Role tabs */}
          <div className="flex gap-2 mb-8 p-1 rounded-xl bg-secondary">
            {ROLES.map((role, i) => (
              <button key={role.value} onClick={() => handleRoleSelect(i)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${selectedRole === i ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>
                <role.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{role.label}</span>
              </button>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="Enter your email" className="w-full px-4 py-3 rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="Enter your password" className="w-full px-4 py-3 rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring transition-all pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
              <LogIn className="w-5 h-5" /> Sign In
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center font-medium mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              {ROLES.map(r => (<p key={r.value}><span className="font-medium text-foreground">{r.label}:</span> {r.email} / 123456</p>))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
