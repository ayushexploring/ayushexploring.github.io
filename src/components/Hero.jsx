import Icon from './Icon'
import { contacts, profile, publications, scholar, mentorship } from '../data/profile'

const primaryLinks = contacts.filter((c) => ['Google Scholar', 'GitHub', 'LinkedIn', 'ORCiD'].includes(c.label))

const menteeCount = mentorship.reduce((n, g) => n + g.students.length, 0)

const stats = [
  { label: 'Citations', value: scholar.citations, icon: 'quote' },
  { label: 'h-index', value: scholar.hIndex, icon: 'chart' },
  { label: 'i10-index', value: scholar.i10Index, icon: 'spark' },
  { label: 'Publications', value: publications.length, icon: 'book' },
  { label: 'Students mentored', value: menteeCount, icon: 'users' },
]

export default function Hero() {
  return (
    <div id="top" className="relative overflow-hidden">
      {/* Ambient background: soft accent wash + faint grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-accent-200/35 blur-3xl dark:bg-accent-800/20" />
        <div className="absolute -right-24 top-32 size-72 rounded-full bg-accent-100/50 blur-3xl dark:bg-accent-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-ink-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ink-200)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] dark:bg-[linear-gradient(to_right,var(--color-ink-800)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ink-800)_1px,transparent_1px)] dark:opacity-60" />
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-14">
          {/* Portrait sits above the text on small screens, beside it from lg up. */}
          <div className="reveal order-first lg:order-last lg:pt-1">
            <img
              src="/ayush.webp"
              width="512"
              height="512"
              alt={profile.name}
              fetchPriority="high"
              className="size-28 rounded-full object-cover ring-1 ring-ink-200 sm:size-32 lg:size-44 dark:ring-ink-800"
            />
          </div>

          <div className="min-w-0">
            <h1 className="reveal font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink-900 sm:text-6xl dark:text-ink-50">
              {profile.name}
            </h1>

            <p className="reveal mt-5 max-w-2xl text-lg leading-relaxed text-ink-600 dark:text-ink-300">
              <span className="font-semibold text-ink-900 dark:text-ink-100">{profile.role}</span> at{' '}
              {profile.org} — {profile.orgParent}.
            </p>
            <p className="reveal mt-2 max-w-2xl text-lg leading-relaxed text-ink-600 dark:text-ink-300">
              <span className="font-semibold text-ink-900 dark:text-ink-100">{profile.secondRole}</span> at{' '}
              <a
                href={profile.department.url}
                target="_blank"
                rel="noreferrer noopener"
                className="underline decoration-accent-400 decoration-2 underline-offset-2 transition-colors hover:text-accent-700 dark:hover:text-accent-300"
              >
                {profile.secondOrg}
              </a>
              .
            </p>

            <div className="reveal mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-500 dark:text-ink-400">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="pin" className="size-4" />
                {profile.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="spark" className="size-4" />
                {profile.tagline}
              </span>
            </div>

            <div className="reveal mt-9 flex flex-wrap items-center gap-2.5">
              <a
                href="#publications"
                className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-ink-50 shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-ink-50 dark:text-ink-900"
              >
                <Icon name="book" className="size-4" />
                View publications
              </a>
              <a
                href="mailto:ayush.k1998@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl border border-ink-300 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-400 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800/70"
              >
                <Icon name="mail" className="size-4" />
                Get in touch
              </a>

              <div className="ml-1 flex items-center gap-1">
                {primaryLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    title={l.label}
                    aria-label={l.label}
                    className="grid size-10 place-items-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/70 dark:hover:text-ink-100"
                  >
                    <Icon name={l.icon} className="size-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <dl className="reveal mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 sm:grid-cols-3 lg:grid-cols-5 dark:border-ink-800 dark:bg-ink-800">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink-50 px-4 py-5 dark:bg-ink-900/60">
              <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">
                <Icon name={s.icon} className="size-3.5" />
                {s.label}
              </dt>
              <dd className="mt-1.5 font-serif text-3xl font-semibold tabular-nums text-ink-900 dark:text-ink-50">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="reveal mt-3 text-[11px] text-ink-400 dark:text-ink-500">
          Citation metrics from{' '}
          <a
            href={scholar.url}
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-2 hover:text-ink-600 dark:hover:text-ink-300"
          >
            Google Scholar
          </a>
          , retrieved {scholar.retrieved}.
        </p>
      </div>
    </div>
  )
}
