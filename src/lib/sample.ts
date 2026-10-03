// SAMPLE CONTENT — placeholders for development only.
// Replace with real, verified customer reviews before launch.
export const sampleReviews = [
  { name: "Sample Customer A", text: "Placeholder review. Real customer feedback will appear here once orders begin shipping." },
  { name: "Sample Customer B", text: "Placeholder review. Use this space for a verified customer's words about the coffee." },
  { name: "Sample Customer C", text: "Placeholder review. Only genuine reviews from verified buyers should be published." },
];

// Preview data shown in /admin when no database is connected. Clearly labelled as sample in the UI.
const ago = (days: number, hour = 14) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 10, 0, 0);
  return d.toISOString();
};
const row = (n: number, days: number, status: string, city: string, state: string, items: [string, string, number, number][], sub = false) => ({
  id: `sample-${n}`,
  number: `CR-${1000 + n}`,
  email: `sample${n}@example.com`,
  name: `Sample Customer ${n}`,
  total_cents: items.reduce((s, i) => s + i[2] * i[3], 0),
  payment_status: "paid",
  fulfillment_status: status,
  shipping_address: { city, state },
  carrier: null as string | null,
  tracking_number: null as string | null,
  stripe_subscription_id: sub ? "sample" : null,
  created_at: ago(days),
  order_items: items.map(([name, size, quantity, unit], k) => ({ id: `${n}-${k}`, name, size, quantity, total_cents: quantity * unit })),
});

export const sampleOrders = () => [
  row(9, 0, "unfulfilled", "Austin", "TX", [["Organic Dark Roast Blend", "12 oz", 2, 2499]]),
  row(8, 1, "unfulfilled", "Denver", "CO", [["Colombian Mountain Reserve", "2 lb", 1, 5999]]),
  row(7, 2, "shipped", "Miami", "FL", [["Colombian Decaf", "12 oz", 1, 2599], ["Organic Dark Roast Blend", "12 oz", 1, 2499]]),
  row(6, 4, "shipped", "Seattle", "WA", [["Organic Dark Roast Blend", "12 oz", 1, 2249]], true),
  row(5, 6, "delivered", "Portland", "OR", [["Organic Dark Roast Blend", "5 lb", 1, 11999]]),
  row(4, 9, "delivered", "Chicago", "IL", [["Colombian Mountain Reserve", "12 oz", 2, 2799]]),
  row(3, 12, "delivered", "Boston", "MA", [["Colombian Mountain Reserve", "12 oz", 1, 2519]], true),
  row(2, 38, "delivered", "Phoenix", "AZ", [["Organic Dark Roast Blend", "2 lb", 1, 5499]]),
  row(1, 71, "delivered", "Atlanta", "GA", [["Colombian Decaf", "2 lb", 1, 5699]]),
];
