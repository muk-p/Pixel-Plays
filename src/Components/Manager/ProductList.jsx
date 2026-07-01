import React from 'react';
import Image from 'next/image'; // 🚀 Next.js optimized Image loader tool
import { getImageUrl } from '../../config/api';
import { isRemoteImageSource } from '../../config/ImageLoader';

const ProductList = ({
  filteredProducts,
  productCount,
  openForm,
  handleDelete,
  toggleHero,
  loading
}) => {
  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const category = product.category?.trim() || 'Uncategorized';
    if (!groups[category]) groups[category] = [];
    groups[category].push(product);
    return groups;
  }, {});

  const sortedCategories = Object.keys(groupedProducts).sort((a, b) => a.localeCompare(b));

  // Next.js Image Asset Resolution Guard Function
  const resolveProductImage = (srcPath) => {
    if (!srcPath) return 'https://unsplash.com'; // Clean default fallback placeholder
    try {
      const parsedUrl = getImageUrl(srcPath);
      // Ensure it produces a valid relative path or schema string format
      return parsedUrl || srcPath;
    } catch (e) {
      return srcPath;
    }
  };

  return (
    <div className="space-y-10">
      {filteredProducts.length > 0 ? sortedCategories.map(category => (
        <div key={category} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          
          {/* Category Header Bar */}
          <div className="bg-gray-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
            <h2 className="text-xs md:text-sm font-black uppercase tracking-wider text-gray-700">{category}</h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {groupedProducts[category].length} {groupedProducts[category].length > 1 ? 'Items' : 'Item'}
            </span>
          </div>

          {/* Management Table View */}
          <div className="divide-y divide-gray-100">
            {groupedProducts[category].map(product => {
              const resolvedImageSrc = resolveProductImage(product.image_url);
              const useUnoptimizedImage = isRemoteImageSource(resolvedImageSrc);

              return (
              // 👈 1. Updated structural DOM mapping keys from product.id to handle unique slugs natively
              <div key={product.slug || product.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                
                {/* Info Column */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Next.js Optimization Frame Wrapper for Fluid Sizing layout */}
                  <div className="w-12 h-12 relative overflow-hidden bg-gray-100 rounded-xl shrink-0 border border-gray-100">
                    <Image 
                      src={resolvedImageSrc}
                      alt={product.name || "Product item layout illustration thumbnail picture"} 
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized={useUnoptimizedImage}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{product.name}</h3>
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-tight mt-0.5">
                      {product.brand || 'No Brand'}
                    </p>
                  </div>
                </div>

                {/* Metrics Grid Column */}
                <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-8 shrink-0 text-left sm:text-right">
                  {/* Price */}
                  <div>
                    <span className="block text-[9px] uppercase text-gray-400 font-black tracking-wider sm:hidden">Price</span>
                    <span className="text-sm font-black text-gray-900">KES {Number(product.price).toLocaleString()}</span>
                  </div>

                  {/* Stock Metrics */}
                  <div className="sm:w-28">
                    <span className="block text-[9px] uppercase text-gray-400 font-black tracking-wider sm:hidden">Stock</span>
                    <span className={`inline-flex items-center text-xs font-black uppercase ${
                      product.stock === 0 
                        ? 'text-red-600' 
                        : product.stock < 5 
                        ? 'text-amber-600' 
                        : 'text-emerald-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${
                        product.stock === 0 ? 'bg-red-500' : product.stock < 5 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      {product.stock} Units
                    </span>
                  </div>
                </div>

                {/* Management Actions Column */}
                <div className="flex items-center justify-end gap-2 shrink-0 pt-3 sm:pt-0 border-t border-gray-50 sm:border-none">
                  {/* Hero Feature Star */}
                  <button 
                    onClick={() => toggleHero(product)}
                    disabled={loading}
                    className={`p-2 rounded-xl transition-all border ${
                      product.is_hero 
                        ? 'text-amber-500 bg-amber-50 border-amber-200' 
                        : 'text-gray-400 bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                    title={product.is_hero ? "Remove from Showcase" : "Promote to Showcase"}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>

                  {/* Edit Action */}
                  <button 
                    onClick={() => openForm(product)} 
                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Edit
                  </button>

                  {/* Delete Action */}
                  <button 
                    // 👈 2. Updated click handler interceptor to pass the whole product object containing our slugs
                    onClick={() => handleDelete(product)} 
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>

              </div>
              );
            })}
          </div>
        </div>
      )) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <p className="text-gray-400 font-medium">
            {productCount > 0 ? 'No inventory matches your search criteria.' : 'Your store catalog is currently empty.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
