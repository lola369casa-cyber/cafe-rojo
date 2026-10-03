"use client";

import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FREE_SHIPPING_CENTS, money, unitPrice } from "@/lib/site";
import { Bag } from "./bag";
import { lineKey, useCart } from "./cart";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotalCents, hasSubscription, count } = useCart();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname, setOpen]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const remaining = Math.max(FREE_SHIPPING_CENTS - subtotalCents, 0);
  const free = hasSubscription || remaining === 0;
  const progress = free ? 100 : Math.round((subtotalCents / FREE_SHIPPING_CENTS) * 100);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-ink/55 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-paper shadow-2xl transition-transform duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-sand px-6 py-5">
          <h2 className="font-serif text-3xl">Your Cart <span className="text-lg text-muted">({count})</span></h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="flex h-10 w-10 items-center justify-center hover:text-burgundy">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-sand bg-cream px-6 py-4">
            <p className="text-sm">
              {free ? (
                <>Your order ships <strong className="font-medium text-forest">free</strong>.</>
              ) : (
                <>You’re <strong className="font-medium text-burgundy">{money(remaining)}</strong> away from free shipping.</>
              )}
            </p>
            <div className="mt-2 h-1 w-full bg-sand" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free shipping">
              <div className="h-full bg-forest transition-[width] duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-3xl">Your cart is empty</p>
              <p className="mt-2 text-muted">Discover coffee from the mountains of Colombia.</p>
              <Link href="/shop" className="btn btn-primary mt-7" onClick={() => setOpen(false)}>Shop Coffee</Link>
            </div>
          ) : (
            <ul className="divide-y divide-sand">
              {items.map((i) => {
                const k = lineKey(i);
                const unit = unitPrice(i.priceCents, i.subscribe);
                return (
                  <li key={k} className="flex gap-4 py-5">
                    <Link href={`/shop/${i.slug}`} className="w-20 shrink-0">
                      <Bag bag={i.bag} subtitle={i.name} size={i.size} image={i.image} alt={i.name} sizes="80px" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <Link href={`/shop/${i.slug}`} className="font-serif text-xl leading-tight hover:text-burgundy">{i.name}</Link>
                        <p className="shrink-0 font-medium">{money(unit * i.qty)}</p>
                      </div>
                      <p className="text-sm text-muted">{i.size} · {money(unit)} each</p>
                      {i.subscribe && <p className="mt-0.5 text-xs tracking-wide text-forest uppercase">Subscription · every {i.interval} weeks</p>}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-sand">
                          <button className="flex h-9 w-9 items-center justify-center hover:bg-cream" onClick={() => setQty(k, i.qty - 1)} aria-label={`Decrease quantity of ${i.name}`}><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm" aria-live="polite">{i.qty}</span>
                          <button className="flex h-9 w-9 items-center justify-center hover:bg-cream" onClick={() => setQty(k, i.qty + 1)} aria-label={`Increase quantity of ${i.name}`}><Plus size={14} /></button>
                        </div>
                        <button className="text-xs tracking-[0.16em] text-muted uppercase underline-offset-4 hover:text-burgundy hover:underline" onClick={() => remove(k)}>Remove</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-sand px-6 pt-5 pb-6">
            <div className="flex items-baseline justify-between">
              <span className="text-[0.74rem] tracking-[0.2em] uppercase">Subtotal</span>
              <span className="font-serif text-3xl">{money(subtotalCents)}</span>
            </div>
            <p className="mt-1 text-sm text-muted">Shipping and taxes calculated at checkout.</p>
            <div className="mt-5 grid gap-3">
              <Link href="/checkout" className="btn btn-primary" onClick={() => setOpen(false)}>Checkout</Link>
              <button className="btn btn-outline" onClick={() => setOpen(false)}>Continue Shopping</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
