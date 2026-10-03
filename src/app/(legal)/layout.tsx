export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-x max-w-3xl py-16 lg:py-24">
      <p className="mb-8 border border-dashed border-burgundy/50 px-4 py-2 text-xs tracking-[0.14em] text-burgundy uppercase">
        Draft template — have this policy reviewed and completed before launch
      </p>
      <div className="prose-cr text-[1.06rem] leading-[1.85] [&_h1]:mb-6 [&_h1]:font-serif [&_h1]:text-5xl [&_h1]:leading-tight">{children}</div>
    </div>
  );
}
