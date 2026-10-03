"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categories, type Article } from "@/lib/journal";

export const fmtDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export function JournalList({ articles }: { articles: Article[] }) {
  const [cat, setCat] = useState<string>("All");
  const list = cat === "All" ? articles : articles.filter((a) => a.category === cat);
  return (
    <>
      <div className="flex gap-x-7 gap-y-3 overflow-x-auto border-b border-sand pb-5 whitespace-nowrap sm:flex-wrap" role="group" aria-label="Categories">
        {["All", ...categories].map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`border-b pb-1 text-[0.72rem] font-medium tracking-[0.2em] uppercase transition-colors ${cat === c ? "border-gold text-burgundy" : "border-transparent text-muted hover:text-ink"}`}>
            {c}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="py-20 text-center font-serif text-2xl text-muted">New stories in this category are on the way.</p>
      ) : (
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <article key={a.slug} className="group">
              <Link href={`/journal/${a.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                <Image src={a.image} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              </Link>
              <p className="eyebrow mt-5">{a.category}</p>
              <h2 className="mt-2 font-serif text-[1.75rem] leading-tight"><Link href={`/journal/${a.slug}`} className="hover:text-burgundy">{a.title}</Link></h2>
              <p className="mt-3 text-[0.98rem] text-muted">{a.excerpt}</p>
              <p className="mt-3 text-xs tracking-[0.14em] text-muted uppercase">{fmtDate(a.date)} · {a.minutes} min read</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
