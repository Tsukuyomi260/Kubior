export default function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-stone-200">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-stone-900 mb-3">Commande annulée</h1>
        <p className="text-stone-500 mb-6">
          Aucun paiement n'a été effectué. Reprenez quand vous voulez.
        </p>

        <a
          href="/"
          className="block w-full text-center bg-green-700 text-white font-medium py-2.5 rounded-xl hover:bg-green-800 transition"
        >
          Retour à la boutique
        </a>
      </div>
    </div>
  )
}
