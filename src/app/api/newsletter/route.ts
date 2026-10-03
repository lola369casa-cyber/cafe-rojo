import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabase } from "@/lib/site";
import { adminClient } from "@/lib/supabase";

const schema = z.object({ email: z.email(), source: z.string().max(40).optional() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!hasSupabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Email sign-up isn’t connected yet. Please check back soon." }, { status: 503 });
  }
  const { error } = await adminClient()
    .from("newsletter_subscribers")
    .upsert({ email: parsed.data.email.toLowerCase(), source: parsed.data.source ?? "site" }, { onConflict: "email" });
  if (error) {
    console.error("[newsletter]", error);
    return NextResponse.json({ error: "We couldn’t save your email. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ message: "Thank you — welcome to the Café Rojo community." });
}
