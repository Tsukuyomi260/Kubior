import { useState } from 'react'
import { motion } from 'framer-motion'

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

// Warm-toned morphing blob behind the product image. Squishes on card hover.
function WarmBlob() {
  return (
    <motion.svg
      width="320"
      height="240"
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      variants={{ hover: { scale: 1.3 } }}
      transition={{ duration: 1, ease: 'backInOut' }}
      className="absolute inset-0 z-0 h-full w-full"
    >
      <motion.circle
        variants={{ hover: { scaleY: 0.6, y: -16 } }}
        transition={{ duration: 1, ease: 'backInOut', delay: 0.2 }}
        cx="160"
        cy="80"
        r="70"
        className="fill-amber-300/60"
      />
      <motion.ellipse
        variants={{ hover: { scaleY: 2, y: -10 } }}
        transition={{ duration: 1, ease: 'backInOut', delay: 0.2 }}
        cx="160"
        cy="180"
        rx="80"
        ry="34"
        className="fill-green-300/50"
      />
    </motion.svg>
  )
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
    <motion.div
      whileHover="hover"
      transition={{ duration: 1, ease: 'backInOut' }}
      variants={{ hover: { scale: 1.03 } }}
      className={`relative bg-white rounded-2xl overflow-hidden border ${
        popular ? 'border-amber-400 shadow-lg' : 'border-stone-200 shadow-sm'
      }`}
    >
      {popular && (
        <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-semibold">
          Populaire
        </span>
      )}

      {/* Image with morphing blob behind it */}
      <div className="relative aspect-[4/3] overflow-hidden bg-amber-50">
        <WarmBlob />
        {image && !imgError ? (
          <motion.img
            src={image}
            alt={name}
            variants={{ hover: { scale: 1.08 } }}
            transition={{ duration: 1, ease: 'backInOut' }}
            className="relative z-10 w-full h-full object-contain p-4 drop-shadow-md"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="relative z-10 flex h-full w-full items-center justify-center text-5xl">
            🍲
          </span>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-stone-900 mb-1">{name}</h2>
        <p className="text-stone-500 text-sm mb-4">{description}</p>

        <div className="mb-5 space-y-1">
          <p className="inline-block px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-medium">
            {sachets} sachets
          </p>
          <motion.p
            variants={{ hover: { scale: 1.06 } }}
            transition={{ duration: 1, ease: 'backInOut' }}
            className="origin-left text-3xl font-bold text-stone-900 pt-2"
          >
            {priceFcfa}
          </motion.p>
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
    </motion.div>
  )
}
