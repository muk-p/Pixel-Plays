import React from 'react';

const CheckoutSuccess = ({ orderId, success, fullName }) => {
  return (
    <div className="w-full max-w-md bg-(--surface) rounded-3xl shadow-2xl p-8 border border-(--border) text-center animate-fadeIn">
      
      {/* ================================================================= */}
      {/* STATE A: WAITING FOR USER TO ENTER M-PESA PIN */}
      {/* ================================================================= */}
      {!success ? (
        <>
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-50 border border-amber-100 mb-6 relative">
            {/* Smooth glowing ring animation */}
            <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-3xl animate-pulse">🔒</span>
          </div>
          
          <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Awaiting Payment...</h2>
          <p className="text-xs font-extrabold text-amber-700 mb-6 bg-amber-50 py-2 px-4 rounded-xl inline-block border border-amber-100/50">
            STK Push Sent to Your Handset
          </p>
          
          <p className="text-(--muted) text-sm font-medium mb-6 px-4 leading-relaxed">
            Please check your phone screen. Enter your **M-Pesa PIN** inside the popup window to authorize this checkout charge.
          </p>
        </>
      ) : (
        /* ================================================================= */
        /* STATE B: PAYMENT SUCCESSFULLY CONFIRMED BY WEBHOOK */
        /* ================================================================= */
        <>
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 border border-emerald-200 mb-6 animate-bounce">
            <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">Order Confirmed!</h2>
          <p className="text-xs font-extrabold text-emerald-700 mb-6 bg-emerald-50 py-2 px-4 rounded-xl inline-block border border-emerald-100">
            KSh Payment Received Successfully
          </p>
          
          <p className="text-(--muted) text-sm font-medium mb-6 px-4 leading-relaxed">
            Thank you! Your transaction cleared cleanly. The operations team has begun packing your cargo payload.
          </p>
        </>
      )}

      {/* ================================================================= */}
      {/* META INFORMATION RECEIPT CARD CARRIER */}
      {/* ================================================================= */}
      <div className="space-y-3">
        {/* Order tracking hash identifier */}
        {orderId && (
          <div className="bg-(--surface-alt) rounded-2xl p-4 border border-(--border) font-mono flex justify-between items-center text-left">
            <div className="w-full">
              <span className="block text-[10px] text-(--muted) uppercase font-black tracking-widest mb-0.5">
                {!success ? "Transaction Reference Key" : "Master Order Ticket Number"}
              </span>
              <span className="text-xs font-black text-foreground tracking-wider break-all block">
                {success ? `#${orderId}` : orderId}
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Client Name mapping */}
        <div className="bg-(--surface-alt) rounded-2xl p-4 border border-(--border) font-mono text-left">
          <span className="block text-[10px] text-(--muted) uppercase font-black tracking-widest mb-1">
            Account Owner Name
          </span>
          <span className="text-base font-black text-foreground tracking-wider block truncate">
            {fullName || 'GadgetFinds Shopper'}
          </span>
        </div>
      </div>

    </div>
  );
};

export default CheckoutSuccess;
