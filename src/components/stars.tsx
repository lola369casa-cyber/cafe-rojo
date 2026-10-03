export function Stars({ value = 5, className = "" }: { value?: number; className?: string }) {
  return (
    <span className={`tracking-[0.15em] text-gold ${className}`} role="img" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(Math.round(value))}
      <span className="text-sand">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

/** Shows a rating only when real reviews exist — never an invented one. */
export function Rating({ rating, count }: { rating: number | null; count: number }) {
  if (!rating || !count) return <span className="text-xs tracking-wide text-muted">New · No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <Stars value={rating} />
      <span className="text-muted">({count})</span>
    </span>
  );
}
