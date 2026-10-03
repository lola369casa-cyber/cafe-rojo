import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { money } from "@/lib/site";
import { getUser, isAdminEmail, serverClient } from "@/lib/supabase";
import { signOut, updateProfile } from "./actions";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

const notices: Record<string, string> = {
  saved: "Your details have been saved.",
  "no-billing": "No payment details on file yet — they’re created with your first order.",
  "billing-unavailable": "Billing management isn’t switched on yet.",
  "auth-error": "That sign-in link has expired or is invalid. Please try again.",
};
const day = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const notice = (await searchParams).notice;
  const user = await getUser();
  const banner = typeof notice === "string" && notices[notice] ? (
    <p role="status" className="mb-8 border border-gold/60 bg-cream px-4 py-3 text-sm">{notices[notice]}</p>
  ) : null;

  if (!user) return <div className="container-x py-16 lg:py-24">{banner}<AuthForm /></div>;

  const supabase = await serverClient();
  const [{ data: profile }, { data: orders }, { data: subs }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
    supabase.from("subscriptions").select("*").order("created_at", { ascending: false }),
  ]);
  const a = (profile?.address ?? {}) as Record<string, string>;
  const h2 = "font-serif text-3xl";
  const field = (name: string, label: string, value?: string | null, auto?: string, span = "") => (
    <div className={span}>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={value ?? ""} autoComplete={auto} className="field" />
    </div>
  );

  return (
    <div className="container-x py-12 lg:py-20">
      {banner}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand pb-8">
        <div>
          <p className="eyebrow">My Account</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Hello{profile?.first_name ? `, ${profile.first_name}` : ""}</h1>
          <p className="mt-2 text-muted">{user.email}</p>
        </div>
        <div className="flex gap-3">
          {isAdminEmail(user.email) && <Link href="/admin" className="btn btn-forest">Admin</Link>}
          <form action={signOut}><button className="btn btn-outline">Log Out</button></form>
        </div>
      </div>

      <div className="mt-12 grid gap-16 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-16">
          <section aria-labelledby="orders">
            <h2 id="orders" className={h2}>Order History</h2>
            {!orders?.length ? (
              <p className="mt-4 text-muted">No orders yet. <Link href="/shop" className="text-burgundy underline underline-offset-4">Shop coffee</Link></p>
            ) : (
              <ul className="mt-6 space-y-5">
                {orders.map((o: any) => (
                  <li key={o.id} className="border border-sand bg-white p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-serif text-2xl">{o.number}</p>
                      <p className="text-sm text-muted">{day(o.created_at)}</p>
                    </div>
                    <ul className="mt-3 text-[0.98rem]">
                      {o.order_items.map((i: any) => <li key={i.id}>{i.name} — {i.size} × {i.quantity}</li>)}
                    </ul>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand pt-4">
                      <p className="text-xs tracking-[0.16em] uppercase">
                        <span className="text-forest">{o.fulfillment_status}</span>
                        {o.tracking_number && <span className="text-muted"> · {o.carrier ?? "Tracking"} {o.tracking_number}</span>}
                      </p>
                      <p className="font-medium">{money(o.total_cents)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="subs">
            <h2 id="subs" className={h2}>Subscriptions</h2>
            {!subs?.length ? (
              <p className="mt-4 text-muted">No active subscriptions. <Link href="/#subscribe" className="text-burgundy underline underline-offset-4">Start one</Link></p>
            ) : (
              <ul className="mt-6 space-y-5">
                {subs.map((s: any) => (
                  <li key={s.id} className="border border-sand bg-white p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-serif text-2xl">Every {s.interval_weeks} weeks</p>
                      <p className="text-xs tracking-[0.16em] text-forest uppercase">{s.status}</p>
                    </div>
                    <ul className="mt-2 text-[0.98rem]">{(s.items ?? []).map((i: any, n: number) => <li key={n}>{i.name} — {i.size} × {i.quantity}</li>)}</ul>
                    {s.current_period_end && <p className="mt-2 text-sm text-muted">Next renewal {day(s.current_period_end)}</p>}
                  </li>
                ))}
              </ul>
            )}
            <form action="/api/billing-portal" method="post" className="mt-6 flex flex-wrap gap-3">
              <button className="btn btn-outline">Manage Subscriptions</button>
              <button className="btn btn-outline">Update Payment Method</button>
            </form>
            <p className="mt-3 text-sm text-muted">Subscriptions and saved cards are managed securely through Stripe.</p>
          </section>
        </div>

        <section aria-labelledby="details">
          <h2 id="details" className={h2}>Details &amp; Shipping Address</h2>
          <form action={updateProfile} className="mt-6 grid grid-cols-2 gap-4">
            {field("first_name", "First Name", profile?.first_name, "given-name")}
            {field("last_name", "Last Name", profile?.last_name, "family-name")}
            {field("phone", "Phone", profile?.phone, "tel", "col-span-2")}
            {field("line1", "Address", a.line1, "address-line1", "col-span-2")}
            {field("line2", "Apartment, suite", a.line2, "address-line2", "col-span-2")}
            {field("city", "City", a.city, "address-level2", "col-span-2")}
            {field("state", "State", a.state, "address-level1")}
            {field("zip", "ZIP", a.zip, "postal-code")}
            <button className="btn btn-primary col-span-2">Save Changes</button>
          </form>
        </section>
      </div>
    </div>
  );
}
