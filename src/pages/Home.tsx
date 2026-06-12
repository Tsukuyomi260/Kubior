import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'

const PRODUCTS = [
  {
    id: 'decouverte',
    name: 'Pack Découverte',
    sachets: 5,
    priceFcfa: '2 500 FCFA',
    priceUsd: '$4.50',
    description: 'Parfait pour essayer notre bouillon naturel',
    image: '/pack-decouverte.jpeg',
    popular: false,
  },
  {
    id: 'famille',
    name: 'Pack Famille',
    sachets: 15,
    priceFcfa: '6 500 FCFA',
    priceUsd: '$11.50',
    description: 'Idéal pour toute la famille',
    image: '/pack-famille.jpeg',
    popular: true,
  },
  {
    id: 'mois',
    name: 'Pack Mois',
    sachets: 30,
    priceFcfa: '12 000 FCFA',
    priceUsd: '$21.50',
    description: "L'offre complète pour le mois",
    image: '/pack-mois.jpeg',
    popular: false,
  },
]

export default function Home() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <Reveal>
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium mb-4">
              100% naturel · sans additifs
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Le bouillon Kubi'or
            </h1>
            <p className="text-lg text-stone-600 max-w-xl mx-auto">
              Un bouillon naturel, riche en goût, pour sublimer vos plats du
              quotidien. Choisissez le pack qui vous convient.
            </p>
          </Reveal>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.id} delay={i * 120}>
              <ProductCard {...product} />
            </Reveal>
          ))}
        </div>

        {/* Currency note */}
        <Reveal>
          <p className="text-center text-xs text-stone-500 mt-10 max-w-2xl mx-auto">
            Prix affichés en FCFA pour le marché béninois. Le paiement est traité
            en USD par Stripe (XOF non supporté en Checkout). Le montant débité
            correspond à l'équivalent indiqué entre parenthèses.
          </p>
        </Reveal>
      </main>

      <footer className="border-t border-stone-200 py-6">
        <p className="text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Kubi'or · Paiement sécurisé par Stripe
        </p>
      </footer>
    </div>
  )
}
