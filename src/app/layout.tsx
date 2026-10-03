import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { CartProvider } from "@/components/cart";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Header, type SearchEntry } from "@/components/header";
import { getProducts } from "@/lib/data";
import { articles } from "@/lib/journal";
import { site } from "@/lib/site";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const sans = Jost({ variable: "--font-jost", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Café Rojo — Premium Colombian Coffee, Roasted in Small Batches",
    template: "%s | Café Rojo",
  },
  description:
    "Café Rojo is premium Colombian specialty coffee: mountain-grown, carefully selected and fresh roasted in small batches. Shop Colombian dark roast, single origin and decaf coffee.",
  keywords: [
    "Colombian coffee", "Colombian specialty coffee", "premium Colombian coffee", "Colombian dark roast",
    "Colombian decaf coffee", "specialty coffee", "fresh roasted coffee", "mountain coffee", "single origin Colombian coffee",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Café Rojo — Premium Colombian Coffee",
    description: site.description,
    url: site.url,
    images: [{ url: "/images/hero-wide.jpg", width: 2400, height: 1350, alt: "Ripe red coffee cherries above the misty mountains of Colombia" }],
  },
  twitter: { card: "summary_large_image", title: "Café Rojo — Premium Colombian Coffee", description: site.description, images: ["/images/hero-wide.jpg"] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#14281c" };

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/label.jpg`,
  slogan: site.tagline,
  description: site.description,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const products = await getProducts();
  const searchIndex: SearchEntry[] = [
    ...products.map((p) => ({ title: p.subtitle, href: `/shop/${p.slug}`, kind: "Coffee" as const, text: `${p.name} ${p.type} ${p.roast} ${p.origin} ${p.tastingNotes.join(" ")}` })),
    ...articles.map((a) => ({ title: a.title, href: `/journal/${a.slug}`, kind: "Journal" as const, text: `${a.category} ${a.excerpt}` })),
    { title: "Our Coffee", href: "/our-coffee", kind: "Page", text: "altitude climate soil varieties processing roasting brewing find your coffee" },
    { title: "Our Story", href: "/our-story", kind: "Page", text: "farmers mountains cherries roasting journey" },
    { title: "Subscriptions", href: "/#subscribe", kind: "Page", text: "subscribe delivery save" },
  ];
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <noscript><style>{`.reveal{opacity:1;transform:none}`}</style></noscript>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-cream">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <CartProvider>
          <Header searchIndex={searchIndex} />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
