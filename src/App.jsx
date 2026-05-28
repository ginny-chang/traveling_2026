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
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-md flex flex-col relative">

        {/* Header */}
        <header className="sticky top-0 z-40 px-4 py-3 bg-bg border-b border-border">
          <h1 className="font-heading font-black text-ink text-[13px] text-center tracking-widest uppercase">
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
