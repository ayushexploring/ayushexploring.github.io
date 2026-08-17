import Icon from './Icon'
import Section from './Section'
import { honors } from '../data/profile'

export default function Honors() {
  return (
    <Section id="honors" title="Talks, Honors & Achievements" icon="award">
      <ul className="grid gap-4 sm:grid-cols-2">
        {honors.map((h, i) => (
          <li key={h.title} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
            <article className="flex h-full gap-4 rounded-2xl border border-ink-200 bg-white/60 p-5 transition-colors hover:border-ink-300 dark:border-ink-800 dark:bg-ink-900/50 dark:hover:border-ink-700">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                  h.kind === 'award'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                    : 'bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300'
                }`}
              >
                <Icon name={h.kind === 'award' ? 'award' : 'mic'} className="size-5" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-serif text-[17px] font-semibold leading-snug text-ink-900 dark:text-ink-50">
                    {h.title}
                  </h3>
                  <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                    {h.when}
                  </span>
                </div>
                <p className="mt-1.5 text-[14px] font-medium text-ink-700 dark:text-ink-300">{h.where}</p>
                {h.note && <p className="mt-2 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">{h.note}</p>}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  )
}
