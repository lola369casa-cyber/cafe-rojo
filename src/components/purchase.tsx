"use client";

import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { INTERVALS, money, SUBSCRIBE_DISCOUNT, unitPrice, type Interval } from "@/lib/site";
import { toCartItem } from "./add-to-cart";
import { Bag } from "./bag";
import { CallRequest } from "./call-request";
import { useCart } from "./cart";
import { Rating } from "./stars";

export function Purchase({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [subscribe, setSubscribe] = useState(false);
  const [interval, setInterval] = useState<Interval>(4);
  const [qty, setQty] = useState(1);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const soldOut = !variant || variant.inventory <= 0;
  const price = variant ? unitPrice(variant.priceCents, subscribe) : 0;
  const option = (on: boolean) => `cursor-pointer border px-4 py-3 text-sm transition-colors ${on ? "border-burgundy bg-burgundy text-cream" : "border-sand bg-white hover:border-gold"}`;

  const addNow = (silent = false) => variant && add(toCartItem(product, variant, subscribe, interval), qty, { silent });

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="lg:sticky lg:top-36 lg:self-start">
        <Bag bag={product.bag} subtitle={product.subtitle} size={variant?.size} image={product.image} alt={`Café Rojo ${product.subtitle}, ${variant?.size} bag`} sizes="(min-width:1024px) 50vw, 100vw" priority />
      </div>

      <div>
        <p className="font-serif text-2xl font-semibold tracking-wide text-burgundy uppercase">Café Rojo</p>
        <h1 className="display mt-2 text-[2.9rem] sm:text-6xl">{product.subtitle}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
          <p className="font-serif text-4xl">{money(price)}</p>
          {subscribe && variant && <p className="text-muted line-through">{money(variant.priceCents)}</p>}
          <p className="text-muted">{variant?.size}</p>
        </div>
        <div className="mt-2"><Rating rating={product.rating} count={product.reviewCount} /></div>
        <div className="gold-rule my-7" />
        <p className="lede">{product.description}</p>
        <p className="mt-4 text-[0.98rem] tracking-wide text-coffee">{product.tastingNotes.join("  •  ")}</p>

        <fieldset className="mt-9">
          <legend className="label">Size</legend>
          <div className="grid grid-cols-3 gap-3">
            {product.variants.map((v) => (
              <label key={v.id} className={`${option(v.id === variant?.id)} text-center ${v.inventory <= 0 ? "opacity-50" : ""}`}>
                <input type="radio" name="size" className="sr-only" checked={v.id === variant?.id} onChange={() => setVariantId(v.id)} />
                <span className="block font-medium">{v.size}</span>
                <span className="block text-xs opacity-80">{v.inventory <= 0 ? "Sold out" : money(v.priceCents)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="label">Purchase Options</legend>
          <div className="grid gap-3">
            <label className={`${option(!subscribe)} flex items-center justify-between`}>
              <input type="radio" name="purchase" className="sr-only" checked={!subscribe} onChange={() => setSubscribe(false)} />
              <span>One-time purchase</span>
              <span>{variant ? money(variant.priceCents) : ""}</span>
            </label>
            <label className={`${option(subscribe)} flex items-center justify-between`}>
              <input type="radio" name="purchase" className="sr-only" checked={subscribe} onChange={() => setSubscribe(true)} />
              <span>Subscribe &amp; Save {Math.round(SUBSCRIBE_DISCOUNT * 100)}%</span>
              <span>{variant ? money(unitPrice(variant.priceCents, true)) : ""}</span>
            </label>
          </div>
          {subscribe && (
            <div className="mt-3">
              <label className="label" htmlFor="freq">Deliver</label>
              <select id="freq" className="field" value={interval} onChange={(e) => setInterval(Number(e.target.value) as Interval)}>
                {INTERVALS.map((w) => <option key={w} value={w}>Every {w} weeks</option>)}
              </select>
              <p className="mt-2 text-sm text-muted">Free shipping on every delivery. Cancel anytime.</p>
            </div>
          )}
        </fieldset>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <div className="inline-flex h-12 shrink-0 items-center justify-between border border-sand bg-white sm:w-36">
            <button className="flex h-full w-12 items-center justify-center hover:bg-cream" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={15} /></button>
            <span aria-live="polite" aria-label="Quantity">{qty}</span>
            <button className="flex h-full w-12 items-center justify-center hover:bg-cream" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity"><Plus size={15} /></button>
          </div>
          <button className="btn btn-primary flex-1" disabled={soldOut} onClick={() => addNow()}>
            {soldOut ? "Sold Out" : `Add to Cart — ${money(price * qty)}`}
          </button>
        </div>
        <button className="btn btn-outline mt-3 w-full" disabled={soldOut} onClick={() => { addNow(true); router.push("/checkout"); }}>
          Buy Now
        </button>
        {variant && variant.inventory > 0 && variant.inventory <= 10 && <p className="mt-3 text-sm text-burgundy">Only {variant.inventory} left in this size.</p>}
        <CallRequest viewing={variant?.id} source="product" />
      </div>
    </div>
  );
}
