"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { Product, Variant } from "@/lib/catalog";
import type { Interval } from "@/lib/site";
import { useCart } from "./cart";

export function toCartItem(p: Product, v: Variant, subscribe = false, interval: Interval = 4) {
  return {
    variantId: v.id,
    slug: p.slug,
    name: p.subtitle,
    size: v.size,
    priceCents: v.priceCents,
    bag: p.bag,
    image: p.image,
    subscribe,
    interval,
  };
}

export function AddToCart({
  product,
  variant,
  className = "btn btn-primary w-full",
  label = "Add to Cart",
}: {
  product: Product;
  variant?: Variant;
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const v = variant ?? product.variants[0];
  const soldOut = !v || v.inventory <= 0;
  return (
    <button
      type="button"
      className={className}
      disabled={soldOut}
      onClick={() => {
        add(toCartItem(product, v));
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
    >
      {soldOut ? "Sold Out" : done ? (<><Check size={15} /> Added</>) : label}
    </button>
  );
}
