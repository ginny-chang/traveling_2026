import { useState } from 'react'
import { itinerary, dayKeys } from '../data/itinerary'
import ActivityCard from '../components/ActivityCard'

function getTodayDayKey() {
  const today = new Date().toISOString().slice(0, 10)
  for (const key of dayKeys) {
    if (itinerary[key].date === today) return key
  }
  return 'day1'
}

export default function Itinerary() {
  const [activeDay, setActiveDay] = useState(getTodayDayKey)
  const day = itinerary[activeDay]
  const dayIdx = dayKeys.indexOf(activeDay) + 1

  return (
    <div className="space-y-4">

      {/* Day tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 border border-border rounded-card">
        {dayKeys.map((key) => {
          const d = itinerary[key]
          const isActive = activeDay === key
          return (
            <button
              key={key}
              onClick={() => setActiveDay(key)}
              className={`py-2 rounded-badge text-center transition-all duration-150 cursor-pointer
                ${isActive
                  ? 'bg-ink text-white'
                  : 'text-sub hover:text-ink hover:bg-surface'
                }`}
            >
              <div className={`text-2xs font-bold tracking-wide ${isActive ? 'text-white' : 'text-ink'}`}>
                {d.label}
              </div>
              <div className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-white/60' : 'text-muted'}`}>
                {d.date.slice(5).replace('-', '/')}
              </div>
            </button>
          )
        })}
      </div>

      {/* Day header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 border-2 border-ink rounded-badge flex items-center justify-center flex-shrink-0">
          <span className="font-mono font-black text-ink text-xs">D{dayIdx}</span>
        </div>
        <div>
          <div className="font-heading font-bold text-ink text-sm leading-tight">{day.subtitle}</div>
          <div className="text-2xs font-mono text-muted mt-0.5">
            {new Date(day.date + 'T12:00:00').toLocaleDateString('zh-TW', {
              year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[14px] top-4 bottom-4 w-px bg-border" />

        <div className="space-y-3">
          {day.activities.map((activity, idx) => (
            <div key={activity.id} className="flex gap-3">
              {/* Dot */}
              <div className="flex-shrink-0 w-7 flex justify-center pt-3.5 z-10">
                <div
                  className={`rounded-full flex-shrink-0
                    ${idx === 0
                      ? 'w-3 h-3 bg-ink'
                      : 'w-2 h-2 bg-white border-2 border-border mt-0.5'
                    }`}
                />
              </div>
              {/* Card */}
              <div className="flex-1 min-w-0">
                <ActivityCard activity={activity} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
