import { useState, useEffect } from 'react'
import { flights } from '../data/flight'

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
    <div className="bg-white rounded-card shadow-card overflow-hidden">
      {/* Type label */}
      <div className={`px-4 py-2 flex items-center justify-between ${
        type === 'outbound' ? 'bg-primary-light' : 'bg-accent-light'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${type === 'outbound' ? 'text-primary' : 'text-accent'}`}>
            {type === 'outbound' ? '✈️ 去程' : '✈️ 回程'}
          </span>
          <span className="text-xs text-sub">{depDate}</span>
          {flight.flightNumber && (
            <span className={`font-mono text-xs font-bold ${type === 'outbound' ? 'text-primary' : 'text-accent'}`}>
              {flight.flightNumber}
            </span>
          )}
          {flight.airline && <span className="text-xs text-sub">{flight.airline}</span>}
        </div>
        {/* Live status */}
        {loading && <span className="text-xs text-sub animate-pulse">查詢中…</span>}
        {!loading && status && <StatusBadge status={status} delay={Math.max(depDelay, arrDelay)} />}
        {!loading && error && <span className="text-xs text-sub/60">無即時資料</span>}
      </div>

      {/* Flight route */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div className="text-left">
            <div className="text-3xl font-heading font-bold text-ink">{displayDepTime}</div>
            {isLive && liveDepEst && liveDepEst !== liveDepSched && !liveDepAct && (
              <div className="text-xs text-orange-500 font-medium">預計 {liveDepEst}</div>
            )}
            {isLive && liveDepAct && <div className="text-xs text-green-600 font-medium">實際 {liveDepAct}</div>}
            <div className="text-lg font-bold text-primary mt-0.5">{flight.from.code}</div>
            <div className="text-xs text-sub">{flight.from.city}</div>
            {flight.from.terminal && (
              <div className="text-xs font-medium text-accent mt-1 bg-accent-light px-2 py-0.5 rounded-full inline-block">
                {flight.from.terminal}
              </div>
            )}
          </div>

          {/* Centre */}
          <div className="flex flex-col items-center gap-1 flex-1 px-3">
            <div className={`text-2xl ${isLive && status === 'active' ? 'animate-bounce' : ''}`}>✈️</div>
            <div className="w-full flex items-center gap-1">
              <div className="h-px bg-border flex-1" />
              <div className="text-xs text-sub whitespace-nowrap">直飛</div>
              <div className="h-px bg-border flex-1" />
            </div>
            {isLive && <div className="text-[10px] text-primary font-medium">即時</div>}
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div className="text-3xl font-heading font-bold text-ink">{displayArrTime}</div>
            {isLive && liveArrEst && liveArrEst !== liveArrSched && !liveArrAct && (
              <div className="text-xs text-orange-500 font-medium">預計 {liveArrEst}</div>
            )}
            {isLive && liveArrAct && <div className="text-xs text-green-600 font-medium">實際 {liveArrAct}</div>}
            <div className="text-lg font-bold text-primary mt-0.5">{flight.to.code}</div>
            <div className="text-xs text-sub">{flight.to.city}</div>
            {flight.to.terminal && (
              <div className="text-xs font-medium text-accent mt-1 bg-accent-light px-2 py-0.5 rounded-full inline-block">
                {flight.to.terminal}
              </div>
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
      {/* Countdown */}
      {countdownTarget && (
        <div className="bg-primary rounded-card p-5 shadow-card">
          <Countdown targetDate={countdownTarget} label={countdownLabel} />
        </div>
      )}

      {now > returnArr && (
        <div className="bg-accent-light rounded-card p-4 text-center text-sm text-sub">
          🎉 旅程已結束，平安到家！
        </div>
      )}

      {/* Last updated + refresh */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-sub">
          {lastUpdated
            ? `即時資料・${lastUpdated.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} 更新`
            : '載入即時資料中…'}
        </span>
        <button
          onClick={fetchLive}
          disabled={loadingState.outbound || loadingState.return}
          className="text-xs text-primary font-medium flex items-center gap-1 disabled:opacity-50"
        >
          <span className={loadingState.outbound || loadingState.return ? 'animate-spin' : ''}>↻</span>
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

      {/* Free plan notice */}
      <div className="text-xs text-sub/60 text-center px-4">
        資料來源：AviationStack · 免費方案每月 500 次查詢
      </div>
    </div>
  )
}
