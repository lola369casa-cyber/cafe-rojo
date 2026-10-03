import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CoffeeFinder } from "@/components/coffee-finder";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Coffee — Why Colombian Mountain Coffee Is Different",
  description: "Altitude, climate, soil, variety, processing and roasting: how Colombian specialty coffee gets its character, and how to find the Café Rojo coffee for you.",
  alternates: { canonical: "/our-coffee" },
};

const sections = [
  { id: "why-colombia", title: "Why Colombia?", image: "/images/mountains.jpg", alt: "Mountain ranges of Colombia in morning mist",
    text: ["Colombia sits on the equator and is crossed by three ranges of the Andes. Together they create the conditions coffee loves: steady daylight, reliable rain and steep slopes at elevation.", "It is also a country where coffee is a way of life. Much of it is grown on small family farms, where the craft is passed from one generation to the next."] },
  { id: "altitude", title: "Altitude", image: "/images/finca.jpg", alt: "A finca on a high Colombian hillside",
    text: ["High on the mountainside, days are warm and nights are cool. Coffee cherries ripen slowly in those conditions, giving them more time to develop sweetness and complexity.", "It is the reason mountain-grown coffee is so highly regarded."] },
  { id: "climate", title: "Climate", image: "/images/plantation.jpg", alt: "Lush coffee trees under soft light",
    text: ["Near the equator there are no harsh seasons, only a rhythm of rain and sun. In many regions of Colombia that rhythm allows more than one harvest in a year.", "Cloud and mist drifting through the valleys shelter the trees from the strongest sun."] },
  { id: "soil", title: "Soil", image: "/images/cherries.jpg", alt: "Glossy coffee leaves and ripe cherries",
    text: ["Much of Colombia’s coffee land is volcanic in origin. These soils are rich in organic matter and drain well on steep slopes — good ground for healthy trees."] },
  { id: "varieties", title: "Coffee Varieties", image: "/images/cherries-macro.jpg", alt: "Close view of red coffee cherries",
    text: ["Colombia is known for arabica coffee, the species valued for sweetness and aroma. Within arabica there are many varieties, each with its own character in the cup.", "As Café Rojo confirms the variety of each lot, it is listed on that coffee’s product page."] },
  { id: "processing", title: "Processing", image: "/images/washing.jpg", alt: "Coffee cherries in clear water during washing",
    text: ["After harvest, the fruit must be removed from the seed. The washed method — pulping, fermenting, then rinsing clean — is the traditional approach in Colombia and is associated with a clean, bright cup.", "The beans are then dried slowly until they are stable. At this stage they are called green coffee."] },
  { id: "roasting", title: "Roasting", image: "/images/roasting.jpg", alt: "Coffee beans turning in a roaster",
    text: ["Roasting is where green coffee becomes the coffee you recognize. Heat develops sweetness, aroma and body; how far the roast is taken decides the balance between the bean’s own character and deeper roast flavors.", "Café Rojo is roasted in small batches in the United States, so each batch gets close attention."] },
  { id: "brewing", title: "Brewing", image: "/images/pour.jpg", alt: "Coffee poured from a clay pot into a white cup",
    text: ["Great coffee is simple to brew well. Grind just before brewing, use fresh water just off the boil, and start from about one part coffee to sixteen parts water.", "From there, adjust to taste: a finer grind for more strength, a coarser grind for a gentler cup."] },
];

export default async function OurCoffeePage() {
  const products = await getProducts();
  return (
    <>
      <PageHero tall eyebrow="Our Coffee" title="Coffee Shaped by the Mountains" text="What makes Colombian coffee distinctive, from the hillside to your kitchen." image="/images/cherries.jpg" alt="A branch of ripe coffee cherries above Colombia’s mountains" />

      <nav aria-label="On this page" className="border-b border-sand bg-cream">
        <ul className="container-x flex gap-7 overflow-x-auto py-4 text-[0.7rem] font-medium tracking-[0.2em] whitespace-nowrap uppercase">
          {sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="hover:text-burgundy">{s.title}</a></li>)}
          <li><a href="#find" className="text-burgundy">Find Your Coffee</a></li>
        </ul>
      </nav>

      <div className="container-x space-y-20 py-20 lg:space-y-32 lg:py-28">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="grid scroll-mt-36 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <Reveal className={i % 2 ? "lg:order-2" : ""}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={s.image} alt={s.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="font-serif text-5xl text-gold">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="h2 mt-2">{s.title}</h2>
              <div className="gold-rule my-6" />
              {s.text.map((t) => <p key={t} className="lede mb-4">{t}</p>)}
            </Reveal>
          </section>
        ))}
      </div>

      <section id="find" className="scroll-mt-28 bg-cream py-20 lg:py-28">
        <div className="container-x"><CoffeeFinder products={products} /></div>
        <div className="mt-12 text-center"><Link href="/shop" className="btn btn-outline">Shop All Coffee</Link></div>
      </section>
    </>
  );
}
