import Link from "next/link";
import { site } from "@/lib/site";
import { Newsletter } from "./newsletter";

const icons: Record<string, React.ReactNode> = {
  Instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".6" fill="currentColor" /></>,
  Facebook: <path d="M14 8.5V7c0-.8.5-1.3 1.4-1.3H17V3h-2.3C12.3 3 11 4.6 11 6.8v1.7H9V11h2v10h3V11h2.4l.4-2.5z" />,
  TikTok: <path d="M14 3v11.2a3.3 3.3 0 1 1-3.3-3.3M14 3c.3 2.5 2 4.3 4.5 4.6" />,
  YouTube: <><rect x="2.5" y="5.5" width="19" height="13" rx="3.5" /><path d="m10 9.2 5 2.8-5 2.8z" fill="currentColor" /></>,
};

const cols = [
  { title: "Explore", links: [["Shop", "/shop"], ["Our Coffee", "/our-coffee"], ["Our Story", "/our-story"], ["Journal", "/journal"], ["Contact", "/contact"]] },
  { title: "Support", links: [["Shipping", "/shipping"], ["Returns", "/returns"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["My Account", "/account"]] },
];

export function Footer() {
  const social: [string, string][] = [
    ["Instagram", site.social.instagram],
    ["Facebook", site.social.facebook],
    ["TikTok", site.social.tiktok],
    ["YouTube", site.social.youtube],
  ];
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.5fr] lg:py-20">
        <div>
          <p className="font-serif text-5xl font-semibold text-cream">Café Rojo</p>
          <div className="gold-rule my-5" />
          <p className="font-serif text-xl text-cream/85 italic">“{site.tagline}”</p>
          <div className="mt-7 flex gap-2">
            {social.map(([name, href]) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Café Rojo on ${name}`} className="flex h-11 w-11 items-center justify-center border border-cream/25 transition-colors hover:border-gold hover:text-gold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{icons[name]}</svg>
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="eyebrow">{c.title}</p>
            <ul className="mt-5 space-y-3">
              {c.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-cream/80 transition-colors hover:text-gold-light">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p className="eyebrow">Stay Close to the Source</p>
          <p className="mt-5 mb-5 text-cream/75">New releases, limited lots and stories from the mountains of Colombia.</p>
          <Newsletter dark button="Join" source="footer" />
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs tracking-[0.14em] text-cream/60 uppercase sm:flex-row">
          <p>© 2026 Café Rojo. All Rights Reserved.</p>
          <p>Grown in Colombia · Roasted in the United States</p>
        </div>
      </div>
    </footer>
  );
}
