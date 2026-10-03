import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/site";
import { serverClient } from "@/lib/supabase";

// Completes Google sign-in, email confirmation and password-reset links.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  if (hasSupabase && code) {
    const supabase = await serverClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(dest, url.origin));
  }
  return NextResponse.redirect(new URL("/account?notice=auth-error", url.origin));
}
