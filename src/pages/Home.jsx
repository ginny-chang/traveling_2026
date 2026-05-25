import { useState, useEffect } from 'react'
import { itinerary, dayKeys, tripDates } from '../data/itinerary'
import ActivityCard from '../components/ActivityCard'

function parseTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00`)
}

function getDayInfo(now) {
  for (const key of dayKeys) {
    const day = itinerary[key]
    if (day.date === now.toISOString().slice(0, 10)) return { key, day }
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
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  const tripStart = new Date(`${tripDates.start}T00:00:00`)
  const tripEnd = new Date(`${tripDates.end}T23:59:59`)

  // Before trip
  if (now < tripStart) {
    const diff = tripStart - now
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="text-center pt-2">
          <div className="text-2xl font-heading font-bold text-ink">🇰🇷 釜山旅遊</div>
          <div className="text-sm text-sub mt-1">2026 / 6 / 3 — 6 / 6</div>
        </div>

        {/* Countdown card */}
        <div className="bg-primary rounded-card p-6 text-white text-center shadow-card">
          <div className="text-sm font-medium opacity-80 mb-3">距離出發還有</div>
          <div className="flex justify-center gap-4">
            <div>
              <div className="text-4xl font-heading font-bold">{days}</div>
              <div className="text-xs opacity-70 mt-1">天</div>
            </div>
            <div className="text-3xl font-light opacity-40 self-center">:</div>
            <div>
              <div className="text-4xl font-heading font-bold">{hours}</div>
              <div className="text-xs opacity-70 mt-1">小時</div>
            </div>
            <div className="text-3xl font-light opacity-40 self-center">:</div>
            <div>
              <div className="text-4xl font-heading font-bold">{mins}</div>
              <div className="text-xs opacity-70 mt-1">分鐘</div>
            </div>
          </div>
          <div className="mt-4 text-xs opacity-70">✈️ 6/3 凌晨 02:40 出發</div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'flight', icon: '✈️', label: '航班資訊' },
            { key: 'itinerary', icon: '📅', label: '查看行程' },
            { key: 'checklist', icon: '✅', label: '行李清單' },
            { key: 'expense', icon: '💰', label: '開始記帳' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="bg-white rounded-card shadow-card p-4 flex flex-col items-center gap-2 hover:shadow-card-hover active:scale-95 transition-all"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium text-ink">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // After trip
  if (now > tripEnd) {
    return (
      <div className="space-y-5">
        <div className="text-center pt-2">
          <div className="text-2xl font-heading font-bold text-ink">🇰🇷 釜山旅遊</div>
          <div className="text-sm text-sub mt-1">2026 / 6 / 3 — 6 / 6</div>
        </div>
        <div className="bg-accent-light rounded-card p-6 text-center shadow-card">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-lg font-heading font-bold text-ink">旅程圓滿結束！</div>
          <div className="text-sm text-sub mt-2">希望這趟釜山之旅留下了美好的回憶 💕</div>
        </div>
      </div>
    )
  }

  // During trip
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

  // Find current and next activity
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-heading font-bold text-ink">
            Day {dayIndex} · {day.subtitle}
          </div>
          <div className="text-xs text-sub mt-0.5">
            {now.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })}
          </div>
        </div>
        <div className="bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full">
          Day {dayIndex}
        </div>
      </div>

      {/* Current activity */}
      {currentActivity ? (
        <div>
          <div className="text-xs text-sub font-medium mb-2 uppercase tracking-wider">🟢 現在</div>
          <ActivityCard activity={currentActivity} highlight="now" />
        </div>
      ) : (
        <div className="bg-white rounded-card shadow-card p-4 text-center text-sub text-sm">
          目前沒有進行中的活動
        </div>
      )}

      {/* Next activity */}
      {nextActivity && (
        <div>
          <div className="text-xs text-sub font-medium mb-2 uppercase tracking-wider">⏭ 接下來</div>
          <ActivityCard activity={nextActivity} highlight="next" />
        </div>
      )}

      {/* View full itinerary button */}
      <button
        onClick={() => onNavigate('itinerary')}
        className="w-full bg-white rounded-card shadow-card py-3 text-sm font-medium text-primary hover:bg-primary-light transition-colors"
      >
        查看今日完整行程 →
      </button>
    </div>
  )
}
