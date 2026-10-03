"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { money, unitPrice } from "@/lib/site";
import { Bag } from "./bag";
import { CallRequest } from "./call-request";
import { lineKey, useCart } from "./cart";

const states = "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" ");

export function CheckoutForm() {
  const { items, subtotalCents, shippingCents, hasSubscription } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: Object.fromEntries(new FormData(e.currentTarget)),
          items: items.map((i) => ({ variantId: i.variantId, qty: i.qty, subscribe: i.subscribe, interval: i.interval })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "We couldn’t start the payment.");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-28 text-center">
        <h1 className="display text-5xl">Your cart is empty</h1>
        <p className="lede mt-4">Add a coffee to begin checkout.</p>
        <Link href="/shop" className="btn btn-primary mt-8">Shop Coffee</Link>
      </div>
    );
  }

  const F = ({ name, label, type = "text", auto, required = true, className = "" }: { name: string; label: string; type?: string; auto: string; required?: boolean; className?: string }) => (
    <div className={className}>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} autoComplete={auto} required={required} className="field" />
    </div>
  );

  return (
    <div className="container-x py-10 lg:py-16">
      <h1 className="display text-5xl sm:text-6xl">Checkout</h1>
      <p className="mt-3 flex items-center gap-2 text-sm text-muted"><Lock size={14} /> Secure checkout — payment is processed by Stripe.</p>

      <form onSubmit={submit} className="mt-10 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-3xl">1. Your Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {F({ name: "firstName", label: "First Name", auto: "given-name" })}
              {F({ name: "lastName", label: "Last Name", auto: "family-name" })}
              {F({ name: "email", label: "Email", type: "email", auto: "email" })}
              {F({ name: "phone", label: "Phone", type: "tel", auto: "tel", required: false })}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl">2. Shipping Address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-6">
              {F({ name: "address", label: "Address", auto: "address-line1", className: "sm:col-span-6" })}
              {F({ name: "address2", label: "Apartment, suite (optional)", auto: "address-line2", required: false, className: "sm:col-span-6" })}
              {F({ name: "city", label: "City", auto: "address-level2", className: "sm:col-span-3" })}
              <div className="sm:col-span-1">
                <label className="label" htmlFor="state">State</label>
                <select id="state" name="state" required autoComplete="address-level1" className="field" defaultValue="">
                  <option value="" disabled>—</option>
                  {states.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              {F({ name: "zip", label: "ZIP", auto: "postal-code", className: "sm:col-span-2" })}
              <div className="sm:col-span-6">
                <label className="label" htmlFor="country">Country</label>
                <select id="country" name="country" className="field" autoComplete="country"><option value="US">United States</option></select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl">3. Payment</h2>
            <div className="mt-5 border border-sand bg-cream p-6">
              <p>You’ll complete payment on Stripe’s secure page.</p>
              <ul className="mt-3 flex flex-wrap gap-2 text-xs tracking-[0.14em] uppercase">
                {["Credit / Debit Card", "Apple Pay", "Google Pay"].map((m) => <li key={m} className="border border-sand bg-white px-3 py-1.5">{m}</li>)}
              </ul>
              <p className="mt-3 text-sm text-muted">Café Rojo never sees or stores your card details.</p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-36 lg:self-start">
          <div className="border border-sand bg-white p-6 sm:p-8">
            <h2 className="font-serif text-3xl">Order Summary</h2>
            <ul className="mt-5 divide-y divide-sand border-y border-sand">
              {items.map((i) => (
                <li key={lineKey(i)} className="flex gap-4 py-4">
                  <div className="w-16 shrink-0"><Bag bag={i.bag} subtitle={i.name} size={i.size} image={i.image} alt={i.name} sizes="64px" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-xl leading-tight">{i.name}</p>
                    <p className="text-sm text-muted">{i.size} · Qty {i.qty}</p>
                    {i.subscribe && <p className="text-xs tracking-wide text-forest uppercase">Every {i.interval} weeks</p>}
                  </div>
                  <p className="font-medium">{money(unitPrice(i.priceCents, i.subscribe) * i.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2.5 text-[0.98rem]">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotalCents)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{shippingCents === 0 ? "Free" : money(shippingCents)}</dd></div>
              <div className="flex justify-between"><dt>Tax</dt><dd className="text-muted">Calculated at payment</dd></div>
              <div className="flex items-baseline justify-between border-t border-sand pt-4">
                <dt className="text-[0.74rem] font-medium tracking-[0.2em] uppercase">Total</dt>
                <dd className="font-serif text-4xl">{money(subtotalCents + shippingCents)}</dd>
              </div>
            </dl>
            {hasSubscription && <p className="mt-3 text-sm text-muted">Includes a subscription. It renews automatically at the frequency shown until you cancel.</p>}
            {error && <p role="alert" className="mt-4 border border-burgundy/40 bg-burgundy/5 p-3 text-sm text-burgundy">{error}</p>}
            <button className="btn btn-primary mt-6 w-full" disabled={busy}>{busy ? "Redirecting…" : "Continue to Secure Payment"}</button>
            <p className="mt-3 text-center text-xs text-muted">Have a discount code? Enter it on the payment page.</p>
          </div>
          <CallRequest />
        </aside>
      </form>
    </div>
  );
}
