import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { findVariant } from "@/lib/data";
import { hasStripe, INTERVALS, shippingFor, site, unitPrice } from "@/lib/site";
import { stripe } from "@/lib/stripe";
import { getUser } from "@/lib/supabase";

const schema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string(),
        qty: z.number().int().min(1).max(20),
        subscribe: z.boolean(),
        interval: z.union(INTERVALS.map((i) => z.literal(i))),
      }),
    )
    .min(1)
    .max(30),
  customer: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.email(),
    phone: z.string().trim().max(40).optional().default(""),
    address: z.string().trim().min(1).max(200),
    address2: z.string().trim().max(120).optional().default(""),
    city: z.string().trim().min(1).max(80),
    state: z.string().trim().min(1).max(40),
    zip: z.string().trim().min(3).max(12),
    country: z.literal("US"),
  }),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  if (!hasStripe) {
    return NextResponse.json({ error: "Online payments aren’t switched on yet. Add the Stripe keys to enable checkout." }, { status: 503 });
  }
  const { items, customer } = parsed.data;

  // Prices always come from the catalog on the server — never from the browser.
  const lines: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;
  for (const item of items) {
    const found = await findVariant(item.variantId);
    if (!found) return NextResponse.json({ error: "An item in your cart is no longer available." }, { status: 409 });
    const { product, variant } = found;
    if (variant.inventory < item.qty) {
      return NextResponse.json({ error: `Only ${variant.inventory} of ${product.subtitle} (${variant.size}) left in stock.` }, { status: 409 });
    }
    const unit = unitPrice(variant.priceCents, item.subscribe);
    subtotal += unit * item.qty;
    lines.push({
      quantity: item.qty,
      price_data: {
        currency: "usd",
        unit_amount: unit,
        product_data: { name: `Café Rojo ${product.subtitle} — ${variant.size}`, metadata: { variant_id: variant.id } },
        ...(item.subscribe ? { recurring: { interval: "week" as const, interval_count: item.interval } } : {}),
      },
    });
  }

  const subs = items.filter((i) => i.subscribe);
  if (new Set(subs.map((i) => i.interval)).size > 1) {
    return NextResponse.json({ error: "Subscriptions in one order must share the same delivery frequency. Please check out different frequencies separately." }, { status: 400 });
  }
  const isSubscription = subs.length > 0;
  const shipping = shippingFor(subtotal, isSubscription);
  const user = await getUser();
  const metadata = {
    customer: JSON.stringify(customer),
    items: JSON.stringify(items.map((i) => ({ v: i.variantId, q: i.qty, s: i.subscribe ? i.interval : 0 }))),
    user_id: user?.id ?? "",
  };

  try {
    const session = await stripe().checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: lines,
      customer_email: customer.email,
      allow_promotion_codes: true,
      metadata,
      ...(isSubscription
        ? { subscription_data: { metadata } }
        : {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  display_name: shipping === 0 ? "Free shipping" : "Standard shipping",
                  fixed_amount: { amount: shipping, currency: "usd" },
                },
              },
            ],
          }),
      ...(process.env.STRIPE_AUTOMATIC_TAX === "true"
        ? { automatic_tax: { enabled: true }, billing_address_collection: "required" as const }
        : {}),
      success_url: `${site.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/checkout`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.json({ error: "We couldn’t start the payment. Please try again." }, { status: 502 });
  }
}
