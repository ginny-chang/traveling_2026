import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import FlightPage from './pages/Flight'
import Itinerary from './pages/Itinerary'
import Checklist from './pages/Checklist'
import Expense from './pages/Expense'

const PAGE_TITLES = {
  home:      '釜山旅遊 2026',
  flight:    '航班資訊',
  itinerary: '旅遊行程',
  checklist: '行李清單',
  expense:   '旅遊記帳',
}

export default function App() {
  const [activePage, setActivePage] = useState('home')

  const renderPage = () => {
    switch (activePage) {
      case 'home':      return <Home onNavigate={setActivePage} />
      case 'flight':    return <FlightPage />
      case 'itinerary': return <Itinerary />
      case 'checklist': return <Checklist />
      case 'expense':   return <Expense />
      default:          return <Home onNavigate={setActivePage} />
    }
  }

  return (
    <div className="min-h-screen flex justify-center" style={{background:'linear-gradient(135deg, #E8F0FF 0%, #F0E8FF 50%, #E8F6FF 100%)'}}>
      <div className="w-full max-w-md flex flex-col relative">
        {/* Header */}
        <header
          className="sticky top-0 z-40 px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          <h1 className="font-heading font-semibold text-ink text-[15px] text-center tracking-wide">
            {PAGE_TITLES[activePage]}
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-28 scrollbar-hide">
          {renderPage()}
        </main>

        {/* Floating nav */}
        <BottomNav active={activePage} onChange={setActivePage} />
      </div>
    </div>
  )
}
