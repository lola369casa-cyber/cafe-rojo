"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { INTERVALS, money, SUBSCRIBE_DISCOUNT, unitPrice, type Interval } from "@/lib/site";
import { toCartItem } from "./add-to-cart";
import { useCart } from "./cart";

export function SubscriptionPicker({ products }: { products: Product[] }) {
  const { add } = useCart();
  const [slug, setSlug] = useState(products[0]?.slug ?? "");
  const [interval, setInterval] = useState<Interval>(4);
  const product = products.find((p) => p.slug === slug) ?? products[0];
  const variant = product?.variants[0];
  if (!product || !variant) return null;

  return (
    <div className="border border-sand bg-white p-7 sm:p-10">
      <label className="label" htmlFor="sub-coffee">Your coffee</label>
      <select id="sub-coffee" className="field" value={slug} onChange={(e) => setSlug(e.target.value)}>
        {products.map((p) => <option key={p.slug} value={p.slug}>{p.subtitle} — {p.variants[0]?.size}</option>)}
      </select>

      <fieldset className="mt-7">
        <legend className="label">Delivery frequency</legend>
        <div className="grid grid-cols-2 gap-3">
          {INTERVALS.map((w) => (
            <label key={w} className={`cursor-pointer border px-4 py-3.5 text-center text-sm transition-colors ${interval === w ? "border-burgundy bg-burgundy text-cream" : "border-sand hover:border-gold"}`}>
              <input type="radio" name="interval" value={w} checked={interval === w} onChange={() => setInterval(w)} className="sr-only" />
              Every {w} weeks
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 flex items-baseline justify-between border-t border-sand pt-6">
        <span className="text-sm text-muted">Per delivery · save {Math.round(SUBSCRIBE_DISCOUNT * 100)}%</span>
        <span>
          <span className="mr-2 text-muted line-through">{money(variant.priceCents)}</span>
          <span className="font-serif text-3xl">{money(unitPrice(variant.priceCents, true))}</span>
        </span>
      </div>
      <button className="btn btn-primary mt-6 w-full" onClick={() => add(toCartItem(product, variant, true, interval))}>
        Start Your Subscription
      </button>
    </div>
  );
}
