"use client";

import { Phone } from "lucide-react";
import { useState } from "react";
import { useCart } from "./cart";

/**
 * "Have a question before you order?" — asks the Café Rojo voice guide to phone the customer.
 * Deliberately not a <form>: it sits inside the checkout form and must not submit or block it.
 */
export function CallRequest({ viewing, source = "checkout" }: { viewing?: string; source?: "checkout" | "product" }) {
  const { items } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  // Start from what the customer already typed into the checkout form.
  const prefill = () => {
    const value = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value ?? "";
    if (!name) setName(value("firstName"));
    if (!phone) setPhone(value("phone"));
  };

  async function request() {
    if (!name.trim() || !phone.trim() || !consent) {
      setState("error");
      setMessage("Please enter your name and phone number, and tick the box to agree to the call.");
      return;
    }
    setState("busy");
    try {
      const res = await fetch("/api/voice-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, consent, viewing, source, items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "We couldn’t place the call.");
      setState("done");
      setMessage(data.message);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "We couldn’t place the call.");
    }
  }

  return (
    <section aria-labelledby="call-title" className="mt-6 border border-sand bg-cream p-6 sm:p-8" onFocus={prefill}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold text-burgundy"><Phone size={18} strokeWidth={1.5} aria-hidden /></span>
        <div>
          <h2 id="call-title" className="font-serif text-[1.7rem] leading-tight">Questions before you order?</h2>
          <p className="mt-1.5 text-[0.95rem] text-muted">
            Our coffee guide will call you right now to talk through the coffee, how it’s grown and roasted, pricing and shipping.
          </p>
        </div>
      </div>

      {state === "done" ? (
        <p role="status" className="mt-5 border border-forest/30 bg-paper p-4 font-serif text-xl text-forest italic">{message}</p>
      ) : (
        <div className="mt-5 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="call-name">Your name</label>
              <input id="call-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className="field" />
            </div>
            <div>
              <label className="label" htmlFor="call-phone">Phone number</label>
              <input id="call-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="(555) 555-5555" className="field" />
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#6e1423]" />
            <span>I agree to receive one call at this number from Café Rojo’s automated AI voice assistant about my questions. The call may be recorded.</span>
          </label>
          {state === "error" && <p role="alert" className="text-sm text-burgundy">{message}</p>}
          <button type="button" className="btn btn-forest" onClick={request} disabled={state === "busy"}>
            {state === "busy" ? "Placing your call…" : "Call Me Now"}
          </button>
        </div>
      )}
    </section>
  );
}
