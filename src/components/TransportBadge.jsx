const transportConfig = {
  taxi: { icon: '🚖', label: '計程車', color: 'bg-amber-50 text-amber-700' },
  subway: { icon: '🚇', label: '地鐵', color: 'bg-blue-50 text-blue-700' },
  walk: { icon: '🚶', label: '步行', color: 'bg-green-50 text-green-700' },
  bus: { icon: '🚌', label: '公車', color: 'bg-purple-50 text-purple-700' },
  train: { icon: '🚂', label: '列車', color: 'bg-rose-50 text-rose-700' },
}

export default function TransportBadge({ type, detail }) {
  if (!type) return null
  const config = transportConfig[type]
  if (!config) return null

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-badge ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
      {detail && <span className="opacity-70">· {detail}</span>}
    </span>
  )
}
