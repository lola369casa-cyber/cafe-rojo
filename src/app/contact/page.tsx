import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about Café Rojo coffee, an order, wholesale or subscriptions? Get in touch.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="We’d Love to Hear From You" image="/images/finca.jpg" alt="A finca in the Colombian mountains" />
      <div className="container-x grid gap-14 py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:py-24">
        <div>
          <h2 className="h2">Get in Touch</h2>
          <div className="gold-rule my-7" />
          <p className="lede">Questions about our coffee, an order, a subscription or wholesale? Send us a note and we’ll reply as soon as we can.</p>
          <dl className="mt-9 space-y-5">
            <div><dt className="eyebrow">Orders &amp; Subscriptions</dt><dd className="mt-1">Manage them anytime from your account.</dd></div>
            <div><dt className="eyebrow">Wholesale</dt><dd className="mt-1">Cafés, restaurants and retailers — tell us about your business.</dd></div>
          </dl>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
