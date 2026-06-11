import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  sachets: number
  priceFcfa: string
  priceUsd: string
  description: string
  image?: string
  popular?: boolean
}

export default function ProductCard({
  id,
  name,
  sachets,
  priceFcfa,
  priceUsd,
  description,
  image,
  popular = false,
}: ProductCardProps) {
  const [loading, setLoading] = useState(false)
  const [imgError, setImgError] = useState(false)

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
    <div
      className={`relative bg-white rounded-2xl overflow-hidden border transition hover:shadow-xl ${
        popular ? 'border-amber-400 shadow-lg' : 'border-stone-200 shadow-sm'
      }`}
    >
      {popular && (
        <span className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-semibold">
          Populaire
        </span>
      )}

      {/* Image / fallback */}
      <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-5xl">🍲</span>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-stone-900 mb-1">{name}</h2>
        <p className="text-stone-500 text-sm mb-4">{description}</p>

        <div className="mb-5 space-y-1">
          <p className="inline-block px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-medium">
            {sachets} sachets
          </p>
          <p className="text-3xl font-bold text-stone-900 pt-2">{priceFcfa}</p>
          <p className="text-xs text-stone-400">≈ {priceUsd} facturé en USD</p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-green-700 text-white font-medium py-2.5 rounded-xl hover:bg-green-800 transition disabled:bg-stone-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirection…' : 'Commander'}
        </button>
      </div>
    </div>
  )
}
