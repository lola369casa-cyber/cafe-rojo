import { Card, td, th } from "@/components/admin-ui";
import { getOrders } from "@/lib/admin";
import { money } from "@/lib/site";

export default async function AdminCustomers() {
  const { orders } = await getOrders();
  const map = new Map<string, { name: string; orders: number; spent: number; last: string; subscriber: boolean }>();
  for (const o of orders) {
    const c = map.get(o.email) ?? { name: o.name ?? "", orders: 0, spent: 0, last: o.created_at, subscriber: false };
    map.set(o.email, { name: c.name || o.name || "", orders: c.orders + 1, spent: c.spent + o.total_cents, last: c.last > o.created_at ? c.last : o.created_at, subscriber: c.subscriber || !!o.stripe_subscription_id });
  }
  const rows = [...map.entries()].sort((a, b) => b[1].spent - a[1].spent);
  return (
    <Card title={`Customers (${rows.length})`}>
      {rows.length === 0 ? <p className="text-muted">No customers yet.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead><tr className="border-b border-sand">{["Customer", "Orders", "Total spent", "Last order", "Subscriber"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-sand">
              {rows.map(([email, c]) => (
                <tr key={email}>
                  <td className={td}><p className="font-medium">{c.name || "—"}</p><p className="text-xs text-muted">{email}</p></td>
                  <td className={td}>{c.orders}</td>
                  <td className={td}>{money(c.spent)}</td>
                  <td className={td}>{new Date(c.last).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className={td}>{c.subscriber ? "Yes" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
