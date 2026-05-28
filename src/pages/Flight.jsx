import { useState, useEffect } from 'react'
import { RefreshCw, Plane } from 'lucide-react'
import { flights } from '../data/flight'

const SKY_PHOTO = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=85'

// ── Status badge ────────────────────────────────────────────────
const STATUS_CONFIG = {
  scheduled: { label: '準時',   dot: 'bg-ink' },
  active:    { label: '飛行中', dot: 'bg-ink animate-pulse' },
  landed:    { label: '已降落', dot: 'bg-muted' },
  cancelled: { label: '取消',   dot: 'bg-ink' },
  diverted:  { label: '改降',   dot: 'bg-ink' },
  incident:  { label: '異常',   dot: 'bg-ink' },
}

function StatusBadge({ status, delay }) {
  if (!status) return null
  const cfg = STATUS_CONFIG[status] || { label: status, dot: 'bg-muted' }
  return (
    <span className="inline-flex items-center gap-1.5 text-2xs font-bold tracking-wide uppercase px-2 py-1 border border-ink text-ink rounded-badge">
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
      {delay > 0 && <span className="opacity-60">+{delay}m</span>}
    </span>
  )
}

// ── Fetch real-time data ────────────────────────────────────────
async function fetchFlightStatus(iata, date) {
  const params = new URLSearchParams({ iata, date })
  const resp = await fetch(`/api/flight?${params}`)
  if (!resp.ok) throw new Error('API error')
  const json = await resp.json()
  if (json.error) throw new Error(json.error.info || json.error)
  return json.data?.[0] || null
}

// ── Countdown ──────────────────────────────────────────────────
function Countdown({ targetDate, label }) {
  const [diff, setDiff] = useState(new Date(targetDate) - new Date())
  useEffect(() => {
    const t = setInterval(() => setDiff(new Date(targetDate) - new Date()), 1000)
    return () => clearInterval(t)
  }, [targetDate])
  if (diff <= 0) return null
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins  = Math.floor((diff % 3600000) / 60000)
  const secs  = Math.floor((diff % 60000) / 1000)

  return (
    <div>
      <div className="text-[9px] font-mono tracking-widest opacity-50 mb-3 uppercase">{label}</div>
      <div className="flex items-end gap-3">
        {days > 0 && (
          <div>
            <div className="text-5xl font-heading font-black text-white tabular-nums leading-none">{days}</div>
            <div className="text-[9px] font-mono text-white/50 mt-1 tracking-widest">DAYS</div>
          </div>
        )}
        <div>
          <div className="text-5xl font-heading font-black text-white tabular-nums leading-none">{String(hours).padStart(2,'0')}</div>
          <div className="text-[9px] font-mono text-white/50 mt-1 tracking-widest">HRS</div>
        </div>
        <div className="text-white/30 text-4xl pb-5">:</div>
        <div>
          <div className="text-5xl font-heading font-black text-white tabular-nums leading-none">{String(mins).padStart(2,'0')}</div>
          <div className="text-[9px] font-mono text-white/50 mt-1 tracking-widest">MIN</div>
        </div>
        <div className="text-white/30 text-4xl pb-5">:</div>
        <div>
          <div className="text-5xl font-heading font-black text-white tabular-nums leading-none">{String(secs).padStart(2,'0')}</div>
          <div className="text-[9px] font-mono text-white/50 mt-1 tracking-widest">SEC</div>
        </div>
      </div>
    </div>
  )
}

// ── Format time from ISO string ─────────────────────────────────
function fmtTime(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
}

// ── Flight Card ────────────────────────────────────────────────
function FlightCard({ flight, type, liveData, loading, error }) {
  const dep = new Date(flight.departure)
  const arr = new Date(flight.arrival)
  const depTime = dep.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
  const arrTime = arr.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
  const depDate = dep.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })

  const liveDepSched = fmtTime(liveData?.departure?.scheduled)
  const liveDepEst   = fmtTime(liveData?.departure?.estimated)
  const liveDepAct   = fmtTime(liveData?.departure?.actual)
  const liveArrSched = fmtTime(liveData?.arrival?.scheduled)
  const liveArrEst   = fmtTime(liveData?.arrival?.estimated)
  const liveArrAct   = fmtTime(liveData?.arrival?.actual)

  const displayDepTime = liveDepAct || liveDepEst || liveDepSched || depTime
  const displayArrTime = liveArrAct || liveArrEst || liveArrSched || arrTime
  const isLive = !!liveData

  const depDelay = liveData?.departure?.delay || 0
  const arrDelay = liveData?.arrival?.delay || 0
  const status   = liveData?.flight_status

  return (
    <div className="bg-white border border-border rounded-card overflow-hidden">
      {/* Label bar */}
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xs font-bold tracking-widest uppercase text-ink">
            {type === 'outbound' ? '去程' : '回程'}
          </span>
          <span className="text-2xs font-mono text-muted">{depDate}</span>
          {flight.flightNumber && (
            <span className="font-mono text-2xs font-bold text-sub border border-border rounded-badge px-1.5 py-0.5">
              {flight.flightNumber}
            </span>
          )}
          {flight.airline && (
            <span className="text-2xs text-muted font-mono">{flight.airline}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {loading && <span className="text-2xs text-muted font-mono animate-pulse">查詢中…</span>}
          {!loading && status && <StatusBadge status={status} delay={Math.max(depDelay, arrDelay)} />}
          {!loading && !status && !error && (
            <span className="text-2xs font-mono text-muted">預定</span>
          )}
        </div>
      </div>

      {/* Route */}
      <div className="px-5 py-5">
        <div className="flex items-center justify-between">

          {/* Departure */}
          <div className="text-left">
            <div className="text-4xl font-heading font-black text-ink tabular-nums leading-none">{displayDepTime}</div>
            {isLive && liveDepEst && liveDepEst !== liveDepSched && !liveDepAct && (
              <div className="text-2xs font-mono text-sub mt-0.5">est. {liveDepEst}</div>
            )}
            {isLive && liveDepAct && (
              <div className="text-2xs font-mono text-sub mt-0.5">act. {liveDepAct}</div>
            )}
            <div className="text-2xl font-heading font-black text-ink mt-2 leading-none">{flight.from.code}</div>
            <div className="text-2xs font-mono text-muted mt-0.5">{flight.from.city}</div>
            {flight.from.terminal && (
              <div className="mt-1.5 text-2xs font-bold text-ink border border-ink rounded-badge px-1.5 py-0.5 inline-block tracking-wide">
                {flight.from.terminal}
              </div>
            )}
          </div>

          {/* Centre */}
          <div className="flex flex-col items-center gap-2 px-4">
            <Plane size={16} strokeWidth={1.5} className="text-ink" />
            <div className="flex items-center gap-1 w-20">
              <div className="h-px bg-border flex-1" />
              <div className="h-px bg-ink w-1" />
            </div>
            {isLive && (
              <div className="text-[8px] font-mono text-ink tracking-widest uppercase">LIVE</div>
            )}
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div className="text-4xl font-heading font-black text-ink tabular-nums leading-none">{displayArrTime}</div>
            {isLive && liveArrEst && liveArrEst !== liveArrSched && !liveArrAct && (
              <div className="text-2xs font-mono text-sub mt-0.5">est. {liveArrEst}</div>
            )}
            {isLive && liveArrAct && (
              <div className="text-2xs font-mono text-sub mt-0.5">act. {liveArrAct}</div>
            )}
            <div className="text-2xl font-heading font-black text-ink mt-2 leading-none">{flight.to.code}</div>
            <div className="text-2xs font-mono text-muted mt-0.5">{flight.to.city}</div>
            {flight.to.terminal && (
              <div className="mt-1.5 text-2xs font-bold text-ink border border-ink rounded-badge px-1.5 py-0.5 inline-block tracking-wide">
                {flight.to.terminal}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 border-t border-border">
          <span className="text-2xs font-mono text-muted">即時資料不可用 · 顯示預定時刻</span>
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
export default function FlightPage() {
  const now        = new Date()
  const outboundDep = new Date(flights.outbound.departure)
  const returnDep   = new Date(flights.return.departure)
  const returnArr   = new Date(flights.return.arrival)

  let countdownTarget = null
  let countdownLabel  = ''
  if (now < outboundDep) {
    countdownTarget = flights.outbound.departure
    countdownLabel  = 'DEPARTURE COUNTDOWN'
  } else if (now < returnDep) {
    countdownTarget = flights.return.departure
    countdownLabel  = 'RETURN FLIGHT'
  }

  const [live, setLive]             = useState({ outbound: null, return: null })
  const [loadingState, setLoading]  = useState({ outbound: false, return: false })
  const [errorState, setError]      = useState({ outbound: null, return: null })
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchLive = async () => {
    const fetchOne = async (key, flightData) => {
      const date = flightData.departure.slice(0, 10)
      setLoading(s => ({ ...s, [key]: true }))
      setError(s => ({ ...s, [key]: null }))
      try {
        const data = await fetchFlightStatus(flightData.flightNumber, date)
        setLive(s => ({ ...s, [key]: data }))
      } catch (e) {
        setError(s => ({ ...s, [key]: e.message }))
      } finally {
        setLoading(s => ({ ...s, [key]: false }))
      }
    }
    await Promise.all([
      fetchOne('outbound', flights.outbound),
      fetchOne('return', flights.return),
    ])
    setLastUpdated(new Date())
  }

  useEffect(() => { fetchLive() }, [])

  return (
    <div className="space-y-4">

      {/* Sky hero */}
      <div
        className="relative w-full overflow-hidden rounded-card"
        style={{ minHeight: countdownTarget ? '180px' : '100px' }}
      >
        <img
          src={SKY_PHOTO}
          alt="sky"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) saturate(0.8)' }}
        />
        <div className="relative z-10 p-6">
          {countdownTarget ? (
            <Countdown targetDate={countdownTarget} label={countdownLabel} />
          ) : now > returnArr ? (
            <div className="text-white">
              <div className="text-2xs font-mono tracking-widest opacity-50 mb-1">STATUS</div>
              <div className="text-2xl font-heading font-black">旅程圓滿結束</div>
              <div className="text-2xs font-mono opacity-50 mt-1">Jun 3 — Jun 6, 2026 · Busan</div>
            </div>
          ) : (
            <div className="text-white">
              <div className="text-2xs font-mono tracking-widest opacity-50 mb-1">STATUS</div>
              <div className="text-2xl font-heading font-black">旅程進行中</div>
            </div>
          )}
        </div>
      </div>

      {/* Live data controls */}
      <div className="flex items-center justify-between">
        <span className="text-2xs font-mono text-muted">
          {lastUpdated
            ? `即時資料 · ${lastUpdated.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} 更新`
            : 'AviationStack · 查詢中…'}
        </span>
        <button
          onClick={fetchLive}
          disabled={loadingState.outbound || loadingState.return}
          className="flex items-center gap-1.5 text-2xs font-bold tracking-wide uppercase text-ink border border-border rounded-badge px-2 py-1 hover:border-ink transition-colors cursor-pointer disabled:opacity-40"
        >
          <RefreshCw size={9} strokeWidth={2.5} className={loadingState.outbound || loadingState.return ? 'animate-spin' : ''} />
          重新整理
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Flight cards */}
      <div className="space-y-3">
        <FlightCard
          flight={flights.outbound}
          type="outbound"
          liveData={live.outbound}
          loading={loadingState.outbound}
          error={errorState.outbound}
        />
        <FlightCard
          flight={flights.return}
          type="return"
          liveData={live.return}
          loading={loadingState.return}
          error={errorState.return}
        />
      </div>

      <div className="text-2xs font-mono text-muted text-center pt-1">
        AviationStack · 免費方案每月 500 次查詢
      </div>
    </div>
  )
}
