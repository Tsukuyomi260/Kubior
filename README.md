# Kubi'or Mini-Shop

A production-ready e-commerce site for selling Kubi'or natural bouillon packs via Stripe Checkout.

## Features

- 3 product packs (Découverte, Famille, Mois)
- Stripe Checkout integration
- Webhook signature verification
- Supabase order persistence
- Success/cancel pages
- Mobile-responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Vercel Functions (Node.js)
- **Payment**: Stripe Checkout
- **Database**: Supabase (PostgreSQL)

## Setup

### 1. Clone & Install

\`\`\`bash
git clone <repo-url>
cd kubior
npm install
\`\`\`

### 2. Configure Stripe

1. Create a Stripe account (test mode)
2. Create 3 products with prices:
   - Découverte: $4.50 (5 sachets)
   - Famille: $11.50 (15 sachets)
   - Mois: $21.50 (30 sachets)
3. Copy `.env.example` to `.env.local`
4. Add keys:
   - \`STRIPE_SECRET_KEY\` (sk_test_...)
   - \`STRIPE_WEBHOOK_SECRET\` (whsec_...)
   - \`STRIPE_PRICE_DECOUVERTE\`, \`STRIPE_PRICE_FAMILLE\`, \`STRIPE_PRICE_MOIS\` (price_...)

### 3. Configure Supabase

1. Create a Supabase project
2. Run SQL to create orders table:

\`\`\`sql
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  stripe_session_id text UNIQUE NOT NULL,
  customer_email text NOT NULL,
  pack_name text NOT NULL,
  quantity int NOT NULL,
  amount_total int NOT NULL,
  currency text DEFAULT 'usd',
  status text DEFAULT 'paid',
  shipping_name text,
  shipping_city text
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
\`\`\`

3. Add to `.env.local`:
   - \`SUPABASE_URL\` (https://...supabase.co)
   - \`SUPABASE_SERVICE_ROLE_KEY\` (service role key)
   - \`VITE_SUPABASE_URL\` (same as SUPABASE_URL)
   - \`VITE_SUPABASE_ANON_KEY\` (anon key)

### 4. Local Development

\`\`\`bash
npm run dev
\`\`\`

Test webhooks with Stripe CLI:

\`\`\`bash
stripe listen --forward-to localhost:3000/api/webhook
\`\`\`

### 5. Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables (all from .env.local)
4. Deploy

## Flow

1. User selects pack → POST /api/create-checkout-session
2. Stripe Checkout Session created, user redirected to Stripe
3. User pays → Stripe sends checkout.session.completed webhook
4. Webhook verifies signature → INSERT order into Supabase
5. User redirected to /success?session_id=xxx
6. Page fetches order details from GET /api/order?session_id=xxx
7. Order confirmed displayed

## Security Notes

- **Stripe Signature**: All webhooks verify \`stripe-signature\` header with constructEvent
- **Service Role**: Only used in Vercel Functions, never exposed to client
- **Idempotency**: \`stripe_session_id\` UNIQUE prevents duplicate orders
- **No Direct Writes**: Frontend cannot write to Supabase; all writes via webhook

## Price Notes

- **Display**: FCFA (Beninese market)
- **Processing**: USD (Stripe limitation, XOF not supported)
- Conversion shown as approximation only

## Hors-scope

- User authentication
- Dynamic cart
- Shipping calculation
- Multi-language UI
- Inventory management
- Admin dashboard
- Subscription mode
- Custom email templates

## Resources

- [Stripe Checkout](https://docs.stripe.com/payments/checkout)
- [Stripe Webhooks](https://docs.stripe.com/webhooks#verify-events)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Supabase + Vercel](https://supabase.com/docs/guides/integrations/vercel)
