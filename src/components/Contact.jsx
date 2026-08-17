import Icon from './Icon'
import Section from './Section'
import { contacts } from '../data/profile'

export default function Contact() {
  return (
    <Section
      id="contact"
      title="Get in touch"
      icon="mail"
      kicker="Happy to hear about research collaborations, student supervision, or talks on cyber security and applied deep learning."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {contacts.map((c, i) => {
          const external = !c.href.startsWith('mailto:')
          return (
            <li key={c.label} className="reveal" style={{ transitionDelay: `${Math.min(i, 5) * 55}ms` }}>
              <a
                href={c.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-ink-200 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-sm dark:border-ink-800 dark:bg-ink-900/50 dark:hover:border-accent-700"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-600 transition-colors group-hover:bg-accent-100 group-hover:text-accent-700 dark:bg-ink-800 dark:text-ink-300 dark:group-hover:bg-accent-900/60 dark:group-hover:text-accent-300">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                    {c.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[14.5px] font-medium text-ink-800 dark:text-ink-100">
                    {c.value}
                  </span>
                </span>
                <Icon
                  name="external"
                  className="size-4 shrink-0 text-ink-300 transition-colors group-hover:text-accent-600 dark:text-ink-600 dark:group-hover:text-accent-400"
                />
              </a>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
