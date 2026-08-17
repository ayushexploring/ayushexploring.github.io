import About from './components/About'
import Contact from './components/Contact'
import Education from './components/Education'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Honors from './components/Honors'
import Nav from './components/Nav'
import Publications from './components/Publications'
import Teaching from './components/Teaching'
import useReveal from './hooks/useReveal'
import useTheme from './hooks/useTheme'

export default function App() {
  const { theme, toggle } = useTheme()
  useReveal([])

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-50 dark:focus:bg-ink-50 dark:focus:text-ink-900"
      >
        Skip to content
      </a>

      <Nav theme={theme} onToggleTheme={toggle} />

      <main>
        <Hero />
        <About />
        {/* Alternating tints keep long scrolls legible without hard section rules */}
        <div className="bg-ink-100/40 dark:bg-ink-900/30">
          <Experience />
          <Education />
        </div>
        <Publications />
        <div className="bg-ink-100/40 dark:bg-ink-900/30">
          <Honors />
          <Teaching />
        </div>
        <Contact />
      </main>

      <Footer />
    </>
  )
}
