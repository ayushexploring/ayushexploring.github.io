import { useCallback, useEffect, useMemo, useState } from 'react'
import Connect from './Connect'
import Field from './components/Field'
import ListEditor from './components/ListEditor'
import useSettings from './useSettings'
import { SECTIONS, validate } from './schema'
import { loadContent, saveContent } from './github'
import bundled from '../data/content.json'

const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)

function ObjectEditor({ section, value, onChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {section.fields.map((field) => {
        const full = ['textarea', 'stringList', 'object'].includes(field.type)
        return (
          <div key={field.name} className={full ? 'sm:col-span-2' : undefined}>
            <Field field={field} value={value?.[field.name]} onChange={(v) => onChange({ ...value, [field.name]: v })} />
          </div>
        )
      })}
    </div>
  )
}

export default function Admin() {
  const { settings, setSettings, clear, configured } = useSettings()

  const [content, setContent] = useState(null)
  const [baseline, setBaseline] = useState(null)
  const [sha, setSha] = useState(null)
  const [active, setActive] = useState(SECTIONS[0].key)
  const [state, setState] = useState({ phase: 'idle', msg: '' })

  const dirty = content && baseline && !equal(content, baseline)
  const issues = useMemo(() => (content ? validate(content) : []), [content])

  const load = useCallback(async () => {
    setState({ phase: 'loading', msg: 'Loading current content from GitHub…' })
    try {
      const { json, sha: fileSha } = await loadContent(settings)
      setContent(json)
      setBaseline(structuredClone(json))
      setSha(fileSha)
      setState({ phase: 'idle', msg: '' })
    } catch (err) {
      // Fall back to the copy bundled at build time so the editor is still usable.
      setContent(structuredClone(bundled))
      setBaseline(structuredClone(bundled))
      setSha(null)
      setState({
        phase: 'error',
        msg: `${err.message} — showing the version bundled with this page instead. Publishing is disabled until a reload succeeds.`,
      })
    }
  }, [settings])

  useEffect(() => {
    if (configured) load()
  }, [configured, load])

  // Guard against closing the tab with uncommitted edits.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  async function publish() {
    if (issues.length) {
      setState({ phase: 'error', msg: `Fix ${issues.length} validation issue(s) before publishing.` })
      return
    }
    if (!sha) {
      setState({ phase: 'error', msg: 'Content was not loaded from GitHub — reload before publishing.' })
      return
    }

    const summary = describeChanges(baseline, content)
    setState({ phase: 'saving', msg: 'Committing to GitHub…' })
    try {
      const { sha: newSha, commitUrl } = await saveContent({
        ...settings,
        json: content,
        sha,
        message: `content: ${summary}`,
      })
      setSha(newSha)
      setBaseline(structuredClone(content))
      setState({
        phase: 'saved',
        msg: 'Published. GitHub Actions is rebuilding the site — it goes live in about a minute.',
        commitUrl,
      })
    } catch (err) {
      setState({ phase: 'error', msg: err.message })
    }
  }

  function download() {
    const blob = new Blob([JSON.stringify(content, null, 2) + '\n'], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!configured) return <Connect settings={settings} onSave={setSettings} />

  if (!content) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-ink-500">
        {state.msg || 'Loading…'}
      </div>
    )
  }

  const section = SECTIONS.find((s) => s.key === active)

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-ink-50/90 backdrop-blur dark:border-ink-800 dark:bg-ink-950/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">Content editor</h1>
            <p className="truncate text-[11.5px] text-ink-500 dark:text-ink-400">
              {settings.owner}/{settings.repo} · {settings.branch} · {settings.path}
            </p>
          </div>

          {dirty && (
            <span className="rounded-md bg-amber-100 px-2 py-1 text-[11.5px] font-semibold text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
              Unpublished changes
            </span>
          )}
          {issues.length > 0 && (
            <span className="rounded-md bg-rose-100 px-2 py-1 text-[11.5px] font-semibold text-rose-800 dark:bg-rose-900/50 dark:text-rose-200">
              {issues.length} issue{issues.length === 1 ? '' : 's'}
            </span>
          )}

          <button
            type="button"
            onClick={download}
            className="rounded-lg border border-ink-300 px-3 py-1.5 text-[12.5px] font-medium text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
          >
            Download JSON
          </button>
          <button
            type="button"
            onClick={load}
            className="rounded-lg border border-ink-300 px-3 py-1.5 text-[12.5px] font-medium text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={publish}
            disabled={!dirty || issues.length > 0 || state.phase === 'saving' || !sha}
            className="rounded-lg bg-ink-900 px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-50 disabled:opacity-40 dark:bg-ink-50 dark:text-ink-900"
          >
            {state.phase === 'saving' ? 'Publishing…' : 'Publish'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (dirty && !confirm('You have unpublished changes. Disconnect anyway?')) return
              clear()
              setContent(null)
            }}
            className="rounded-lg px-2 py-1.5 text-[12.5px] text-ink-500 hover:text-ink-800 dark:hover:text-ink-200"
          >
            Disconnect
          </button>
        </div>

        {state.msg && (
          <div
            className={`px-5 py-2 text-[12.5px] ${
              state.phase === 'error'
                ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                : state.phase === 'saved'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-ink-100 text-ink-700 dark:bg-ink-900 dark:text-ink-300'
            }`}
          >
            <div className="mx-auto max-w-6xl">
              {state.msg}
              {state.commitUrl && (
                <>
                  {' '}
                  <a href={state.commitUrl} target="_blank" rel="noreferrer noopener" className="font-semibold underline">
                    View commit
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[210px_1fr]">
        {/* Section list */}
        <nav className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto lg:block lg:space-y-0.5 lg:overflow-visible">
            {SECTIONS.map((s) => {
              const count = Array.isArray(content[s.key]) ? content[s.key].length : null
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => setActive(s.key)}
                    className={`flex w-full shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                      active === s.key
                        ? 'bg-ink-900 text-ink-50 dark:bg-ink-50 dark:text-ink-900'
                        : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'
                    }`}
                  >
                    {s.label}
                    {count !== null && (
                      <span className={active === s.key ? 'opacity-70' : 'text-ink-400'}>{count}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Editor */}
        <main className="min-w-0">
          <div className="mb-5">
            <h2 className="font-serif text-xl font-semibold text-ink-900 dark:text-ink-50">{section.label}</h2>
            {section.hint && (
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">{section.hint}</p>
            )}
          </div>

          {issues.length > 0 && (
            <details className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/40">
              <summary className="cursor-pointer text-[13px] font-semibold text-rose-800 dark:text-rose-300">
                {issues.length} issue{issues.length === 1 ? '' : 's'} blocking publish
              </summary>
              <ul className="mt-3 space-y-1.5 text-[12.5px] text-rose-800 dark:text-rose-300">
                {issues.map((iss, i) => (
                  <li key={i}>
                    <span className="font-medium">{iss.path}</span> — {iss.message}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {section.kind === 'object' ? (
            <ObjectEditor
              section={section}
              value={content[section.key]}
              onChange={(v) => setContent({ ...content, [section.key]: v })}
            />
          ) : (
            <ListEditor
              section={section}
              items={content[section.key]}
              onChange={(v) => setContent({ ...content, [section.key]: v })}
            />
          )}
        </main>
      </div>
    </div>
  )
}

/** Builds a readable commit message from what actually changed. */
function describeChanges(before, after) {
  const parts = []
  for (const s of SECTIONS) {
    const a = before?.[s.key]
    const b = after?.[s.key]
    if (equal(a, b)) continue

    if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
      const d = b.length - a.length
      parts.push(`${d > 0 ? '+' : ''}${d} ${s.label.toLowerCase()}`)
    } else {
      parts.push(`update ${s.label.toLowerCase()}`)
    }
  }
  return parts.length ? parts.join(', ') : 'update content'
}
