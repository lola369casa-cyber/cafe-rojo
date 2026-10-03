import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { findVariant } from "@/lib/data";
import { emails } from "@/lib/email";
import { unitPrice } from "@/lib/site";
import { stripe } from "@/lib/stripe";
import { adminClient } from "@/lib/supabase";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Stripe → database. Any failure returns 500 so Stripe retries instead of the order being silently lost.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await recordOrder(event.data.object);
        break;
      case "invoice.paid": {
        const invoice = event.data.object as any;
        if (invoice.billing_reason === "subscription_cycle" && invoice.customer_email) {
          await emails.subscriptionRenewal(invoice.customer_email, { totalCents: invoice.amount_paid });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const end = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
        const { error } = await adminClient()
          .from("subscriptions")
          .update({ status: sub.status, current_period_end: end ? new Date(end * 1000).toISOString() : null })
          .eq("stripe_subscription_id", sub.id);
        if (error) throw error;
        break;
      }
    }
  } catch (e) {
    console.error(`[stripe webhook] ${event.type} failed:`, e);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}

async function recordOrder(session: Stripe.Checkout.Session) {
  const db = adminClient();
  const { data: existing } = await db.from("orders").select("id").eq("stripe_session_id", session.id).maybeSingle();
  if (existing) return; // already recorded — Stripe may deliver an event more than once

  const customer = JSON.parse(session.metadata?.customer ?? "{}");
  const cart: { v: string; q: number; s: number }[] = JSON.parse(session.metadata?.items ?? "[]");
  const email = session.customer_details?.email ?? customer.email;
  const userId = session.metadata?.user_id || null;
  const discount = session.total_details?.amount_discount ?? 0;
  const subtotal = session.amount_subtotal ?? 0;
  const factor = subtotal > 0 ? (subtotal - discount) / subtotal : 1;

  const items = [];
  for (const c of cart) {
    const found = await findVariant(c.v);
    if (!found) continue;
    const list = unitPrice(found.variant.priceCents, Boolean(c.s));
    const unit = Math.round(list * factor);
    items.push({ variant_id: c.v, name: found.product.subtitle, size: found.variant.size, quantity: c.q, unit_cents: unit, total_cents: unit * c.q });
  }

  const { data: number, error: numErr } = await db.rpc("next_order_number");
  if (numErr) throw numErr;
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : (session.subscription?.id ?? null);
  const customerId = typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null);

  const { data: order, error } = await db
    .from("orders")
    .insert({
      number,
      user_id: userId,
      email,
      name: [customer.firstName, customer.lastName].filter(Boolean).join(" "),
      phone: customer.phone,
      shipping_address: { line1: customer.address, line2: customer.address2, city: customer.city, state: customer.state, zip: customer.zip, country: customer.country },
      subtotal_cents: subtotal,
      shipping_cents: session.total_details?.amount_shipping ?? 0,
      tax_cents: session.total_details?.amount_tax ?? 0,
      discount_cents: discount,
      total_cents: session.amount_total ?? 0,
      payment_status: session.payment_status === "paid" ? "paid" : session.payment_status,
      stripe_session_id: session.id,
      stripe_subscription_id: subscriptionId,
    })
    .select("id")
    .single();
  if (error) throw error;

  const { error: itemErr } = await db.from("order_items").insert(items.map((i) => ({ ...i, order_id: order.id })));
  if (itemErr) throw itemErr;
  for (const i of items) {
    const { error: invErr } = await db.rpc("decrement_inventory", { v_id: i.variant_id, qty: i.quantity });
    if (invErr) throw invErr;
  }
  revalidatePath("/", "layout"); // stock levels changed
  if (userId && customerId) await db.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId);

  const subItems = cart.filter((c) => c.s);
  if (subscriptionId && subItems.length) {
    const subLines = items.filter((i) => subItems.some((s) => s.v === i.variant_id));
    const { error: subErr } = await db.from("subscriptions").insert({
      user_id: userId,
      email,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: customerId,
      interval_weeks: subItems[0].s,
      items: subLines,
      amount_cents: subLines.reduce((s, i) => s + i.total_cents, 0),
    });
    if (subErr) throw subErr;
    await emails.subscriptionConfirmation(email, {
      weeks: subItems[0].s,
      items: subLines.map((i) => ({ name: `${i.name} — ${i.size}`, qty: i.quantity, totalCents: i.total_cents })),
    });
  }

  await emails.orderConfirmation(email, {
    number,
    totalCents: session.amount_total ?? 0,
    items: items.map((i) => ({ name: `${i.name} — ${i.size}`, qty: i.quantity, totalCents: i.total_cents })),
  });
}
