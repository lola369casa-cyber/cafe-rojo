import { NextResponse } from "next/server";
import { hasStripe, site } from "@/lib/site";
import { stripe } from "@/lib/stripe";
import { adminClient, getUser } from "@/lib/supabase";

// Sends a signed-in customer to Stripe's portal to manage subscriptions and payment methods.
export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.redirect(`${site.url}/account`, 303);
  if (!hasStripe) return NextResponse.redirect(`${site.url}/account?notice=billing-unavailable`, 303);

  const db = adminClient();
  const { data: profile } = await db.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
  let customerId: string | null = profile?.stripe_customer_id ?? null;
  if (!customerId && user.email) {
    const found = await stripe().customers.list({ email: user.email, limit: 1 });
    customerId = found.data[0]?.id ?? null;
  }
  if (!customerId) return NextResponse.redirect(`${site.url}/account?notice=no-billing`, 303);

  const portal = await stripe().billingPortal.sessions.create({ customer: customerId, return_url: `${site.url}/account` });
  return NextResponse.redirect(portal.url, 303);
}
