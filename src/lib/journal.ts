export const categories = [
  "Colombian Coffee",
  "Coffee Origins",
  "Brewing",
  "Roasting",
  "Coffee Recipes",
  "Behind the Brand",
] as const;

export type Article = {
  slug: string;
  title: string;
  category: (typeof categories)[number];
  excerpt: string;
  image: string;
  date: string;
  minutes: number;
  body: { heading?: string; text: string }[];
};

export const articles: Article[] = [
  {
    slug: "why-colombian-mountain-coffee-is-so-special",
    title: "Why Colombian Mountain Coffee Is So Special",
    category: "Colombian Coffee",
    excerpt: "Altitude, climate and generations of know-how: what makes coffee from Colombia's mountains taste the way it does.",
    image: "/images/mountains.jpg",
    date: "2026-09-18",
    minutes: 4,
    body: [
      { text: "Colombia's coffee grows where the Andes split into three ranges and run the length of the country. Those slopes put coffee trees at elevations where days are warm, nights are cool, and cherries ripen slowly." },
      { heading: "Slow ripening, more character", text: "Coffee cherries that mature slowly have more time to develop sugars and the compounds that later become aroma and flavor in the roaster. It is one of the main reasons mountain-grown coffee is prized." },
      { heading: "Arabica country", text: "Colombia is known for growing arabica, the species associated with sweeter, more aromatic coffee. Much of it is picked by hand, because steep hillsides make machine harvesting impractical and because pickers can choose only the ripe red cherries." },
      { heading: "A culture, not just a crop", text: "Coffee in Colombia is largely grown on small family farms. Knowledge of when to pick, how to ferment and how to dry is passed down, and it shows in the cup." },
    ],
  },
  {
    slug: "understanding-coffee-roast-levels",
    title: "Understanding Coffee Roast Levels",
    category: "Roasting",
    excerpt: "Light, medium, dark — what actually changes in the bean, and how to choose the roast that suits you.",
    image: "/images/roasting.jpg",
    date: "2026-09-10",
    minutes: 5,
    body: [
      { text: "Roasting transforms dense green coffee into something aromatic and brittle enough to grind. How far the roast is taken shapes almost everything you taste." },
      { heading: "Light", text: "Lighter roasts keep more of the bean's own character: brighter acidity, more floral and fruit notes, a lighter body." },
      { heading: "Medium", text: "Medium roasts balance origin character with roast sweetness. Acidity softens, body fills out and caramel-like notes appear." },
      { heading: "Dark", text: "Darker roasts bring roast flavors forward: chocolate, toasted nuts, a fuller body and a lower perceived acidity. Done with care, a dark roast is rich rather than burnt." },
      { heading: "Choosing", text: "There is no best roast, only the one you enjoy. If you take milk or like a deep, comforting cup, start dark. If you drink it black and like nuance, start medium." },
    ],
  },
  {
    slug: "how-to-brew-the-perfect-dark-roast",
    title: "How to Brew the Perfect Dark Roast",
    category: "Brewing",
    excerpt: "Dark roasts extract easily. A few small adjustments keep the cup rich and smooth rather than bitter.",
    image: "/images/pour.jpg",
    date: "2026-08-28",
    minutes: 4,
    body: [
      { text: "Dark-roasted beans are more porous and soluble than lighter roasts, so they give up their flavor quickly. The goal is to take the sweetness and body without over-extracting." },
      { heading: "Use slightly cooler water", text: "Water just off the boil works well. Letting the kettle rest for about a minute after boiling helps avoid harsh, bitter notes." },
      { heading: "Grind a touch coarser", text: "If your cup tastes bitter or drying, coarsen the grind before changing anything else. If it tastes thin, go finer." },
      { heading: "Start with a simple ratio", text: "A common starting point is about one part coffee to sixteen parts water by weight. Adjust to taste from there." },
      { heading: "Good methods", text: "French press and moka pot flatter a dark roast's body. Drip makes an easy, consistent daily cup." },
    ],
  },
  {
    slug: "from-coffee-cherry-to-roasted-bean",
    title: "From Coffee Cherry to Roasted Bean",
    category: "Coffee Origins",
    excerpt: "The coffee bean starts life as the seed of a red fruit. Here is the path it takes before it reaches your grinder.",
    image: "/images/harvest-basket.jpg",
    date: "2026-08-15",
    minutes: 5,
    body: [
      { text: "Every coffee bean is the seed of a cherry. Most cherries hold two seeds, face to face, wrapped in fruit." },
      { heading: "Harvest", text: "Ripe cherries turn a deep red. Selective hand-picking means only ripe fruit is taken, and a tree is visited several times through the season." },
      { heading: "Processing", text: "The fruit has to come off the seed. In the washed method, common in Colombia, cherries are pulped, fermented to loosen the remaining fruit, then washed clean." },
      { heading: "Drying", text: "The seeds are dried slowly, on patios or raised beds, until they are stable enough to store and ship. At this stage it is called green coffee." },
      { heading: "Roasting", text: "Green coffee is shipped to the roaster, where heat develops the aroma, sweetness and color we recognize as coffee." },
    ],
  },
  {
    slug: "meet-the-regions-behind-colombian-coffee",
    title: "Meet the Regions Behind Colombian Coffee",
    category: "Colombian Coffee",
    excerpt: "Huila, Nariño, Antioquia, the Sierra Nevada — a short introduction to some of Colombia's best-known coffee regions.",
    image: "/images/plantation.jpg",
    date: "2026-08-02",
    minutes: 4,
    body: [
      { text: "Colombia is not one coffee landscape but many. Regions differ in altitude, rainfall and harvest season, and those differences reach the cup." },
      { heading: "Huila", text: "In the south, Huila is one of the country's largest producing regions and is widely regarded for sweet, well-structured coffee." },
      { heading: "Nariño", text: "Bordering Ecuador, Nariño's farms are among the highest in Colombia, where cool nights slow ripening." },
      { heading: "Antioquia", text: "One of Colombia's historic coffee heartlands, with a long tradition of family farms across its mountainsides." },
      { heading: "Sierra Nevada de Santa Marta", text: "An isolated mountain range rising near the Caribbean coast, home to coffee grown by small producers including Indigenous communities." },
    ],
  },
];
