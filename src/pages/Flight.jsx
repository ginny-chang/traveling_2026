import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { flights } from '../data/flight'

const SKY_PHOTO = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'

// ── Status badge ────────────────────────────────────────────────
const STATUS_CONFIG = {
  scheduled: { label: '準時', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  active:    { label: '飛行中', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500 animate-pulse' },
  landed:    { label: '已降落', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  cancelled: { label: '取消', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  diverted:  { label: '改降', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  incident:  { label: '異常', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
}

function StatusBadge({ status, delay }) {
  if (!status) return null
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
      {delay > 0 && <span className="opacity-70">· 延誤 {delay} 分鐘</span>}
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
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return (
    <div className="text-center">
      <div className="text-xs text-white/70 mb-2">{label}</div>
      <div className="flex justify-center gap-3">
        {days > 0 && <div className="text-center"><div className="text-3xl font-heading font-bold text-white">{days}</div><div className="text-xs text-white/60">天</div></div>}
        <div className="text-center"><div className="text-3xl font-heading font-bold text-white">{String(hours).padStart(2,'0')}</div><div className="text-xs text-white/60">時</div></div>
        <div className="self-center text-white/40 text-2xl pb-4">:</div>
        <div className="text-center"><div className="text-3xl font-heading font-bold text-white">{String(mins).padStart(2,'0')}</div><div className="text-xs text-white/60">分</div></div>
        <div className="self-center text-white/40 text-2xl pb-4">:</div>
        <div className="text-center"><div className="text-3xl font-heading font-bold text-white">{String(secs).padStart(2,'0')}</div><div className="text-xs text-white/60">秒</div></div>
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
  const depDate = dep.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })

  // Live times (override static if available)
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
  const status = liveData?.flight_status

  return (
    <div
      className="rounded-card overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 4px 24px rgba(79,126,247,0.08)',
      }}
    >
      {/* Label bar */}
      <div className={`px-4 py-2.5 flex items-center justify-between ${
        type === 'outbound'
          ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-100/50'
          : 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-b border-pink-100/50'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${type === 'outbound' ? 'text-primary' : 'text-pink-500'}`}>
            {type === 'outbound' ? '去程' : '回程'}
          </span>
          <span className="text-xs text-sub">{depDate}</span>
          {flight.flightNumber && (
            <span className={`font-mono text-xs font-bold ${type === 'outbound' ? 'text-primary' : 'text-pink-500'}`}>
              {flight.flightNumber}
            </span>
          )}
          {flight.airline && <span className="text-[11px] text-sub">{flight.airline}</span>}
        </div>
        {loading && <span className="text-[11px] text-sub animate-pulse">查詢中…</span>}
        {!loading && status && <StatusBadge status={status} delay={Math.max(depDelay, arrDelay)} />}
        {!loading && !status && !error && <span className="text-[11px] text-sub/50">預定班次</span>}
      </div>

      {/* Route */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          {/* Dep */}
          <div className="text-left">
            <div className="text-3xl font-heading font-bold text-ink tabular-nums">{displayDepTime}</div>
            {isLive && liveDepEst && liveDepEst !== liveDepSched && !liveDepAct && (
              <div className="text-[11px] text-orange-500 font-medium">預計 {liveDepEst}</div>
            )}
            {isLive && liveDepAct && <div className="text-[11px] text-green-600 font-medium">實際 {liveDepAct}</div>}
            <div className="text-lg font-heading font-bold text-gradient mt-0.5">{flight.from.code}</div>
            <div className="text-[11px] text-sub">{flight.from.city}</div>
            {flight.from.terminal && (
              <span className="inline-block mt-1 text-[11px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                {flight.from.terminal}
              </span>
            )}
          </div>

          {/* Centre */}
          <div className="flex flex-col items-center gap-1.5 flex-1 px-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isLive && status === 'active' ? 'animate-bounce' : ''
              }`}
              style={{background:'linear-gradient(135deg,#4F7EF7,#7C6FCD)', boxShadow:'0 4px 12px rgba(79,126,247,0.3)'}}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[10px] text-sub/60">直飛</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            {isLive && <div className="text-[10px] text-primary font-semibold">即時</div>}
          </div>

          {/* Arr */}
          <div className="text-right">
            <div className="text-3xl font-heading font-bold text-ink tabular-nums">{displayArrTime}</div>
            {isLive && liveArrEst && liveArrEst !== liveArrSched && !liveArrAct && (
              <div className="text-[11px] text-orange-500 font-medium">預計 {liveArrEst}</div>
            )}
            {isLive && liveArrAct && <div className="text-[11px] text-green-600 font-medium">實際 {liveArrAct}</div>}
            <div className="text-lg font-heading font-bold text-gradient mt-0.5">{flight.to.code}</div>
            <div className="text-[11px] text-sub">{flight.to.city}</div>
            {flight.to.terminal && (
              <span className="inline-block mt-1 text-[11px] font-semibold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                {flight.to.terminal}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
export default function FlightPage() {
  const now = new Date()
  const outboundDep = new Date(flights.outbound.departure)
  const returnDep   = new Date(flights.return.departure)
  const returnArr   = new Date(flights.return.arrival)

  // Decide countdown target
  let countdownTarget = null
  let countdownLabel = ''
  if (now < outboundDep) { countdownTarget = flights.outbound.departure; countdownLabel = '距離去程起飛' }
  else if (now < returnDep) { countdownTarget = flights.return.departure; countdownLabel = '距離回程起飛' }

  // Live data state: { outbound, return }
  const [live, setLive] = useState({ outbound: null, return: null })
  const [loadingState, setLoadingState] = useState({ outbound: false, return: false })
  const [errorState, setErrorState] = useState({ outbound: null, return: null })
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchLive = async () => {
    const fetchOne = async (key, flightData) => {
      const date = flightData.departure.slice(0, 10)
      setLoadingState(s => ({ ...s, [key]: true }))
      setErrorState(s => ({ ...s, [key]: null }))
      try {
        const data = await fetchFlightStatus(flightData.flightNumber, date)
        setLive(s => ({ ...s, [key]: data }))
      } catch (e) {
        setErrorState(s => ({ ...s, [key]: e.message }))
      } finally {
        setLoadingState(s => ({ ...s, [key]: false }))
      }
    }
    await Promise.all([
      fetchOne('outbound', flights.outbound),
      fetchOne('return', flights.return),
    ])
    setLastUpdated(new Date())
  }

  // Fetch on mount
  useEffect(() => { fetchLive() }, [])

  return (
    <div className="space-y-4">
      {/* Sky photo hero with countdown overlay */}
      <div className="relative rounded-card overflow-hidden shadow-glass" style={{minHeight: countdownTarget ? '200px' : '120px'}}>
        <img src={SKY_PHOTO} alt="sky" className="w-full h-full object-cover absolute inset-0" style={{minHeight: countdownTarget ? '200px' : '120px'}} />
        <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(30,60,120,0.45) 0%, rgba(15,30,80,0.75) 100%)'}} />

        {countdownTarget ? (
          <div className="relative z-10 p-5">
            <Countdown targetDate={countdownTarget} label={countdownLabel} />
          </div>
        ) : now > returnArr ? (
          <div className="relative z-10 p-5 text-center text-white">
            <div className="text-2xl mb-1">🎉</div>
            <div className="font-heading font-bold">旅程圓滿結束，平安到家！</div>
          </div>
        ) : (
          <div className="relative z-10 p-5 text-center text-white">
            <div className="text-sm font-medium opacity-80">旅程進行中</div>
          </div>
        )}
      </div>

      {/* Last updated + refresh */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-sub">
          {lastUpdated
            ? `即時資料 · ${lastUpdated.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} 更新`
            : '查詢即時資料中…'}
        </span>
        <button
          onClick={fetchLive}
          disabled={loadingState.outbound || loadingState.return}
          className="flex items-center gap-1 text-xs text-primary font-medium cursor-pointer disabled:opacity-40"
        >
          <RefreshCw size={12} strokeWidth={2} className={loadingState.outbound || loadingState.return ? 'animate-spin' : ''} />
          重新整理
        </button>
      </div>

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

      <div className="text-[11px] text-sub/50 text-center">
        資料來源：AviationStack · 免費方案每月 500 次查詢
      </div>
    </div>
  )
}
