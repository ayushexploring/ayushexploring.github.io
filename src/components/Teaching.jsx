import Icon from './Icon'
import Section from './Section'
import { mentorship, teaching } from '../data/profile'

const total = mentorship.reduce((n, g) => n + g.students.length, 0)

export default function Teaching() {
  return (
    <Section
      id="teaching"
      title="Teaching & Mentorship"
      icon="users"
      kicker={`Teaching at SC&SS, JNU alongside supervising ${total} graduate and undergraduate theses — several of which became peer-reviewed publications.`}
    >
      <div className="space-y-10">
        {/* Teaching */}
        <ul className="grid gap-4">
          {teaching.map((t) => (
            <li key={t.role} className="reveal">
              <div className="flex gap-4 rounded-2xl border border-ink-200 bg-white/60 p-5 dark:border-ink-800 dark:bg-ink-900/50">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">
                  <Icon name="cap" className="size-5" />
                </span>
                <div>
                  <h3 className="font-serif text-[17px] font-semibold text-ink-900 dark:text-ink-50">{t.role}</h3>
                  <p className="mt-1.5 text-[14px] text-ink-700 dark:text-ink-300">{t.org}</p>
                  {t.note && <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-400">{t.note}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Supervision, grouped by level */}
        <div className="space-y-8">
          {mentorship.map((group) => (
            <div key={group.level} className="reveal">
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50">{group.level}</h3>
                <span className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                  {group.students.length} {group.students.length === 1 ? 'student' : 'students'}
                </span>
                <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {group.students.map((s) => (
                  <li
                    key={s.name}
                    className="rounded-xl border border-ink-200 bg-white/50 p-4 transition-colors hover:border-ink-300 dark:border-ink-800 dark:bg-ink-900/40 dark:hover:border-ink-700"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">{s.name}</p>
                      <span className="shrink-0 text-[11.5px] tabular-nums text-ink-400 dark:text-ink-500">{s.period}</span>
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-ink-500 dark:text-ink-400">{s.institute}</p>
                    {s.title && (
                      <p className="mt-2 border-l-2 border-accent-300 pl-3 text-[13px] leading-relaxed text-ink-600 dark:border-accent-800 dark:text-ink-300">
                        {s.title}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
