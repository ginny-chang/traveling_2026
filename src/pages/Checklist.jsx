import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultChecklist } from '../data/checklist'

// Build initial state: { id: false, ... }
const buildInitial = () => {
  const state = {}
  defaultChecklist.forEach((cat) => cat.items.forEach((item) => { state[item.id] = false }))
  return state
}

export default function Checklist() {
  const [checked, setChecked] = useLocalStorage('busan-checklist', buildInitial)

  const allIds = defaultChecklist.flatMap((c) => c.items.map((i) => i.id))
  const totalCount = allIds.length
  const checkedCount = allIds.filter((id) => checked[id]).length
  const allDone = checkedCount === totalCount

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  const reset = () => setChecked(buildInitial())

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-ink text-lg">行李清單</h2>
          <p className="text-xs text-sub mt-0.5">
            已完成 {checkedCount} / {totalCount} 項
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs text-sub border border-border rounded-lg px-3 py-1.5 hover:bg-border/30 transition-colors"
        >
          重設
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-border rounded-full h-2">
        <div
          className="bg-primary rounded-full h-2 transition-all duration-500"
          style={{ width: `${(checkedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* All done banner */}
      {allDone && (
        <div className="bg-primary-light rounded-card p-4 text-center">
          <div className="text-2xl mb-1">✅</div>
          <div className="font-semibold text-primary">準備完成！出發囉 🎉</div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {defaultChecklist.map((cat) => {
          const catChecked = cat.items.filter((i) => checked[i.id]).length
          return (
            <div key={cat.category} className="bg-white rounded-card shadow-card overflow-hidden">
              {/* Category header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-sm text-ink">{cat.category}</span>
                <span className="text-xs text-sub">{catChecked}/{cat.items.length}</span>
              </div>

              {/* Items */}
              <div className="divide-y divide-border/50">
                {cat.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checked[item.id]
                        ? 'bg-primary border-primary'
                        : 'border-border bg-white'
                    }`}>
                      {checked[item.id] && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm transition-all ${
                      checked[item.id] ? 'line-through text-sub' : 'text-ink'
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
