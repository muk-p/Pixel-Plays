"use client"; // 🚀 Required because modals track conditional state attachments

import React, { useState, useEffect } from 'react';

const InventoryModal = ({
  selectedProduct,
  inventory,
  newCodes,
  setNewCodes,
  handleAddCodes,
  setShowInventory
}) => {
  // Safe Hydration state hook guard
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manage Inventory</h2>
              <p className="text-gray-500 text-sm">{selectedProduct.name}</p>
            </div>
            <button
              onClick={() => setShowInventory(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">Add New Codes</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Enter codes (one per line)
                </label>
                <textarea
                  value={newCodes}
                  onChange={(e) => setNewCodes(e.target.value)}
                  placeholder="ABC123-DEF456-GHI789&#10;XYZ789-UVW123-STU456"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={handleAddCodes}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Add Codes to Inventory
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Current Inventory ({inventory.length} codes)</h3>
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-xl">
              {inventory.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No codes in inventory yet. Add some codes above.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {inventory.map(item => (
                    <div key={item.id} className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {item.code}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'sold'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      {item.sold_at && isMounted && (
                        <span className="text-xs text-gray-500">
                          Sold {new Date(item.sold_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
