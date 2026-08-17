import Icon from './Icon'

export default function Section({ id, title, icon, kicker, children, className = '' }) {
  return (
    /* scroll-mt-20 clears the 4rem sticky nav with a little breathing room. */
    <section id={id} className={`scroll-mt-20 py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="reveal mb-10">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">
                <Icon name={icon} className="size-[18px]" />
              </span>
            )}
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl dark:text-ink-50">
              {title}
            </h2>
          </div>
          {kicker && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">{kicker}</p>}
          <div className="mt-6 h-px bg-gradient-to-r from-ink-200 via-ink-200/60 to-transparent dark:from-ink-800 dark:via-ink-800/60" />
        </header>
        {children}
      </div>
    </section>
  )
}
