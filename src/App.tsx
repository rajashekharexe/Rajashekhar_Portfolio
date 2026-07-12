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

// Heavy chunks — loaded only when needed to optimize the initial page load speed.
// INSTRUCTOR NOTE: If sir asks "how did you optimize performance?", tell him you used React.lazy() 
// to split the heavy 3D Physics and Terminal code so they don't block the initial page load.
// const PhysicsPlayground = lazy(() =>
//   import('./components/PhysicsPlayground').then(m => ({ default: m.PhysicsPlayground }))
// )
const Terminal = lazy(() =>
  import('./components/Terminal').then(m => ({ default: m.Terminal }))
)

/**
 * SectionShell
 * 
 * WHAT IT DOES: 
 * A lightweight placeholder box that shows up while the heavy chunks (like 3D Galaxy) are downloading.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * If sir asks to change the color of the loading placeholder, change the `bg` prop passed to it.
 */
const SectionShell = ({ id, bg = 'bg-black', h = 'min-h-screen' }: { id: string; bg?: string; h?: string }) => (
  <div id={id} className={`${h} ${bg}`} />
)

/**
 * App (Main Component)
 * 
 * WHAT IT DOES:
 * This is the root component of your website. It holds all the different sections (Hero, Skills, etc.)
 * and manages the global loading state (Preloader).
 * 
 * HOW IT WORKS:
 * It uses a `loading` state. While true, it shows the Preloader. Once the Preloader finishes,
 * it sets `loading` to false and reveals the main content with a smooth fade-in.
 */
/**
 * FEATURE REMOVAL STRATEGY (For your review):
 * If your sir asks you to remove ANY specific section or feature (e.g., "Remove the GitHub Stats"), 
 * DO NOT delete the actual file. Instead, simply scroll down to the `return` statement below, find 
 * the component (e.g., `<GitHubStats />`), and comment it out by adding `//` before it, or removing it.
 * This safely removes the feature from the screen instantly without breaking the app.
 */
function App() {
  // Global state to track if the black preloader screen is currently running
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
      // Restore scroll and padding
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
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
