"use client";

import { useEffect, useState } from 'react';
import { API_BASE_URL, getImageUrl } from '@/config/api';

const brands = ['Samsung', 'Apple', 'Nothing'];
const formatPrice = (price) => `KSh ${Number(price).toLocaleString('en-KE')}`;

export default function PhoneCatalogPreviewPage() {
  const [products, setProducts] = useState([]);
  const [activeBrand, setActiveBrand] = useState('Samsung');
  const [selectedSlug, setSelectedSlug] = useState('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [status, setStatus] = useState('loading');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/shopping/products/preview/phones`)
      .then((response) => {
        if (!response.ok) throw new Error('Preview endpoint is unavailable');
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setProducts(data.products || []);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleProducts = products.filter((product) => product.brand === activeBrand);
  const selectedProduct = visibleProducts.find((product) => product.slug === selectedSlug) || visibleProducts[0];
  const selectedVariant = selectedProduct?.variants[selectedVariantIndex] || selectedProduct?.variants[0];
  const productImage = selectedProduct?.images?.[0] || selectedProduct?.image_url;

  const selectBrand = (brand) => {
    setActiveBrand(brand);
    setSelectedSlug('');
    setSelectedVariantIndex(0);
  };

  const selectProduct = (product) => {
    setSelectedSlug(product.slug);
    setSelectedVariantIndex(0);
  };

  const toggleTheme = () => setIsDark((currentTheme) => !currentTheme);

  return (
    <main data-theme={isDark ? 'dark' : 'light'} className="preview-root min-h-screen bg-[#f4f6f3] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">Local catalog review</p>
            <h1 className="mt-1 text-2xl font-bold">Phones</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
              className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700"
            >
              Dark mode
              <span className={`relative inline-flex h-6 w-11 items-center border transition-colors ${isDark ? 'border-emerald-300 bg-emerald-700' : 'border-slate-400 bg-slate-200'}`}>
                <span className={`absolute h-4 w-4 bg-white transition-transform ${isDark ? 'translate-x-5' : 'translate-x-1'}`} />
              </span>
            </button>
            <span className="border border-emerald-800/20 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">
              PREVIEW ONLY · NO DATABASE WRITES
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <nav aria-label="Phone brands" className="flex gap-2 overflow-x-auto border-b border-slate-200">
          {brands.map((brand) => {
            const count = products.filter((product) => product.brand === brand).length;
            const isActive = activeBrand === brand;

            return (
              <button
                key={brand}
                type="button"
                onClick={() => selectBrand(brand)}
                aria-pressed={isActive}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-emerald-800 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {brand} <span className="ml-1 text-xs font-medium opacity-70">{count}</span>
              </button>
            );
          })}
        </nav>

        {status === 'loading' && (
          <p className="py-16 text-sm text-slate-500">Loading local phone data...</p>
        )}
        {status === 'error' && (
          <div className="mt-8 border-l-4 border-rose-700 bg-white px-5 py-4 text-sm text-slate-700">
            Preview data is unavailable. Start the local backend and enable `PHONE_CATALOG_PREVIEW` in its ignored `.env` file.
          </div>
        )}

        {status === 'ready' && (
          <div className="grid gap-8 pt-7 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.5fr)] lg:gap-12">
            <section aria-labelledby="model-list-heading">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 id="model-list-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {activeBrand} models
                </h2>
                <span className="text-xs text-slate-500">{visibleProducts.length} models</span>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200">
                {visibleProducts.map((product) => {
                  const isSelected = product.slug === (selectedProduct?.slug || '');
                  return (
                    <button
                      key={product.slug}
                      type="button"
                      onClick={() => selectProduct(product)}
                      aria-pressed={isSelected}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-3.5 text-left transition-colors ${
                        isSelected ? 'bg-emerald-50' : 'bg-transparent hover:bg-white'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                        {product.name}
                      </span>
                      <span className="shrink-0 text-xs text-slate-500">
                        From {formatPrice(product.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="variant-heading" className="border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {selectedProduct ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">{selectedProduct.brand}</p>
                  <h2 id="variant-heading" className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {selectedProduct.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">Choose a configuration to review its price and warranty.</p>

                  <div className="mt-7 grid gap-2 sm:grid-cols-2">
                    {selectedProduct.variants.map((variant, index) => {
                      const isSelected = index === selectedVariantIndex;
                      return (
                        <button
                          key={`${variant.label}-${variant.market}-${variant.warranty}`}
                          type="button"
                          onClick={() => setSelectedVariantIndex(index)}
                          aria-pressed={isSelected}
                          className={`min-h-20 border px-4 py-3 text-left transition-colors ${
                            isSelected
                              ? 'border-emerald-800 bg-emerald-50'
                              : 'border-slate-200 bg-white hover:border-slate-400'
                          }`}
                        >
                          <span className="block text-sm font-semibold text-slate-900">{variant.label}</span>
                          <span className="mt-1 block text-xs text-slate-500">{variant.market} · {variant.warranty}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedVariant && (
                    <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-t border-slate-200 pt-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected price</p>
                        <p className="mt-1 text-3xl font-bold tabular-nums text-slate-950">{formatPrice(selectedVariant.price)}</p>
                      </div>
                      <span className="text-sm text-slate-600">{selectedVariant.warranty}</span>
                    </div>
                  )}

                  <div className="mt-9 grid gap-8 border-t border-slate-200 pt-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <section aria-labelledby="image-heading">
                      <h3 id="image-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Product image</h3>
                      <div
                        role="img"
                        aria-label={`${selectedProduct.name} product image${productImage ? '' : ' placeholder'}`}
                        className="mt-3 flex aspect-[4/3] items-center justify-center border border-dashed border-slate-200 bg-white bg-cover bg-center text-sm text-slate-500"
                        style={productImage ? { backgroundImage: `url("${getImageUrl(productImage)}")` } : undefined}
                      >
                        {!productImage && <span>Image not added yet</span>}
                      </div>
                    </section>

                    <div className="space-y-7">
                      <section aria-labelledby="description-heading">
                        <h3 id="description-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Description</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {selectedProduct.description || 'Description not added yet.'}
                        </p>
                      </section>

                      <section aria-labelledby="features-heading">
                        <h3 id="features-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Features</h3>
                        {selectedProduct.features?.length ? (
                          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700">
                            {selectedProduct.features.map((feature, index) => (
                              <li key={`${index}-${String(feature)}`}>
                                {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-3 text-sm text-slate-500">Features not added yet.</p>
                        )}
                      </section>

                      {!!Object.keys(selectedProduct.specs || {}).length && (
                        <section aria-labelledby="specs-heading">
                          <h3 id="specs-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Specifications</h3>
                          <dl className="mt-3 space-y-2 text-sm">
                            {Object.entries(selectedProduct.specs).map(([name, value]) => (
                              <div key={name} className="flex justify-between gap-4 border-b border-slate-200 pb-2">
                                <dt className="text-slate-500">{name}</dt>
                                <dd className="text-right font-medium text-slate-800">{String(value)}</dd>
                              </div>
                            ))}
                          </dl>
                        </section>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="py-10 text-sm text-slate-500">No models found for this brand.</p>
              )}
            </section>
          </div>
        )}
      </div>
      <style jsx global>{`
        .preview-root[data-theme='dark'] {
          background-color: #101714;
          color: #f8fafc;
        }
        .preview-root[data-theme='dark'] .bg-white {
          background-color: #17231d;
        }
        .preview-root[data-theme='dark'] .bg-emerald-50 {
          background-color: #183d2d;
        }
        .preview-root[data-theme='dark'] .text-slate-950,
        .preview-root[data-theme='dark'] .text-slate-900,
        .preview-root[data-theme='dark'] .text-slate-800,
        .preview-root[data-theme='dark'] .text-slate-700 {
          color: #f1f5f9;
        }
        .preview-root[data-theme='dark'] .text-slate-600,
        .preview-root[data-theme='dark'] .text-slate-500 {
          color: #cbd5e1;
        }
        .preview-root[data-theme='dark'] .text-emerald-950 {
          color: #d1fae5;
        }
        .preview-root[data-theme='dark'] .text-emerald-900 {
          color: #a7f3d0;
        }
        .preview-root[data-theme='dark'] .text-emerald-800 {
          color: #6ee7b7;
        }
        .preview-root[data-theme='dark'] .border-slate-200,
        .preview-root[data-theme='dark'] .divide-slate-200 > :not(:last-child) {
          border-color: #405248;
        }
        .preview-root[data-theme='dark'] [class*='border-emerald-800'] {
          border-color: #6ee7b7;
        }
        .preview-root[data-theme='dark'] .hover\\:bg-white:hover {
          background-color: #26372e;
        }
        .preview-root[data-theme='dark'] .hover\\:text-slate-900:hover {
          color: #ffffff;
        }
        .preview-root[data-theme='dark'] .hover\\:border-slate-400:hover {
          border-color: #a7f3d0;
        }
      `}</style>
    </main>
  );
}
