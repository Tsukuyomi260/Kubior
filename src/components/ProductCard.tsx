import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  sachets: number
  priceFcfa: string
  priceUsd: string
  description: string
}

export default function ProductCard({
  id,
  name,
  sachets,
  priceFcfa,
  priceUsd,
  description,
}: ProductCardProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack: id }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur: ' + (data.error || 'Impossible de créer la session'))
      }
    } catch (error) {
      alert('Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{name}</h2>
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        <div className="mb-4 space-y-1">
          <p className="text-sm text-gray-600">{sachets} sachets</p>
          <p className="text-2xl font-bold text-gray-900">{priceFcfa}</p>
          <p className="text-xs text-gray-500">(≈ {priceUsd})</p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Chargement...' : 'Commander'}
        </button>
      </div>
    </div>
  )
}
