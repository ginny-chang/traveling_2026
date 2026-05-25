const tabs = [
  { key: 'home', icon: '🏠', label: '首頁' },
  { key: 'flight', icon: '✈️', label: '航班' },
  { key: 'itinerary', icon: '📅', label: '行程' },
  { key: 'checklist', icon: '✅', label: '清單' },
  { key: 'expense', icon: '💰', label: '記帳' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="max-w-md mx-auto flex">
        {tabs.map((tab) => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-sub'
              }`}
            >
              <span className="text-xl leading-tight">{tab.icon}</span>
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-primary' : 'text-sub'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
