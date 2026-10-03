import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

// Admin data must never be prerendered or cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const links = [
  ["Dashboard", "/admin"],
  ["Orders", "/admin/orders"],
  ["Products", "/admin/products"],
  ["Subscriptions", "/admin/subscriptions"],
  ["Discounts", "/admin/discounts"],
  ["Customers", "/admin/customers"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { preview } = await requireAdmin();
  return (
    <div className="bg-cream">
      <div className="container-x py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Café Rojo</p>
            <h1 className="display mt-2 text-5xl">Admin</h1>
          </div>
          <nav aria-label="Admin" className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="border-b border-transparent pb-1 text-[0.72rem] font-medium tracking-[0.2em] uppercase hover:border-gold hover:text-burgundy">{label}</Link>
            ))}
          </nav>
        </div>
        {preview && (
          <p className="mt-6 border border-dashed border-burgundy/50 bg-paper px-4 py-3 text-sm text-burgundy">
            <strong className="font-medium">Preview mode — sample data.</strong> No database is connected, so figures below are placeholders and changes can’t be saved. Add the Supabase keys to go live (see README).
          </p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
