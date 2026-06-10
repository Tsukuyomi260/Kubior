import Header from '../components/Header'
import ProductCard from '../components/ProductCard'

const PRODUCTS = [
  {
    id: 'decouverte',
    name: 'Pack Découverte',
    sachets: 5,
    priceFcfa: '2 500 FCFA',
    priceUsd: '$4.50',
    description: 'Parfait pour essayer notre bouillon naturel',
  },
  {
    id: 'famille',
    name: 'Pack Famille',
    sachets: 15,
    priceFcfa: '6 500 FCFA',
    priceUsd: '$11.50',
    description: 'Idéal pour toute la famille',
  },
  {
    id: 'mois',
    name: 'Pack Mois',
    sachets: 30,
    priceFcfa: '12 000 FCFA',
    priceUsd: '$21.50',
    description: 'L\'offre complète pour le mois',
  },
]

export default function Home() {
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kubi'or</h1>
          <p className="text-lg text-gray-600">Bouillon naturel de qualité</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  )
}
