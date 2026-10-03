import { Card, input, Pill, td, th } from "@/components/admin-ui";
import { getOrders } from "@/lib/admin";
import { money } from "@/lib/site";
import { updateOrder } from "../actions";

const statuses = ["unfulfilled", "processing", "shipped", "delivered", "cancelled"];

export default async function AdminOrders() {
  const { orders, preview } = await getOrders();
  return (
    <Card title={`Orders (${orders.length})`}>
      {orders.length === 0 ? <p className="text-muted">No orders yet.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b border-sand">
                {["Order", "Customer", "Products", "Total", "Payment", "Shipping", "Fulfillment"].map((h) => <th key={h} className={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className={td}>
                    <p className="font-medium">{o.number}</p>
                    <p className="text-xs text-muted">{new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    {o.stripe_subscription_id && <Pill>Subscription</Pill>}
                  </td>
                  <td className={td}><p>{o.name}</p><p className="text-xs text-muted">{o.email}</p></td>
                  <td className={td}>{o.order_items.map((i) => <p key={i.id}>{i.name} — {i.size} × {i.quantity}</p>)}</td>
                  <td className={`${td} font-medium`}>{money(o.total_cents)}</td>
                  <td className={td}><Pill tone={o.payment_status === "paid" ? "good" : "warn"}>{o.payment_status}</Pill></td>
                  <td className={td}>{[o.shipping_address?.city, o.shipping_address?.state].filter(Boolean).join(", ")}</td>
                  <td className={td}>
                    <form action={updateOrder} className="grid w-56 gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="fulfillment_status" defaultValue={o.fulfillment_status} className={input} aria-label={`Fulfillment status for ${o.number}`}>
                        {statuses.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <input name="carrier" defaultValue={o.carrier ?? ""} placeholder="Carrier" className={input} aria-label="Carrier" />
                      <input name="tracking_number" defaultValue={o.tracking_number ?? ""} placeholder="Tracking number" className={input} aria-label="Tracking number" />
                      <button disabled={preview} className="btn btn-forest !min-h-9 !px-3 !py-1.5">Update</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-5 text-sm text-muted">Marking an order “shipped” emails the customer their shipping confirmation.</p>
    </Card>
  );
}
