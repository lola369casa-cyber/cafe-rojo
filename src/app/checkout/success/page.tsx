import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/clear-cart";
import { hasStripe, money } from "@/lib/site";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const id = (await searchParams).session_id;
  let paid = false;
  let total: number | null = null;
  let email: string | null = null;
  if (hasStripe && typeof id === "string") {
    try {
      const s = await stripe().checkout.sessions.retrieve(id);
      paid = s.payment_status === "paid" || s.status === "complete";
      total = s.amount_total;
      email = s.customer_details?.email ?? null;
    } catch {}
  }

  if (!paid) {
    return (
      <div className="container-x py-28 text-center">
        <h1 className="display text-5xl">We couldn’t confirm this order</h1>
        <p className="lede mx-auto mt-4 max-w-xl">If you completed payment, your confirmation email is on its way. Otherwise, your cart is still saved.</p>
        <Link href="/checkout" className="btn btn-primary mt-8">Return to Checkout</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-24 text-center lg:py-32">
      <ClearCart />
      <p className="eyebrow">Order Confirmed</p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">Thank You</h1>
      <div className="gold-rule mx-auto my-8" />
      <p className="lede mx-auto max-w-xl">
        Your coffee is being prepared.{email ? <> A confirmation has been sent to <strong className="font-medium text-ink">{email}</strong>.</> : null}
      </p>
      {total != null && <p className="mt-4 font-serif text-3xl">Total paid {money(total)}</p>}
      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <Link href="/account" className="btn btn-primary">View Your Orders</Link>
        <Link href="/shop" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
