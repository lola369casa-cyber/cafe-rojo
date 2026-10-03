// On Vercel the production domain is known automatically; NEXT_PUBLIC_SITE_URL overrides it (e.g. a custom domain).
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const site = {
  name: "Café Rojo",
  tagline: "From the Colombian Mountains to Your Cup",
  description:
    "Premium Colombian coffee sourced from the mountains of Colombia and roasted in small batches in the United States.",
  url: siteUrl,
  // Replace with the brand's real profiles before launch.
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
    youtube: "https://www.youtube.com/",
  },
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/our-coffee", label: "Our Coffee" },
  { href: "/our-story", label: "Our Story" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
export const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY);
export const hasResend = Boolean(process.env.RESEND_API_KEY);

// Commerce rules — shared by the cart UI and the server-side checkout.
export const FREE_SHIPPING_CENTS = 5000;
export const FLAT_SHIPPING_CENTS = 695;
export const SUBSCRIBE_DISCOUNT = 0.1;
export const INTERVALS = [2, 4, 6, 8] as const;
export type Interval = (typeof INTERVALS)[number];

export function unitPrice(priceCents: number, subscribe: boolean) {
  return subscribe ? Math.round(priceCents * (1 - SUBSCRIBE_DISCOUNT)) : priceCents;
}

export function shippingFor(subtotalCents: number, hasSubscription: boolean) {
  if (subtotalCents === 0) return 0;
  // Subscription orders always ship free.
  if (hasSubscription || subtotalCents >= FREE_SHIPPING_CENTS) return 0;
  return FLAT_SHIPPING_CENTS;
}

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
