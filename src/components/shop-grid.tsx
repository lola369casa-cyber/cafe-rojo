"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { coffeeTypes, origins, sizes, type Product } from "@/lib/catalog";
import { ProductCard } from "./product-card";

type Filters = { type: string[]; origin: string[]; size: string[]; availability: string[] };
const empty: Filters = { type: [], origin: [], size: [], availability: [] };

export function ShopGrid({ products }: { products: Product[] }) {
  const [f, setF] = useState<Filters>(empty);
  const [sort, setSort] = useState("featured");
  const [open, setOpen] = useState(false);

  const groups: { key: keyof Filters; title: string; options: string[] }[] = [
    { key: "type", title: "Coffee Type", options: coffeeTypes },
    { key: "origin", title: "Origin", options: [...new Set([...origins, ...products.map((p) => p.region).filter((r): r is string => !!r)])] },
    { key: "size", title: "Format", options: sizes },
    { key: "availability", title: "Availability", options: ["In Stock", "Limited Release"] },
  ];

  const toggle = (key: keyof Filters, value: string) =>
    setF((prev) => ({ ...prev, [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value] }));

  const list = useMemo(() => {
    const out = products.filter((p) => {
      if (f.type.length && !f.type.includes(p.type) && !(f.type.includes("Limited Release") && p.availability === "Limited Release")) return false;
      if (f.origin.length && !f.origin.some((o) => o === p.origin || o === p.region)) return false;
      if (f.size.length && !p.variants.some((v) => f.size.includes(v.size) && v.inventory > 0)) return false;
      if (f.availability.length) {
        const inStock = p.variants.some((v) => v.inventory > 0);
        const ok = (f.availability.includes("In Stock") && inStock) || (f.availability.includes("Limited Release") && p.availability === "Limited Release");
        if (!ok) return false;
      }
      return true;
    });
    const price = (p: Product) => p.variants[0]?.priceCents ?? 0;
    if (sort === "low") out.sort((a, b) => price(a) - price(b));
    if (sort === "high") out.sort((a, b) => price(b) - price(a));
    if (sort === "name") out.sort((a, b) => a.subtitle.localeCompare(b.subtitle));
    return out;
  }, [products, f, sort]);

  const activeCount = Object.values(f).flat().length;

  const panel = (
    <div className="space-y-9">
      {groups.map((g) => (
        <fieldset key={g.key}>
          <legend className="mb-4 w-full border-b border-sand pb-3 text-[0.72rem] font-medium tracking-[0.22em] uppercase">{g.title}</legend>
          <div className="space-y-2.5">
            {g.options.map((o) => (
              <label key={o} className="flex cursor-pointer items-center gap-3 text-[0.98rem] hover:text-burgundy">
                <input type="checkbox" checked={f[g.key].includes(o)} onChange={() => toggle(g.key, o)} className="h-4 w-4 accent-[#6e1423]" />
                {o}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {activeCount > 0 && <button className="link-underline" onClick={() => setF(empty)}>Clear all filters</button>}
    </div>
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block" aria-label="Filters">{panel}</aside>

      <div>
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-sand pb-5">
          <button className="flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.2em] uppercase lg:hidden" onClick={() => setOpen(true)}>
            <SlidersHorizontal size={16} strokeWidth={1.5} /> Filters{activeCount ? ` (${activeCount})` : ""}
          </button>
          <p className="hidden text-sm text-muted lg:block" aria-live="polite">{list.length} {list.length === 1 ? "coffee" : "coffees"}</p>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-muted">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-sand bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none">
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        {list.length === 0 ? (
          <div className="border border-sand bg-cream px-6 py-20 text-center">
            <p className="font-serif text-3xl">No coffees match those filters</p>
            <p className="mt-2 text-muted">New origins and limited releases are added as they arrive.</p>
            <button className="btn btn-outline mt-7" onClick={() => setF(empty)}>Clear Filters</button>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 3} />)}
          </div>
        )}
      </div>

      {/* Mobile filter sheet */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-ink/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <div className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-paper p-6 transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"}`}>
          <div className="mb-6 flex items-center justify-between">
            <p className="font-serif text-3xl">Filters</p>
            <button onClick={() => setOpen(false)} aria-label="Close filters" className="flex h-10 w-10 items-center justify-center"><X size={22} strokeWidth={1.5} /></button>
          </div>
          {panel}
          <button className="btn btn-primary mt-8 w-full" onClick={() => setOpen(false)}>Show {list.length} {list.length === 1 ? "coffee" : "coffees"}</button>
        </div>
      </div>
    </div>
  );
}
