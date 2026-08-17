const inputCls =
  'w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 ' +
  'focus:border-accent-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'

function Label({ field, children }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-ink-700 dark:text-ink-200">
        {field.label}
        {field.required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {field.hint && <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-500 dark:text-ink-400">{field.hint}</p>}
    </div>
  )
}

/** Array of plain strings — authors, tags, About paragraphs. */
function StringList({ field, value, onChange }) {
  const rows = Array.isArray(value) ? value : []

  const set = (i, v) => onChange(rows.map((r, j) => (j === i ? v : r)))
  const add = () => onChange([...rows, ''])
  const remove = (i) => onChange(rows.filter((_, j) => j !== i))
  const move = (i, d) => {
    const next = [...rows]
    const j = i + d
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <Label field={field}>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-start gap-1.5">
            {field.multiline ? (
              <textarea rows={3} className={inputCls} value={row} onChange={(e) => set(i, e.target.value)} />
            ) : (
              <input type="text" className={inputCls} value={row} onChange={(e) => set(i, e.target.value)} />
            )}
            <div className="flex shrink-0 gap-0.5 pt-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Move up"
                className="grid size-7 place-items-center rounded text-ink-400 hover:bg-ink-100 disabled:opacity-30 dark:hover:bg-ink-800"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                title="Move down"
                className="grid size-7 place-items-center rounded text-ink-400 hover:bg-ink-100 disabled:opacity-30 dark:hover:bg-ink-800"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                title="Remove"
                className="grid size-7 place-items-center rounded text-ink-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-dashed border-ink-300 px-3 py-1.5 text-[12px] font-medium text-ink-600 hover:border-accent-400 hover:text-accent-700 dark:border-ink-700 dark:text-ink-300"
        >
          + {field.addLabel ?? 'Add item'}
        </button>
      </div>
    </Label>
  )
}

export default function Field({ field, value, onChange }) {
  switch (field.type) {
    case 'stringList':
      return <StringList field={field} value={value} onChange={onChange} />

    case 'object':
      return (
        <fieldset className="rounded-xl border border-ink-200 p-4 dark:border-ink-800">
          <legend className="px-1 text-[12px] font-semibold text-ink-700 dark:text-ink-200">{field.label}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {field.subFields.map((sub) => (
              <Field
                key={sub.name}
                field={sub}
                value={value?.[sub.name]}
                onChange={(v) => onChange({ ...(value ?? {}), [sub.name]: v })}
              />
            ))}
          </div>
        </fieldset>
      )

    case 'textarea':
      return (
        <Label field={field}>
          <textarea
            rows={field.rows ?? 3}
            className={inputCls}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </Label>
      )

    case 'number':
      return (
        <Label field={field}>
          <input
            type="number"
            className={inputCls}
            value={value ?? ''}
            min={field.min}
            max={field.max}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          />
        </Label>
      )

    case 'select':
      return (
        <Label field={field}>
          <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o} value={o}>
                {field.optionLabels?.[o] ?? o}
              </option>
            ))}
          </select>
        </Label>
      )

    case 'boolean':
      return (
        <div>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="size-4 accent-accent-600"
            />
            <span className="text-[12px] font-semibold text-ink-700 dark:text-ink-200">{field.label}</span>
          </label>
          {field.hint && <p className="mt-1.5 text-[11.5px] text-ink-500 dark:text-ink-400">{field.hint}</p>}
        </div>
      )

    default:
      return (
        <Label field={field}>
          <input
            type={field.type === 'url' ? 'url' : 'text'}
            className={inputCls}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </Label>
      )
  }
}
