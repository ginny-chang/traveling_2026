import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultChecklist } from '../data/checklist'

const buildInitial = () => {
  const state = {}
  defaultChecklist.forEach((cat) => cat.items.forEach((item) => { state[item.id] = false }))
  return state
}

export default function Checklist() {
  const [checked, setChecked] = useLocalStorage('busan-checklist', buildInitial)

  const allIds       = defaultChecklist.flatMap((c) => c.items.map((i) => i.id))
  const totalCount   = allIds.length
  const checkedCount = allIds.filter((id) => checked[id]).length
  const allDone      = checkedCount === totalCount
  const pct          = Math.round((checkedCount / totalCount) * 100)

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  const reset  = () => setChecked(buildInitial())

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xs font-mono tracking-widest text-muted uppercase mb-1">行李清單</div>
          <div className="font-heading font-black text-ink text-3xl leading-none tabular-nums">
            {String(checkedCount).padStart(2,'0')}
            <span className="text-muted text-xl">/{String(totalCount).padStart(2,'0')}</span>
          </div>
        </div>
        <button
          onClick={reset}
          className="text-2xs font-bold tracking-widest uppercase text-sub border border-border rounded-badge px-3 py-1.5 hover:border-ink hover:text-ink transition-colors cursor-pointer"
        >
          重設
        </button>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="h-1.5 flex-1 bg-surface rounded-full overflow-hidden mr-3">
            <div
              className="h-full bg-ink rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-2xs font-mono text-muted tabular-nums w-8 text-right">{pct}%</span>
        </div>
      </div>

      {/* All done banner */}
      {allDone && (
        <div className="border-2 border-ink rounded-card p-4 text-center">
          <div className="text-2xs font-mono tracking-widest text-muted mb-2 uppercase">全部完成</div>
          <div className="font-heading font-black text-ink text-xl">準備完成！出發囉</div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {defaultChecklist.map((cat) => {
          const catChecked = cat.items.filter((i) => checked[i.id]).length
          const catDone    = catChecked === cat.items.length
          return (
            <div key={cat.category} className={`border rounded-card overflow-hidden ${catDone ? 'border-ink' : 'border-border'}`}>

              {/* Category header */}
              <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                <span className="text-2xs font-bold tracking-widest uppercase text-ink">{cat.category}</span>
                <span className="text-2xs font-mono text-muted">{catChecked}/{cat.items.length}</span>
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {cat.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="hidden"
                    />
                    {/* Custom checkbox */}
                    <div className={`w-4.5 h-4.5 rounded-badge border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checked[item.id] ? 'bg-ink border-ink' : 'border-border bg-white'
                    }`}
                      style={{ width: '18px', height: '18px' }}
                    >
                      {checked[item.id] && (
                        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm transition-all ${
                      checked[item.id] ? 'line-through text-muted' : 'text-ink'
                    }`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
