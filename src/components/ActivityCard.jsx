import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import TransportBadge from './TransportBadge'
import CopyButton from './CopyButton'

export default function ActivityCard({ activity, highlight }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`bg-white border rounded-card px-4 py-3.5 transition-colors duration-150
        ${highlight === 'now'  ? 'border-ink border-2'
        : highlight === 'next' ? 'border-ink'
        : 'border-border'}`}
    >
      {/* Status */}
      {highlight === 'now' && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" />
          <span className="text-2xs font-bold tracking-widest uppercase text-ink">Now</span>
        </div>
      )}
      {highlight === 'next' && (
        <span className="text-2xs font-bold tracking-widest uppercase text-sub block mb-2">Next</span>
      )}

      {/* Time */}
      <div className="text-2xs font-mono text-muted mb-0.5 tabular-nums">
        {activity.startTime && activity.endTime
          ? `${activity.startTime} — ${activity.endTime}`
          : activity.startTime || ''}
      </div>

      {/* Title */}
      <div className="text-sm font-bold text-ink leading-snug">{activity.title}</div>

      {/* Transport */}
      {activity.transport && (
        <div className="mt-2">
          <TransportBadge type={activity.transport} detail={activity.transportDetail} />
        </div>
      )}

      {/* Korean address */}
      {activity.koreanAddress && (
        <div className="mt-2 flex items-center gap-2 flex-wrap border-t border-border pt-2">
          <span className="text-2xs font-mono text-muted">{activity.koreanAddress}</span>
          <CopyButton text={activity.koreanAddress} />
        </div>
      )}

      {/* Notes */}
      {activity.notes && (
        <p className="mt-2 text-2xs text-sub leading-relaxed border-l-2 border-border pl-2">
          {activity.notes}
        </p>
      )}

      {/* Accordion */}
      {activity.accordion && (
        <div className="mt-2.5 border-t border-border pt-2.5">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-2xs font-bold tracking-wide uppercase text-ink cursor-pointer"
          >
            <ChevronRight size={12} strokeWidth={2.5} className={`transition-transform duration-150 ${open ? 'rotate-90' : ''}`} />
            {activity.accordion.title}
          </button>
          {open && (
            <ul className="mt-2 space-y-1.5 pl-4">
              {activity.accordion.items.map((item, i) => (
                <li key={i} className="text-2xs text-sub flex gap-2 leading-relaxed">
                  <span className="text-muted flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
