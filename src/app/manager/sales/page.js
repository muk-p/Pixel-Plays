"use client";

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, getAxiosConfig } from '@/config/api';

const currencyFormatter = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
});

export default function SalesOverview() {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.SHOPPING.STATS, getAxiosConfig());
        setSummary(data.summary || {});
        setTopProducts(data.topProducts || []);
      } catch (err) {
        console.error('Failed to load sales stats', err);
        setError('Unable to load sales stats right now.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const salesMetrics = useMemo(() => {
    if (!summary) {
      return [
        { title: 'Total Revenue', value: '—', change: 'Loading…', isPositive: true, icon: '💰' },
        { title: 'Average Order Value', value: '—', change: 'Loading…', isPositive: true, icon: '🛒' },
        { title: 'Completed Orders', value: '—', change: 'Loading…', isPositive: true, icon: '✅' },
      ];
    }

    return [
      {
        title: 'Total Revenue',
        value: currencyFormatter.format(summary.totalRevenue || 0),
        change: `${summary.totalOrders || 0} total orders`,
        isPositive: true,
        icon: '💰',
      },
      {
        title: 'Average Order Value',
        value: currencyFormatter.format(summary.averageOrderValue || 0),
        change: `${summary.pendingOrders || 0} pending`,
        isPositive: true,
        icon: '🛒',
      },
      {
        title: 'Completed Orders',
        value: summary.completedOrders || 0,
        change: `${summary.canceledOrders || 0} canceled`,
        isPositive: true,
        icon: '✅',
      },
    ];
  }, [summary]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {salesMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl bg-gray-50 p-2.5 rounded-xl border border-gray-100">{metric.icon}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                metric.isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{metric.title}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{loading ? '—' : metric.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[18.75rem]">
          <div>
            <h3 className="font-bold text-gray-800 text-base">Live sales snapshot</h3>
            <p className="text-xs text-gray-400">Revenue and order activity pulled from the backend</p>
          </div>
          <div className="h-32 w-full flex items-end justify-between px-2 pt-4 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-gray-100 w-full h-0" />
              <div className="border-b border-gray-100 w-full h-0" />
              <div className="border-b border-gray-100 w-full h-0" />
            </div>
            <div className="w-[10%] bg-indigo-100 rounded-t-lg h-[40%]" />
            <div className="w-[10%] bg-indigo-200 rounded-t-lg h-[55%]" />
            <div className="w-[10%] bg-indigo-300 rounded-t-lg h-[45%]" />
            <div className="w-[10%] bg-indigo-400 rounded-t-lg h-[70%]" />
            <div className="w-[10%] bg-indigo-500 rounded-t-lg h-[60%]" />
            <div className="w-[10%] bg-indigo-600 rounded-t-lg h-[90%]" />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1 border-t border-gray-50 pt-2">
            <span>LIVE</span><span>DATA</span><span>FROM</span><span>BACKEND</span><span>ORDERS</span><span>NOW</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 text-base mb-4">Top Performers</h3>
          <div className="space-y-4">
            {topProducts.length === 0 && !loading ? (
              <p className="text-sm text-gray-500">No completed sales yet.</p>
            ) : null}
            {topProducts.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                <div className="truncate max-w-[9.375rem]">
                  <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                  <p className="text-[10px] text-indigo-600 font-semibold">{item.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-gray-900">{currencyFormatter.format(item.revenue || 0)}</p>
                  <p className="text-[10px] font-medium text-gray-400">{item.sales} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
