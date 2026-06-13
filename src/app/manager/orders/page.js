"use client";

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, getAxiosConfig } from '@/config/api';

const currencyFormatter = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
});

const statusStyles = {
  pending: 'text-amber-700 bg-amber-50 border-amber-100',
  processing: 'text-blue-700 bg-blue-50 border-blue-100',
  shipped: 'text-indigo-700 bg-indigo-50 border-indigo-100',
  delivered: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  canceled: 'text-rose-700 bg-rose-50 border-rose-100',
};

const formatStatus = (status = '') => {
  const normalized = status?.toLowerCase() || '';
  if (normalized === 'delivered') return 'Delivered';
  if (normalized === 'processing') return 'Processing';
  if (normalized === 'shipped') return 'Shipped';
  if (normalized === 'canceled') return 'Canceled';
  return 'Pending';
};

export default function OrderTracking() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.SHOPPING.STATS, getAxiosConfig());
        setSummary(data.summary || {});
        setOrders(data.recentOrders || []);
      } catch (err) {
        console.error('Failed to load order stats', err);
        setError('Unable to load order activity right now.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = useMemo(() => {
    if (!summary) {
      return [
        { label: 'Pending', value: '—', color: 'text-amber-500' },
        { label: 'Processing', value: '—', color: 'text-indigo-600' },
        { label: 'Completed', value: '—', color: 'text-emerald-500' },
      ];
    }

    return [
      { label: 'Pending', value: summary.pendingOrders || 0, color: 'text-amber-500' },
      { label: 'Processing', value: summary.processingOrders || 0, color: 'text-indigo-600' },
      { label: 'Completed', value: summary.completedOrders || 0, color: 'text-emerald-500' },
    ];
  }, [summary]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="font-bold text-gray-800 text-lg">Fulfillment Engine</h2>
          <p className="text-xs text-gray-400">Track incoming customer physical cargo and fulfillment activity from the backend</p>
        </div>
        <div className="flex items-center gap-6">
          {statCards.map((card) => (
            <div key={card.label} className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase">{card.label}</p>
              <p className={`text-lg font-black ${card.color}`}>{loading ? '—' : card.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-base">Recent Live Orders</h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">Real-time Stream</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Product Type</th>
                <th className="py-3 px-6">Total Cost</th>
                <th className="py-3 px-6 text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
              {!loading && orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-sm text-gray-500">No recent orders found.</td>
                </tr>
              ) : null}
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-indigo-600">{order.orderNumber || `#${order.id}`}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{order.customerName}</td>
                  <td className="py-4 px-6 text-gray-500">Physical Product</td>
                  <td className="py-4 px-6 font-bold text-gray-900">{currencyFormatter.format(order.totalAmount || 0)}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusStyles[(order.status || '').toLowerCase()] || 'text-slate-700 bg-slate-50 border-slate-100'}`}>
                      {formatStatus(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
