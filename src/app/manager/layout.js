"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation"; 
import { useAuth } from '@/Context/AuthContext'; 

export default function ManagerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth(); 
  const [isDark, setIsDark] = useState(false);

  // 1. Role Verification Security Layer
  useEffect(() => {
    if (loading) return;

    // Fixed: Use router.replace instead of redirect inside useEffect
    if (!user || user.role !== 'manager') {
      router.replace('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedTheme = window.localStorage.getItem('manager-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextMode = storedTheme ? storedTheme === 'dark' : prefersDark;

    setIsDark(nextMode);
    document.documentElement.classList.toggle('dark', nextMode);
    document.documentElement.style.colorScheme = nextMode ? 'dark' : 'light';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    window.localStorage.setItem('manager-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // 2. Shield View: Render a placeholder loader while credentials are authenticated
  if (loading || !user || user.role !== 'manager') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] dark:bg-slate-950">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Validating Panel Access...</p>
        </div>
      </div>
    );
  }

  // Helper array to generate our tabs beautifully
  const navigationTabs = [
    { name: 'Sales Overview', path: '/manager/sales'},
    { name: 'Order Tracking', path: '/manager/orders' },
    { name: 'Hardware', path: '/manager/products'},
    { name: 'Digital Codes', path: '/manager/codes' },
  ];

  // 3. Authorized Dashboard Layout View
  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-8 pb-20 transition-colors duration-300 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Glass Card */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 transition-all duration-300 hover:shadow-md dark:bg-slate-900/80 dark:border-slate-800">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none dark:bg-indigo-950/30" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="hidden sm:flex bg-linear-to-tr from-indigo-50 to-purple-50 p-3 rounded-2xl border border-indigo-100/50 text-indigo-600 shadow-inner shrink-0 dark:from-indigo-950/60 dark:to-purple-950/60 dark:border-indigo-900/60 dark:text-indigo-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-indigo-950 to-slate-900 dark:from-slate-100 dark:via-indigo-200 dark:to-slate-100">
                  Manager Dashboard
                </h1>
                <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm dark:bg-indigo-950/60 dark:border-indigo-900/60 dark:text-indigo-300">
                  HQ Panel
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 dark:text-slate-400">
                 Manage your Kenyan store sales, orders, catalog & digital assets
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
            <div className="bg-gray-100/80 p-1.5 rounded-2xl flex flex-wrap md:flex-nowrap items-center w-full md:w-auto gap-1 shadow-inner border border-gray-200/50 dark:bg-slate-800/80 dark:border-slate-700">
              {navigationTabs.map((tab) => {
                const isActive = pathname === tab.path;
                return (
                  <button
                    key={tab.path}
                    onClick={() => router.push(tab.path)}
                    className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-sm border border-gray-100 dark:bg-slate-700 dark:text-indigo-300 dark:border-slate-600'
                        : 'text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.name}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Dynamic sub-page layout view goes here */}
        <div className="animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
}
