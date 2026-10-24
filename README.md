# Café Rojo

Premium Colombian coffee — e-commerce site.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (PostgreSQL + auth) · Stripe · Resend.

```bash
npm install
npm run dev
```

The site runs with no keys at all: the shop uses the built-in starter catalog, the cart works,
and `/admin` opens in a read-only preview on sample data. Checkout, accounts, email sign-up and
the contact form each say plainly that they are not connected yet. Add keys to switch them on.

## Going live

Copy `.env.example` to `.env.local` and fill it in.

1. **Database (Supabase)** — create a project, run `supabase/schema.sql` in the SQL editor, and add
   the URL, anon key and service-role key. Put your email in `ADMIN_EMAILS`, create an account at
   `/account`, then open `/admin/products` and choose **Load Starter Catalog**.
2. **Google login (optional)** — enable the Google provider in Supabase → Authentication, and add
   `<site>/auth/callback` to the allowed redirect URLs.
3. **Payments (Stripe)** — add `STRIPE_SECRET_KEY` (test key first). Create a webhook pointing to
   `<site>/api/stripe/webhook` for `checkout.session.completed`, `invoice.paid`,
   `customer.subscription.updated` and `customer.subscription.deleted`, and add its signing secret.
   Enable the Customer Portal in Stripe so customers can manage subscriptions and cards. Apple Pay
   and Google Pay appear automatically on Stripe's payment page. For sales tax, enable Stripe Tax and
   set `STRIPE_AUTOMATIC_TAX=true`.
4. **Email (Resend)** — add `RESEND_API_KEY`, a verified `EMAIL_FROM`, and `CONTACT_TO`. Password-reset
   and confirmation emails are sent by Supabase Auth (customise them in Supabase → Auth → Templates).
5. **Voice guide (Retell)** — the checkout page offers a call from an AI coffee guide. Add `RETELL_API_KEY`
   and `RETELL_FROM_NUMBER`, create the agent from `retell/agent-prompt.md`, and bind it to that number for
   outbound calls (or set `RETELL_AGENT_ID`).
6. **Deploy** — set the same variables on the host and set `NEXT_PUBLIC_SITE_URL` to the live URL.

Card details never touch this app: payment happens on Stripe's hosted page.

## Lead capture (Google Sheets)

Newsletter sign-ups, contact messages and "call me" requests are logged to the Google Sheet
**Café Rojo — Website Leads** through the n8n workflow **Café Rojo — Website Leads** (`eTQoqO5kvyfUcywF`).
The site calls it server-side with `N8N_LEADS_WEBHOOK_URL` and `N8N_LEADS_KEY`; requests without the key
get a 401 and nothing is written. Every lead is written before anything else happens.

- **Call requests:** the workflow places the coffee guide call itself, using the Retell connection in n8n.
  Until a caller number is set in the workflow's **Check Key** node (`CALLER`), call requests are saved with
  Follow-up Status "Call back" and the visitor is told a person will call them back.
- **After a call:** Retell posts its analysis to `/webhook/cafe-rojo-call-callback`, which fills Call Status,
  Duration, Sentiment, Summary, Call Script (transcript) and Recording URL onto the same row by Call ID.
- **Columns:** the Sheets nodes carry fixed column lists. Renaming or adding a header means updating the
  matching nodes in n8n too, or the node fails with "Missing columns".

## Before launch — placeholders to replace

- **Prices** other than Dark Roast 12 oz ($24.99), the **$50 free-shipping threshold**, the
  **$6.95 flat rate**, the **10% subscriber saving** — `src/lib/catalog.ts`, `src/lib/site.ts`.
- **Mountain Reserve and Decaf** roast levels, tasting notes and descriptions — confirm or edit.
- **Process / variety / altitude / region** are blank for every coffee and hidden until filled in
  (Admin → Products). Add them only once verified for the lot.
- **Reviews** on the home page are marked sample content — `src/lib/sample.ts`.
- **Social links** — `src/lib/site.ts`. **Policies** (shipping, returns, privacy, terms) are draft templates.
- **Product photos** — until uploaded in Admin → Products, products show the label on an illustrated bag.

## Images

`reference/` holds the original label and the cleaned sources. The hero is the label artwork with the
two subtitle lines removed; the wide desktop version was extended left and right with Adobe generative
expand. Story photography is stills from the "From Seed to Soul" film clips.
