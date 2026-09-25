import Link from 'next/link';

export const metadata = {
  title: 'No Return Policy',
  description:
    'PixelPlays no return policy for digital codes, custom orders, and products that have been opened or used.',
};

export default function NoReturnPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
        >
          ← Back to home
        </Link>

        <header className="mt-6 border-b border-(--border) pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">PixelPlays Kenya</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            No Return Policy
          </h1>
        </header>

        <div className="mt-8 space-y-6 text-sm leading-7 text-(--muted)
">
          <p>
            Please read this policy carefully before placing an order with PixelPlays Kenya. By purchasing any
            product or digital code from us, you agree to the terms set out below.
          </p>

          <section>
            <h2 className="text-lg font-bold text-foreground">1. General principle</h2>
            <p>
              Due to the nature of digital codes, bespoke gaming products, and items that are sealed, personalized,
              or used once, we do not accept returns or exchanges unless the product is defective, damaged on
              arrival, or materially different from what was described in the listing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">2. Digital codes and instant delivery items</h2>
            <p>
              Digital game codes, e-wallet codes, subscription vouchers, and similar instant-delivery products are
              non-refundable once sent or activated. We do not offer cancellation or returns after confirmation of
              delivery to the customer or the redemption email/number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">3. Defective or damaged products</h2>
            <p>
              If an item arrives damaged, defective, or incorrect, please contact us within 24 hours of delivery
              with clear photos and your order details. We will review the issue and, where appropriate, arrange a
              replacement, repair, or refund according to the specific circumstances of the order.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">4. Opened or used items</h2>
            <p>
              Products that have been opened, used, installed, activated, or otherwise tampered with are not eligible
              for return unless there is a valid defect or a misrepresentation by PixelPlays.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">5. Cancellation before dispatch</h2>
            <p>
              If you cancel before the order is dispatched, we may, at our discretion, refund the purchase price
              less any payment processing or administrative costs already incurred.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">6. Customer responsibility</h2>
            <p>
              It is your responsibility to confirm the correct platform, region, account details, email address, and
              product selection before completing checkout. PixelPlays is not liable for errors made by the buyer in
              entering information for digital delivery.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">7. Contact us</h2>
            <p>
              If you believe your order qualifies for a return or replacement, contact our support team immediately
              at +254 794 966 733 or +254 119 318 296.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
