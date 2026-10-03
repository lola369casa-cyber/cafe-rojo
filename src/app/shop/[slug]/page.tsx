import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { Purchase } from "@/components/purchase";
import { getProduct, getProducts } from "@/lib/data";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  const image = product.image ?? "/images/label.jpg";
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { title: `${product.seoTitle} | Café Rojo`, description: product.seoDescription, url: `/shop/${product.slug}`, images: [image] },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const others = (await getProducts()).filter((p) => p.id !== product.id).slice(0, 3);

  // Only verified facts are shown: any field left empty is omitted.
  const facts = [
    ["Origin", product.region ? `${product.region}, ${product.origin}` : product.origin],
    ["Roast", product.roast],
    ["Process", product.process],
    ["Variety", product.variety],
    ["Altitude", product.altitude],
    ["Tasting Notes", product.tastingNotes.join(", ")],
    ["Recommended Brew Methods", product.brewMethods.join(", ")],
  ].filter((f): f is [string, string] => Boolean(f[1]));

  const prices = product.variants.map((v) => v.priceCents);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Café Rojo ${product.subtitle}`,
    description: product.description,
    image: `${site.url}${product.image ?? "/images/label.jpg"}`,
    brand: { "@type": "Brand", name: "Café Rojo" },
    category: "Coffee",
    countryOfOrigin: "Colombia",
    ...(product.rating && product.reviewCount
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount } }
      : {}),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: (Math.min(...prices) / 100).toFixed(2),
      highPrice: (Math.max(...prices) / 100).toFixed(2),
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.inventory > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/shop/${product.slug}`,
    },
  };

  return (
    <div className="container-x py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Shop", href: "/shop" }, { name: product.subtitle, href: `/shop/${product.slug}` }]} />
      <div className="mt-8"><Purchase product={product} /></div>

      <section className="mt-20 grid gap-12 border-t border-sand pt-16 lg:mt-28 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow">The Details</p>
          <h2 className="h2 mt-4">About This Coffee</h2>
          <dl className="mt-8 divide-y divide-sand border-y border-sand">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[42%_1fr] gap-4 py-4">
                <dt className="text-[0.72rem] font-medium tracking-[0.2em] text-muted uppercase">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <p className="eyebrow">Tasting Profile</p>
          <h2 className="h2 mt-4">What You’ll Taste</h2>
          <dl className="mt-8 grid grid-cols-2 gap-px bg-sand">
            {(["aroma", "body", "flavor", "finish"] as const).map((k) => (
              <div key={k} className="bg-cream p-6">
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-2 font-serif text-2xl leading-snug">{product.profile[k]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {others.length > 0 && (
        <section className="mt-20 border-t border-sand pt-16 lg:mt-28">
          <h2 className="h2 text-center">You May Also Enjoy</h2>
          <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
