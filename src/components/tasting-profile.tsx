"use client";

import { Coffee, Droplet, Hourglass, Wind } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/catalog";

const parts = [
  { key: "aroma", label: "Aroma", Icon: Wind },
  { key: "body", label: "Body", Icon: Droplet },
  { key: "flavor", label: "Flavor", Icon: Coffee },
  { key: "finish", label: "Finish", Icon: Hourglass },
] as const;

export function TastingProfile({ products }: { products: Product[] }) {
  const [slug, setSlug] = useState(products[0]?.slug);
  const product = products.find((p) => p.slug === slug) ?? products[0];
  if (!product) return null;
  return (
    <div>
      {products.length > 1 && (
        <div role="tablist" aria-label="Choose a coffee" className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {products.map((p) => (
            <button
              key={p.slug}
              role="tab"
              aria-selected={p.slug === product.slug}
              onClick={() => setSlug(p.slug)}
              className={`border-b pb-1.5 text-[0.72rem] font-medium tracking-[0.2em] uppercase transition-colors ${
                p.slug === product.slug ? "border-gold text-cream" : "border-transparent text-cream/55 hover:text-cream"
              }`}
            >
              {p.subtitle}
            </button>
          ))}
        </div>
      )}
      <dl className="mt-12 grid grid-cols-2 gap-px bg-cream/15 lg:grid-cols-4">
        {parts.map(({ key, label, Icon }) => (
          <div key={key} className="bg-forest px-5 py-10 text-center sm:px-8 sm:py-12">
            <Icon size={30} strokeWidth={1} className="mx-auto text-gold" aria-hidden />
            <dt className="eyebrow mt-5">{label}</dt>
            <dd className="mt-3 font-serif text-[1.55rem] leading-snug text-cream sm:text-[1.75rem]">{product.profile[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
