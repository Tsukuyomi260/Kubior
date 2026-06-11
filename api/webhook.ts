import { VercelRequest, VercelResponse } from '@vercel/node'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PACK_INFO: Record<string, number> = {
  decouverte: 5,
  famille: 15,
  mois: 30,
}

// Stripe signature verification needs the raw request body.
// Disable Vercel's automatic body parsing for this route.
export const config = {
  api: {
    bodyParser: false,
  },
}

async function readRawBody(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature'] as string

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe signature' })
  }

  let event: Stripe.Event

  try {
    const rawBody = await readRawBody(req)
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('[webhook] Signature verification failed:', error)
    return res.status(401).json({ error: 'Invalid signature' })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const pack = session.metadata?.pack || 'unknown'
      const quantity = PACK_INFO[pack] || 0

      const { error } = await supabase.from('orders').insert({
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email || '',
        pack_name: pack,
        quantity,
        amount_total: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'paid',
        shipping_name: session.shipping_details?.name || null,
        shipping_city: session.shipping_details?.address?.city || null,
      })

      if (error) {
        console.error('[webhook] Supabase insert error:', error)
        return res.status(500).json({ error: 'Failed to save order' })
      }

      res.json({ received: true })
    } catch (error) {
      console.error('[webhook] Processing error:', error)
      return res.status(500).json({ error: 'Processing failed' })
    }
  } else {
    res.json({ received: true })
  }
}
