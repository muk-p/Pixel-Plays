"use client";

import React from 'react';

const BuyerOrdersAside = ({
  isOpen,
  onClose,
  buyerSearch,
  setBuyerSearch,
  buyerResult,
  buyerFeedback,
  onSearch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close buyer orders panel"
      />

      <aside className="relative flex h-full w-[92vw] max-w-sm flex-col border-r border-(--border) bg-(--surface) p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500">Buyer Hub</p>
            <h2 className="text-lg font-black text-foreground">Order Status</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-(--border) p-2 text-foreground transition hover:bg-(--surface-alt)"
            aria-label="Close buyer orders panel"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSearch} className="mt-5 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-(--muted)">
            Search by checkout ID
          </label>
          <div className="flex gap-2">
            <input
              value={buyerSearch}
              onChange={(e) => setBuyerSearch(e.target.value)}
              placeholder="e.g CHK12345"
              className="flex-1 rounded-xl border border-(--border) bg-(--surface-alt) px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </form>

        {buyerFeedback && (
          <p className="mt-3 rounded-xl border border-(--border) bg-(--surface-alt) px-3 py-2 text-sm text-(--muted)">
            {buyerFeedback}
          </p>
        )}

        {buyerResult ? (
          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-3 text-sm shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <div className="flex items-center justify-between gap-2">
              <p className="font-black text-foreground">{buyerResult.orderNumber || buyerResult.id}</p>
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {buyerResult.status || 'On Route'}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-(--muted)">
              <p>{buyerResult.itemName || 'Order fetched from the checkout ID.'}</p>
              {buyerResult.customerName && <p>Customer: {buyerResult.customerName}</p>}
              {buyerResult.totalAmount != null && <p>Total: KES {Number(buyerResult.totalAmount).toFixed(2)}</p>}
              {buyerResult.paymentMethod && <p>Payment: {buyerResult.paymentMethod}</p>}
              {buyerResult.address && <p>Address: {buyerResult.address}</p>}
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">Order lookup</p>
            <p className="rounded-xl border border-dashed border-(--border) p-3 text-sm text-(--muted)">
              Enter the checkout ID shown at the end of checkout to retrieve the matching order.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default BuyerOrdersAside;
