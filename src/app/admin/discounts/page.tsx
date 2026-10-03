import { Card, input, Pill, td, th } from "@/components/admin-ui";
import { requireAdmin } from "@/lib/admin";
import { createDiscount, toggleDiscount } from "../actions";

export default async function AdminDiscounts() {
  const { preview, db } = await requireAdmin();
  const { data: codes } = db ? await db.from("discount_codes").select("*").order("created_at", { ascending: false }) : { data: [] };
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
      <Card title="Create discount code">
        <form action={createDiscount} className="grid gap-4">
          <div><label className="label" htmlFor="code">Code</label><input id="code" name="code" required placeholder="WELCOME10" className={input} /></div>
          <div><label className="label" htmlFor="percent_off">Percent off</label><input id="percent_off" name="percent_off" type="number" min={1} max={100} required placeholder="10" className={input} /></div>
          <button className="btn btn-primary" disabled={preview}>Create Code</button>
          <p className="text-xs text-muted">Codes are created in Stripe and redeemed by customers on the payment page.</p>
        </form>
      </Card>
      <Card title="Discount codes">
        {!codes?.length ? <p className="text-muted">No discount codes yet.</p> : (
          <table className="w-full">
            <thead><tr className="border-b border-sand">{["Code", "Discount", "Status", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-sand">
              {codes.map((c) => (
                <tr key={c.id}>
                  <td className={`${td} font-medium`}>{c.code}</td>
                  <td className={td}>{c.percent_off}% off</td>
                  <td className={td}><Pill tone={c.active ? "good" : "neutral"}>{c.active ? "Active" : "Inactive"}</Pill></td>
                  <td className={td}>
                    <form action={toggleDiscount}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="active" value={String(!c.active)} />
                      <button className="link-underline">{c.active ? "Deactivate" : "Activate"}</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
