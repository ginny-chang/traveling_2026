import { Car, TramFront, Footprints, Bus, Train } from 'lucide-react'

const config = {
  taxi:   { Icon: Car,        label: '計程車' },
  subway: { Icon: TramFront,  label: '地鐵' },
  walk:   { Icon: Footprints, label: '步行' },
  bus:    { Icon: Bus,        label: '公車' },
  train:  { Icon: Train,      label: '列車' },
}

export default function TransportBadge({ type, detail }) {
  if (!type || !config[type]) return null
  const { Icon, label } = config[type]
  return (
    <span className="inline-flex items-center gap-1.5 text-2xs font-semibold tracking-wide uppercase px-2 py-1 border border-border text-sub rounded-badge">
      <Icon size={10} strokeWidth={2} />
      {label}{detail && ` · ${detail}`}
    </span>
  )
}
