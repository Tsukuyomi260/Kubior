# Kubi'or Mini-Shop

A small, production-style storefront that sells three packs of **Kubi'or** natural bouillon through **Stripe Checkout**. Built as a focused demo of a secure Stripe + webhook + database flow.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)

**Live demo:** https://kubior.vercel.app
**Walkthrough (90s):** https://www.loom.com/share/16e82e2649f8446faee09dab36e45dca

🇫🇷 Version française : [README.fr.md](README.fr.md)

![Kubi'or storefront](docs/screenshot.png)

---

**Contents:** [What it does](#what-it-does) · [How it works](#how-it-works) · [Tech stack](#tech-stack) · [Local setup](#local-setup) · [Stripe](#configure-stripe) · [Supabase](#configure-supabase) · [Env vars](#environment-variables) · [Deploy](#deploy-to-vercel) · [Testing](#testing) · [Security](#security-notes)

---

## What it does

- One product page with three packs (Découverte, Famille, Mois)
- Stripe Checkout (hosted) for payment
- A Stripe webhook that **verifies the signature** and persists each paid order to Supabase
- Success page that looks up the order by `session_id`
- Cancel page for abandoned checkouts

No user accounts, no cart, no inventory — by design. The point is a clean, secure payment pipeline.

---

## How it works

```
Visitor → /                         (product page, 3 packs)
   │  click "Commander"
   ▼
POST /api/create-checkout-session   (creates Stripe Checkout Session)
   │  redirect
   ▼
Stripe Checkout (hosted)            (visitor pays with card)
   │
   ├─ redirect → /success?session_id=…  → GET /api/order → shows order
   │
   └─ event  → POST /api/webhook    (verify signature → INSERT into Supabase)
```

The browser never writes to the database. The **only** thing that creates an order is the signature-verified webhook.

---

## Tech stack

| Layer    | Choice                                  |
| -------- | --------------------------------------- |
| Frontend | React 18 + Vite + TypeScript + Tailwind |
| Payments | Stripe Checkout + Stripe Webhooks       |
| Database | Supabase (PostgreSQL)                    |
| Backend  | Vercel Functions (Node)                 |
| Hosting  | Vercel                                  |
| Motion   | framer-motion                           |

---

## Project structure

```
kubior/
├── api/
│   ├── create-checkout-session.ts   POST – creates a Checkout Session
│   ├── webhook.ts                   POST – verifies signature, saves order
│   └── order.ts                     GET  – fetches an order by session_id
├── src/
│   ├── components/  Header, ProductCard, Reveal
│   ├── pages/       Home, Success, Cancel
│   └── App.tsx      path-based routing
└── vercel.json      SPA rewrite (non-/api routes → index.html)
```

---

## Local setup

```bash
git clone https://github.com/Tsukuyomi260/Kubior.git
cd kubior
npm install
cp .env.example .env.local   # then fill it in (see below)
npm run dev                  # http://localhost:5173
```

> `npm run dev` runs the **frontend only**. The `/api/*` functions are Vercel serverless functions and do not run under Vite. To run them locally, use `vercel dev`. The simplest way to test the full payment flow is the deployed site.

---

## Configure Stripe

1. Create a Stripe account and stay in **test mode**.
2. Create three products, each with a one-time price:
   - Découverte — $4.50
   - Famille — $11.50
   - Mois — $21.50
3. For each product, copy the **price ID** (`price_…`, **not** the product `prod_…`) into the matching env var.
4. **Developers → Webhooks → Add endpoint:**
   - URL: `https://YOUR-APP.vercel.app/api/webhook`
   - Event: `checkout.session.completed`
   - Copy the **signing secret** (`whsec_…`) into `STRIPE_WEBHOOK_SECRET`.

## Configure Supabase

1. Create a Supabase project.
2. In the SQL editor, create the `orders` table:

```sql
create table orders (
  id                uuid primary key default uuid_generate_v4(),
  created_at        timestamptz default now(),
  stripe_session_id text unique not null,
  customer_email    text not null,
  pack_name         text not null,
  quantity          int  not null,
  amount_total      int  not null,
  currency          text default 'usd',
  status            text default 'paid',
  shipping_name     text,
  shipping_city     text
);

alter table orders enable row level security;
-- No anon policies: the browser cannot read or write.
-- All writes go through the webhook using the service-role key.
```

3. From **Settings → API**, copy the Project URL, the `anon` key, and the `service_role` key.

---

## Environment variables

| Variable                    | Where        | Notes                                 |
| --------------------------- | ------------ | ------------------------------------- |
| `STRIPE_SECRET_KEY`         | server       | `sk_test_…`                           |
| `STRIPE_WEBHOOK_SECRET`     | server       | `whsec_…`                             |
| `STRIPE_PRICE_DECOUVERTE`   | server       | `price_…`                             |
| `STRIPE_PRICE_FAMILLE`      | server       | `price_…`                             |
| `STRIPE_PRICE_MOIS`         | server       | `price_…`                             |
| `SUPABASE_URL`              | server       | project URL                           |
| `SUPABASE_SERVICE_ROLE_KEY` | server only  | **never** exposed to the client       |
| `VITE_SUPABASE_URL`         | client       | public                                |
| `VITE_SUPABASE_ANON_KEY`    | client       | public anon key                       |
| `VITE_SITE_URL`             | both         | base URL for success/cancel redirects |

Add all of these in **Vercel → Project → Settings → Environment Variables**, then redeploy.

---

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add the environment variables above.
4. Deploy — Vercel auto-detects Vite and builds the `api/` functions.
5. Set the Stripe webhook endpoint to `https://YOUR-APP.vercel.app/api/webhook`.

---

## Testing

Use a Stripe test card:

```
4242 4242 4242 4242   any future expiry   any CVC
```

Full flow: pick a pack → pay → land on `/success` with the order details → confirm a new row in the Supabase `orders` table.

**Signature check:** a `POST` to `/api/webhook` without a valid `stripe-signature` header returns **401**.

---

## Security notes

- **Webhook signature** is always verified with `stripe.webhooks.constructEvent` against the raw request body (Vercel body parsing is disabled for that route).
- **Service-role key** is used only inside Vercel Functions, never shipped to the browser.
- **No client writes:** the front end never inserts into Supabase; only the webhook does.
- **Idempotency:** `stripe_session_id` is `UNIQUE`. A replayed event hits the unique constraint and returns `200` instead of creating a duplicate.
- **Logs** contain error messages only — never the email, shipping address, or full Stripe objects.

---

## Currency note

Prices are shown in **FCFA** for the Beninese market, but Stripe Checkout does not support **XOF**, so payments are charged in **USD**. The card amount equals the USD value shown in parentheses next to each pack.

---

## Out of scope (intentionally)

Auth, dynamic cart, shipping calculation, inventory, multi-language UI, admin dashboard, subscriptions, custom transactional email (Stripe already sends the receipt).
