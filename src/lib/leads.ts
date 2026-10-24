import "server-only";

// Sends a lead to the n8n "Café Rojo — Website Leads" workflow, which writes it to the
// Google Sheet (and, for call requests, places the coffee guide call once a caller number is set).
// Server-side only: the shared key never reaches the browser.

export type LeadType = "newsletter" | "contact" | "call_request";
export type LeadResult = { status: "saved" | "callback_requested" | "calling" | "call_failed"; lead_id?: string };

export const hasLeadSheet = Boolean(process.env.N8N_LEADS_WEBHOOK_URL && process.env.N8N_LEADS_KEY);

export async function sendLead(lead: {
  type: LeadType;
  source: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  product_viewed?: string;
  cart?: string;
  consent?: boolean;
  dynamic_variables?: Record<string, string>;
}): Promise<LeadResult> {
  const res = await fetch(process.env.N8N_LEADS_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.N8N_LEADS_KEY! },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(15000),
  });
  const data = (await res.json().catch(() => ({}))) as Partial<LeadResult>;
  // A refused call still saved the lead; the caller decides what to tell the visitor.
  if (res.status === 502 && data.status === "call_failed") return { status: "call_failed", lead_id: data.lead_id };
  if (!res.ok || !data.status) throw new Error(`Lead sheet responded ${res.status}`);
  return data as LeadResult;
}
