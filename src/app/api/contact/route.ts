import { NextResponse } from "next/server";
import { z } from "zod";
import { emails } from "@/lib/email";
import { hasResend, hasSupabase } from "@/lib/site";
import { adminClient } from "@/lib/supabase";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email(),
  message: z.string().trim().min(1).max(5000),
  company: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete every field with a valid email." }, { status: 400 });
  const { company, ...msg } = parsed.data;
  const ok = { message: "Thank you — your message is on its way to us." };
  if (company) return NextResponse.json(ok);

  const canStore = hasSupabase && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const canEmail = hasResend && !!process.env.CONTACT_TO;
  if (!canStore && !canEmail) {
    return NextResponse.json({ error: "The contact form isn’t connected yet. Please check back soon." }, { status: 503 });
  }
  try {
    if (canStore) {
      const { error } = await adminClient().from("contact_messages").insert(msg);
      if (error) throw error;
    }
    if (canEmail) await emails.contact(msg);
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json({ error: "We couldn’t send your message. Please try again." }, { status: 500 });
  }
  return NextResponse.json(ok);
}
