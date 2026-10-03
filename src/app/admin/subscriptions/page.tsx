import { Card, Pill, td, th } from "@/components/admin-ui";
import { requireAdmin } from "@/lib/admin";
import { money } from "@/lib/site";
import { cancelSubscription } from "../actions";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AdminSubscriptions() {
  const { db } = await requireAdmin();
  const { data: subs } = db ? await db.from("subscriptions").select("*").order("created_at", { ascending: false }) : { data: [] as any[] };
  return (
    <Card title={`Subscriptions (${subs?.length ?? 0})`}>
      {!subs?.length ? <p className="text-muted">No subscriptions yet. They appear here as customers subscribe at checkout.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead><tr className="border-b border-sand">{["Customer", "Coffee", "Frequency", "Per delivery", "Status", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-sand">
              {subs.map((s: any) => (
                <tr key={s.id}>
                  <td className={td}>{s.email}</td>
                  <td className={td}>{(s.items ?? []).map((i: any, n: number) => <p key={n}>{i.name} — {i.size} × {i.quantity}</p>)}</td>
                  <td className={td}>Every {s.interval_weeks} weeks</td>
                  <td className={td}>{money(s.amount_cents)}</td>
                  <td className={td}><Pill tone={s.status === "active" ? "good" : "neutral"}>{s.status}</Pill></td>
                  <td className={td}>
                    {s.status === "active" && (
                      <form action={cancelSubscription}>
                        <input type="hidden" name="stripe_subscription_id" value={s.stripe_subscription_id} />
                        <button className="link-underline">Cancel</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
