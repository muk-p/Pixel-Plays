'use client';

import React from 'react';
import { useCheckoutForm } from '@/Components/Auth/useCheckoutForm';
import CheckoutSuccess from '@/Components/Auth/CheckoutSucces'; // Fixed: Restored the missing 's' on the end
import CheckoutForm from '@/Components/Auth/CheckoutForm';

const Checkout = () => {
  const form = useCheckoutForm();

  // Show the success loading card if an M-Pesa push is running OR if the payment has finished completely
  const isProcessingOrComplete = form.orderId !== null || form.success;

  return (
    <div className="min-h-[calc(100vh-53px)] w-full bg-gray-50 flex items-center justify-center py-8 px-4 overflow-y-auto">
      {isProcessingOrComplete ? (
        <CheckoutSuccess 
          orderId={form.orderId} 
          success={form.success} 
          fullName={form.fullName}
        />
      ) : (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 h-auto">
          <div className="mb-6 rounded-3xl border border-dashed border-indigo-200 bg-indigo-50 p-6">
            <p className="text-sm text-indigo-700 font-medium mb-4">
              Our online checkout is currently inactive. To complete your purchase, pay directly to the till below.
            </p>

            <div className="space-y-3">
              <div className="rounded-2xl bg-white p-5 border border-indigo-100 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-black text-indigo-500">Till Number</p>
                <p className="text-2xl font-black text-indigo-900">9218652</p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-indigo-100 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-black text-indigo-500">Payee Name</p>
                <p className="text-2xl font-black text-indigo-900">John Mukara</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-indigo-100 p-4 border border-indigo-200 text-sm text-indigo-700">
              Please complete payment using M-Pesa to the till number above and keep your confirmation message.
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-green-700">Need help before checkout?</p>
                <p className="mt-1 text-sm font-medium text-green-700">Reach our support team instantly on WhatsApp.</p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href="https://wa.me/254794966733?text=Hello%20Pixel%20Plays%2C%20I%20need%20help%20with%20my%20checkout."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2.5 text-sm font-black text-white transition hover:bg-green-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12.04 2.5A9.54 9.54 0 0 0 3.4 11.58c0 1.68.44 3.3 1.27 4.72L2.5 21.5l5.34-1.4a9.53 9.53 0 0 0 4.2 1.02h.01c5.27 0 9.54-4.27 9.54-9.54A9.54 9.54 0 0 0 12.04 2.5Zm0 17.34h-.01a7.8 7.8 0 0 1-3.95-1.1l-.28-.17-3.17.83.85-3.08-.18-.3a7.8 7.8 0 0 1-1.22-4.17c0-4.31 3.5-7.81 7.81-7.81a7.8 7.8 0 0 1 7.81 7.81c0 4.31-3.5 7.81-7.81 7.81Zm4.3-5.86c-.24-.12-1.41-.69-1.63-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.64-1.19-1.42-1.33-1.66-.14-.24-.015-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.41-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.01 0 1.19.86 2.33.98 2.49.12.16 1.7 2.6 4.13 3.55.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                </svg>
                Chat Support on WhatsApp
              </a>
              <a
                href="https://wa.me/254795040185?text=Hello%20Pixel%20Plays%2C%20I%20would%20like%20to%20ask%20about%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12.04 2.5A9.54 9.54 0 0 0 3.4 11.58c0 1.68.44 3.3 1.27 4.72L2.5 21.5l5.34-1.4a9.53 9.53 0 0 0 4.2 1.02h.01c5.27 0 9.54-4.27 9.54-9.54A9.54 9.54 0 0 0 12.04 2.5Zm0 17.34h-.01a7.8 7.8 0 0 1-3.95-1.1l-.28-.17-3.17.83.85-3.08-.18-.3a7.8 7.8 0 0 1-1.22-4.17c0-4.31 3.5-7.81 7.81-7.81a7.8 7.8 0 0 1 7.81 7.81c0 4.31-3.5 7.81-7.81 7.81Zm4.3-5.86c-.24-.12-1.41-.69-1.63-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.64-1.19-1.42-1.33-1.66-.14-.24-.015-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.41-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.01 0 1.19.86 2.33.98 2.49.12.16 1.7 2.6 4.13 3.55.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                </svg>
                Chat Sales on WhatsApp
              </a>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 md:mb-6 tracking-tight">
            M-Pesa Checkout
          </h2>
          
          {/* Price Display */}
          <div className="mb-4 md:mb-6 p-4 md:p-6 bg-green-50 rounded-2xl border border-green-100">
            <p className="text-[10px] text-green-700 uppercase font-black tracking-widest mb-0.5">Total to Pay</p>
            <p className="text-3xl md:text-4xl font-black text-green-600">{form.formatCurrency(form.totalPrice)}</p>
          </div>

          {/* Global Error Banner / Status Prompts */}
          {form.errorMessage && (
            <div className={`mb-4 p-3 border rounded-xl text-xs font-bold ${
              form.errorMessage.includes('🔒') ? 'bg-orange-50 border-orange-200 text-orange-600 animate-pulse' : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {form.errorMessage}
            </div>
          )}

          {/* Single Unified Checkout Form */}
          <CheckoutForm {...form} />
        </div>
      )}
    </div>
  );
};

export default Checkout;