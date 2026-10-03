import Link from "next/link";
import { Card, input, Pill, td, th } from "@/components/admin-ui";
import { requireAdmin } from "@/lib/admin";
import { coffeeTypes, type Product } from "@/lib/catalog";
import { getProducts } from "@/lib/data";
import { money } from "@/lib/site";
import { loadStarterCatalog, saveProduct } from "../actions";

export default async function AdminProducts({ searchParams }: PageProps<"/admin/products">) {
  const { preview, db } = await requireAdmin();
  const edit = (await searchParams).edit;
  const products = await getProducts(true);
  let empty = false;
  if (db) {
    const { count } = await db.from("products").select("id", { count: "exact", head: true });
    empty = !count;
  }
  const editing = typeof edit === "string" ? (edit === "new" ? null : products.find((p) => p.id === edit)) : undefined;

  if (editing !== undefined) return <ProductForm product={editing ?? null} preview={preview} />;

  return (
    <Card title={`Products (${products.length})`}>
      {empty && (
        <form action={loadStarterCatalog} className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-gold/60 bg-cream p-4">
          <p className="text-sm">The database has no products yet — the shop is showing the built-in starter catalog. Load it into the database to start editing.</p>
          <button className="btn btn-forest">Load Starter Catalog</button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead><tr className="border-b border-sand">{["Product", "Type", "Variants · price · stock", "Status", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-sand">
            {products.map((p) => (
              <tr key={p.id}>
                <td className={td}><p className="font-medium">{p.subtitle}</p><p className="text-xs text-muted">/shop/{p.slug}</p></td>
                <td className={td}>{p.type}</td>
                <td className={td}>{p.variants.map((v) => <p key={v.id}>{v.size} · {money(v.priceCents)} · {v.inventory} in stock</p>)}</td>
                <td className={td}><Pill tone="good">{p.availability}</Pill></td>
                <td className={td}><Link href={`/admin/products?edit=${p.id}`} className="link-underline">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/admin/products?edit=new" className="btn btn-primary mt-6">Add Product</Link>
    </Card>
  );
}

function ProductForm({ product: p, preview }: { product: Product | null; preview: boolean }) {
  const F = ({ name, label, value, span = "", area = false, hint }: { name: string; label: string; value?: string | null; span?: string; area?: boolean; hint?: string }) => (
    <div className={span}>
      <label className="label" htmlFor={name}>{label}</label>
      {area ? <textarea id={name} name={name} defaultValue={value ?? ""} rows={3} className={input} /> : <input id={name} name={name} defaultValue={value ?? ""} className={input} />}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
  const rows = [...(p?.variants ?? []), null, null].slice(0, Math.max((p?.variants.length ?? 0) + 1, 3));
  return (
    <Card title={p ? `Edit — ${p.subtitle}` : "Add product"}>
      <form action={saveProduct} className="grid gap-5 sm:grid-cols-2">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <input type="hidden" name="slug" value={p?.slug ?? ""} />
        {F({ name: "subtitle", label: "Product name", value: p?.subtitle })}
        {F({ name: "name", label: "Full name", value: p?.name })}
        <div>
          <label className="label" htmlFor="type">Coffee type</label>
          <select id="type" name="type" defaultValue={p?.type ?? "Dark Roast"} className={input}>{coffeeTypes.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        {F({ name: "roast", label: "Roast level", value: p?.roast })}
        {F({ name: "origin", label: "Origin", value: p?.origin ?? "Colombia" })}
        {F({ name: "region", label: "Region", value: p?.region, hint: "e.g. Huila, Nariño — only if verified" })}
        <div>
          <label className="label" htmlFor="availability">Availability</label>
          <select id="availability" name="availability" defaultValue={p?.availability ?? "In Stock"} className={input}><option>In Stock</option><option>Limited Release</option></select>
        </div>
        <div>
          <label className="label" htmlFor="bag">Bag colour</label>
          <select id="bag" name="bag" defaultValue={p?.bag ?? "burgundy"} className={input}><option>burgundy</option><option>forest</option><option>coffee</option></select>
        </div>
        {F({ name: "tasting_notes", label: "Tasting notes", value: p?.tastingNotes.join(", "), span: "sm:col-span-2", hint: "Comma separated" })}
        {F({ name: "aroma", label: "Aroma", value: p?.profile.aroma })}
        {F({ name: "body", label: "Body", value: p?.profile.body })}
        {F({ name: "flavor", label: "Flavor", value: p?.profile.flavor })}
        {F({ name: "finish", label: "Finish", value: p?.profile.finish })}
        {F({ name: "short", label: "Short description", value: p?.short, span: "sm:col-span-2" })}
        {F({ name: "description", label: "Description", value: p?.description, span: "sm:col-span-2", area: true })}
        {F({ name: "process", label: "Process", value: p?.process, hint: "Leave blank until verified — blank fields are hidden" })}
        {F({ name: "variety", label: "Variety", value: p?.variety })}
        {F({ name: "altitude", label: "Altitude", value: p?.altitude })}
        {F({ name: "brew_methods", label: "Recommended brew methods", value: p?.brewMethods.join(", "), hint: "Comma separated" })}

        <fieldset className="sm:col-span-2">
          <legend className="label">Variants</legend>
          <div className="grid gap-2">
            {rows.map((v, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input name={`v_size_${i}`} defaultValue={v?.size ?? ""} placeholder="Size (e.g. 12 oz)" aria-label="Size" className={input} />
                <input name={`v_price_${i}`} defaultValue={v ? (v.priceCents / 100).toFixed(2) : ""} placeholder="Price (USD)" inputMode="decimal" aria-label="Price" className={input} />
                <input name={`v_inv_${i}`} defaultValue={v?.inventory ?? ""} placeholder="Inventory" inputMode="numeric" aria-label="Inventory" className={input} />
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted">Clear a row’s size to remove that variant.</p>
        </fieldset>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="image">Product photograph</label>
          <input id="image" name="image" type="file" accept="image/*" className={input} />
          <p className="mt-1 text-xs text-muted">{p?.image ? "A photo is set. Upload to replace it." : "No photo yet — the site shows the label on a bag illustration."}</p>
          {p?.image && <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" name="remove_image" /> Remove current photo</label>}
        </div>
        {F({ name: "seo_title", label: "SEO title", value: p?.seoTitle, span: "sm:col-span-2" })}
        {F({ name: "seo_description", label: "SEO description", value: p?.seoDescription, span: "sm:col-span-2", area: true })}
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="active" defaultChecked /> Visible in shop</label>
        <div className="flex gap-3 sm:col-span-2">
          <button className="btn btn-primary" disabled={preview}>{preview ? "Connect database to save" : "Save Product"}</button>
          <Link href="/admin/products" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </Card>
  );
}
