import { useState, useEffect } from 'react'
import { flights } from '../data/flight'

function Countdown({ targetDate, label }) {
  const [diff, setDiff] = useState(new Date(targetDate) - new Date())

  useEffect(() => {
    const update = () => setDiff(new Date(targetDate) - new Date())
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
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
        {days > 0 && (
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-white">{days}</div>
            <div className="text-xs text-white/60">天</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-3xl font-heading font-bold text-white">{String(hours).padStart(2, '0')}</div>
          <div className="text-xs text-white/60">時</div>
        </div>
        <div className="text-center self-center text-white/40 text-2xl pb-4">:</div>
        <div className="text-center">
          <div className="text-3xl font-heading font-bold text-white">{String(mins).padStart(2, '0')}</div>
          <div className="text-xs text-white/60">分</div>
        </div>
        <div className="text-center self-center text-white/40 text-2xl pb-4">:</div>
        <div className="text-center">
          <div className="text-3xl font-heading font-bold text-white">{String(secs).padStart(2, '0')}</div>
          <div className="text-xs text-white/60">秒</div>
        </div>
      </div>
    </div>
  )
}

function FlightCard({ flight, type }) {
  const dep = new Date(flight.departure)
  const arr = new Date(flight.arrival)
  const depTime = dep.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
  const arrTime = arr.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
  const depDate = dep.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })

  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden">
      {/* Type label */}
      <div className={`px-4 py-2 text-xs font-bold tracking-wider ${
        type === 'outbound' ? 'bg-primary-light text-primary' : 'bg-accent-light text-accent'
      }`}>
        {type === 'outbound' ? '✈️ 去程' : '✈️ 回程'}
        <span className="ml-2 font-normal opacity-70">{depDate}</span>
        {flight.flightNumber && <span className="ml-2 font-mono">{flight.flightNumber}</span>}
      </div>

      {/* Flight route */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div className="text-left">
            <div className="text-3xl font-heading font-bold text-ink">{depTime}</div>
            <div className="text-lg font-bold text-primary mt-0.5">{flight.from.code}</div>
            <div className="text-xs text-sub">{flight.from.city}</div>
            {flight.from.terminal && (
              <div className="text-xs font-medium text-accent mt-1 bg-accent-light px-2 py-0.5 rounded-full inline-block">
                {flight.from.terminal}
              </div>
            )}
          </div>

          {/* Plane icon */}
          <div className="flex flex-col items-center gap-1 flex-1 px-4">
            <div className="text-2xl">✈️</div>
            <div className="w-full flex items-center gap-1">
              <div className="h-px bg-border flex-1" />
              <div className="text-xs text-sub whitespace-nowrap">直飛</div>
              <div className="h-px bg-border flex-1" />
            </div>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div className="text-3xl font-heading font-bold text-ink">{arrTime}</div>
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

export default function FlightPage() {
  const now = new Date()
  const outboundDep = new Date(flights.outbound.departure)
  const returnDep = new Date(flights.return.departure)
  const returnArr = new Date(flights.return.arrival)

  let countdownTarget = null
  let countdownLabel = ''

  if (now < outboundDep) {
    countdownTarget = flights.outbound.departure
    countdownLabel = '距離去程起飛'
  } else if (now < returnDep) {
    countdownTarget = flights.return.departure
    countdownLabel = '距離回程起飛'
  }

  return (
    <div className="space-y-4">
      {/* Countdown banner */}
      {countdownTarget && (
        <div className="bg-primary rounded-card p-5 shadow-card">
          <Countdown targetDate={countdownTarget} label={countdownLabel} />
        </div>
      )}

      {/* Trip ended */}
      {now > returnArr && (
        <div className="bg-accent-light rounded-card p-4 text-center text-sm text-sub">
          🎉 旅程已結束，平安到家！
        </div>
      )}

      {/* Flight cards */}
      <div className="space-y-3">
        <FlightCard flight={flights.outbound} type="outbound" />
        <FlightCard flight={flights.return} type="return" />
      </div>

      {/* Note */}
      <div className="text-xs text-sub text-center px-4">
        班機號碼請在 <code className="bg-border/60 px-1 py-0.5 rounded text-ink">src/data/flight.js</code> 中填寫
      </div>
    </div>
  )
}
