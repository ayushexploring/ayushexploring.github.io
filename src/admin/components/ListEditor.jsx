import { useState } from 'react'
import Field from './Field'

const btn =
  'rounded-lg px-2.5 py-1 text-[12px] font-medium text-ink-600 hover:bg-ink-100 disabled:opacity-30 dark:text-ink-300 dark:hover:bg-ink-800'

/** Nested list of objects — currently the students inside a supervision group. */
function ObjectList({ field, value, onChange }) {
  const rows = Array.isArray(value) ? value : []

  const set = (i, v) => onChange(rows.map((r, j) => (j === i ? v : r)))
  const remove = (i) => onChange(rows.filter((_, j) => j !== i))
  const move = (i, d) => {
    const next = [...rows]
    const j = i + d
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      <p className="text-[12px] font-semibold text-ink-700 dark:text-ink-200">{field.label}</p>
      <div className="mt-2 space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="rounded-xl border border-ink-200 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-900/60">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="truncate text-[12px] font-semibold text-ink-800 dark:text-ink-100">
                {field.itemLabel?.(row) ?? `#${i + 1}`}
              </span>
              <div className="flex shrink-0 gap-0.5">
                <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button type="button" className={btn} disabled={i === rows.length - 1} onClick={() => move(i, 1)}>
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-lg px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {field.subFields.map((sub) => (
                <div key={sub.name} className={sub.type === 'textarea' ? 'sm:col-span-2' : undefined}>
                  <Field field={sub} value={row?.[sub.name]} onChange={(v) => set(i, { ...row, [sub.name]: v })} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...rows, field.newItem()])}
          className="rounded-lg border border-dashed border-ink-300 px-3 py-1.5 text-[12px] font-medium text-ink-600 hover:border-accent-400 hover:text-accent-700 dark:border-ink-700 dark:text-ink-300"
        >
          + {field.addLabel ?? 'Add'}
        </button>
      </div>
    </div>
  )
}

function ItemForm({ section, item, onChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {section.fields.map((field) => {
        const full =
          field.type === 'textarea' ||
          field.type === 'stringList' ||
          field.type === 'objectList' ||
          field.type === 'object'

        return (
          <div key={field.name} className={full ? 'sm:col-span-2' : undefined}>
            {field.type === 'objectList' ? (
              <ObjectList field={field} value={item?.[field.name]} onChange={(v) => onChange({ ...item, [field.name]: v })} />
            ) : (
              <Field field={field} value={item?.[field.name]} onChange={(v) => onChange({ ...item, [field.name]: v })} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ListEditor({ section, items, onChange }) {
  const [open, setOpen] = useState(null)
  const rows = Array.isArray(items) ? items : []

  const update = (i, v) => onChange(rows.map((r, j) => (j === i ? v : r)))
  const remove = (i) => {
    onChange(rows.filter((_, j) => j !== i))
    setOpen(null)
  }
  const duplicate = (i) => {
    const copy = structuredClone(rows[i])
    onChange([...rows.slice(0, i + 1), copy, ...rows.slice(i + 1)])
    setOpen(i + 1)
  }
  const move = (i, d) => {
    const next = [...rows]
    const j = i + d
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    setOpen(j)
  }
  const add = () => {
    onChange([...rows, section.newItem()])
    setOpen(rows.length)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[13px] text-ink-500 dark:text-ink-400">
          {rows.length} {rows.length === 1 ? 'entry' : 'entries'}
        </p>
        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-ink-900 px-3 py-1.5 text-[13px] font-semibold text-ink-50 hover:opacity-90 dark:bg-ink-50 dark:text-ink-900"
        >
          + Add {section.label.replace(/s$/, '').toLowerCase()}
        </button>
      </div>

      <ul className="space-y-2">
        {rows.map((item, i) => {
          const isOpen = open === i
          return (
            <li key={i} className="overflow-hidden rounded-xl border border-ink-200 dark:border-ink-800">
              <div className="flex items-center gap-2 bg-white px-3 py-2.5 dark:bg-ink-900/50">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                >
                  <span className="shrink-0 text-ink-400">{isOpen ? '▾' : '▸'}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-ink-900 dark:text-ink-50">
                      {section.itemLabel(item)}
                    </span>
                    {section.itemMeta?.(item) && (
                      <span className="block truncate text-[11.5px] text-ink-500 dark:text-ink-400">
                        {section.itemMeta(item)}
                      </span>
                    )}
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-0.5">
                  <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)} title="Move up">
                    ↑
                  </button>
                  <button
                    type="button"
                    className={btn}
                    disabled={i === rows.length - 1}
                    onClick={() => move(i, 1)}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button type="button" className={btn} onClick={() => duplicate(i)} title="Duplicate">
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete “${section.itemLabel(item)}”?`)) remove(i)
                    }}
                    className="rounded-lg px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-ink-200 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950/40">
                  <ItemForm section={section} item={item} onChange={(v) => update(i, v)} />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {rows.length === 0 && (
        <p className="rounded-xl border border-dashed border-ink-300 py-10 text-center text-[13px] text-ink-500 dark:border-ink-700">
          Nothing here yet.
        </p>
      )}
    </div>
  )
}

export { ItemForm }
