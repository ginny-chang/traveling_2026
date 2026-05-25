import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CATEGORIES = ['餐飲', '交通', '購物', '票券', '住宿', '其他']

const formatKRW = (amount) =>
  `₩${Number(amount).toLocaleString('ko-KR')}`

export default function Expense() {
  const [names, setNames] = useLocalStorage('busan-names', ['Ginny', 'Friend'])
  const [expenses, setExpenses] = useLocalStorage('busan-expenses', [])
  const [form, setForm] = useState({ amount: '', payer: 0, category: '餐飲', note: '' })
  const [editingName, setEditingName] = useState(null) // 0 or 1
  const [tempName, setTempName] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Calculations
  const paid = [0, 1].map((i) =>
    expenses.filter((e) => e.payer === i).reduce((sum, e) => sum + e.amount, 0)
  )
  const total = paid[0] + paid[1]
  const perPerson = total / 2
  const balance = paid[0] - perPerson // positive = person0 paid more

  const addExpense = () => {
    const amount = parseInt(form.amount.replace(/,/g, ''), 10)
    if (!amount || isNaN(amount) || amount <= 0) return
    setExpenses((prev) => [
      {
        id: Date.now(),
        amount,
        payer: form.payer,
        category: form.category,
        note: form.note,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
    setForm({ amount: '', payer: 0, category: '餐飲', note: '' })
    setShowForm(false)
  }

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const startEditName = (i) => {
    setEditingName(i)
    setTempName(names[i])
  }

  const saveName = () => {
    if (tempName.trim()) {
      setNames((prev) => {
        const next = [...prev]
        next[editingName] = tempName.trim()
        return next
      })
    }
    setEditingName(null)
  }

  const categoryColors = {
    餐飲: 'bg-orange-50 text-orange-600',
    交通: 'bg-blue-50 text-blue-600',
    購物: 'bg-pink-50 text-pink-600',
    票券: 'bg-purple-50 text-purple-600',
    住宿: 'bg-green-50 text-green-600',
    其他: 'bg-gray-50 text-gray-600',
  }

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-primary rounded-card p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/80 text-xs font-medium">總花費</span>
          <span className="text-white font-heading font-bold text-xl">{formatKRW(total)}</span>
        </div>

        {/* Per-person breakdown */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white/20 rounded-xl p-2.5">
              {editingName === i ? (
                <input
                  autoFocus
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  className="text-white text-xs font-bold w-full bg-transparent outline-none border-b border-white/50"
                />
              ) : (
                <button
                  onClick={() => startEditName(i)}
                  className="text-white text-xs font-bold flex items-center gap-1"
                >
                  {names[i]} <span className="text-white/50 text-[10px]">✎</span>
                </button>
              )}
              <div className="text-white/70 text-[10px] mt-1">已付</div>
              <div className="text-white font-bold mt-0.5">{formatKRW(paid[i])}</div>
            </div>
          ))}
        </div>

        {/* Balance */}
        {total > 0 && (
          <div className="bg-white/20 rounded-xl p-3 text-center">
            {Math.abs(balance) < 1 ? (
              <span className="text-white text-sm font-semibold">✅ 剛好平帳！</span>
            ) : balance > 0 ? (
              <span className="text-white text-sm font-semibold">
                {names[1]} 欠 {names[0]}{' '}
                <span className="font-heading font-bold">{formatKRW(Math.abs(balance))}</span>
              </span>
            ) : (
              <span className="text-white text-sm font-semibold">
                {names[0]} 欠 {names[1]}{' '}
                <span className="font-heading font-bold">{formatKRW(Math.abs(balance))}</span>
              </span>
            )}
            <div className="text-white/60 text-xs mt-1">
              每人應付 {formatKRW(perPerson)}
            </div>
          </div>
        )}
      </div>

      {/* Add expense button / form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-white border-2 border-dashed border-border rounded-card py-3 text-sm font-medium text-primary hover:border-primary hover:bg-primary-light transition-all"
        >
          + 新增支出
        </button>
      ) : (
        <div className="bg-white rounded-card shadow-card p-4 space-y-3">
          <div className="font-semibold text-ink text-sm">新增支出</div>

          {/* Amount */}
          <div>
            <label className="text-xs text-sub mb-1 block">金額（韓元 ₩）</label>
            <input
              type="number"
              placeholder="例如：15000"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Payer */}
          <div>
            <label className="text-xs text-sub mb-1 block">付款人</label>
            <div className="flex gap-2">
              {[0, 1].map((i) => (
                <button
                  key={i}
                  onClick={() => setForm((f) => ({ ...f, payer: i }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    form.payer === i
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border text-sub'
                  }`}
                >
                  {names[i]}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-sub mb-1 block">類別</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    form.category === cat
                      ? 'border-primary bg-primary text-white'
                      : 'border-border text-sub'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-xs text-sub mb-1 block">備註（可選）</label>
            <input
              type="text"
              placeholder="例如：汗蒸幕入場費"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-border text-sub hover:bg-bg transition-colors"
            >
              取消
            </button>
            <button
              onClick={addExpense}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              新增
            </button>
          </div>
        </div>
      )}

      {/* Expense list */}
      {expenses.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs text-sub font-medium">支出明細</div>
          {expenses.map((expense) => (
            <div key={expense.id} className="bg-white rounded-card shadow-card px-4 py-3 flex items-center gap-3">
              {/* Category badge */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                categoryColors[expense.category] || 'bg-gray-50 text-gray-600'
              }`}>
                {expense.category.slice(0, 1)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-ink">{expense.category}</span>
                  {expense.note && (
                    <span className="text-xs text-sub truncate">· {expense.note}</span>
                  )}
                </div>
                <div className="text-xs text-sub mt-0.5">
                  {names[expense.payer]} 付款
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-ink text-sm">
                  {formatKRW(expense.amount)}
                </span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-sub hover:text-red-400 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-sub">
          <div className="text-3xl mb-2">💸</div>
          <div className="text-sm">還沒有支出記錄</div>
        </div>
      )}
    </div>
  )
}
