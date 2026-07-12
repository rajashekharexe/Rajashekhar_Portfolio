import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MagneticButton } from './MagneticButton'
import { useLenis } from 'lenis/react'
import { useSoundEffects } from '../hooks/useSoundEffects'

const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

/**
 * Navbar
 * 
 * WHAT IT DOES:
 * A sticky navigation bar that stays at the top of the screen. It changes color (transparent to white)
 * when you scroll down, and hides itself when you scroll into the 3D Galaxy section.
 * 
 * HOW IT WORKS:
 * Uses Framer Motion's `useScroll` and `useMotionValueEvent` to track how far the user has scrolled.
 * It uses an IntersectionObserver to figure out which section is currently on screen to underline the active link.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - To add or remove links, just change the `links` array at the top of this file.
 * - To change the white background color when scrolled, look for `bg-white/90` and change it to `bg-black/90` (and adjust text colors accordingly).
 */
export function Navbar({ isReady = true }: { isReady?: boolean }) {
  // isScrolled: true if the user scrolled past the hero section (triggers white background)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isGalaxy, setIsGalaxy] = useState(false)
  const { scrollY } = useScroll()
  const lenis = useLenis()
  const { playHover } = useSoundEffects()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)

    // Detect when the galaxy section is in full-screen mode
    const galaxyEl = document.getElementById('galaxy')
    if (galaxyEl) {
      const scrollable = galaxyEl.offsetHeight - window.innerHeight
      if (scrollable > 0) {
        const p = (latest - galaxyEl.offsetTop) / scrollable
        setIsGalaxy(p > 0.22 && p < 0.97)
      }
    }
  })

  // Track which section is currently in the viewport
  useEffect(() => {
    const sectionIds = links.map(l => l.toLowerCase())
    const observers: IntersectionObserver[] = []

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.4 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={isReady ? { y: 0, opacity: isGalaxy ? 0 : 1 } : { y: -20, opacity: 0 }}
      transition={{ duration: isGalaxy ? 0.5 : 0.8, ease: [0.16, 1, 0.3, 1], delay: isReady ? 0.5 : 0 }}
      style={{ pointerEvents: isGalaxy ? 'none' : 'auto' }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 border-b transition-all duration-300 ease-out will-change-transform ${
        isScrolled
          ? 'py-2 bg-white/90 backdrop-blur-lg border-neutral-200/50 shadow-sm text-neutral-900'
          : 'py-2.5 border-transparent mix-blend-difference text-white'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl font-display font-bold tracking-tight"
      >
        Rajashekhar
      </motion.div>

      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        {links.map((link, i) => {
          const id = link.toLowerCase()
          const isActive = activeSection === id
          return (
            <MagneticButton key={link}>
              <motion.a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  // Slim navbar height = py-2 (16px) + link text (~20px) = ~36px
                  // offset: -40 → section top sits just below the navbar
                  const offset = -40
                  if (lenis) {
                    lenis.scrollTo(`#${id}`, { offset, immediate: false })
                  } else {
                    const el = document.getElementById(id)
                    if (el) {
                      const top = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop)
                      window.scrollTo({ top: top + offset, behavior: 'smooth' })
                    }
                  }
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                onMouseEnter={playHover}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.06,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="relative group block p-2"
              >
                {link}
                {/* Hover underline */}
                <span
                  className={`absolute left-2 right-2 bottom-1 h-[1px] transition-transform duration-300 ${
                    isScrolled ? 'bg-neutral-900' : 'bg-white'
                  } ${
                    isActive
                      ? 'scale-x-100 origin-left'
                      : 'scale-x-0 origin-right group-hover:origin-left group-hover:scale-x-100'
                  }`}
                />
              </motion.a>
            </MagneticButton>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center space-x-6 text-sm font-medium"
      >
        <MagneticButton>
          <a
            href="https://github.com/rajashekharexe"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={playHover}
            className="hidden sm:block hover:text-gray-300 transition-colors p-2"
          >
            GitHub
          </a>
        </MagneticButton>
      </motion.div>
    </motion.nav>
  )
}
