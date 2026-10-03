import { money } from "@/lib/site";

export function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`border border-sand bg-white p-6 ${className}`}>
      {title && <h2 className="mb-5 text-[0.72rem] font-medium tracking-[0.22em] text-muted uppercase">{title}</h2>}
      {children}
    </section>
  );
}

export function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border border-sand bg-white p-6">
      <p className="text-[0.68rem] font-medium tracking-[0.22em] text-muted uppercase">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
    </div>
  );
}

/** Single-series bar chart. One hue; values on hover and in the accessible table below the bars. */
export function Bars({ data, format = "money", label }: { data: { label: string; value: number }[]; format?: "money" | "count"; label: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const fmt = (v: number) => (format === "money" ? money(v) : String(v));
  return (
    <figure aria-label={label}>
      <div className="flex h-44 items-end gap-1.5 border-b border-sand">
        {data.map((d) => (
          <div key={d.label} className="group relative flex h-full flex-1 items-end" title={`${d.label}: ${fmt(d.value)}`}>
            <div className="w-full rounded-t-[2px] bg-forest transition-colors group-hover:bg-burgundy" style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 2 : 0 }} />
            <span className="pointer-events-none absolute -top-1 left-1/2 hidden -translate-x-1/2 -translate-y-full bg-ink px-2 py-1 text-xs whitespace-nowrap text-cream group-hover:block">{fmt(d.value)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 text-[0.62rem] text-muted">
        {data.map((d, i) => <span key={d.label} className="flex-1 truncate text-center">{data.length > 8 && i % 2 ? "" : d.label}</span>)}
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>{data.map((d) => <tr key={d.label}><th scope="row">{d.label}</th><td>{fmt(d.value)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}

export function HBars({ data, label }: { data: { label: string; value: number }[]; label: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (!data.length) return <p className="text-muted">No sales yet.</p>;
  return (
    <ul aria-label={label} className="space-y-4">
      {data.map((d) => (
        <li key={d.label}>
          <div className="flex justify-between gap-4 text-sm"><span>{d.label}</span><span className="font-medium">{money(d.value)}</span></div>
          <div className="mt-1.5 h-2 bg-cream"><div className="h-full bg-forest" style={{ width: `${(d.value / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

export const th = "px-4 py-3 text-left text-[0.66rem] font-medium tracking-[0.18em] text-muted uppercase";
export const td = "px-4 py-3 align-top text-[0.95rem]";
export const input = "w-full border border-sand bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none";

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "good" | "warn" | "neutral" }) {
  const c = tone === "good" ? "border-forest/40 text-forest" : tone === "warn" ? "border-burgundy/40 text-burgundy" : "border-sand text-muted";
  return <span className={`inline-block border px-2 py-0.5 text-[0.66rem] tracking-[0.14em] uppercase ${c}`}>{children}</span>;
}
