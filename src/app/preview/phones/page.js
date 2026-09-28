"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_BASE_URL, getImageUrl } from '@/config/api';
import { useAuth } from '@/Context/AuthContext';

const brands = [
  { name: 'Samsung', image: '/uploads/Galaxy%20s26.jpg', alt: 'Samsung Galaxy S26' },
  { name: 'Apple', image: '/uploads/iPhone-18-Pro-Dark-Cherry-Feature.jpg', alt: 'Apple iPhone 18 Pro' },
  { name: 'Nothing', image: '/uploads/Nothing%20phones.jpg', alt: 'Nothing phones' },
];
const formatPrice = (price) => `KSh ${Number(price).toLocaleString('en-KE')}`;

export default function PhoneCatalogPreviewPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [activeBrand, setActiveBrand] = useState('Samsung');
  const [selectedSlug, setSelectedSlug] = useState('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'manager') {
      router.replace('/');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
      return;
    }

    const controller = new AbortController();
    let active = true;

    fetch(`${API_BASE_URL}/api/shopping/products/admin/preview/phones`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
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
      controller.abort();
    };
  }, [authLoading, user, router]);

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

  return (
    <main className="min-h-screen bg-transparent text-foreground transition-colors">
      <header className="border-b border-(--border) bg-(--surface)">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-(--accent-2)">Internal catalog review</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground">Phones</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="border border-(--border) bg-(--surface-alt) px-3 py-1.5 text-xs font-semibold text-foreground">
              PREVIEW ONLY · NO DATABASE WRITES
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <nav aria-label="Phone brands" className="grid grid-cols-3 gap-2 border-b border-(--border) pb-6 sm:gap-4">
          {brands.map((brand) => {
            const count = products.filter((product) => product.brand === brand.name).length;
            const isActive = activeBrand === brand.name;

            return (
              <button
                key={brand.name}
                type="button"
                onClick={() => selectBrand(brand.name)}
                aria-pressed={isActive}
                className={`min-w-0 overflow-hidden border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-2) ${
                  isActive
                    ? 'border-(--accent-2) bg-(--surface-alt) text-foreground'
                    : 'border-(--border) bg-(--surface) text-(--muted) hover:border-(--accent-2) hover:text-foreground'
                }`}
              >
                <span className="relative block aspect-square overflow-hidden bg-(--surface-alt) sm:aspect-[4/3]">
                  <Image
                    src={getImageUrl(brand.image)}
                    alt={brand.alt}
                    fill
                    sizes="(max-width: 640px) 33vw, 400px"
                    className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </span>
                <span className="flex min-h-12 items-center justify-between gap-1 px-2 py-2 sm:px-4">
                  <span className="truncate text-xs font-bold sm:text-sm">{brand.name}</span>
                  <span className="shrink-0 text-[10px] text-(--muted) sm:text-xs">{count}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {status === 'loading' && (
          <p className="py-16 text-sm text-(--muted)">Loading local phone data...</p>
        )}
        {status === 'error' && (
          <div className="mt-8 border-l-4 border-(--danger) bg-(--surface) px-5 py-4 text-sm text-foreground">
            Preview data is unavailable. Confirm the backend preview flag is enabled and your manager session is valid.
          </div>
        )}

        {status === 'ready' && (
          <div className="grid gap-8 pt-7 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.5fr)] lg:gap-12">
            <section aria-labelledby="model-list-heading">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 id="model-list-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-(--muted)">
                  {activeBrand} models
                </h2>
                <span className="text-xs text-(--muted)">{visibleProducts.length} models</span>
              </div>

              <div className="divide-y divide-(--border) border-y border-(--border)">
                {visibleProducts.map((product) => {
                  const isSelected = product.slug === (selectedProduct?.slug || '');
                  return (
                    <button
                      key={product.slug}
                      type="button"
                      onClick={() => selectProduct(product)}
                      aria-pressed={isSelected}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-3.5 text-left transition-colors ${
                        isSelected ? 'bg-(--surface-alt)' : 'bg-transparent hover:bg-(--surface-alt)'
                      }`}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {product.name}
                      </span>
                      <span className="shrink-0 text-xs text-(--muted)">
                        From {formatPrice(product.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="variant-heading" className="border-t border-(--border) pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {selectedProduct ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--accent-2)">{selectedProduct.brand}</p>
                  <h2 id="variant-heading" className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                    {selectedProduct.name}
                  </h2>
                  <p className="mt-2 text-sm text-(--muted)">Choose a configuration to review its price and warranty.</p>

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
                              ? 'border-(--accent-2) bg-(--surface-alt)'
                              : 'border-(--border) bg-(--surface) hover:border-(--accent-2)'
                          }`}
                        >
                          <span className="block text-sm font-semibold text-foreground">{variant.label}</span>
                          <span className="mt-1 block text-xs text-(--muted)">{variant.market} · {variant.warranty} · {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedVariant && (
                    <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-t border-(--border) pt-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">Selected price</p>
                        <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">{formatPrice(selectedVariant.price)}</p>
                      </div>
                      <span className="text-sm text-(--muted)">{selectedVariant.warranty}</span>
                    </div>
                  )}

                  <div className="mt-9 grid gap-8 border-t border-(--border) pt-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <section aria-labelledby="image-heading">
                      <h3 id="image-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-(--muted)">Product image</h3>
                      <div
                        role="img"
                        aria-label={`${selectedProduct.name} product image${productImage ? '' : ' placeholder'}`}
                        className="mt-3 flex aspect-[4/3] items-center justify-center border border-dashed border-(--border) bg-(--surface) bg-cover bg-center text-sm text-(--muted)"
                        style={productImage ? { backgroundImage: `url("${getImageUrl(productImage)}")` } : undefined}
                      >
                        {!productImage && <span>Image not added yet</span>}
                      </div>
                    </section>

                    <div className="space-y-7">
                      <section aria-labelledby="description-heading">
                        <h3 id="description-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-(--muted)">Description</h3>
                        <p className="mt-3 text-sm leading-6 text-foreground">
                          {selectedProduct.description || 'Description not added yet.'}
                        </p>
                      </section>

                      <section aria-labelledby="features-heading">
                        <h3 id="features-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-(--muted)">Features</h3>
                        {selectedProduct.features?.length ? (
                          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-foreground">
                            {selectedProduct.features.map((feature, index) => (
                              <li key={`${index}-${String(feature)}`}>
                                {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-3 text-sm text-(--muted)">Features not added yet.</p>
                        )}
                      </section>

                      {!!Object.keys(selectedProduct.specs || {}).length && (
                        <section aria-labelledby="specs-heading">
                          <h3 id="specs-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-(--muted)">Specifications</h3>
                          <dl className="mt-3 space-y-2 text-sm">
                            {Object.entries(selectedProduct.specs).map(([name, value]) => (
                              <div key={name} className="flex justify-between gap-4 border-b border-(--border) pb-2">
                                <dt className="text-(--muted)">{name}</dt>
                                <dd className="text-right font-medium text-foreground">{String(value)}</dd>
                              </div>
                            ))}
                          </dl>
                        </section>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="py-10 text-sm text-(--muted)">No models found for this brand.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
