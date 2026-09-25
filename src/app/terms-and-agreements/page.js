import Link from 'next/link';

export const metadata = {
  title: 'Terms and Agreements',
  description:
    'Read PixelPlays Kenya terms and agreements covering orders, payments, digital codes, delivery, and customer obligations.',
};

export default function TermsAndAgreementsPage() {
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
            Terms and Agreements
          </h1>
        </header>

        <div className="mt-8 space-y-6 text-sm leading-7 text-(--muted)
">
          <p>
            These Terms and Agreements govern all purchases made through PixelPlays Kenya. By placing an order, you
            confirm that you have read, understood, and agreed to these terms.
          </p>

          <section>
            <h2 className="text-lg font-bold text-foreground">1. Eligibility and order acceptance</h2>
            <p>
              You must be at least 18 years old or have the legal authority to make purchases in Kenya. PixelPlays
              reserves the right to refuse, cancel, or limit any order without prior notice if we suspect fraud,
              misuse, or a violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">2. Product accuracy</h2>
            <p>
              We work to provide accurate product descriptions, pricing, and availability information. However,
              occasional errors may occur. In such cases, we may correct the listing, cancel the order, or contact
              you for confirmation before processing the sale.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">3. Payment and checkout</h2>
            <p>
              All purchases are processed through secure payment gateways available at the time of order. Orders are
              considered accepted only after payment is successfully received and confirmed by PixelPlays.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">4. Digital products</h2>
            <p>
              Digital gaming codes and instant-delivery products are provided electronically. It is your responsibility
              to provide the correct platform, region, and delivery details and to confirm the product is compatible
              with your device or account before finalizing payment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">5. Delivery and timing</h2>
            <p>
              Delivery times depend on product type, stock availability, and the delivery method selected. We will do
              our best to process orders promptly, but we do not guarantee exact delivery windows for every order.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">6. Returns, defects, and disputes</h2>
            <p>
              Please refer to our No Return Policy for handling of returns, damaged goods, and digital code disputes.
              We will address genuine defects or delivery issues in line with the policy and our legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">7. Privacy and data use</h2>
            <p>
              We use customer information strictly to process and deliver orders, support service requests, and comply
              with applicable law. We do not sell customer data to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">8. Limitation of liability</h2>
            <p>
              PixelPlays is not liable for indirect, incidental, or consequential losses arising from delays,
              product incompatibility, or failed third-party services, except where caused by our negligence or
              intentional misconduct.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">9. Contact</h2>
            <p>
              For questions, complaints, or support requests, contact PixelPlays at +254 794 966 733 or +254 119 318 296.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
