import { Leaf, Flame, Package, Compass, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Stars } from "@/components/stars";
import { SubscriptionPicker } from "@/components/subscription-picker";
import { TastingProfile } from "@/components/tasting-profile";
import { getProducts } from "@/lib/data";
import { sampleReviews } from "@/lib/sample";
import { site } from "@/lib/site";

const benefits = [
  { Icon: MapPin, title: "Traceable Origin", text: "Carefully selected Colombian coffee." },
  { Icon: Flame, title: "Small-Batch Roasted", text: "Roasted with precision to develop depth, aroma and balance." },
  { Icon: Leaf, title: "Crafted for Your Cup", text: "Freshly roasted and packaged for exceptional flavor." },
];

const journey = [
  { step: "Colombia", image: "/images/mountains.jpg", alt: "Misty mountain ranges of Colombia at sunrise", text: "High mountain slopes where warm days and cool nights shape the coffee." },
  { step: "Coffee Farm", image: "/images/finca.jpg", alt: "A traditional Colombian finca among coffee trees", text: "Coffee grown on hillside farms, tended by people who know the land." },
  { step: "Harvest", image: "/images/harvest-basket.jpg", alt: "A hand sorting ripe red coffee cherries in a woven basket", text: "Ripe red cherries, picked when they are ready." },
  { step: "Green Coffee", image: "/images/drying.jpg", alt: "Coffee drying on patios beneath the mountains", text: "Processed, dried and carefully selected before it travels." },
  { step: "Roasting", image: "/images/roasting.jpg", alt: "Coffee beans roasting", text: "Roasted in small batches to bring out depth and sweetness." },
  { step: "Your Cup", image: "/images/pour.jpg", alt: "Fresh coffee poured into a white cup", text: "Packaged fresh, so what you brew tastes the way it should." },
];

const why = [
  { Icon: MapPin, title: "Colombian Origin", text: "Carefully selected coffee from Colombia’s renowned growing regions." },
  { Icon: Flame, title: "Small-Batch Roasting", text: "Roasted in controlled batches to develop consistent flavor." },
  { Icon: Package, title: "Freshly Packaged", text: "Coffee is packaged to protect freshness and aroma." },
  { Icon: Compass, title: "Crafted With Purpose", text: "A premium coffee experience from origin to cup." },
];

const gallery = [
  { src: "/images/cherries-macro.jpg", alt: "Ripe coffee cherries with morning dew" },
  { src: "/images/mountains.jpg", alt: "Colombian mountains in mist" },
  { src: "/images/label.jpg", alt: "The Café Rojo label" },
  { src: "/images/pour.jpg", alt: "Coffee being poured" },
  { src: "/images/roasting.jpg", alt: "Roasted coffee beans" },
  { src: "/images/plantation.jpg", alt: "Rows of coffee trees on a hillside" },
  { src: "/images/farmer-cup.jpg", alt: "A coffee farmer enjoying a cup on the porch" },
  { src: "/images/washing.jpg", alt: "Coffee cherries being washed" },
];

const subscriptionBenefits = ["Automatic delivery", "Cancel anytime", "Flexible delivery schedule", "Subscriber savings", "Freshly roasted coffee"];

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      {/* 1 — Hero */}
      <section className="relative bg-forest-deep">
        {/* Desktop: wide cinematic artwork */}
        <div className="relative hidden h-[calc(88vh-104px)] min-h-[560px] md:block">
          <Image
            src="/images/hero-wide.jpg"
            alt="Café Rojo — a coffee branch heavy with ripe red cherries above the misty mountains of Colombia, with a traditional finca among the coffee trees"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/55 via-30% to-transparent to-60%" />
          <div className="pointer-events-none absolute inset-4 border border-gold-light/60 lg:inset-5" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="container-x pb-[clamp(2rem,6vh,4rem)] text-center text-cream [text-shadow:0_1px_18px_rgba(10,25,16,.75)]">
              <p className="eyebrow !text-gold-light">Premium Colombian Coffee</p>
              <h1 className="display mx-auto mt-3 max-w-5xl text-[clamp(2.4rem,6.4vh,4.4rem)]">From the Colombian Mountains to Your Cup</h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/90">
                Discover carefully selected Colombian coffee, expertly roasted to bring the character of Colombia’s mountains into every cup.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/shop" className="btn btn-primary">Shop Coffee</Link>
                <Link href="/our-story" className="btn btn-light">Discover Our Story</Link>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile: the full label artwork, message beneath */}
        <div className="md:hidden">
          <div className="relative aspect-[2/3] max-h-[78vh] w-full">
            <Image
              src="/images/hero-portrait.jpg"
              alt="Café Rojo — ripe red coffee cherries, misty Colombian mountains and a traditional finca"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
          <div className="px-6 pt-9 pb-12 text-center text-cream">
            <p className="eyebrow !text-gold-light">Premium Colombian Coffee</p>
            <p className="display mt-3 text-[2.5rem]">From the Colombian Mountains to Your Cup</p>
            <p className="mt-4 text-cream/85">
              Discover carefully selected Colombian coffee, expertly roasted to bring the character of Colombia’s mountains into every cup.
            </p>
            <div className="mt-7 grid gap-3">
              <Link href="/shop" className="btn btn-primary">Shop Coffee</Link>
              <Link href="/our-story" className="btn btn-light">Discover Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Brand introduction */}
      <section className="container-x py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/farmer.jpg" alt="A Colombian coffee farmer picking ripe cherries by hand" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -right-4 -bottom-6 hidden w-[42%] border-8 border-paper sm:block lg:-right-10">
              <div className="relative aspect-square">
                <Image src="/images/cherries-macro.jpg" alt="Ripe red coffee cherries" fill sizes="25vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Our Coffee</p>
            <h2 className="h2 mt-4">Coffee With a Sense of Place</h2>
            <div className="gold-rule my-7" />
            <p className="lede">
              Café Rojo begins in the mountains of Colombia, where altitude, climate, soil and generations of coffee-growing tradition create extraordinary coffee cherries.
            </p>
            <p className="lede mt-5">
              From carefully selected green beans to the final roast, every step is designed to preserve the distinctive character of the coffee.
            </p>
            <ul className="mt-10 grid gap-7 sm:grid-cols-3">
              {benefits.map(({ Icon, title, text }) => (
                <li key={title}>
                  <Icon size={26} strokeWidth={1.1} className="text-burgundy" aria-hidden />
                  <p className="mt-3 text-[0.72rem] font-medium tracking-[0.2em] uppercase">{title}</p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 3 — Featured coffee */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="container-x">
          <Reveal className="text-center">
            <p className="eyebrow">The Collection</p>
            <h2 className="h2 mt-4">Discover Café Rojo</h2>
            <div className="gold-rule mx-auto mt-7" />
          </Reveal>
          <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 110}><ProductCard product={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Coffee experience */}
      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-forest-deep">
        <Image src="/images/cherries.jpg" alt="A coffee branch laden with ripe red cherries" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/70 to-forest-deep/10 max-md:bg-forest-deep/75 max-md:bg-none" />
        <div className="container-x relative py-20">
          <Reveal className="max-w-xl text-cream">
            <p className="eyebrow !text-gold-light">The Experience</p>
            <h2 className="h2 mt-4">Born in the Mountains. Roasted for Your Moment.</h2>
            <div className="gold-rule my-7" />
            <p className="text-lg leading-[1.8] text-cream/85">
              Every cup tells a story. From the red coffee cherries growing high in Colombia’s mountains to the careful roasting process, Café Rojo connects the origin of the bean with the ritual of your morning cup.
            </p>
            <Link href="/our-coffee" className="btn btn-gold mt-9">Explore Our Coffee</Link>
          </Reveal>
        </div>
      </section>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {[
          ["/images/plantation.jpg", "Coffee farm on a Colombian hillside"],
          ["/images/farmer-harvest.jpg", "Harvesting coffee cherries by hand"],
          ["/images/roasting-2.jpg", "Freshly roasted coffee beans"],
          ["/images/pour-2.jpg", "Freshly brewed coffee"],
        ].map(([src, alt]) => (
          <div key={src} className="group relative aspect-[4/3] overflow-hidden">
            <Image src={src} alt={alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
          </div>
        ))}
      </div>

      {/* 5 — Tasting profile */}
      <section className="bg-forest py-20 text-cream lg:py-28">
        <div className="container-x">
          <Reveal className="text-center">
            <p className="eyebrow !text-gold-light">Tasting Profile</p>
            <h2 className="h2 mt-4">What You’ll Taste</h2>
            <div className="gold-rule mx-auto mt-7 mb-10" />
          </Reveal>
          <Reveal><TastingProfile products={products} /></Reveal>
        </div>
      </section>

      {/* 6 — Our story */}
      <section className="container-x py-20 lg:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Origin to Cup</p>
          <h2 className="h2 mt-4">The Journey of Café Rojo</h2>
          <div className="gold-rule mx-auto my-7" />
          <p className="lede">
            Mountain-grown in Colombia, carefully selected as green coffee, expertly roasted and packaged fresh — a single line that connects the farmer, the roaster and you.
          </p>
        </Reveal>
        <ol className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((j, i) => (
            <li key={j.step}>
              <Reveal delay={(i % 3) * 110}>
                <div className="group relative aspect-[4/3] overflow-hidden">
                  <Image src={j.image} alt={j.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                </div>
                <div className="mt-5 flex items-baseline gap-4">
                  <span className="font-serif text-4xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[0.78rem] font-medium tracking-[0.24em] uppercase">{j.step}</h3>
                    <p className="mt-1.5 text-[0.98rem] text-muted">{j.text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mt-14 text-center"><Link href="/our-story" className="btn btn-outline">Read Our Story</Link></div>
      </section>

      {/* 7 — Why Café Rojo */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="container-x">
          <Reveal className="text-center">
            <p className="eyebrow">The Difference</p>
            <h2 className="h2 mt-4">Why Café Rojo</h2>
            <div className="gold-rule mx-auto mt-7" />
          </Reveal>
          <div className="mt-14 grid gap-px bg-sand sm:grid-cols-2 lg:grid-cols-4">
            {why.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 90} className="bg-paper px-8 py-12 text-center">
                <Icon size={30} strokeWidth={1} className="mx-auto text-burgundy" aria-hidden />
                <h3 className="mt-6 text-[0.76rem] font-medium tracking-[0.24em] uppercase">{title}</h3>
                <div className="gold-rule mx-auto my-5 !w-8" />
                <p className="text-[0.98rem] text-muted">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — Subscription */}
      <section id="subscribe" className="container-x scroll-mt-28 py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Subscribe &amp; Save</p>
            <h2 className="h2 mt-4">Never Run Out of Your Favorite Coffee</h2>
            <div className="gold-rule my-7" />
            <p className="lede">Choose your coffee and how often it arrives. We roast, pack and deliver on your schedule.</p>
            <ul className="mt-8 space-y-3.5">
              {subscriptionBenefits.map((b) => (
                <li key={b} className="flex items-center gap-4">
                  <span className="h-px w-7 bg-gold" aria-hidden />
                  <span className="text-[1.02rem]">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}><SubscriptionPicker products={products} /></Reveal>
        </div>
      </section>

      {/* 9 — Reviews */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="container-x">
          <Reveal className="text-center">
            <p className="eyebrow">Reviews</p>
            <h2 className="h2 mt-4">From Our Coffee Community</h2>
            <div className="gold-rule mx-auto mt-7" />
            <p className="mx-auto mt-6 inline-block border border-dashed border-burgundy/50 px-4 py-1.5 text-xs tracking-[0.16em] text-burgundy uppercase">
              Sample content — replace with verified customer reviews before launch
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {sampleReviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 100}>
                <figure className="flex h-full flex-col border border-sand bg-paper p-8">
                  <Stars />
                  <blockquote className="mt-5 flex-1 font-serif text-[1.35rem] leading-snug italic">“{r.text}”</blockquote>
                  <figcaption className="mt-6 border-t border-sand pt-4">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs tracking-[0.16em] text-muted uppercase">Verified Customer · Sample</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — Social gallery */}
      <section className="py-20 lg:py-28">
        <Reveal className="container-x text-center">
          <p className="eyebrow">@caferojo</p>
          <h2 className="h2 mt-4">Life at the Source</h2>
          <div className="gold-rule mx-auto mt-7" />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-1.5 px-1.5 md:grid-cols-4">
          {gallery.map((g) => (
            <a key={g.src} href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden" aria-label={`${g.alt} — view on Instagram`}>
              <Image src={g.src} alt={g.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <span className="absolute inset-0 bg-forest-deep/0 transition-colors duration-500 group-hover:bg-forest-deep/25" />
            </a>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Follow Café Rojo</a>
        </div>
      </section>

      {/* 11 — Email signup */}
      <section className="relative overflow-hidden bg-burgundy-deep py-20 text-cream lg:py-28">
        <Image src="/images/mountains.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="container-x relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow !text-gold-light">Join Us</p>
            <h2 className="h2 mt-4">Stay Close to the Source</h2>
            <div className="gold-rule mx-auto my-7" />
            <p className="mb-9 text-lg text-cream/85">
              Join the Café Rojo community for new coffee releases, limited lots, brewing inspiration and stories from the mountains of Colombia.
            </p>
            <Newsletter dark source="home" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
