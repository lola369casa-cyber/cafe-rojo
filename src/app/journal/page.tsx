import type { Metadata } from "next";
import { JournalList } from "@/components/journal-list";
import { PageHero } from "@/components/page-hero";
import { articles } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal — Colombian Coffee, Brewing & Roasting Guides",
  description: "Stories and guides from Café Rojo: Colombian coffee origins, roast levels, brewing methods and life behind the brand.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <>
      <PageHero eyebrow="The Journal" title="Stories From the Source" text="Colombian coffee, brewing, roasting and the people behind it." image="/images/farmer-cup.jpg" alt="A coffee farmer drinking coffee on a porch overlooking the mountains" />
      <div className="container-x py-14 lg:py-20"><JournalList articles={articles} /></div>
    </>
  );
}
