import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    try { await navigator.clipboard.writeText(text) }
    catch { const e = document.createElement('textarea'); e.value = text; document.body.appendChild(e); e.select(); document.execCommand('copy'); document.body.removeChild(e) }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={`inline-flex items-center gap-1 text-2xs font-bold tracking-wide uppercase px-2 py-1 border transition-colors duration-150 cursor-pointer rounded-badge
        ${copied ? 'bg-ink text-white border-ink' : 'border-border text-sub hover:border-ink hover:text-ink'}`}
    >
      {copied ? <Check size={9} strokeWidth={3} /> : <Copy size={9} strokeWidth={2} />}
      {copied ? 'COPIED' : 'COPY'}
    </button>
  )
}
