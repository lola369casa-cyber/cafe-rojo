import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabase } from "@/lib/site";
import { hasLeadSheet, sendLead } from "@/lib/leads";
import { adminClient } from "@/lib/supabase";

const schema = z.object({ email: z.email(), source: z.string().max(40).optional() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  const source = parsed.data.source ?? "site";
  const canStore = hasSupabase && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!canStore && !hasLeadSheet) {
    return NextResponse.json({ error: "Email sign-up isn’t connected yet. Please check back soon." }, { status: 503 });
  }
  // Saved to every destination that is connected; succeeds if at least one took it.
  let saved = false;
  if (canStore) {
    const { error } = await adminClient().from("newsletter_subscribers").upsert({ email, source }, { onConflict: "email" });
    if (error) console.error("[newsletter] database", error);
    else saved = true;
  }
  if (hasLeadSheet) {
    try {
      await sendLead({ type: "newsletter", source: `newsletter · ${source}`, email });
      saved = true;
    } catch (e) {
      console.error("[newsletter] lead sheet", e);
    }
  }
  if (!saved) return NextResponse.json({ error: "We couldn’t save your email. Please try again." }, { status: 500 });
  return NextResponse.json({ message: "Thank you — welcome to the Café Rojo community." });
}
