import { useEffect, useState } from 'react'
import Icon from './Icon'
import { profile, sections } from '../data/profile'
import useActiveSection from '../hooks/useActiveSection'

const ids = sections.map((s) => s.id)

export default function Nav({ theme, onToggleTheme }) {
  const active = useActiveSection(ids)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-ink-200/80 bg-ink-50/85 backdrop-blur-md dark:border-ink-800/80 dark:bg-ink-950/85'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5 rounded-lg text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-ink-900 text-[11px] font-bold tracking-wider text-ink-50 transition-transform group-hover:-rotate-6 dark:bg-ink-50 dark:text-ink-900">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? 'true' : undefined}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                active === s.id
                  ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/60 dark:text-accent-200'
                  : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/70 dark:hover:text-ink-100'
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="grid size-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/70 dark:hover:text-ink-100"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="size-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 md:hidden dark:text-ink-400 dark:hover:bg-ink-800/70"
          >
            <Icon name={open ? 'close' : 'menu'} className="size-[18px]" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-200 bg-ink-50 md:hidden dark:border-ink-800 dark:bg-ink-950">
          <nav className="mx-auto grid max-w-5xl gap-0.5 px-5 py-3 sm:px-8" aria-label="Sections">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active === s.id
                    ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/60 dark:text-accent-200'
                    : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800/70'
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
