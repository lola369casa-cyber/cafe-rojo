import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function Page() {
  return (
    <>
      <h1>Terms</h1>
      <h2>Orders</h2>
      <p>By placing an order you agree to pay the listed price plus any applicable shipping and tax. We may cancel an order if an item is unavailable or a price was listed in error, and will refund you in full.</p>
      <h2>Subscriptions</h2>
      <p>Subscriptions renew automatically at the frequency you choose until cancelled. You can cancel at any time from your account.</p>
      <h2>Product information</h2>
      <p>We describe our coffee as accurately as we can. Tasting notes are a guide; flavor varies with brewing method and personal taste.</p>
    </>
  );
}
