"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserClient, supabaseReady } from "@/lib/supabase-browser";

type Mode = "login" | "register" | "forgot" | "update";

export function AuthForm({ initial = "login" }: { initial?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabaseReady) return;
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const supabase = browserClient();
    const origin = window.location.origin;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) throw error;
        router.refresh();
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: f.email,
          password: f.password,
          options: { data: { first_name: f.firstName, last_name: f.lastName }, emailRedirectTo: `${origin}/auth/callback` },
        });
        if (error) throw error;
        if (data.session) router.refresh();
        else setInfo("Check your email to confirm your account.");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(f.email, { redirectTo: `${origin}/auth/callback?next=/account/reset` });
        if (error) throw error;
        setInfo("If an account exists for that email, a reset link is on its way.");
      } else {
        const { error } = await supabase.auth.updateUser({ password: f.password });
        if (error) throw error;
        router.push("/account");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    if (!supabaseReady) return;
    await browserClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
  }

  const titles: Record<Mode, string> = { login: "Welcome Back", register: "Create Your Account", forgot: "Reset Your Password", update: "Choose a New Password" };
  const cta: Record<Mode, string> = { login: "Log In", register: "Create Account", forgot: "Send Reset Link", update: "Update Password" };

  return (
    <div className="mx-auto max-w-md border border-sand bg-white p-7 sm:p-10">
      <h1 className="display text-center text-[2.6rem]">{titles[mode]}</h1>
      <div className="gold-rule mx-auto my-6" />
      {!supabaseReady && (
        <p className="mb-6 border border-dashed border-burgundy/50 p-3 text-sm text-burgundy">
          Customer accounts switch on once the database is connected (see README). The form below is a preview.
        </p>
      )}
      <form onSubmit={submit} className="grid gap-4">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label" htmlFor="firstName">First Name</label><input id="firstName" name="firstName" required autoComplete="given-name" className="field" /></div>
            <div><label className="label" htmlFor="lastName">Last Name</label><input id="lastName" name="lastName" required autoComplete="family-name" className="field" /></div>
          </div>
        )}
        {mode !== "update" && (
          <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" className="field" /></div>
        )}
        {mode !== "forgot" && (
          <div>
            <label className="label" htmlFor="password">{mode === "update" ? "New Password" : "Password"}</label>
            <input id="password" name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} className="field" />
          </div>
        )}
        {error && <p role="alert" className="text-sm text-burgundy">{error}</p>}
        {info && <p role="status" className="text-sm text-forest">{info}</p>}
        <button className="btn btn-primary" disabled={busy || !supabaseReady}>{busy ? "Please wait…" : cta[mode]}</button>
      </form>

      {(mode === "login" || mode === "register") && (
        <>
          <div className="my-6 flex items-center gap-4 text-xs tracking-[0.2em] text-muted uppercase"><span className="h-px flex-1 bg-sand" />or<span className="h-px flex-1 bg-sand" /></div>
          <button className="btn btn-outline w-full" onClick={google} disabled={!supabaseReady}>Continue with Google</button>
        </>
      )}

      <div className="mt-7 flex flex-col items-center gap-2 text-sm">
        {mode === "login" && (<>
          <button className="underline-offset-4 hover:text-burgundy hover:underline" onClick={() => setMode("forgot")}>Forgot your password?</button>
          <button className="underline-offset-4 hover:text-burgundy hover:underline" onClick={() => setMode("register")}>New here? Create an account</button>
        </>)}
        {(mode === "register" || mode === "forgot") && (
          <button className="underline-offset-4 hover:text-burgundy hover:underline" onClick={() => setMode("login")}>Already have an account? Log in</button>
        )}
      </div>
    </div>
  );
}
