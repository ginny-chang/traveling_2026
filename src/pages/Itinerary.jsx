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
      <div
        className="flex gap-1.5 p-1.5 rounded-2xl"
        style={{background:'rgba(255,255,255,0.6)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.7)'}}
      >
        {dayKeys.map((key) => {
          const d = itinerary[key]
          const isActive = activeDay === key
          return (
            <button
              key={key}
              onClick={() => setActiveDay(key)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
              style={isActive ? {
                background: 'linear-gradient(135deg, #4F7EF7 0%, #7C6FCD 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(79,126,247,0.3)',
              } : {color: '#64748B'}}
            >
              <div>{d.label}</div>
              <div className={`text-[10px] font-normal mt-0.5 ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                {d.date.slice(5).replace('-', '/')}
              </div>
            </button>
          )
        })}
      </div>

      {/* Day header */}
      <div className="flex items-center gap-3 px-1">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0"
          style={{background:'linear-gradient(135deg, #4F7EF7 0%, #7C6FCD 100%)', boxShadow:'0 4px 12px rgba(79,126,247,0.3)'}}
        >
          D{dayKeys.indexOf(activeDay) + 1}
        </div>
        <div>
          <div className="font-heading font-bold text-ink text-sm">{day.subtitle}</div>
          <div className="text-[11px] text-sub">
            {new Date(day.date + 'T12:00:00').toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[17px] top-5 bottom-5 w-px" style={{background:'linear-gradient(to bottom, #4F7EF7, #7C6FCD)'}} />
        <div className="space-y-3">
          {day.activities.map((activity, idx) => (
            <div key={activity.id} className="flex gap-3">
              {/* Dot */}
              <div className="flex-shrink-0 w-9 flex justify-center pt-3.5 z-10">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={idx === 0
                    ? {background:'linear-gradient(135deg,#4F7EF7,#7C6FCD)', boxShadow:'0 0 0 3px rgba(79,126,247,0.2)'}
                    : {background:'white', border:'2px solid #CBD5E1'}
                  }
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
