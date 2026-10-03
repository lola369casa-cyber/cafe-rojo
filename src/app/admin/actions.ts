"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { seedProducts } from "@/lib/catalog";
import { emails } from "@/lib/email";
import { hasStripe } from "@/lib/site";
import { stripe } from "@/lib/stripe";

async function db() {
  const a = await requireAdmin();
  if (a.preview) throw new Error("Preview mode: connect the database to make changes.");
  return a.db;
}
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const list = (f: FormData, k: string) => str(f, k).split(",").map((s) => s.trim()).filter(Boolean);
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function updateOrder(formData: FormData) {
  const d = await db();
  const id = str(formData, "id");
  const status = str(formData, "fulfillment_status");
  const { data: before } = await d.from("orders").select("fulfillment_status, email, number").eq("id", id).single();
  const patch = { fulfillment_status: status, carrier: str(formData, "carrier") || null, tracking_number: str(formData, "tracking_number") || null };
  const { error } = await d.from("orders").update(patch).eq("id", id);
  if (error) throw new Error(`Could not update order: ${error.message}`);
  if (before && status === "shipped" && before.fulfillment_status !== "shipped") {
    await emails.shippingConfirmation(before.email, { number: before.number, tracking: patch.tracking_number, carrier: patch.carrier });
  }
  revalidatePath("/admin/orders");
}

export async function saveProduct(formData: FormData) {
  const d = await db();
  const subtitle = str(formData, "subtitle");
  if (!subtitle) throw new Error("A product needs a name.");
  const id = str(formData, "id") || slugify(subtitle);
  const row: Record<string, unknown> = {
    id,
    slug: str(formData, "slug") || slugify(subtitle),
    name: str(formData, "name") || `Café Rojo ${subtitle}`,
    subtitle,
    type: str(formData, "type"),
    roast: str(formData, "roast"),
    origin: str(formData, "origin") || "Colombia",
    region: str(formData, "region") || null,
    availability: str(formData, "availability"),
    tasting_notes: list(formData, "tasting_notes"),
    profile: { aroma: str(formData, "aroma"), body: str(formData, "body"), flavor: str(formData, "flavor"), finish: str(formData, "finish") },
    short: str(formData, "short"),
    description: str(formData, "description"),
    process: str(formData, "process") || null,
    variety: str(formData, "variety") || null,
    altitude: str(formData, "altitude") || null,
    brew_methods: list(formData, "brew_methods"),
    bag: str(formData, "bag") || "burgundy",
    seo_title: str(formData, "seo_title") || null,
    seo_description: str(formData, "seo_description") || null,
    active: formData.get("active") === "on",
  };

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) throw new Error("Product image must be an image file.");
    const path = `${id}-${Date.now()}.${file.name.split(".").pop()?.toLowerCase() ?? "jpg"}`;
    const { error } = await d.storage.from("product-images").upload(path, file, { contentType: file.type });
    if (error) throw new Error(`Image upload failed: ${error.message}`);
    row.image = d.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  } else if (formData.get("remove_image") === "on") {
    row.image = null;
  }

  const { error } = await d.from("products").upsert(row);
  if (error) throw new Error(`Could not save product: ${error.message}`);

  // Variants: one row per size with a price.
  const keep: string[] = [];
  for (let i = 0; i < 6; i++) {
    const size = str(formData, `v_size_${i}`);
    const price = Number(str(formData, `v_price_${i}`));
    if (!size || !Number.isFinite(price) || price <= 0) continue;
    const vid = `${id}-${slugify(size)}`;
    keep.push(vid);
    const { error: vErr } = await d.from("variants").upsert({ id: vid, product_id: id, size, price_cents: Math.round(price * 100), inventory: Math.max(0, Math.floor(Number(str(formData, `v_inv_${i}`)) || 0)) });
    if (vErr) throw new Error(`Could not save variant ${size}: ${vErr.message}`);
  }
  const { data: existing } = await d.from("variants").select("id").eq("product_id", id);
  const drop = (existing ?? []).map((v) => v.id).filter((v) => !keep.includes(v));
  if (drop.length) await d.from("variants").delete().in("id", drop);

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function loadStarterCatalog() {
  const d = await db();
  for (const [i, p] of seedProducts.entries()) {
    const { error } = await d.from("products").upsert({
      id: p.id, slug: p.slug, name: p.name, subtitle: p.subtitle, type: p.type, roast: p.roast, origin: p.origin, region: p.region,
      availability: p.availability, tasting_notes: p.tastingNotes, profile: p.profile, short: p.short, description: p.description,
      process: p.process, variety: p.variety, altitude: p.altitude, brew_methods: p.brewMethods, bag: p.bag,
      seo_title: p.seoTitle, seo_description: p.seoDescription, sort: i,
    });
    if (error) throw new Error(`Could not load ${p.subtitle}: ${error.message}`);
    const { error: vErr } = await d.from("variants").upsert(p.variants.map((v) => ({ id: v.id, product_id: p.id, size: v.size, price_cents: v.priceCents, inventory: v.inventory })));
    if (vErr) throw new Error(`Could not load variants: ${vErr.message}`);
  }
  revalidatePath("/", "layout");
}

export async function createDiscount(formData: FormData) {
  const d = await db();
  const code = str(formData, "code").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const percent = Math.floor(Number(str(formData, "percent_off")));
  if (!code || !(percent >= 1 && percent <= 100)) throw new Error("Enter a code and a percentage between 1 and 100.");
  if (!hasStripe) throw new Error("Stripe must be connected before creating discount codes.");
  const coupon = await stripe().coupons.create({ percent_off: percent, duration: "once", name: `${code} — ${percent}% off` });
  const promo = await stripe().promotionCodes.create({ promotion: { type: "coupon", coupon: coupon.id }, code });
  const { error } = await d.from("discount_codes").insert({ code, percent_off: percent, stripe_coupon_id: coupon.id, stripe_promotion_code_id: promo.id });
  if (error) throw new Error(`Could not save discount: ${error.message}`);
  revalidatePath("/admin/discounts");
}

export async function toggleDiscount(formData: FormData) {
  const d = await db();
  const id = str(formData, "id");
  const active = str(formData, "active") === "true";
  const { data: row } = await d.from("discount_codes").select("stripe_promotion_code_id").eq("id", id).single();
  if (row?.stripe_promotion_code_id && hasStripe) await stripe().promotionCodes.update(row.stripe_promotion_code_id, { active });
  const { error } = await d.from("discount_codes").update({ active }).eq("id", id);
  if (error) throw new Error(`Could not update discount: ${error.message}`);
  revalidatePath("/admin/discounts");
}

export async function cancelSubscription(formData: FormData) {
  const d = await db();
  const sid = str(formData, "stripe_subscription_id");
  if (!hasStripe) throw new Error("Stripe is not connected.");
  await stripe().subscriptions.cancel(sid);
  const { error } = await d.from("subscriptions").update({ status: "canceled" }).eq("stripe_subscription_id", sid);
  if (error) throw new Error(`Could not update subscription: ${error.message}`);
  revalidatePath("/admin/subscriptions");
}
