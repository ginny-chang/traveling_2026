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

  return (
    <div className="space-y-4">
      {/* Day tabs */}
      <div className="flex gap-2 bg-border/30 p-1 rounded-xl">
        {dayKeys.map((key) => {
          const d = itinerary[key]
          const isActive = activeDay === key
          return (
            <button
              key={key}
              onClick={() => setActiveDay(key)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-sub hover:text-ink'
              }`}
            >
              <div>{d.label}</div>
              <div className={`text-[10px] font-normal mt-0.5 ${isActive ? 'text-primary/70' : 'text-sub/70'}`}>
                {d.date.slice(5).replace('-', '/')}
              </div>
            </button>
          )
        })}
      </div>

      {/* Day header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0">
          D{dayKeys.indexOf(activeDay) + 1}
        </div>
        <div>
          <div className="font-heading font-bold text-ink">{day.subtitle}</div>
          <div className="text-xs text-sub">
            {new Date(day.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
          </div>
        </div>
      </div>

      {/* Activity list with timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[18px] top-6 bottom-6 w-px bg-border z-0" />

        <div className="space-y-3">
          {day.activities.map((activity, idx) => (
            <div key={activity.id} className="flex gap-3">
              {/* Timeline dot */}
              <div className="flex-shrink-0 w-9 flex justify-center pt-3.5 z-10">
                <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                  idx === 0 ? 'bg-primary border-primary' : 'bg-white border-border'
                }`} />
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
