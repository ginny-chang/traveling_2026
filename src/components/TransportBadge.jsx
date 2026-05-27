import { Car, Train, Footprints, Bus, TramFront } from 'lucide-react'

const transportConfig = {
  taxi:   { Icon: Car,        label: '計程車', bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100' },
  subway: { Icon: TramFront,  label: '地鐵',   bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100' },
  walk:   { Icon: Footprints, label: '步行',   bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-100' },
  bus:    { Icon: Bus,        label: '公車',   bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  train:  { Icon: Train,      label: '列車',   bg: 'bg-rose-50',   text: 'text-rose-600',   border: 'border-rose-100' },
}

export default function TransportBadge({ type, detail }) {
  if (!type) return null
  const config = transportConfig[type]
  if (!config) return null
  const { Icon } = config

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-badge border ${config.bg} ${config.text} ${config.border}`}>
      <Icon size={12} strokeWidth={2} />
      <span>{config.label}</span>
      {detail && <span className="opacity-60">· {detail}</span>}
    </span>
  )
}
