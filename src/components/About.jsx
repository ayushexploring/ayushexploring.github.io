import Section from './Section'
import { profile } from '../data/profile'

export default function About() {
  return (
    <Section id="about" title="About" icon="spark">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="reveal space-y-5">
          {profile.about.map((para, i) => (
            <p key={i} className="text-[17px] leading-[1.75] text-ink-700 dark:text-ink-300">
              {para}
            </p>
          ))}
        </div>

        <aside className="reveal space-y-6">
          <div className="rounded-2xl border border-ink-200 bg-white/60 p-5 dark:border-ink-800 dark:bg-ink-900/50">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Research interests
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {profile.interests.map((t) => (
                <li
                  key={t}
                  className="rounded-lg bg-accent-100/70 px-2.5 py-1 text-[13px] font-medium text-accent-800 dark:bg-accent-900/50 dark:text-accent-200"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-ink-200 bg-white/60 p-5 dark:border-ink-800 dark:bg-ink-900/50">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Doctoral advisor
            </h3>
            <a
              href={profile.advisor.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 block font-serif text-lg font-semibold text-ink-900 underline decoration-accent-400 decoration-2 underline-offset-4 transition-colors hover:text-accent-700 dark:text-ink-50 dark:hover:text-accent-300"
            >
              {profile.advisor.name}
            </a>
            <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-400">{profile.department.name}</p>
          </div>
        </aside>
      </div>
    </Section>
  )
}
