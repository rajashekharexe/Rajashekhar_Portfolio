import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { LogoTicker } from './components/LogoTicker'
import { SmoothScroll } from './components/SmoothScroll'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Experience } from './components/Experience'
import { Contact } from './components/Contact'
import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Spotlight } from './components/Spotlight'
import { ScrollProgress } from './components/ScrollProgress'
import { VelocityMarquee } from './components/VelocityMarquee'
import { FluidBackground } from './components/FluidBackground'

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <ScrollProgress />
      <Spotlight />
      <Cursor />
      <FluidBackground />
      <SmoothScroll>
        <main className={`min-h-screen text-foreground font-sans ${loading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100 transition-opacity duration-1000'}`}>
          <Navbar />
          <Hero />
          
          <div className="relative z-10 w-full overflow-hidden">
            <VelocityMarquee baseVelocity={-2}>Software Engineer</VelocityMarquee>
            <VelocityMarquee baseVelocity={2}>Creative Developer</VelocityMarquee>
          </div>

          <LogoTicker />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  )
}

export default App
