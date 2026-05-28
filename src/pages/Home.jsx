import { useState, useEffect } from 'react'
import { Plane, CalendarDays, CheckSquare, Wallet, Wind, Droplets } from 'lucide-react'
import { itinerary, dayKeys, tripDates } from '../data/itinerary'
import { useWeather } from '../hooks/useWeather'
import ActivityCard from '../components/ActivityCard'

const BUSAN_SKY = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=85'

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])
  return now
}

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

// ── Airplane Window HUD ──────────────────────────────────────────
function AirplaneWindow({ weather, countdown, currentDay }) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="relative w-full flex justify-center">
      {/* Outer frame */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '4 / 5',
          borderRadius: '42% 42% 48% 48% / 36% 36% 44% 44%',
          background: '#111',
          padding: '10px',
          boxShadow: '0 0 0 3px #0A0A0A, 0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Inner glass */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ borderRadius: '40% 40% 46% 46% / 34% 34% 42% 42%' }}
        >
          {/* Photo */}
          <img
            src={BUSAN_SKY}
            alt="flight view"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.72) saturate(1.1)' }}
          />

          {/* HUD overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">

            {/* ─ Top row ───────────────────────────── */}
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[9px] font-mono tracking-widest opacity-50 mb-0.5">LOCAL TIME</div>
                <div className="text-2xl font-heading font-black tabular-nums leading-none">{timeStr}</div>
              </div>
              <div className="text-right">
                {weather ? (
                  <>
                    <div className="text-[9px] font-mono tracking-widest opacity-50 mb-0.5">부산 WEATHER</div>
                    <div className="text-2xl font-heading font-black leading-none">{weather.temp}°</div>
                    <div className="text-[10px] font-mono opacity-60 mt-0.5">{weather.label}</div>
                  </>
                ) : (
                  <>
                    <div className="text-[9px] font-mono opacity-50">WEATHER</div>
                    <div className="text-sm opacity-40">—</div>
                  </>
                )}
              </div>
            </div>

            {/* ─ Thin divider ─────────────────────── */}
            <div className="border-t border-white/20" />

            {/* ─ Centre: Destination ───────────────── */}
            <div>
              <div className="text-[9px] font-mono tracking-widest opacity-50 mb-1.5">DESTINATION</div>
              <div
                className="font-heading text-white leading-none"
                style={{ fontSize: 'clamp(3rem, 18vw, 5rem)', fontWeight: 900, letterSpacing: '-0.03em' }}
              >
                부산
              </div>
              <div className="text-[11px] font-mono opacity-50 mt-1.5 tracking-widest">TPE → PUS · ZE984</div>
            </div>

            {/* ─ Thin divider ─────────────────────── */}
            <div className="border-t border-white/20" />

            {/* ─ Bottom row ────────────────────────── */}
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[9px] font-mono opacity-50 tracking-widest mb-0.5">COORDINATES</div>
                <div className="text-[10px] font-mono opacity-70">35°10′N  129°04′E</div>
              </div>
              {countdown !== null && (
                <div className="text-right">
                  <div className="text-[9px] font-mono opacity-50 tracking-widest mb-0.5">DEPARTURE</div>
                  <div className="text-[10px] font-mono font-bold">
                    {countdown.days > 0 ? `T-${countdown.days}D ${countdown.hours}H` : `T-${countdown.hours}H ${countdown.mins}M`}
                  </div>
                </div>
              )}
              {currentDay && (
                <div className="text-right">
                  <div className="text-[9px] font-mono opacity-50 tracking-widest mb-0.5">TODAY</div>
                  <div className="text-[10px] font-mono font-bold">{currentDay}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Weather strip ────────────────────────────────────────────────
function WeatherStrip({ weather }) {
  if (!weather) return null
  return (
    <div className="border border-border rounded-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-2xs font-mono tracking-widest text-muted mb-0.5">BUSAN WEATHER NOW</div>
          <div className="text-sm font-bold text-ink">{weather.desc}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-2xl font-heading font-black text-ink">{weather.temp}°C</div>
          <div className="text-2xs text-muted font-mono">feels {weather.feelsLike}°</div>
        </div>
        <div className="space-y-1 border-l border-border pl-4">
          <div className="flex items-center gap-1.5 text-2xs text-sub font-mono">
            <Wind size={10} strokeWidth={2} />
            {weather.wind} km/h
          </div>
          <div className="flex items-center gap-1.5 text-2xs text-sub font-mono">
            <Droplets size={10} strokeWidth={2} />
            {weather.humidity}%
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Quick link card ──────────────────────────────────────────────
function QuickCard({ Icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-border rounded-card p-4 text-left hover:border-ink transition-colors duration-150 cursor-pointer group w-full"
    >
      <Icon size={18} strokeWidth={1.8} className="text-ink mb-2" />
      <div className="text-sm font-bold text-ink leading-tight">{label}</div>
      {sub && <div className="text-2xs text-muted font-mono mt-0.5">{sub}</div>}
    </button>
  )
}

// ── Main ─────────────────────────────────────────────────────────
export default function Home({ onNavigate }) {
  const now = useNow()
  const { weather } = useWeather()

  const tripStart = new Date(`${tripDates.start}T00:00:00`)
  const tripEnd   = new Date(`${tripDates.end}T23:59:59`)

  // Countdown
  let countdown = null
  const diff = tripStart - now
  if (diff > 0) {
    countdown = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
    }
  }

  // Current day during trip
  let currentDayLabel = null
  if (now >= tripStart && now <= tripEnd) {
    const dayInfo = getDayInfo(now)
    if (dayInfo) currentDayLabel = dayInfo.day.label
  }

  // ── BEFORE TRIP ──────────────────────────────────────────────
  if (now < tripStart) {
    return (
      <div className="space-y-4">
        {/* Section label */}
        <div className="flex items-center justify-between">
          <span className="text-2xs font-mono tracking-widest text-muted uppercase">Busan · Korea 2026</span>
          <span className="text-2xs font-mono text-muted">Jun 3 — Jun 6</span>
        </div>

        {/* Airplane window */}
        <AirplaneWindow weather={weather} countdown={countdown} />

        {/* Countdown row */}
        <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-card overflow-hidden">
          {[
            { value: countdown.days,  label: 'DAYS' },
            { value: countdown.hours, label: 'HRS' },
            { value: countdown.mins,  label: 'MIN' },
          ].map(({ value, label }) => (
            <div key={label} className="py-3 text-center">
              <div className="text-2xl font-heading font-black text-ink tabular-nums">{String(value).padStart(2,'0')}</div>
              <div className="text-2xs font-mono text-muted tracking-widest">{label}</div>
            </div>
          ))}
        </div>

        {/* Weather */}
        <WeatherStrip weather={weather} />

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-2.5">
          <QuickCard Icon={Plane}        label="航班資訊"   sub="ZE984 · BR163"    onClick={() => onNavigate('flight')} />
          <QuickCard Icon={CalendarDays} label="旅遊行程"   sub="Day 1 — Day 4"    onClick={() => onNavigate('itinerary')} />
          <QuickCard Icon={CheckSquare}  label="行李清單"   sub="25 items"         onClick={() => onNavigate('checklist')} />
          <QuickCard Icon={Wallet}       label="旅遊記帳"   sub="AA split"         onClick={() => onNavigate('expense')} />
        </div>
      </div>
    )
  }

  // ── AFTER TRIP ───────────────────────────────────────────────
  if (now > tripEnd) {
    return (
      <div className="space-y-4">
        <AirplaneWindow weather={weather} countdown={null} />
        <div className="border border-border rounded-card p-4 text-center">
          <div className="text-2xs font-mono tracking-widest text-muted mb-2">TRIP COMPLETED</div>
          <div className="text-xl font-heading font-black text-ink">旅程圓滿結束</div>
          <div className="text-xs text-sub mt-1 font-mono">Jun 3 — Jun 6, 2026 · Busan</div>
        </div>
        <WeatherStrip weather={weather} />
      </div>
    )
  }

  // ── DURING TRIP ──────────────────────────────────────────────
  const dayInfo = getDayInfo(now)

  let currentActivity = null
  let nextActivity = null

  if (dayInfo) {
    const { day } = dayInfo
    for (let i = 0; i < day.activities.length; i++) {
      const a = day.activities[i]
      if (!a.startTime) continue
      const start = parseTime(day.date, a.startTime)
      const end   = a.endTime ? parseTime(day.date, a.endTime) : null
      if (end && now >= start && now < end) {
        currentActivity = a
        nextActivity = day.activities[i + 1] || null
        break
      }
      if (now < start && !nextActivity) nextActivity = a
    }
  }

  const dayIdx = dayInfo ? dayKeys.indexOf(dayInfo.key) + 1 : null

  return (
    <div className="space-y-4">
      {/* Trip status header */}
      <div className="flex items-center justify-between">
        <span className="text-2xs font-mono tracking-widest text-muted uppercase">在釜山 · In Busan</span>
        {dayIdx && <span className="text-2xs font-mono font-bold border border-ink px-2 py-0.5 rounded">DAY {dayIdx}</span>}
      </div>

      {/* Window (smaller during trip) */}
      <AirplaneWindow weather={weather} countdown={null} currentDay={dayInfo?.day.subtitle} />

      {/* Weather */}
      <WeatherStrip weather={weather} />

      <div className="border-t border-border" />

      {/* Current */}
      {currentActivity && (
        <div>
          <div className="text-2xs font-mono tracking-widest text-muted mb-2 uppercase">Now</div>
          <ActivityCard activity={currentActivity} highlight="now" />
        </div>
      )}

      {/* Next */}
      {nextActivity && (
        <div>
          <div className="text-2xs font-mono tracking-widest text-muted mb-2 uppercase">Next</div>
          <ActivityCard activity={nextActivity} highlight="next" />
        </div>
      )}

      {!currentActivity && !nextActivity && (
        <div className="border border-border rounded-card p-4 text-center text-sub text-sm font-mono">
          No more activities today
        </div>
      )}

      <button
        onClick={() => onNavigate('itinerary')}
        className="w-full border border-border rounded-card py-3 text-2xs font-bold tracking-widest uppercase text-ink hover:border-ink hover:bg-surface transition-colors duration-150 cursor-pointer"
      >
        View Full Itinerary →
      </button>
    </div>
  )
}
