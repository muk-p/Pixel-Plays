"use client"; // 🚀 CRUCIAL: Tells Next.js to only run this file on the client browser

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const ONE_HOUR_MS = 3600000;
const DEMO_PORTFOLIO_ORIGIN =
  process.env.NEXT_PUBLIC_DEMO_PORTFOLIO_ORIGIN ||
  'https://web-portfolio-rouge-zeta.vercel.app';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper utility to clear cookies alongside localStorage
  const clearAuthStorage = useCallback(() => {
    if (typeof window === 'undefined') return; // Server guard
    
    // 1. Clear LocalStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('login_timestamp');

    // 2. Clear Cookies for Next.js Server-Side Proxy checks
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    clearAuthStorage();
  }, [clearAuthStorage]);

  // Helper function to check session
  const isSessionExpired = useCallback(() => {
    if (typeof window === 'undefined') return true; // Server guard
    const loginTimestamp = localStorage.getItem('login_timestamp');
    if (!loginTimestamp) return true;

    const timeElapsed = Date.now() - parseInt(loginTimestamp, 10);
    return timeElapsed >= ONE_HOUR_MS;
  }, []);

  // 1. PERSIST LOGIN ON REFRESH & VERIFY EXPIRE TIME
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token && !isSessionExpired()) {
      setUser(JSON.parse(savedUser));
    } else {
      clearAuthStorage();
    }
    setLoading(false);
  }, [isSessionExpired, clearAuthStorage]);

  // 2. ACTIVE LIVE TRACKER & TAB FOCUS CHECK
  useEffect(() => {
    let logoutTimer;

    const verifySession = () => {
      const loginTimestamp = localStorage.getItem('login_timestamp');
      
      if (loginTimestamp) {
        const timeElapsed = Date.now() - parseInt(loginTimestamp, 10);
        const timeLeft = ONE_HOUR_MS - timeElapsed;

        if (timeLeft <= 0) {
          logout();
        } else {
          if (logoutTimer) clearTimeout(logoutTimer);
          
          logoutTimer = setTimeout(() => {
            logout();
          }, timeLeft);
        }
      }
    };

    verifySession();

    window.addEventListener('focus', verifySession);
    
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      window.removeEventListener('focus', verifySession);
    };
  }, [user, logout]);

  // 3. UPDATED LOGIN FUNCTION (Synchronizes Cookies with LocalStorage)
  const login = useCallback((userData) => {
    setUser(userData);
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token'); // Grab token saved right before calling login()
      
      // Save to localStorage for immediate UI hydration
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('login_timestamp', Date.now().toString());

      // Save to cookies with 1-hour expiration so your proxy.js file can read it instantly
      const maxAgeSeconds = 3600; 
      if (token) {
        document.cookie = `token=${token}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
      }
      if (userData?.role) {
        document.cookie = `user_role=${userData.role}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
      }
    }
  }, []);

  useEffect(() => {
    const handleDemoMessage = (event) => {
      if (
        !window.opener ||
        event.origin !== DEMO_PORTFOLIO_ORIGIN ||
        event.source !== window.opener
      ) {
        return;
      }

      const session = event.data;
      if (
        session?.type !== 'portfolio-demo-session' ||
        typeof session.token !== 'string' ||
        session.user?.role !== 'manager' ||
        session.user?.isDemo !== true
      ) {
        return;
      }

      localStorage.setItem('token', session.token);
      login(session.user);
      window.opener.postMessage(
        { type: 'pixelplays-demo-session-received' },
        DEMO_PORTFOLIO_ORIGIN
      );
    };

    window.addEventListener('message', handleDemoMessage);
    if (window.opener) {
      window.opener.postMessage(
        { type: 'pixelplays-demo-ready' },
        DEMO_PORTFOLIO_ORIGIN
      );
    }

    return () => window.removeEventListener('message', handleDemoMessage);
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* FIXED: Always render children, control subcomponent loaders inside layouts */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
