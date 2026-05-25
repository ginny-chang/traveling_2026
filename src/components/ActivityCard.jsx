import { useState } from 'react'
import TransportBadge from './TransportBadge'
import CopyButton from './CopyButton'

export default function ActivityCard({ activity, highlight }) {
  const [accordionOpen, setAccordionOpen] = useState(false)

  const highlightClass = highlight === 'now'
    ? 'border-l-4 border-primary bg-primary-light/40'
    : highlight === 'next'
    ? 'border-l-4 border-accent bg-accent-light/40'
    : 'border-l-4 border-transparent'

  return (
    <div className={`bg-white rounded-card shadow-card px-4 py-3 ${highlightClass}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Highlight label */}
          {highlight === 'now' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
              現在
            </span>
          )}
          {highlight === 'next' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent mb-1">
              ⏭ 接下來
            </span>
          )}

          {/* Time */}
          <div className="text-xs text-sub font-medium mb-0.5">
            {activity.startTime && activity.endTime
              ? `${activity.startTime} – ${activity.endTime}`
              : activity.startTime || ''}
          </div>

          {/* Title */}
          <div className="text-sm font-semibold text-ink leading-snug">
            {activity.title}
          </div>
        </div>
      </div>

      {/* Transport badge */}
      {activity.transport && (
        <div className="mt-2">
          <TransportBadge type={activity.transport} detail={activity.transportDetail} />
        </div>
      )}

      {/* Korean address */}
      {activity.koreanAddress && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-sub font-mono">{activity.koreanAddress}</span>
          <CopyButton text={activity.koreanAddress} />
        </div>
      )}

      {/* Notes */}
      {activity.notes && (
        <div className="mt-2 text-xs text-sub bg-border/40 rounded-lg px-3 py-2">
          {activity.notes}
        </div>
      )}

      {/* Accordion (special notes like spa tips) */}
      {activity.accordion && (
        <div className="mt-2">
          <button
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <span className={`transition-transform duration-200 ${accordionOpen ? 'rotate-90' : ''}`}>▶</span>
            {activity.accordion.title}
          </button>
          {accordionOpen && (
            <ul className="mt-2 space-y-1.5 pl-4">
              {activity.accordion.items.map((item, i) => (
                <li key={i} className="text-xs text-ink flex gap-2">
                  <span className="text-primary mt-0.5 flex-shrink-0">•</span>
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
