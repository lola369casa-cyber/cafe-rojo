import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function Page() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <h2>What we collect</h2>
      <p>When you place an order or create an account we collect your name, email, phone number and shipping address. If you join our mailing list we collect your email address.</p>
      <h2>Payments</h2>
      <p>Payments are processed by Stripe. Café Rojo never receives or stores your full card number.</p>
      <h2>How we use information</h2>
      <p>To fulfil orders, manage subscriptions, send order updates and — if you opt in — send news about our coffee. You can unsubscribe at any time.</p>
      <h2>Your choices</h2>
      <p>Contact us to access, correct or delete your personal information.</p>
    </>
  );
}
