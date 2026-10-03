import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping", alternates: { canonical: "/shipping" } };

export default function Page() {
  return (
    <>
      <h1>Shipping</h1>
      <h2>Processing</h2>
      <p>Coffee is roasted in small batches and packed to order. Processing times will be confirmed here before launch.</p>
      <h2>Rates</h2>
      <p>Orders over $50 ship free within the United States. Orders under $50 ship at a flat rate of $6.95. Subscription deliveries always ship free.</p>
      <h2>Tracking</h2>
      <p>You will receive an email with tracking details when your order ships. You can also track orders from your account.</p>
    </>
  );
}
