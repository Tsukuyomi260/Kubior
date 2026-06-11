import { useEffect, useState } from 'react'

interface OrderDetails {
  id: string
  pack_name: string
  quantity: number
  amount_total: number
  customer_email: string
  created_at: string
}

export default function Success() {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')

    if (!sessionId) {
      setError('Session ID not found')
      setLoading(false)
      return
    }

    let cancelled = false

    // The webhook may take a moment to insert the order after redirect.
    // Retry a few times before giving up.
    const fetchOrder = async (attempt = 0): Promise<void> => {
      const maxAttempts = 6
      try {
        const res = await fetch(`/api/order?session_id=${sessionId}`)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) {
            setOrder(data)
            setLoading(false)
          }
          return
        }
        if (res.status === 404 && attempt < maxAttempts) {
          setTimeout(() => fetchOrder(attempt + 1), 1500)
          return
        }
        if (!cancelled) {
          setError('Order not found')
          setLoading(false)
        }
      } catch (err) {
        if (attempt < maxAttempts) {
          setTimeout(() => fetchOrder(attempt + 1), 1500)
          return
        }
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error')
          setLoading(false)
        }
      }
    }

    fetchOrder()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Chargement de votre commande…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/" className="text-green-700 hover:underline">
            Retour à l'accueil
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border border-stone-200">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-green-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Merci pour votre commande !</h1>
        </div>

        {order && (
          <div className="bg-stone-50 rounded-xl p-4 mb-6 space-y-2 border border-stone-100">
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-stone-800">Numéro de commande :</span> {order.id}
            </p>
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-stone-800">Pack :</span> {order.pack_name}
            </p>
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-stone-800">Quantité :</span> {order.quantity} sachets
            </p>
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-stone-800">Montant :</span> ${(order.amount_total / 100).toFixed(2)}
            </p>
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-stone-800">Email :</span> {order.customer_email}
            </p>
          </div>
        )}

        <p className="text-stone-500 text-sm mb-6 text-center">
          Un email de confirmation vous a été envoyé.
        </p>

        <a
          href="/"
          className="block w-full text-center bg-green-700 text-white font-medium py-2.5 rounded-xl hover:bg-green-800 transition"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  )
}
