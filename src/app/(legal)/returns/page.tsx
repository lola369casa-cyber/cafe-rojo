import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns", alternates: { canonical: "/returns" } };

export default function Page() {
  return (
    <>
      <h1>Returns</h1>
      <h2>Our approach</h2>
      <p>Because coffee is a fresh, perishable product, returns are handled case by case. If something is wrong with your order, contact us and we will make it right.</p>
      <h2>Damaged or incorrect orders</h2>
      <p>Tell us what happened through the contact page, including your order number. The exact return window and refund terms will be confirmed here before launch.</p>
      <h2>Subscriptions</h2>
      <p>You can change, pause or cancel a subscription at any time from your account, before your next renewal.</p>
    </>
  );
}
