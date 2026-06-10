import { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PACK_PRICES: Record<string, string> = {
  decouverte: process.env.STRIPE_PRICE_DECOUVERTE!,
  famille: process.env.STRIPE_PRICE_FAMILLE!,
  mois: process.env.STRIPE_PRICE_MOIS!,
}

const PACK_QUANTITIES: Record<string, number> = {
  decouverte: 5,
  famille: 15,
  mois: 30,
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { pack } = req.body

  if (!pack || !PACK_PRICES[pack]) {
    return res.status(400).json({ error: 'Invalid pack' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PACK_PRICES[pack],
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VITE_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_SITE_URL}/cancel`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['BJ'], // Benin
      },
      metadata: {
        pack,
        quantity: PACK_QUANTITIES[pack],
      },
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('[create-checkout-session]', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}
