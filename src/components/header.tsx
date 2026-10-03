"use client";

import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { nav } from "@/lib/site";
import { useCart } from "./cart";

export type SearchEntry = { title: string; href: string; kind: "Coffee" | "Journal" | "Page"; text: string };

export function Header({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const pathname = usePathname();
  const { count, setOpen, bump } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenu(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setSearch(false), setMenu(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return searchIndex.filter((e) => `${e.title} ${e.text}`.toLowerCase().includes(term)).slice(0, 8);
  }, [q, searchIndex]);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const icon = "flex h-11 w-11 items-center justify-center transition-colors hover:text-burgundy";

  return (
    <header className="sticky top-0 z-40 border-b border-sand/80 bg-paper/95 backdrop-blur">
      <div className="bg-forest-deep py-2 text-center text-[0.66rem] tracking-[0.24em] text-cream/90 uppercase">
        Free shipping on orders over $50<span className="max-sm:hidden"> · Roasted in small batches</span>
      </div>
      <div className="container-x flex h-[68px] items-center justify-between gap-4 lg:h-[76px]">
        <button className={`${icon} -ml-2 lg:hidden`} onClick={() => setMenu(true)} aria-label="Open menu">
          <Menu size={22} strokeWidth={1.5} />
        </button>
        <Link href="/" className="font-serif text-[1.9rem] leading-none font-semibold tracking-tight text-burgundy lg:text-[2.1rem]">
          Café Rojo
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={`border-b py-1 text-[0.72rem] font-medium tracking-[0.2em] uppercase transition-colors hover:text-burgundy ${
                active(n.href) ? "border-gold text-burgundy" : "border-transparent"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="-mr-2 flex items-center">
          <button className={icon} onClick={() => setSearch((s) => !s)} aria-label="Search" aria-expanded={search}>
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link href="/account" className={`${icon} hidden sm:flex`} aria-label="Account">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button className={`${icon} relative`} onClick={() => setOpen(true)} aria-label={`Shopping bag, ${count} items`}>
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span
              key={bump}
              className={`absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-burgundy px-1 text-[0.62rem] font-medium text-cream ${bump ? "bump" : ""}`}
            >
              {count}
            </span>
          </button>
        </div>
      </div>

      {search && (
        <div className="absolute inset-x-0 top-full border-b border-sand bg-paper shadow-[0_18px_30px_-20px_rgba(42,31,26,.35)]">
          <div className="container-x py-6">
            <label className="flex items-center gap-3 border-b border-ink/40 pb-3">
              <Search size={18} strokeWidth={1.5} className="text-muted" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search coffee, stories and guides"
                aria-label="Search"
                className="w-full bg-transparent font-serif text-2xl placeholder:text-muted/60 focus:outline-none"
              />
              <button onClick={() => setSearch(false)} aria-label="Close search"><X size={20} strokeWidth={1.5} /></button>
            </label>
            {q.trim() && (
              <ul className="mt-4 divide-y divide-sand/70">
                {results.length === 0 && <li className="py-4 text-muted">No results for “{q}”.</li>}
                {results.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="flex items-baseline justify-between gap-4 py-3 hover:text-burgundy">
                      <span className="font-serif text-xl">{r.title}</span>
                      <span className="eyebrow shrink-0">{r.kind}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menu ? "" : "pointer-events-none"}`} aria-hidden={!menu}>
        <div className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${menu ? "opacity-100" : "opacity-0"}`} onClick={() => setMenu(false)} />
        <div className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-paper transition-transform duration-300 ${menu ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-[68px] items-center justify-between border-b border-sand px-5">
            <span className="font-serif text-3xl font-semibold text-burgundy">Café Rojo</span>
            <button className={icon} onClick={() => setMenu(false)} aria-label="Close menu"><X size={22} strokeWidth={1.5} /></button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
            {[...nav, { href: "/account", label: "Account" }].map((n) => (
              <Link key={n.href} href={n.href} tabIndex={menu ? 0 : -1} className={`border-b border-sand/70 py-4 font-serif text-[1.7rem] ${active(n.href) ? "text-burgundy" : ""}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <p className="mt-auto px-5 pb-8 font-serif text-lg text-muted italic">From the Colombian Mountains to Your Cup</p>
        </div>
      </div>
    </header>
  );
}
