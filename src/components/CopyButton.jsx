import { useState } from 'react'

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border transition-all ${
        copied
          ? 'bg-primary text-white border-primary'
          : 'bg-primary-light text-primary border-primary/20 hover:bg-primary hover:text-white'
      }`}
    >
      <span>{copied ? '✓' : '📋'}</span>
      <span>{copied ? '已複製！' : '複製地址'}</span>
    </button>
  )
}
