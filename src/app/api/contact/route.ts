import { NextResponse } from "next/server";
import { z } from "zod";
import { emails } from "@/lib/email";
import { hasResend, hasSupabase } from "@/lib/site";
import { hasLeadSheet, sendLead } from "@/lib/leads";
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
  if (!canStore && !canEmail && !hasLeadSheet) {
    return NextResponse.json({ error: "The contact form isn’t connected yet. Please check back soon." }, { status: 503 });
  }
  // Delivered to every destination that is connected; succeeds if at least one took it.
  const results = await Promise.allSettled([
    canStore ? adminClient().from("contact_messages").insert(msg).then(({ error }) => { if (error) throw error; }) : Promise.reject("skip"),
    canEmail ? emails.contact(msg) : Promise.reject("skip"),
    hasLeadSheet ? sendLead({ type: "contact", source: "contact page", ...msg }) : Promise.reject("skip"),
  ]);
  results.forEach((r) => r.status === "rejected" && r.reason !== "skip" && console.error("[contact]", r.reason));
  if (!results.some((r) => r.status === "fulfilled")) {
    return NextResponse.json({ error: "We couldn’t send your message. Please try again." }, { status: 500 });
  }
  return NextResponse.json(ok);
}
