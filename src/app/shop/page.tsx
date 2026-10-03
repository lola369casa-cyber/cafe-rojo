import type { Metadata } from "next";
import { Breadcrumbs, PageHero } from "@/components/page-hero";
import { ShopGrid } from "@/components/shop-grid";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop Colombian Coffee — Dark Roast, Single Origin & Decaf",
  description: "Shop Café Rojo premium Colombian coffee: organic dark roast, Colombian Mountain Reserve and Colombian decaf. Fresh roasted in small batches.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <PageHero eyebrow="The Collection" title="Shop Coffee" text="Mountain-grown Colombian coffee, roasted in small batches and packaged fresh." image="/images/plantation.jpg" alt="Coffee trees on a Colombian hillside" />
      <div className="container-x py-10 lg:py-14">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Shop", href: "/shop" }]} />
        <div className="mt-10"><ShopGrid products={products} /></div>
      </div>
    </>
  );
}
