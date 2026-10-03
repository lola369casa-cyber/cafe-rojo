import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center lg:py-40">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-6xl">This page has wandered off the trail</h1>
      <div className="gold-rule mx-auto my-8" />
      <p className="lede">Let’s get you back to the coffee.</p>
      <div className="mt-9 flex justify-center gap-4">
        <Link href="/shop" className="btn btn-primary">Shop Coffee</Link>
        <Link href="/" className="btn btn-outline">Home</Link>
      </div>
    </div>
  );
}
