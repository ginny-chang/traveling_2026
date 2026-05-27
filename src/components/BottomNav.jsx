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
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav
        className="pointer-events-auto flex items-center gap-1 px-3 py-2.5 rounded-pill"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(15,23,42,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid rgba(255,255,255,0.8)',
        }}
      >
        {tabs.map(({ key, Icon, label }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              aria-label={label}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 cursor-pointer
                ${isActive ? 'w-20 py-2' : 'w-12 py-2'}
              `}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #4F7EF7 0%, #7C6FCD 100%)'
                  : 'transparent',
              }}
            >
              <Icon
                size={isActive ? 18 : 20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'text-white' : 'text-slate-400'}
              />
              {isActive && (
                <span className="text-[10px] font-semibold text-white leading-none">
                  {label}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
