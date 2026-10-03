import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { money } from "@/lib/site";
import { AddToCart } from "./add-to-cart";
import { Bag } from "./bag";
import { Rating } from "./stars";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const v = product.variants[0];
  const href = `/shop/${product.slug}`;
  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative block overflow-hidden" aria-label={`${product.subtitle} — view details`}>
        <Bag
          bag={product.bag}
          subtitle={product.subtitle}
          image={product.image}
          alt={`Café Rojo ${product.subtitle}, ${v?.size ?? "12 oz"} bag`}
          priority={priority}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />
        {product.availability === "Limited Release" && (
          <span className="absolute top-4 left-4 bg-burgundy px-3 py-1 text-[0.62rem] tracking-[0.2em] text-cream uppercase">
            Limited Release
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-6 text-center">
        <p className="eyebrow">{product.roast} Roast · {product.region ?? product.origin}</p>
        <h3 className="mt-2 font-serif text-[1.7rem] leading-tight">
          <Link href={href} className="transition-colors hover:text-burgundy">{product.subtitle}</Link>
        </h3>
        <p className="mt-2 text-[0.95rem] text-muted">{product.tastingNotes.join(" • ")}</p>
        <div className="mt-2"><Rating rating={product.rating} count={product.reviewCount} /></div>
        <p className="mt-3 text-lg font-medium">
          {v ? money(v.priceCents) : "—"} <span className="text-sm font-normal text-muted">/ {v?.size}</span>
        </p>
        <div className="mt-5 flex flex-col items-center gap-3">
          <AddToCart product={product} />
          <Link href={href} className="link-underline">View Details</Link>
        </div>
      </div>
    </article>
  );
}
