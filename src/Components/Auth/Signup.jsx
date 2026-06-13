"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/Context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';

const SignupTab = ({ setAuthMode }) => {
  const { login } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert('Please fill in all fields');
      return;
    }
    if (!formData.email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER_BUYER, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      const { token, buyer } = response.data;
      localStorage.setItem('token', token);
      login(buyer);
      setAuthMode(null);
      router.push('/');
      alert('Welcome to GadgetFinds!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setAuthMode(null)} />

      <div className="bg-(--surface) w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200">
        <button 
          onClick={() => setAuthMode(null)}
          className="absolute top-5 right-5 text-(--muted) hover:text-foreground p-2"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Create Account</h2>
        <p className="text-sm text-(--muted) text-center mb-6">Join the #1 store for Kenyan gamers</p>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-(--muted) mb-1 uppercase tracking-wider">Full Name</label>
            <input 
              name="name"
              type="text" 
              required
              disabled={loading}
              autoComplete="off"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-(--surface-alt) border border-(--border) dark:border-(--border-dark) rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#9333ea] text-foreground placeholder:text-(--muted)" 
              placeholder="e.g. Juma Ali" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-(--muted) mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              disabled={loading}
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-(--surface-alt) border border-(--border) dark:border-(--border-dark) rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#9333ea] text-foreground placeholder:text-(--muted)" 
              placeholder="name@example.com" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-(--muted) mb-1 uppercase tracking-wider">Create Password</label>
            <input 
              name="password"
              type="password" 
              required
              disabled={loading}
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-(--surface-alt) border border-(--border) dark:border-(--border-dark) rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#9333ea] text-foreground placeholder:text-(--muted)" 
              placeholder="••••••••" 
            />
          </div>

          <div className="flex items-start gap-2 py-2">
            <input required type="checkbox" className="mt-1 rounded text-[#9333ea] focus:ring-[#9333ea] bg-(--surface-alt) border-(--border) dark:border-(--border-dark)" id="terms" />
            <label htmlFor="terms" className="text-xs text-(--muted)">
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#9333ea] text-white py-4 rounded-xl font-bold hover:bg-[#a855f7] transition-all shadow-lg active:scale-[0.98]"      
          >
            {loading ? 'Creating Account...' : 'Create My Account'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-(--muted)">
          Already have an account?{' '}
          <span 
            onClick={() => setAuthMode('login')} 
            className="text-[#9333ea] dark:text-[#c084fc] font-bold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupTab;
