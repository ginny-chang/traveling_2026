import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CATEGORIES = ['餐飲', '交通', '購物', '票券', '住宿', '其他']

const CAT_SHORT = {
  餐飲: 'EAT', 交通: 'TRN', 購物: 'SHP', 票券: 'TKT', 住宿: 'STY', 其他: 'ETC',
}

const formatKRW = (amount) => `₩${Number(amount).toLocaleString('ko-KR')}`

export default function Expense() {
  const [names, setNames]     = useLocalStorage('busan-names', ['Ginny', 'Friend'])
  const [expenses, setExpenses] = useLocalStorage('busan-expenses', [])
  const [form, setForm]       = useState({ amount: '', payer: 0, category: '餐飲', note: '' })
  const [editingName, setEditingName] = useState(null)
  const [tempName, setTempName] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Calculations
  const paid      = [0, 1].map((i) =>
    expenses.filter((e) => e.payer === i).reduce((sum, e) => sum + e.amount, 0)
  )
  const total     = paid[0] + paid[1]
  const perPerson = total / 2
  const balance   = paid[0] - perPerson // positive = person0 paid more

  const addExpense = () => {
    const amount = parseInt(form.amount.replace(/,/g, ''), 10)
    if (!amount || isNaN(amount) || amount <= 0) return
    setExpenses((prev) => [{
      id: Date.now(), amount, payer: form.payer,
      category: form.category, note: form.note,
      createdAt: new Date().toISOString(),
    }, ...prev])
    setForm({ amount: '', payer: 0, category: '餐飲', note: '' })
    setShowForm(false)
  }

  const deleteExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id))

  const startEditName = (i) => { setEditingName(i); setTempName(names[i]) }
  const saveName = () => {
    if (tempName.trim()) {
      setNames((prev) => { const next = [...prev]; next[editingName] = tempName.trim(); return next })
    }
    setEditingName(null)
  }

  return (
    <div className="space-y-4">

      {/* Summary card */}
      <div className="border-2 border-ink rounded-card overflow-hidden">

        {/* Total */}
        <div className="px-4 py-4 border-b border-ink flex items-center justify-between">
          <div>
            <div className="text-2xs font-mono tracking-widest text-muted uppercase mb-1">總花費</div>
            <div className="font-heading font-black text-ink text-3xl leading-none tabular-nums">
              {formatKRW(total)}
            </div>
          </div>
          {total > 0 && (
            <div className="text-right">
              <div className="text-2xs font-mono text-muted mb-0.5">每人應付</div>
              <div className="font-mono font-bold text-sub text-sm">{formatKRW(perPerson)}</div>
            </div>
          )}
        </div>

        {/* Per-person row */}
        <div className="grid grid-cols-2 divide-x divide-border">
          {[0, 1].map((i) => (
            <div key={i} className="px-4 py-3">
              {editingName === i ? (
                <input
                  autoFocus
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  className="text-2xs font-bold text-ink w-full bg-transparent outline-none border-b border-ink"
                />
              ) : (
                <button
                  onClick={() => startEditName(i)}
                  className="text-2xs font-bold text-muted tracking-widest uppercase flex items-center gap-1 cursor-pointer hover:text-ink transition-colors"
                >
                  {names[i]} <span className="opacity-40 text-[9px]">✎</span>
                </button>
              )}
              <div className="font-heading font-black text-ink text-xl mt-1 tabular-nums leading-none">
                {formatKRW(paid[i])}
              </div>
              <div className="text-2xs font-mono text-muted mt-0.5">已付</div>
            </div>
          ))}
        </div>

        {/* Balance */}
        {total > 0 && (
          <div className="px-4 py-3 border-t border-border bg-surface text-center">
            {Math.abs(balance) < 1 ? (
              <div className="text-2xs font-bold tracking-widest uppercase text-ink">剛好平帳</div>
            ) : balance > 0 ? (
              <div className="text-xs font-bold text-ink">
                {names[1]} 欠 {names[0]}{' '}
                <span className="font-heading font-black">{formatKRW(Math.abs(balance))}</span>
              </div>
            ) : (
              <div className="text-xs font-bold text-ink">
                {names[0]} 欠 {names[1]}{' '}
                <span className="font-heading font-black">{formatKRW(Math.abs(balance))}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add expense button */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 border border-border rounded-card py-3 text-2xs font-bold tracking-widest uppercase text-ink hover:border-ink hover:bg-surface transition-colors cursor-pointer"
        >
          <Plus size={12} strokeWidth={2.5} />
          新增支出
        </button>
      ) : (
        <div className="border border-border rounded-card overflow-hidden">
          {/* Form header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-2xs font-bold tracking-widest uppercase text-ink">新增支出</span>
            <button onClick={() => setShowForm(false)} className="text-muted hover:text-ink cursor-pointer">
              <X size={14} strokeWidth={2} />
            </button>
          </div>

          <div className="px-4 py-4 space-y-4">
            {/* Amount */}
            <div>
              <label className="text-2xs font-mono text-muted uppercase tracking-widest block mb-1.5">金額（₩）</label>
              <input
                type="number"
                placeholder="15000"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full border border-border rounded-badge px-3 py-2.5 text-sm font-mono text-ink outline-none focus:border-ink transition-colors"
              />
            </div>

            {/* Payer */}
            <div>
              <label className="text-2xs font-mono text-muted uppercase tracking-widest block mb-1.5">付款人</label>
              <div className="flex gap-2">
                {[0, 1].map((i) => (
                  <button
                    key={i}
                    onClick={() => setForm((f) => ({ ...f, payer: i }))}
                    className={`flex-1 py-2 rounded-badge text-sm font-bold border-2 transition-all cursor-pointer ${
                      form.payer === i ? 'border-ink bg-ink text-white' : 'border-border text-sub hover:border-ink hover:text-ink'
                    }`}
                  >
                    {names[i]}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-2xs font-mono text-muted uppercase tracking-widest block mb-1.5">類別</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setForm((f) => ({ ...f, category: cat }))}
                    className={`px-2.5 py-1 rounded-badge text-2xs font-bold border transition-all cursor-pointer ${
                      form.category === cat
                        ? 'border-ink bg-ink text-white'
                        : 'border-border text-sub hover:border-ink hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-2xs font-mono text-muted uppercase tracking-widest block mb-1.5">備註（可選）</label>
              <input
                type="text"
                placeholder="例如：汗蒸幕入場費"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                className="w-full border border-border rounded-badge px-3 py-2.5 text-sm font-mono text-ink outline-none focus:border-ink transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              onClick={addExpense}
              className="w-full py-3 rounded-badge text-2xs font-bold tracking-widest uppercase bg-ink text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              新增
            </button>
          </div>
        </div>
      )}

      {/* Expense list */}
      {expenses.length > 0 ? (
        <div className="space-y-2">
          <div className="text-2xs font-mono tracking-widest text-muted uppercase">支出明細</div>
          {expenses.map((expense) => (
            <div key={expense.id} className="bg-white border border-border rounded-card px-4 py-3 flex items-center gap-3">
              {/* Category */}
              <div className="w-10 h-10 border border-border rounded-badge flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-mono font-bold text-sub tracking-wider">
                  {CAT_SHORT[expense.category] || 'ETC'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xs font-bold text-ink">{expense.category}</span>
                  {expense.note && (
                    <span className="text-2xs text-muted font-mono truncate">· {expense.note}</span>
                  )}
                </div>
                <div className="text-2xs font-mono text-muted mt-0.5">
                  {names[expense.payer]} 付款
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-heading font-black text-ink text-sm tabular-nums">
                  {formatKRW(expense.amount)}
                </span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-card py-10 text-center">
          <div className="text-2xs font-mono tracking-widest text-muted uppercase">還沒有支出記錄</div>
        </div>
      )}
    </div>
  )
}
