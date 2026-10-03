export type Size = "12 oz" | "2 lb" | "5 lb";
export type CoffeeType = "Dark Roast" | "Medium Roast" | "Decaf" | "Limited Release";
export type BagColor = "burgundy" | "forest" | "coffee";

export type Variant = { id: string; size: Size; priceCents: number; inventory: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  type: CoffeeType;
  roast: string;
  origin: string;
  region: string | null;
  availability: "In Stock" | "Limited Release";
  tastingNotes: string[];
  profile: { aroma: string; body: string; flavor: string; finish: string };
  short: string;
  description: string;
  // Verified facts only. Leave null until confirmed for the specific lot —
  // the product page hides any field that is null.
  process: string | null;
  variety: string | null;
  altitude: string | null;
  brewMethods: string[];
  bag: BagColor;
  image: string | null;
  variants: Variant[];
  rating: number | null;
  reviewCount: number;
  seoTitle: string;
  seoDescription: string;
};

// Seed catalog. Used when no database is connected, and by `supabase/seed.sql`.
export const seedProducts: Product[] = [
  {
    id: "dark-roast",
    slug: "organic-dark-roast-blend",
    name: "Café Rojo Dark Roast",
    subtitle: "Organic Dark Roast Blend",
    type: "Dark Roast",
    roast: "Dark",
    origin: "Colombia",
    region: null,
    availability: "In Stock",
    tastingNotes: ["Rich", "Smooth", "Chocolate", "Caramel"],
    profile: {
      aroma: "Rich and inviting",
      body: "Full and smooth",
      flavor: "Dark chocolate and caramel",
      finish: "Long, warm and balanced",
    },
    short: "A deep, full Colombian roast with dark chocolate and caramel.",
    description:
      "A rich Colombian coffee crafted for those who enjoy a deeper, fuller roast. Expect notes of dark chocolate, caramel and roasted nuts with a smooth finish.",
    process: null,
    variety: null,
    altitude: null,
    brewMethods: ["French press", "Drip", "Espresso", "Moka pot"],
    bag: "burgundy",
    image: null,
    variants: [
      { id: "dark-roast-12oz", size: "12 oz", priceCents: 2499, inventory: 120 },
      { id: "dark-roast-2lb", size: "2 lb", priceCents: 5499, inventory: 40 },
      { id: "dark-roast-5lb", size: "5 lb", priceCents: 11999, inventory: 15 },
    ],
    rating: null,
    reviewCount: 0,
    seoTitle: "Organic Dark Roast Blend — Colombian Dark Roast Coffee",
    seoDescription:
      "Café Rojo Organic Dark Roast Blend: premium Colombian dark roast coffee with notes of dark chocolate and caramel, roasted in small batches.",
  },
  {
    id: "mountain-reserve",
    slug: "colombian-mountain-reserve",
    name: "Café Rojo Mountain Reserve",
    subtitle: "Colombian Mountain Reserve",
    type: "Medium Roast",
    roast: "Medium",
    origin: "Colombia",
    region: null,
    availability: "In Stock",
    tastingNotes: ["Balanced", "Smooth", "Sweet", "Clean"],
    profile: {
      aroma: "Sweet and fragrant",
      body: "Medium and rounded",
      flavor: "Balanced sweetness",
      finish: "Clean and gentle",
    },
    short: "A balanced medium roast that lets mountain-grown Colombian coffee speak.",
    description:
      "A medium roast that keeps the character of mountain-grown Colombian coffee in the foreground: balanced, smooth and easy to return to cup after cup.",
    process: null,
    variety: null,
    altitude: null,
    brewMethods: ["Pour-over", "Drip", "AeroPress", "French press"],
    bag: "forest",
    image: null,
    variants: [
      { id: "mountain-reserve-12oz", size: "12 oz", priceCents: 2799, inventory: 90 },
      { id: "mountain-reserve-2lb", size: "2 lb", priceCents: 5999, inventory: 30 },
      { id: "mountain-reserve-5lb", size: "5 lb", priceCents: 12999, inventory: 10 },
    ],
    rating: null,
    reviewCount: 0,
    seoTitle: "Colombian Mountain Reserve — Single Origin Colombian Coffee",
    seoDescription:
      "Café Rojo Colombian Mountain Reserve: a balanced medium roast of mountain-grown Colombian specialty coffee, roasted fresh in small batches.",
  },
  {
    id: "decaf",
    slug: "colombian-decaf",
    name: "Café Rojo Decaf",
    subtitle: "Colombian Decaf",
    type: "Decaf",
    roast: "Medium-Dark",
    origin: "Colombia",
    region: null,
    availability: "In Stock",
    tastingNotes: ["Smooth", "Mellow", "Cocoa", "Sweet"],
    profile: {
      aroma: "Soft and sweet",
      body: "Smooth and mellow",
      flavor: "Cocoa and gentle sweetness",
      finish: "Soft and rounded",
    },
    short: "Colombian coffee character, without the caffeine.",
    description:
      "Colombian coffee for any hour of the day. A smooth, mellow decaf roasted to keep the sweetness and body you expect from Café Rojo.",
    process: null,
    variety: null,
    altitude: null,
    brewMethods: ["Drip", "French press", "Pour-over"],
    bag: "coffee",
    image: null,
    variants: [
      { id: "decaf-12oz", size: "12 oz", priceCents: 2599, inventory: 80 },
      { id: "decaf-2lb", size: "2 lb", priceCents: 5699, inventory: 25 },
      { id: "decaf-5lb", size: "5 lb", priceCents: 12499, inventory: 8 },
    ],
    rating: null,
    reviewCount: 0,
    seoTitle: "Colombian Decaf — Premium Colombian Decaf Coffee",
    seoDescription:
      "Café Rojo Colombian Decaf: smooth, mellow Colombian decaf coffee with cocoa sweetness, roasted in small batches in the United States.",
  },
];

export const coffeeTypes: CoffeeType[] = ["Dark Roast", "Medium Roast", "Decaf", "Limited Release"];
export const origins = ["Colombia", "Huila", "Nariño", "Antioquia", "Sierra Nevada"];
export const sizes: Size[] = ["12 oz", "2 lb", "5 lb"];

export const finder: { label: string; slug: string; why: string }[] = [
  { label: "Smooth & Balanced", slug: "colombian-mountain-reserve", why: "Our medium roast is the most balanced cup in the range." },
  { label: "Rich & Bold", slug: "organic-dark-roast-blend", why: "The deepest, fullest roast we make." },
  { label: "Bright & Fruity", slug: "colombian-mountain-reserve", why: "Our lightest roast, and the closest to a bright, lively cup." },
  { label: "Low Acidity", slug: "organic-dark-roast-blend", why: "A darker roast mellows perceived acidity." },
  { label: "Decaf", slug: "colombian-decaf", why: "Colombian character, without the caffeine." },
];
