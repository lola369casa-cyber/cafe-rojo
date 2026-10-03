import Image from "next/image";
import { site } from "@/lib/site";

export function PageHero({ eyebrow, title, text, image, alt, tall = false }: { eyebrow: string; title: string; text?: string; image: string; alt: string; tall?: boolean }) {
  return (
    <section className={`relative flex items-end overflow-hidden bg-forest-deep ${tall ? "min-h-[72vh]" : "min-h-[46vh] lg:min-h-[52vh]"}`}>
      <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/35 to-forest-deep/10" />
      <div className="container-x relative py-14 text-cream lg:py-20">
        <p className="eyebrow !text-gold-light">{eyebrow}</p>
        <h1 className="display mt-4 max-w-4xl text-5xl sm:text-6xl lg:text-7xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg text-cream/85">{text}</p>}
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const base = site.url;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${base}${it.href}` })),
  };
  return (
    <nav aria-label="Breadcrumb" className="text-[0.7rem] tracking-[0.18em] text-muted uppercase">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ol className="flex flex-wrap gap-x-2">
        {items.map((it, i) => (
          <li key={it.href} className="flex gap-x-2">
            {i > 0 && <span aria-hidden>/</span>}
            {i === items.length - 1 ? <span aria-current="page" className="text-ink">{it.name}</span> : <a href={it.href} className="hover:text-burgundy">{it.name}</a>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
