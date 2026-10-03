import Link from "next/link";
import { Bars, Card, HBars, Pill, Stat, td, th } from "@/components/admin-ui";
import { getOrders } from "@/lib/admin";
import { getProducts } from "@/lib/data";
import { money } from "@/lib/site";

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export default async function AdminDashboard() {
  const [{ orders }, products] = await Promise.all([getOrders(), getProducts(true)]);
  const paid = orders.filter((o) => o.payment_status === "paid");
  const total = paid.reduce((s, o) => s + o.total_cents, 0);
  const customers = new Set(paid.map((o) => o.email)).size;
  const subscription = paid.filter((o) => o.stripe_subscription_id).reduce((s, o) => s + o.total_cents, 0);

  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    return d;
  });
  const byDay = days.map((d) => {
    const list = paid.filter((o) => dayKey(new Date(o.created_at)) === dayKey(d));
    return { label: `${d.getMonth() + 1}/${d.getDate()}`, sales: list.reduce((s, o) => s + o.total_cents, 0), count: list.length };
  });
  const months = Array.from({ length: 6 }, (_, i) => new Date(today.getFullYear(), today.getMonth() - (5 - i), 1));
  const byMonth = months.map((m) => ({
    label: m.toLocaleDateString("en-US", { month: "short" }),
    value: paid.filter((o) => { const d = new Date(o.created_at); return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth(); }).reduce((s, o) => s + o.total_cents, 0),
  }));

  const perProduct = new Map<string, { revenue: number; units: number }>();
  for (const o of paid) for (const i of o.order_items) {
    const cur = perProduct.get(i.name) ?? { revenue: 0, units: 0 };
    perProduct.set(i.name, { revenue: cur.revenue + i.total_cents, units: cur.units + i.quantity });
  }
  const ranked = [...perProduct.entries()].sort((a, b) => b[1].revenue - a[1].revenue);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Total Sales" value={money(total)} />
        <Stat label="Orders" value={String(paid.length)} />
        <Stat label="Customers" value={String(customers)} />
        <Stat label="Average Order Value" value={paid.length ? money(Math.round(total / paid.length)) : "—"} />
        <Stat label="Subscription Revenue" value={money(subscription)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Sales by day — last 14 days"><Bars label="Sales by day" data={byDay.map((d) => ({ label: d.label, value: d.sales }))} /></Card>
        <Card title="Sales by month — last 6 months"><Bars label="Sales by month" data={byMonth} /></Card>
        <Card title="Orders by day — last 14 days"><Bars label="Orders by day" format="count" data={byDay.map((d) => ({ label: d.label, value: d.count }))} /></Card>
        <Card title="Revenue by product"><HBars label="Revenue by product" data={ranked.map(([label, v]) => ({ label, value: v.revenue }))} /></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Best-selling products">
          {ranked.length === 0 ? <p className="text-muted">No sales yet.</p> : (
            <ol className="divide-y divide-sand">
              {ranked.slice(0, 5).map(([name, v], i) => (
                <li key={name} className="flex items-baseline justify-between gap-4 py-3">
                  <span><span className="mr-3 font-serif text-2xl text-gold">{i + 1}</span>{name}</span>
                  <span className="text-sm text-muted">{v.units} sold · {money(v.revenue)}</span>
                </li>
              ))}
            </ol>
          )}
        </Card>
        <Card title="Inventory">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-sand"><th className={th}>Product</th><th className={th}>Size</th><th className={th}>In stock</th></tr></thead>
              <tbody className="divide-y divide-sand">
                {products.flatMap((p) => p.variants.map((v) => (
                  <tr key={v.id}>
                    <td className={td}>{p.subtitle}</td>
                    <td className={td}>{v.size}</td>
                    <td className={td}>{v.inventory} {v.inventory === 0 ? <Pill tone="warn">Out</Pill> : v.inventory <= 10 ? <Pill tone="warn">Low</Pill> : null}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          <Link href="/admin/products" className="link-underline mt-5 inline-block">Manage products</Link>
        </Card>
      </div>
    </div>
  );
}
