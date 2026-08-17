import Icon from './Icon'
import { contacts, profile } from '../data/profile'

const social = contacts.filter((c) => !c.href.startsWith('mailto:'))

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 dark:border-ink-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-serif text-base font-semibold text-ink-900 dark:text-ink-50">{profile.name}</p>
          <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-400">
            {profile.tagline} · {profile.location}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={s.label}
              title={s.label}
              className="grid size-9 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-800/70 dark:hover:text-ink-100"
            >
              <Icon name={s.icon} className="size-[18px]" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
