"use client";

import Link from "next/link";
import { useState } from "react";
import { finder, type Product } from "@/lib/catalog";
import { money } from "@/lib/site";
import { AddToCart } from "./add-to-cart";
import { Bag } from "./bag";

export function CoffeeFinder({ products }: { products: Product[] }) {
  const [choice, setChoice] = useState<string | null>(null);
  const pick = finder.find((f) => f.label === choice);
  const product = pick ? products.find((p) => p.slug === pick.slug) ?? products[0] : null;

  return (
    <div className="border border-sand bg-paper p-7 sm:p-12">
      <p className="eyebrow text-center">Find Your Coffee</p>
      <h2 className="h2 mt-4 text-center">What type of coffee do you enjoy?</h2>
      <div className="mt-9 flex flex-wrap justify-center gap-3" role="group" aria-label="Coffee preference">
        {finder.map((f) => (
          <button
            key={f.label}
            aria-pressed={choice === f.label}
            onClick={() => setChoice(f.label)}
            className={`border px-6 py-3.5 text-[0.76rem] font-medium tracking-[0.18em] uppercase transition-colors ${choice === f.label ? "border-burgundy bg-burgundy text-cream" : "border-sand bg-white hover:border-gold"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {pick && product && (
          <div key={pick.label} className="page-in mx-auto mt-12 grid max-w-3xl items-center gap-8 border-t border-sand pt-12 sm:grid-cols-[220px_1fr]">
            <Link href={`/shop/${product.slug}`}><Bag bag={product.bag} subtitle={product.subtitle} image={product.image} alt={product.subtitle} sizes="220px" /></Link>
            <div>
              <p className="eyebrow">We recommend</p>
              <h3 className="mt-2 font-serif text-4xl">{product.subtitle}</h3>
              <p className="mt-2 text-muted">{pick.why}</p>
              <p className="mt-3 text-[0.95rem] text-coffee">{product.tastingNotes.join(" • ")}</p>
              <p className="mt-3 text-lg font-medium">{money(product.variants[0].priceCents)} <span className="text-sm font-normal text-muted">/ {product.variants[0].size}</span></p>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <AddToCart product={product} className="btn btn-primary" />
                <Link href={`/shop/${product.slug}`} className="link-underline">View Details</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
