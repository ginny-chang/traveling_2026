import { Home, Plane, CalendarDays, CheckSquare, Wallet } from 'lucide-react'

const tabs = [
  { key: 'home',      Icon: Home,         label: '首頁' },
  { key: 'flight',    Icon: Plane,        label: '航班' },
  { key: 'itinerary', Icon: CalendarDays, label: '行程' },
  { key: 'checklist', Icon: CheckSquare,  label: '清單' },
  { key: 'expense',   Icon: Wallet,       label: '記帳' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center gap-0.5 px-2 py-2 rounded-pill bg-white"
        style={{ border: '1.5px solid #0A0A0A', boxShadow: '3px 3px 0px #0A0A0A' }}
      >
        {tabs.map(({ key, Icon, label }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              aria-label={label}
              className={`flex items-center gap-1.5 rounded-full transition-all duration-150 cursor-pointer
                ${isActive
                  ? 'bg-ink text-white px-4 py-2'
                  : 'text-sub px-3 py-2 hover:text-ink'
                }`}
            >
              <Icon size={isActive ? 15 : 17} strokeWidth={isActive ? 2.5 : 1.8} />
              {isActive && (
                <span className="text-[11px] font-bold tracking-wide whitespace-nowrap">{label}</span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
