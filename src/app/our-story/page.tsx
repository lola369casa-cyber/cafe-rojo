import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Our Story — From Colombia’s Mountains to Your Cup",
  description: "The story of Café Rojo: the mountains, the farms, the farmers, the cherries, the green beans and the roast behind every cup of our Colombian coffee.",
  alternates: { canonical: "/our-story" },
};

const chapters = [
  { title: "The Mountains", image: "/images/mountains.jpg", alt: "Layered Colombian mountain ridges in mist",
    text: "It starts with a landscape. Ridge after ridge of the Andes, mist settling in the valleys each morning and lifting as the sun climbs. Coffee has grown on these slopes for generations." },
  { title: "The Coffee Farms", image: "/images/finca.jpg", alt: "A white-walled finca with a terracotta roof among coffee trees",
    text: "Tucked into the hillsides are the fincas: farmhouses with terracotta roofs, wide verandas and rows of coffee trees running down the slope. Many are small, and most are family-run." },
  { title: "The Farmers", image: "/images/farmer.jpg", alt: "A coffee farmer in a straw hat picking cherries",
    text: "The work is done by hand. A cafetero knows every tree and returns to it again and again through the season, taking only what is ready. That patience cannot be automated." },
  { title: "The Cherries", image: "/images/harvest-basket.jpg", alt: "A woven basket of ripe red coffee cherries",
    text: "Coffee begins as fruit. When the cherries turn deep red, they are picked and gathered by the basket. The red of a ripe coffee cherry is where Café Rojo takes its name." },
  { title: "The Green Beans", image: "/images/drying.jpg", alt: "Coffee drying on wide patios beneath the mountains",
    text: "The fruit is removed, the seeds are washed and then laid out to dry in the mountain air. What remains is green coffee — dense, pale and full of potential. We select it carefully." },
  { title: "The Roasting Process", image: "/images/roasting.jpg", alt: "Coffee beans roasting to a golden brown",
    text: "In the United States the green coffee is roasted in small batches. The roaster listens, watches and smells, drawing out sweetness, aroma and depth without losing what the mountains gave it." },
  { title: "The Finished Coffee", image: "/images/pour.jpg", alt: "Coffee poured into a white cup on a wooden table",
    text: "Then it is packaged fresh and sent to you. When you pour your cup, you are at the end of a long line of care — from the farmer, to the roaster, to your table." },
];

export default function OurStoryPage() {
  return (
    <>
      <section className="relative flex min-h-[86vh] items-end overflow-hidden bg-forest-deep">
        <Image src="/images/cherries.jpg" alt="Ripe red coffee cherries on the branch in the Colombian mountains" fill priority quality={85} sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
        <div className="container-x relative py-16 text-cream lg:py-24">
          <p className="eyebrow !text-gold-light">Our Story</p>
          <h1 className="display mt-4 max-w-5xl text-5xl sm:text-7xl lg:text-[5.5rem]">From Colombia’s Mountains to Your Cup</h1>
          <div className="gold-rule mt-8" />
        </div>
      </section>

      <section className="container-x py-20 text-center lg:py-28">
        <Reveal className="mx-auto max-w-3xl">
          <p className="font-serif text-[1.9rem] leading-[1.35] text-coffee italic sm:text-4xl sm:leading-[1.35]">
            Café Rojo is premium Colombian coffee — grown in the mountains of Colombia and roasted in small batches in the United States. This is how it gets from there to here.
          </p>
        </Reveal>
      </section>

      {chapters.map((c, i) => (
        <section key={c.title} className="relative flex min-h-[80vh] items-center overflow-hidden bg-forest-deep">
          <Image src={c.image} alt={c.alt} fill sizes="100vw" className="object-cover" />
          <div className={`absolute inset-0 max-md:bg-forest-deep/70 ${i % 2 ? "md:bg-gradient-to-l" : "md:bg-gradient-to-r"} from-forest-deep/95 via-forest-deep/65 to-transparent`} />
          <div className="container-x relative py-20">
            <Reveal className={`max-w-lg text-cream ${i % 2 ? "md:ml-auto" : ""}`}>
              <p className="font-serif text-6xl text-gold-light/90">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="h2 mt-2">{c.title}</h2>
              <div className="gold-rule my-6" />
              <p className="text-lg leading-[1.85] text-cream/90">{c.text}</p>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="container-x py-20 text-center lg:py-28">
        <Reveal className="mx-auto max-w-2xl">
          <p className="eyebrow">Farmer · Roaster · You</p>
          <h2 className="h2 mt-4">Taste Where It Comes From</h2>
          <div className="gold-rule mx-auto my-7" />
          <p className="lede">Every bag of Café Rojo carries the whole journey with it.</p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/shop" className="btn btn-primary">Shop Coffee</Link>
            <Link href="/our-coffee" className="btn btn-outline">Explore Our Coffee</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
