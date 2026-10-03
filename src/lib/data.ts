import "server-only";
import { seedProducts, type Product, type Variant } from "./catalog";
import { hasSupabase } from "./site";
import { adminClient } from "./supabase";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToProduct(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    subtitle: r.subtitle,
    type: r.type,
    roast: r.roast,
    origin: r.origin,
    region: r.region,
    availability: r.availability,
    tastingNotes: r.tasting_notes ?? [],
    profile: r.profile ?? { aroma: "", body: "", flavor: "", finish: "" },
    short: r.short ?? "",
    description: r.description ?? "",
    process: r.process,
    variety: r.variety,
    altitude: r.altitude,
    brewMethods: r.brew_methods ?? [],
    bag: r.bag ?? "burgundy",
    image: r.image,
    variants: (r.variants ?? [])
      .map((v: any): Variant => ({ id: v.id, size: v.size, priceCents: v.price_cents, inventory: v.inventory }))
      .sort((a: Variant, b: Variant) => a.priceCents - b.priceCents),
    rating: r.rating,
    reviewCount: r.review_count ?? 0,
    seoTitle: r.seo_title ?? r.subtitle,
    seoDescription: r.seo_description ?? r.short ?? "",
  };
}

export async function getProducts(includeInactive = false): Promise<Product[]> {
  if (!hasSupabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) return seedProducts;
  try {
    let q = adminClient().from("products").select("*, variants(*)").order("sort", { ascending: true });
    if (!includeInactive) q = q.eq("active", true);
    const { data, error } = await q;
    if (error) throw error;
    // An empty table means the seed has not been run yet — fall back rather than show an empty shop.
    return data && data.length ? data.map(rowToProduct) : seedProducts;
  } catch (e) {
    console.error("[catalog] database read failed, using seed catalog:", e);
    return seedProducts;
  }
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function findVariant(variantId: string) {
  for (const p of await getProducts()) {
    const v = p.variants.find((x) => x.id === variantId);
    if (v) return { product: p, variant: v };
  }
  return null;
}
