import { useMemo, useState } from 'react'
import Icon from './Icon'
import Section from './Section'
import useReveal from '../hooks/useReveal'
import { publications, upcoming } from '../data/profile'

const TYPES = ['All', 'Journal', 'Conference', 'Book Chapter']

const typeStyles = {
  Journal: 'bg-accent-100 text-accent-800 dark:bg-accent-900/60 dark:text-accent-200',
  Conference: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  'Book Chapter': 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
}

function highlightSelf(author) {
  return author.startsWith('Verma, A')
}

function PublicationCard({ pub, index }) {
  return (
    <li className="reveal h-full" style={{ transitionDelay: `${Math.min(index, 6) * 60}ms` }}>
      <article className="group relative h-full rounded-2xl border border-ink-200 bg-white/60 p-5 transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-sm dark:border-ink-800 dark:bg-ink-900/50 dark:hover:border-ink-700">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${typeStyles[pub.type]}`}>
            {pub.type}
          </span>
          <span className="text-[12px] font-medium tabular-nums text-ink-500 dark:text-ink-400">{pub.year}</span>
          {pub.citations > 0 && (
            <span
              title={`${pub.citations} citations on Google Scholar`}
              className="ml-auto inline-flex items-center gap-1 rounded-md bg-ink-100 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-ink-600 dark:bg-ink-800 dark:text-ink-300"
            >
              <Icon name="quote" className="size-3" />
              {pub.citations}
            </span>
          )}
        </div>

        <h3 className="mt-3 font-serif text-[17px] font-semibold leading-snug text-ink-900 dark:text-ink-50">
          <a href={pub.doi} target="_blank" rel="noreferrer noopener" className="hover:text-accent-700 dark:hover:text-accent-300">
            {pub.title}
          </a>
        </h3>

        <p className="mt-2 text-[13px] leading-relaxed text-ink-600 dark:text-ink-400">
          {pub.authors.map((a, i) => (
            <span key={a}>
              <span className={highlightSelf(a) ? 'font-semibold text-ink-900 dark:text-ink-100' : undefined}>{a}</span>
              {i < pub.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>

        <p className="mt-2 text-[13px] italic leading-relaxed text-ink-500 dark:text-ink-400">
          {pub.venue}
          {pub.details ? `, ${pub.details}` : ''}.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {pub.tags.map((t) => (
            <span key={t} className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-500 dark:bg-ink-800/80 dark:text-ink-400">
              {t}
            </span>
          ))}
          <a
            href={pub.doi}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent-700 transition-colors hover:text-accent-800 dark:text-accent-300 dark:hover:text-accent-200"
          >
            DOI
            <Icon name="external" className="size-3.5" />
          </a>
        </div>
      </article>
    </li>
  )
}

export default function Publications() {
  const [type, setType] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('citations')

  const counts = useMemo(() => {
    const c = { All: publications.length }
    for (const p of publications) c[p.type] = (c[p.type] ?? 0) + 1
    return c
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = publications.filter((p) => {
      if (type !== 'All' && p.type !== type) return false
      if (!q) return true
      const haystack = [p.title, p.venue, p.details, ...p.authors, ...p.tags, String(p.year)].join(' ').toLowerCase()
      return haystack.includes(q)
    })

    return matches.sort((a, b) =>
      sort === 'citations' ? b.citations - a.citations || b.year - a.year : b.year - a.year || b.citations - a.citations,
    )
  }, [type, query, sort])

  // Re-arm the reveal observer whenever the visible set changes.
  useReveal([type, query, sort])

  return (
    <Section
      id="publications"
      title="Publications"
      icon="book"
      kicker="Peer-reviewed journal, conference and book-chapter work in cyber security, computer vision and applied machine learning. Citation counts reflect Google Scholar."
    >
      {/* Controls */}
      <div className="reveal mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by publication type">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-medium transition-colors ${
                type === t
                  ? 'bg-ink-900 text-ink-50 dark:bg-ink-50 dark:text-ink-900'
                  : 'border border-ink-200 text-ink-600 hover:bg-ink-100 dark:border-ink-800 dark:text-ink-300 dark:hover:bg-ink-800/70'
              }`}
            >
              {t}
              <span className={`tabular-nums ${type === t ? 'opacity-70' : 'text-ink-400 dark:text-ink-500'}`}>
                {counts[t] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative">
            <span className="sr-only">Search publications</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, author, venue…"
              className="w-full rounded-xl border border-ink-200 bg-white/70 py-2 pl-9 pr-3 text-[13px] text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none sm:w-64 dark:border-ink-800 dark:bg-ink-900/60 dark:text-ink-100"
            />
          </label>

          <label className="flex items-center gap-2 text-[13px] text-ink-500 dark:text-ink-400">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-ink-200 bg-white/70 px-2.5 py-2 text-[13px] font-medium text-ink-700 focus:border-accent-400 focus:outline-none dark:border-ink-800 dark:bg-ink-900/60 dark:text-ink-200"
            >
              <option value="citations">Most cited</option>
              <option value="year">Newest</option>
            </select>
          </label>
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {visible.map((p, i) => (
            <PublicationCard key={p.doi} pub={p} index={i} />
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-ink-300 py-14 text-center text-sm text-ink-500 dark:border-ink-700 dark:text-ink-400">
          No publications match “{query}”.
        </p>
      )}

      {/* Forthcoming / indexed elsewhere */}
      <div className="reveal mt-12 rounded-2xl border border-ink-200 bg-ink-100/50 p-5 sm:p-6 dark:border-ink-800 dark:bg-ink-900/40">
        <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          <Icon name="spark" className="size-3.5" />
          Forthcoming &amp; recently indexed
        </h3>
        <ul className="mt-4 space-y-3.5">
          {upcoming.map((p) => (
            <li key={p.title} className="border-l-2 border-ink-300 pl-4 dark:border-ink-700">
              <p className="text-[15px] font-medium leading-snug text-ink-800 dark:text-ink-100">{p.title}</p>
              <p className="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">
                {p.authors.join(', ')} · <span className="italic">{p.venue}</span> · {p.year}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
