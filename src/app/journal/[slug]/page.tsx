import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/page-hero";
import { articles } from "@/lib/journal";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((x) => x.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt, images: [article.image], publishedTime: article.date },
  };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();
  const more = articles.filter((a) => a.slug !== slug).slice(0, 3);
  const date = new Date(article.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `${site.url}${article.image}`,
    datePublished: article.date,
    author: { "@type": "Organization", name: "Café Rojo" },
    publisher: { "@type": "Organization", name: "Café Rojo" },
  };
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="container-x max-w-4xl pt-10 text-center lg:pt-16">
        <div className="flex justify-center"><Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Journal", href: "/journal" }, { name: article.title, href: `/journal/${article.slug}` }]} /></div>
        <p className="eyebrow mt-10">{article.category}</p>
        <h1 className="display mt-4 text-[2.7rem] sm:text-6xl">{article.title}</h1>
        <p className="mt-5 text-xs tracking-[0.16em] text-muted uppercase">{date} · {article.minutes} min read</p>
      </header>
      <div className="container-x mt-10 max-w-6xl">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image src={article.image} alt="" fill priority sizes="(min-width:1280px) 1100px, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="prose-cr container-x max-w-3xl py-14 text-[1.12rem] leading-[1.85]">
        <p className="font-serif text-2xl leading-snug text-ink italic">{article.excerpt}</p>
        {article.body.map((b, i) => (
          <div key={i}>
            {b.heading && <h2>{b.heading}</h2>}
            <p>{b.text}</p>
          </div>
        ))}
        <div className="mt-12 border-t border-sand pt-8 text-center">
          <Link href="/shop" className="btn btn-primary">Shop Coffee</Link>
        </div>
      </div>
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-x">
          <h2 className="h2 text-center">Keep Reading</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {more.map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={a.image} alt="" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                </div>
                <p className="eyebrow mt-4">{a.category}</p>
                <p className="mt-1 font-serif text-2xl leading-tight group-hover:text-burgundy">{a.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
