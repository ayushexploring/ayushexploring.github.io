/** Shared vertical timeline used by Experience and Education. */
export default function Timeline({ items }) {
  return (
    <ol className="relative space-y-3 border-l border-ink-200 pl-6 dark:border-ink-800 sm:pl-8">
      {items.map((item, i) => (
        <li key={i} className="reveal group relative" style={{ transitionDelay: `${i * 70}ms` }}>
          {/* Node on the rail */}
          <span
            aria-hidden="true"
            className={`absolute -left-[calc(1.5rem+5px)] top-6 size-[9px] rounded-full ring-4 ring-ink-50 transition-transform group-hover:scale-125 sm:-left-[calc(2rem+5px)] dark:ring-ink-950 ${
              item.current ? 'bg-accent-500' : 'bg-ink-300 dark:bg-ink-700'
            }`}
          />
          <div className="rounded-2xl border border-ink-200 bg-white/60 p-5 transition-colors hover:border-ink-300 dark:border-ink-800 dark:bg-ink-900/50 dark:hover:border-ink-700">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-serif text-[19px] font-semibold leading-snug text-ink-900 dark:text-ink-50">
                {item.heading}
              </h3>
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-[12px] font-medium tabular-nums ${
                  item.current
                    ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/60 dark:text-accent-200'
                    : 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400'
                }`}
              >
                {item.period}
              </span>
            </div>

            <p className="mt-1.5 text-[15px] font-medium text-ink-700 dark:text-ink-300">{item.org}</p>
            {item.sub && <p className="mt-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">{item.sub}</p>}
            {item.meta && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-ink-100 px-2.5 py-1 text-[12px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                {item.meta}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
