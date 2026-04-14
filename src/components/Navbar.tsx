import { motion } from 'framer-motion'
import { MagneticButton } from './MagneticButton'

export function Navbar() {
  const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-white"
    >
      <div className="text-2xl font-display font-bold tracking-tight">Rajashekhar</div>
      
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        {links.map((link) => (
          <MagneticButton key={link}>
            <a href={`#${link.toLowerCase()}`} className="relative group block p-2">
              {link}
              <span className="absolute left-2 right-2 bottom-1 h-[1px] bg-white scale-x-0 transition-transform duration-300 origin-right group-hover:origin-left group-hover:scale-x-100"></span>
            </a>
          </MagneticButton>
        ))}
      </div>

      <div className="flex items-center space-x-6 text-sm font-medium">
        <MagneticButton>
          <a href="https://github.com/Rajashekhar" target="_blank" className="hidden sm:block hover:text-gray-300 transition-colors p-2">GitHub</a>
        </MagneticButton>
      </div>
    </motion.nav>
  )
}
