"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/Context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS, apiRequest } from '@/config/api';

const LoginTab = ({ setAuthMode }) => {
  const { login } = useAuth();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => {
      setIsOpen(false);
      if (setAuthMode) setAuthMode(null);
    };

    window.addEventListener('open-login-modal', handleOpenModal);
    window.addEventListener('close-login-modal', handleCloseModal);
    setIsOpen(true);

    return () => {
      window.removeEventListener('open-login-modal', handleOpenModal);
      window.removeEventListener('close-login-modal', handleCloseModal);
    };
  }, [setAuthMode]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (setAuthMode) setAuthMode(null);
  };

  const switchToSignup = () => {
    if (setAuthMode) setAuthMode('signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiRequest(() =>
        axios.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
      );
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      login(user);
      handleClose();
      
      if (user.role === 'manager') {
        router.push('/manager/products');
      } else {
        router.push('/');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="bg-(--surface) w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200">
        <button onClick={handleClose} className="absolute top-5 right-5 text-(--muted) p-2 hover:text-foreground">✕</button>
        
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Account Login</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-(--muted) mb-1 uppercase">Email Address</label>
            <input 
              type="email" 
              required
              disabled={loading}
              autoComplete="off"
              className="w-full bg-(--surface-alt) border border-(--border) dark:border-(--border-dark) rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#9333ea] text-foreground placeholder:text-(--muted)" 
              placeholder="name@email.com"
              value={email ?? ''} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-(--muted) mb-1 uppercase">Password</label>
            <input 
              type="password" 
              required
              disabled={loading}
              autoComplete="off"
              className="w-full bg-(--surface-alt) border border-(--border) dark:border-(--border-dark) rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#9333ea] text-foreground placeholder:text-(--muted)" 
              placeholder="••••••••"
              value={password ?? ''} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#9333ea] text-white py-3 rounded-xl font-bold hover:bg-[#a855f7] transition-colors shadow-lg"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-(--muted)">
          Don't have an account?{' '}
          <button 
            onClick={switchToSignup}
            className="text-[#9333ea] dark:text-[#c084fc] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginTab;
