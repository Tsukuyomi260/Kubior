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

    fetch(`/api/order?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setOrder(data)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/" className="text-blue-600 hover:underline">
            Retour à l'accueil
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded-lg p-8 max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-600"
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
          <h1 className="text-2xl font-bold text-gray-900">Merci pour votre commande!</h1>
        </div>

        {order && (
          <div className="bg-gray-50 rounded p-4 mb-6 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Numéro de commande:</span> {order.id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Pack:</span> {order.pack_name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Quantité:</span> {order.quantity} sachets
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Montant:</span> ${(order.amount_total / 100).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Email:</span> {order.customer_email}
            </p>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-6 text-center">
          Un email de confirmation vous a été envoyé.
        </p>

        <a
          href="/"
          className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  )
}
