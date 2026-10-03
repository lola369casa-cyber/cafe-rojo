import "server-only";
import { redirect } from "next/navigation";
import { sampleOrders } from "./sample";
import { hasSupabase } from "./site";
import { adminClient, getUser, isAdminEmail } from "./supabase";

/** Gate for every admin page and action. Without a database, the dashboard runs as a read-only preview on sample data. */
export async function requireAdmin() {
  if (!hasSupabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) return { preview: true as const, db: null };
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/account");
  return { preview: false as const, db: adminClient() };
}

export type AdminOrder = ReturnType<typeof sampleOrders>[number];

export async function getOrders(): Promise<{ orders: AdminOrder[]; preview: boolean }> {
  const { preview, db } = await requireAdmin();
  if (preview) return { orders: sampleOrders(), preview };
  const { data, error } = await db.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(1000);
  if (error) throw new Error(`Could not load orders: ${error.message}`);
  return { orders: (data ?? []) as AdminOrder[], preview };
}
