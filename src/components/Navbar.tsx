import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { MagneticButton } from './MagneticButton'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });
  const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 border-b transition-all duration-500 ease-out will-change-transform ${
        isScrolled 
          ? 'py-4 bg-white/80 backdrop-blur-lg border-neutral-200/50 shadow-sm text-neutral-900' 
          : 'py-6 border-transparent mix-blend-difference text-white'
      }`}
    >
      <div className="text-2xl font-display font-bold tracking-tight">Rajashekhar</div>
      
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        {links.map((link) => (
          <MagneticButton key={link}>
            <a href={`#${link.toLowerCase()}`} className="relative group block p-2">
              {link}
              <span className={`absolute left-2 right-2 bottom-1 h-[1px] scale-x-0 transition-transform duration-300 origin-right group-hover:origin-left group-hover:scale-x-100 ${isScrolled ? 'bg-neutral-900' : 'bg-white'}`}></span>
            </a>
          </MagneticButton>
        ))}
      </div>

      <div className="flex items-center space-x-6 text-sm font-medium">
        <MagneticButton>
          <a href="https://github.com/rajashekharexe" target="_blank" rel="noopener noreferrer" className="hidden sm:block hover:text-gray-300 transition-colors p-2">GitHub</a>
        </MagneticButton>
      </div>
    </motion.nav>
  )
}
