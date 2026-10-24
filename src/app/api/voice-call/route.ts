import { NextResponse } from "next/server";
import { z } from "zod";
import { findVariant } from "@/lib/data";
import { hasLeadSheet, sendLead } from "@/lib/leads";
import { FLAT_SHIPPING_CENTS, FREE_SHIPPING_CENTS, money } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(7).max(30),
  consent: z.literal(true),
  viewing: z.string().max(80).optional(),
  source: z.enum(["checkout", "product"]).default("checkout"),
  items: z.array(z.object({ variantId: z.string(), qty: z.number().int().min(1).max(20) })).max(30).default([]),
});

// Outbound calls cost money and reach real phones, so requests are throttled per number and per visitor.
// (In-memory: resets on redeploy and is per server instance. Move to the database if abuse appears.)
const recent = new Map<string, number[]>();
function allowed(key: string, max: number, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  recent.set(key, [...hits, now]);
  return true;
}

function toE164(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null; // US numbers only, matching where we ship
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter your name and phone number, and agree to receive the call." }, { status: 400 });
  }
  const to = toE164(parsed.data.phone);
  if (!to) return NextResponse.json({ error: "Please enter a valid 10-digit US phone number." }, { status: 400 });

  const { RETELL_API_KEY, RETELL_FROM_NUMBER, RETELL_AGENT_ID } = process.env;
  const direct = Boolean(RETELL_API_KEY && RETELL_FROM_NUMBER);
  if (!hasLeadSheet && !direct) {
    return NextResponse.json({ error: "Our coffee guide isn’t taking calls yet. Please check back soon." }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allowed(`phone:${to}`, 2) || !allowed(`ip:${ip}`, 4)) {
    return NextResponse.json({ error: "We’ve already placed a call recently. Please try again a little later." }, { status: 429 });
  }

  // Cart details come from the catalog on the server, so the agent quotes real names and prices.
  const lines: string[] = [];
  for (const item of parsed.data.items) {
    const found = await findVariant(item.variantId);
    if (found) lines.push(`${item.qty} × ${found.product.subtitle}, ${found.variant.size}, ${money(found.variant.priceCents)} each`);
  }

  const viewing = parsed.data.viewing ? await findVariant(parsed.data.viewing) : null;

  const dynamicVariables = {
    customer_name: parsed.data.name,
    viewing_product: viewing ? `${viewing.product.subtitle}, ${viewing.variant.size}, ${money(viewing.variant.priceCents)}` : "None — they called from the checkout page.",
    cart_summary: lines.length ? lines.join("; ") : "The cart is empty.",
    free_shipping_threshold: money(FREE_SHIPPING_CENTS),
    flat_shipping_rate: money(FLAT_SHIPPING_CENTS),
  };

  // Preferred route: the n8n leads workflow logs the request to the sheet first, then places the call.
  if (hasLeadSheet) {
    try {
      const result = await sendLead({
        type: "call_request",
        source: `${parsed.data.source} page`,
        name: parsed.data.name,
        phone: to,
        consent: true,
        product_viewed: viewing ? dynamicVariables.viewing_product : "",
        cart: lines.join("; "),
        dynamic_variables: dynamicVariables,
      });
      if (result.status === "calling") return NextResponse.json({ message: "Your phone should ring within a minute." });
      // Saved for a person to return — either no caller number is set yet, or the call could not be placed.
      return NextResponse.json({ message: "Thank you — we’ve got your number and will call you back shortly." });
    } catch (e) {
      console.error("[voice-call] lead sheet", e);
      if (!direct) return NextResponse.json({ error: "We couldn’t take your request just now. Please try again in a moment." }, { status: 502 });
    }
  }

  const res = await fetch("https://api.retellai.com/v2/create-phone-call", {
    method: "POST",
    headers: { Authorization: `Bearer ${RETELL_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from_number: RETELL_FROM_NUMBER,
      to_number: to,
      ...(RETELL_AGENT_ID ? { override_agent_id: RETELL_AGENT_ID } : {}),
      metadata: { source: parsed.data.source },
      retell_llm_dynamic_variables: dynamicVariables,
    }),
  });
  if (!res.ok) {
    console.error("[voice-call] Retell rejected the call:", res.status, await res.text());
    return NextResponse.json({ error: "We couldn’t place the call just now. Please try again in a moment." }, { status: 502 });
  }
  return NextResponse.json({ message: "Your phone should ring within a minute." });
}
