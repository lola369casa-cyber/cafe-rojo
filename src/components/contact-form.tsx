"use client";

import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("done");
      setMessage(data.message);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") return <p role="status" className="border border-sand bg-cream p-8 font-serif text-2xl italic">{message}</p>;

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="label" htmlFor="c-name">Name</label><input id="c-name" name="name" required autoComplete="name" className="field" /></div>
        <div><label className="label" htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" required autoComplete="email" className="field" /></div>
      </div>
      <div><label className="label" htmlFor="c-message">Message</label><textarea id="c-message" name="message" required rows={6} className="field" /></div>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state === "error" && <p role="alert" className="text-sm text-burgundy">{message}</p>}
      <button className="btn btn-primary sm:w-fit" disabled={state === "busy"}>{state === "busy" ? "Sending…" : "Send Message"}</button>
    </form>
  );
}
