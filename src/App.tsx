import { useState, useEffect, lazy, Suspense } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { AboutMe } from './components/AboutMe'
import { LogoTicker } from './components/LogoTicker'
import { SmoothScroll } from './components/SmoothScroll'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { GitHubStats } from './components/GitHubStats'
import { Experience } from './components/Experience'
import { Contact } from './components/Contact'
import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Spotlight } from './components/Spotlight'
import { ScrollProgress } from './components/ScrollProgress'
import { VelocityMarquee } from './components/VelocityMarquee'

// Code-split heavy interactive chunks to optimize initial bundle size and First Input Delay (FID)
const Terminal = lazy(() =>
  import('./components/Terminal').then(m => ({ default: m.Terminal }))
)

/**
 * SectionShell
 * Lightweight layout-stable placeholder while asynchronous chunks resolve.
 */
const SectionShell = ({ id, bg = 'bg-black', h = 'min-h-screen' }: { id: string; bg?: string; h?: string }) => (
  <div id={id} className={`${h} ${bg}`} />
)

/**
 * Root Application Component
 * Coordinates global viewport states, smooth scrolling, and preloader lifecycle.
 */
function App() {
  const [loading, setLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Prevent Chrome from aggressively snapping down to previous scroll positions after reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (loading) {
      // Lock scroll and prevent Windows layout shift by reserving scrollbar space
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      // Restore scroll and padding, ensure page starts at the top
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      window.scrollTo(0, 0)
    }
  }, [loading])

  return (
    <>
      {loading && <Preloader onStartExit={() => setIsReady(true)} onComplete={() => setLoading(false)} />}
      <ScrollProgress />
      <Spotlight />
      <Cursor />
      <SmoothScroll>
        <main className="bg-background min-h-screen text-foreground font-sans">
          <Navbar isReady={isReady || !loading} />
          <Hero isReady={isReady || !loading} />
          <AboutMe />

          <div className="bg-background relative z-10 w-full overflow-hidden">
            <VelocityMarquee baseVelocity={-2}>Software Engineer</VelocityMarquee>
            <VelocityMarquee baseVelocity={2}>Creative Developer</VelocityMarquee>
          </div>

          <LogoTicker />
          <Skills />
          <Projects />
          <GitHubStats />

          {/* Galaxy — lazy loaded, fallback keeps layout stable */}
          {/* 
          <Suspense fallback={<SectionShell id="galaxy" />}>
            <PhysicsPlayground />
          </Suspense>
          */}

          {/* Terminal — lazy loaded */}
          <Suspense fallback={<SectionShell id="terminal" bg="bg-neutral-950" h="h-[600px]" />}>
            <Terminal />
          </Suspense>

          <Experience />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  )
}

export default App
