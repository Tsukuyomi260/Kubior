import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Success from './pages/Success'
import Cancel from './pages/Cancel'

function App() {
  const [page, setPage] = useState('home')

  useEffect(() => {
    const path = window.location.pathname

    if (path === '/success') {
      setPage('success')
    } else if (path === '/cancel') {
      setPage('cancel')
    } else {
      setPage('home')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {page === 'home' && <Home />}
      {page === 'success' && <Success />}
      {page === 'cancel' && <Cancel />}
    </div>
  )
}

export default App
