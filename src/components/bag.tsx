import Image from "next/image";
import type { BagColor } from "@/lib/catalog";

const colors: Record<BagColor, { bag: string; text: string }> = {
  burgundy: { bag: "#5c1120", text: "#e9d6ae" },
  forest: { bag: "#1c3a29", text: "#e9d6ae" },
  coffee: { bag: "#3d2a1f", text: "#e9d6ae" },
};

/** Product visual: the Café Rojo label on a coffee bag. Replaced by a real photo when the product has one. */
export function Bag({
  bag,
  subtitle,
  size = "12 oz",
  image,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
  className = "",
}: {
  bag: BagColor;
  subtitle: string;
  size?: string;
  image?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (image) {
    return (
      <div className={`relative aspect-[4/5] overflow-hidden bg-[#efe6d4] ${className}`}>
        <Image src={image} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  const c = colors[bag];
  return (
    <div
      role="img"
      aria-label={alt}
      className={`@container relative flex aspect-[4/5] items-end justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#f6efe0_0%,#e9dfca_70%,#e0d4bb_100%)] ${className}`}
    >
      <div className="absolute bottom-[4.5%] h-[4%] w-[62%] rounded-[50%] bg-black/25 blur-[10px]" />
      <div
        className="relative mb-[6%] h-[86%] w-[58%] rounded-t-[3%] rounded-b-[2%]"
        style={{ background: c.bag, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.05)" }}
      >
        {/* crimped seal */}
        <div
          className="absolute inset-x-0 top-0 h-[6%] rounded-t-[3%]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,.28) 0 2px, rgba(255,255,255,.07) 2px 5px)",
          }}
        />
        <div className="absolute inset-x-[9%] top-[11%] aspect-[2/3] border border-[#c9a56a]/70 shadow-[0_1px_6px_rgba(0,0,0,.35)]">
          <Image src="/images/label.jpg" alt="" fill sizes={sizes} priority={priority} className="object-cover" />
        </div>
        <div className="absolute inset-x-[6%] bottom-[4%] text-center" style={{ color: c.text }}>
          <p className="font-serif text-[4.3cqw] leading-tight italic">{subtitle}</p>
          <p className="mt-[1.2cqw] text-[2.1cqw] tracking-[0.3em] uppercase opacity-80">Whole Bean · Net Wt {size}</p>
        </div>
        {/* volume shading */}
        <div className="pointer-events-none absolute inset-0 rounded-t-[3%] bg-[linear-gradient(90deg,rgba(0,0,0,.34)_0%,rgba(0,0,0,0)_16%,rgba(255,255,255,.07)_46%,rgba(0,0,0,0)_78%,rgba(0,0,0,.38)_100%)]" />
      </div>
    </div>
  );
}
