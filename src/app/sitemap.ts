import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";
import { articles } from "@/lib/journal";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const pages = ["", "/shop", "/our-coffee", "/our-story", "/journal", "/contact", "/shipping", "/returns", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${site.url}/shop/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...articles.map((a) => ({ url: `${site.url}/journal/${a.slug}`, lastModified: a.date, priority: 0.6 })),
  ];
}
