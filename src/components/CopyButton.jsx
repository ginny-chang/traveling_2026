import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg border transition-all duration-200 cursor-pointer ${
        copied
          ? 'bg-green-50 text-green-600 border-green-200'
          : 'bg-primary-light text-primary border-blue-100 hover:bg-primary hover:text-white hover:border-primary'
      }`}
    >
      {copied ? <Check size={10} strokeWidth={2.5} /> : <Copy size={10} strokeWidth={2} />}
      <span>{copied ? '已複製' : '複製'}</span>
    </button>
  )
}
