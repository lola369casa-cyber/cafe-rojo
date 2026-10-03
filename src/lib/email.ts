import "server-only";
import { Resend } from "resend";
import { money, site } from "./site";

type Line = { name: string; qty: number; totalCents: number };

function shell(title: string, body: string) {
  return `<div style="background:#f7f1e5;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:#2a1f1a">
  <div style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid #e4d9c4;padding:36px">
    <p style="font-family:Georgia,serif;font-size:28px;color:#6e1423;margin:0 0 4px">Café Rojo</p>
    <p style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#b8935a;margin:0 0 28px">${site.tagline}</p>
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:0 0 16px">${title}</h1>
    ${body}
    <p style="font-size:12px;color:#7a6a5d;margin:32px 0 0;border-top:1px solid #e4d9c4;padding-top:16px">© ${new Date().getFullYear()} Café Rojo. All Rights Reserved.</p>
  </div></div>`;
}

function lines(items: Line[]) {
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">${items
    .map((i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee3d0">${esc(i.name)} × ${i.qty}</td><td style="padding:8px 0;border-bottom:1px solid #eee3d0;text-align:right">${money(i.totalCents)}</td></tr>`)
    .join("")}</table>`;
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function send(to: string, subject: string, html: string, replyTo?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${subject}" to ${to}`);
    return { skipped: true };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Café Rojo <onboarding@resend.dev>",
    to,
    subject,
    html,
    replyTo,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
  return { skipped: false };
}

export const emails = {
  orderConfirmation: (to: string, o: { number: string; items: Line[]; totalCents: number }) =>
    send(to, `Your Café Rojo order ${o.number}`, shell("Thank you for your order", `<p>Order <strong>${o.number}</strong> is confirmed. We'll email you again when it ships.</p>${lines(o.items)}<p style="text-align:right;font-size:16px"><strong>Total ${money(o.totalCents)}</strong></p>`)),
  shippingConfirmation: (to: string, o: { number: string; tracking?: string | null; carrier?: string | null }) =>
    send(to, `Your Café Rojo order ${o.number} has shipped`, shell("Your coffee is on its way", `<p>Order <strong>${o.number}</strong> has shipped.</p>${o.tracking ? `<p>${esc(o.carrier ?? "Tracking")}: <strong>${esc(o.tracking)}</strong></p>` : ""}`)),
  subscriptionConfirmation: (to: string, s: { items: Line[]; weeks: number }) =>
    send(to, "Your Café Rojo subscription is active", shell("Your subscription is active", `<p>Fresh coffee will arrive every <strong>${s.weeks} weeks</strong>. Change, pause or cancel anytime from your account.</p>${lines(s.items)}`)),
  subscriptionRenewal: (to: string, s: { totalCents: number }) =>
    send(to, "Your Café Rojo subscription has renewed", shell("Your next delivery is being prepared", `<p>We've charged <strong>${money(s.totalCents)}</strong> for your subscription renewal. Your coffee ships shortly.</p>`)),
  contact: (m: { name: string; email: string; message: string }) =>
    send(process.env.CONTACT_TO ?? "", `Contact form: ${m.name}`, shell("New contact message", `<p><strong>${esc(m.name)}</strong> (${esc(m.email)})</p><p style="white-space:pre-wrap">${esc(m.message)}</p>`), m.email),
};
