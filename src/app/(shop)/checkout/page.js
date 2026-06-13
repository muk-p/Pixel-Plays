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
        // Fixed: Passed all required variables so the loading circle knows when to flip to the green checkmark
        <CheckoutSuccess 
          orderId={form.orderId} 
          success={form.success} 
          fullName={form.fullName}
        />
      ) : (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 h-auto">
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
