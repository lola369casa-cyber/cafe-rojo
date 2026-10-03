"use client";

import { useState } from "react";

export function Newsletter({ dark = false, button = "Join the Community", source = "site" }: { dark?: boolean; button?: string; source?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("done");
      setMessage(data.message ?? "Thank you — you’re on the list.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") return <p className={`font-serif text-xl italic ${dark ? "text-cream" : "text-forest"}`} role="status">{message}</p>;

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          aria-label="Email address"
          className={dark ? "w-full border border-cream/30 bg-transparent px-4 py-3 text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none" : "field"}
        />
        <button className={`btn shrink-0 ${dark ? "btn-gold" : "btn-primary"}`} disabled={state === "busy"}>
          {state === "busy" ? "Joining…" : button}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-sm text-red-300" role="alert">{message}</p>}
    </form>
  );
}
