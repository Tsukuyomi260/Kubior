import { useState } from 'react'

export default function Header() {
  const [logoError, setLogoError] = useState(false)

  return (
    <header className="bg-stone-50/80 backdrop-blur border-b border-stone-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
        {!logoError ? (
          <img
            src="/logo.png"
            alt="Kubi'or"
            className="h-10 w-auto"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
        )}
        <div>
          <p className="text-xl font-bold text-stone-900 leading-tight">Kubi'or</p>
          <p className="text-xs text-stone-500">Bouillon naturel premium</p>
        </div>
      </div>
    </header>
  )
}
