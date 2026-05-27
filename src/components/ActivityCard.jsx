import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import TransportBadge from './TransportBadge'
import CopyButton from './CopyButton'

export default function ActivityCard({ activity, highlight }) {
  const [accordionOpen, setAccordionOpen] = useState(false)

  const borderColor =
    highlight === 'now'  ? 'border-l-[3px] border-primary' :
    highlight === 'next' ? 'border-l-[3px] border-pink-400' :
    'border-l-[3px] border-transparent'

  return (
    <div
      className={`rounded-card px-4 py-3.5 transition-shadow ${borderColor}`}
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: highlight === 'now'
          ? '1px solid rgba(79,126,247,0.25)'
          : highlight === 'next'
          ? '1px solid rgba(244,114,182,0.25)'
          : '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 2px 16px rgba(79,126,247,0.06)',
        borderLeftWidth: '3px',
      }}
    >
      {/* Status label */}
      {highlight === 'now' && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-semibold text-primary tracking-wide">現在進行中</span>
        </div>
      )}
      {highlight === 'next' && (
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-[11px] font-semibold text-pink-500">接下來</span>
        </div>
      )}

      {/* Time + Title */}
      <div className="text-[11px] text-sub font-medium mb-0.5 tabular-nums">
        {activity.startTime && activity.endTime
          ? `${activity.startTime} – ${activity.endTime}`
          : activity.startTime || ''}
      </div>
      <div className="text-sm font-semibold text-ink leading-snug">{activity.title}</div>

      {/* Transport */}
      {activity.transport && (
        <div className="mt-2">
          <TransportBadge type={activity.transport} detail={activity.transportDetail} />
        </div>
      )}

      {/* Korean address */}
      {activity.koreanAddress && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-sub font-mono tracking-tight">{activity.koreanAddress}</span>
          <CopyButton text={activity.koreanAddress} />
        </div>
      )}

      {/* Notes */}
      {activity.notes && (
        <div className="mt-2 text-[11px] text-sub/80 bg-slate-50/80 rounded-xl px-3 py-2 leading-relaxed">
          {activity.notes}
        </div>
      )}

      {/* Accordion */}
      {activity.accordion && (
        <div className="mt-2.5">
          <button
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-primary cursor-pointer"
          >
            <ChevronRight
              size={13}
              strokeWidth={2.5}
              className={`transition-transform duration-200 ${accordionOpen ? 'rotate-90' : ''}`}
            />
            {activity.accordion.title}
          </button>
          {accordionOpen && (
            <ul className="mt-2 space-y-1.5 pl-4 border-l-2 border-primary/20 ml-1.5">
              {activity.accordion.items.map((item, i) => (
                <li key={i} className="text-[11px] text-slate-600 leading-relaxed">{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
