import React from 'react';

const CodesList = ({
  filteredProducts,
  hasProducts,
  loading,
  error,
  fetchGamingCodes,
  openForm,
  openInventory,
  handleDelete
}) => {
  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
          <button
            onClick={fetchGamingCodes}
            className="ml-2 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-xl font-black text-gray-300">Loading gaming codes...</div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            {hasProducts ? 'No matching gaming codes found.' : 'No gaming codes found.'}
          </p>
          {!hasProducts && (
            <button
              onClick={() => openForm()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
            >
              Add Your First Gaming Code
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-(--surface) p-4 rounded-2xl border border-(--border) flex items-center justify-between shadow-sm active:bg-(--surface-alt) transition-colors">
              <div className="flex flex-col gap-1 pr-2 flex-1">
                <div className="flex gap-2 items-center">
                  <span className="text-[8px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-black uppercase">{product.region}</span>
                  <span className="text-[8px] bg-(--surface-alt) text-(--muted) px-1.5 py-0.5 rounded font-black uppercase">{product.platform}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
                    product.stock > 10 ? 'bg-green-50 text-green-600' :
                    product.stock > 0 ? 'bg-yellow-50 text-yellow-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-sm line-clamp-1">{product.name}</h3>
                {product.description && (
                  <p className="text-xs text-(--muted) line-clamp-2">{product.description}</p>
                )}
                <p className="font-black text-green-600">KES {product.price.toLocaleString()}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openInventory(product)}
                  className="p-3 bg-blue-50 text-blue-600 rounded-xl active:bg-blue-100 active:text-blue-700 transition-colors"
                  title="Manage Inventory"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => openForm(product)}
                  className="p-3 bg-(--surface-alt) text-(--muted) rounded-xl active:bg-indigo-100 active:text-indigo-600 transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-3 bg-(--surface-alt) text-(--muted) rounded-xl active:bg-red-100 active:text-red-600 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodesList;
