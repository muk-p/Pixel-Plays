'use client';

import React from 'react';

const CheckoutForm = ({
  phone, setPhone,
  fullName, setFullName,
  address, setAddress,
  hasHardware, loading, timedOut, items,
  handlePayment
}) => {
  return (
    <form onSubmit={handlePayment} className="space-y-4 md:space-y-5">
      
      {/* Items in Order */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-(--muted) uppercase tracking-wider mb-1">
          Items in Order
        </label>
        
        <div className="max-h-40 overflow-y-auto border border-(--border) rounded-2xl divide-y divide-[rgba(148,163,184,0.2)] bg-(--surface-alt) pr-1 JSON-scrollbar">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 text-xs font-medium text-foreground">
                <div className="flex items-center space-x-2 truncate pr-2">
                  <span className="bg-(--surface) text-(--muted) px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0">
                    {item.quantity}x
                  </span>
                  <span className="truncate font-semibold text-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-foreground shrink-0 font-mono">
                  KES {Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-xs font-semibold text-gray-400">
              No products found in cart.
            </p>
          )}
        </div>
      </div>

      {/* M-Pesa Number */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1.5">M-Pesa Number</label>
        <input
          type="tel"
          placeholder="2547XXXXXXXX or 07XXXXXXXX"
          className="w-full px-4 py-3 md:py-4 border border-(--border) rounded-xl bg-(--surface-alt) focus:ring-2 focus:ring-green-500 outline-none text-sm transition-all font-medium text-foreground placeholder:text-(--muted)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      {/* Receipt Name */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1.5">Name for Receipt</label>
        <input 
          type="text" 
          placeholder="Your Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 md:py-4 border border-(--border) rounded-xl bg-(--surface-alt) focus:ring-2 focus:ring-green-500 outline-none text-sm transition-all font-medium text-foreground placeholder:text-(--muted)"
          required
        />
      </div>

      {/* Shipping Address - Automatically hidden if order contains only digital codes */}
      {hasHardware && (
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">Physical Shipping Address</label>
          <textarea
            placeholder="Building, street name, estate..."
            rows="2"
            className="w-full px-4 py-3 border border-(--border) bg-(--surface-alt) rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all font-medium text-foreground placeholder:text-(--muted) resize-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
      )}

      {/* Payment CTA */}
      <button
        type="submit"
        disabled={loading || !items || items.length === 0}
        className={`w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-white font-black text-lg transition-all active:scale-[0.98] disabled:bg-(--border) disabled:text-(--muted) disabled:shadow-none mt-2
          ${timedOut ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {loading ? "Sending Prompt..." : timedOut ? "Retry Payment" : "Confirm & Pay Now"}
      </button>

      {timedOut && (
        <p className="text-center text-xs font-bold text-orange-600 animate-pulse mt-2">
          Timed out. Please check your handset screen for the PIN popup.
        </p>
      )}
    </form>
  );
};

export default CheckoutForm;
