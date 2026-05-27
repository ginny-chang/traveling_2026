import { useState, useEffect } from 'react'
import { Plane, CalendarDays, CheckSquare, Wallet, MapPin, Clock } from 'lucide-react'
import { itinerary, dayKeys, tripDates } from '../data/itinerary'
import ActivityCard from '../components/ActivityCard'

const BUSAN_BEACH = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'

function parseTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00`)
}

function getDayInfo(now) {
  const today = now.toISOString().slice(0, 10)
  for (const key of dayKeys) {
    if (itinerary[key].date === today) return { key, day: itinerary[key] }
  }
  return null
}

function getActivityStatus(now, activity, dateStr) {
  if (!activity.startTime) return null
  const start = parseTime(dateStr, activity.startTime)
  const end = activity.endTime ? parseTime(dateStr, activity.endTime) : null
  if (end && now >= start && now < end) return 'now'
  if (now < start) return 'upcoming'
  return 'past'
}

export default function Home({ onNavigate }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const tripStart = new Date(`${tripDates.start}T00:00:00`)
  const tripEnd   = new Date(`${tripDates.end}T23:59:59`)

  // ── Before trip ─────────────────────────────────────────────
  if (now < tripStart) {
    const diff = tripStart - now
    const days  = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const mins  = Math.floor((diff % 3600000) / 60000)

    return (
      <div className="space-y-4">
        {/* Hero photo card */}
        <div className="relative rounded-card overflow-hidden h-52 shadow-glass">
          <img
            src={BUSAN_BEACH}
            alt="부산 해운대 해변"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.1) 60%)'}} />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={12} strokeWidth={2} className="text-white/70" />
              <span className="text-xs text-white/70">부산, 대한민국</span>
            </div>
            <div className="text-xl font-heading font-bold">釜山旅遊 2026</div>
            <div className="text-xs text-white/70 mt-0.5">6/3 — 6/6 · 4 天 3 夜</div>
          </div>
        </div>

        {/* Countdown */}
        <div
          className="rounded-card p-5 text-white"
          style={{background: 'linear-gradient(135deg, #4F7EF7 0%, #7C6FCD 100%)', boxShadow: '0 8px 32px rgba(79,126,247,0.25)'}}
        >
          <div className="text-xs text-white/70 mb-3 text-center font-medium">距離出發還有</div>
          <div className="flex justify-center items-end gap-3">
            {[{v: days, u: '天'}, {v: hours, u: '時'}, {v: mins, u: '分'}].map(({v, u}, i) => (
              <div key={u} className="flex items-end gap-3">
                {i > 0 && <span className="text-white/30 text-2xl font-light pb-4">:</span>}
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold tabular-nums">{String(v).padStart(2,'0')}</div>
                  <div className="text-[10px] text-white/60 mt-0.5">{u}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-white/60 mt-3">✈ ZE984 · 6/3 凌晨 02:40 起飛</div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'flight',    Icon: Plane,         label: '航班資訊', color: 'from-blue-400 to-indigo-500' },
            { key: 'itinerary', Icon: CalendarDays,  label: '查看行程', color: 'from-violet-400 to-purple-500' },
            { key: 'checklist', Icon: CheckSquare,   label: '行李清單', color: 'from-emerald-400 to-teal-500' },
            { key: 'expense',   Icon: Wallet,        label: '旅遊記帳', color: 'from-pink-400 to-rose-500' },
          ].map(({ key, Icon, label, color }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="group rounded-card p-4 flex flex-col items-center gap-2.5 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{background:'rgba(255,255,255,0.82)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.7)', boxShadow:'0 2px 16px rgba(79,126,247,0.06)'}}
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                <Icon size={20} strokeWidth={1.8} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-700">{label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── After trip ──────────────────────────────────────────────
  if (now > tripEnd) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-card overflow-hidden h-52 shadow-glass">
          <img src={BUSAN_BEACH} alt="부산 해운대" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{background:'linear-gradient(to top, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.1) 60%)'}} />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="text-xl font-heading font-bold">旅程圓滿結束 🎉</div>
            <div className="text-xs text-white/70 mt-0.5">希望這趟釜山之旅留下了美好回憶 💕</div>
          </div>
        </div>
      </div>
    )
  }

  // ── During trip ─────────────────────────────────────────────
  const dayInfo = getDayInfo(now)
  if (!dayInfo) {
    return (
      <div className="text-center py-20 text-sub">
        <div className="text-4xl mb-3">🌙</div>
        <div>今天沒有行程安排</div>
      </div>
    )
  }

  const { day } = dayInfo
  const activities = day.activities
  let currentActivity = null
  let nextActivity = null

  for (let i = 0; i < activities.length; i++) {
    const status = getActivityStatus(now, activities[i], day.date)
    if (status === 'now') {
      currentActivity = activities[i]
      nextActivity = activities[i + 1] || null
      break
    }
    if (status === 'upcoming' && !nextActivity) {
      nextActivity = activities[i]
    }
  }

  const dayIndex = dayKeys.indexOf(dayInfo.key) + 1

  return (
    <div className="space-y-4">
      {/* Day hero */}
      <div className="relative rounded-card overflow-hidden h-36 shadow-glass">
        <img src={BUSAN_BEACH} alt="부산" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{background:'linear-gradient(to top, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.05) 70%)'}} />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white flex items-end justify-between">
          <div>
            <div className="text-base font-heading font-bold">{day.subtitle}</div>
            <div className="text-xs text-white/70 flex items-center gap-1">
              <Clock size={10} />
              {now.toLocaleTimeString('zh-TW', {hour:'2-digit', minute:'2-digit'})}
            </div>
          </div>
          <div
            className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{background:'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.3)'}}
          >
            Day {dayIndex}
          </div>
        </div>
      </div>

      {/* Current */}
      {currentActivity ? (
        <div>
          <div className="text-[11px] text-sub font-semibold mb-2 uppercase tracking-widest">現在</div>
          <ActivityCard activity={currentActivity} highlight="now" />
        </div>
      ) : (
        <div className="rounded-card p-4 text-center text-sub text-sm" style={{background:'rgba(255,255,255,0.7)'}}>
          目前沒有進行中的活動
        </div>
      )}

      {/* Next */}
      {nextActivity && (
        <div>
          <div className="text-[11px] text-sub font-semibold mb-2 uppercase tracking-widest">接下來</div>
          <ActivityCard activity={nextActivity} highlight="next" />
        </div>
      )}

      <button
        onClick={() => onNavigate('itinerary')}
        className="w-full rounded-card py-3 text-sm font-semibold text-primary cursor-pointer transition-all hover:shadow-card-hover"
        style={{background:'rgba(255,255,255,0.82)', border:'1px solid rgba(79,126,247,0.15)'}}
      >
        查看今日完整行程 →
      </button>
    </div>
  )
}
