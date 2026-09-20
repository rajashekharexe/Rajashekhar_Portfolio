/**
 * LogoTicker Component
 * Infinite horizontal marquee ticker displaying core competencies and runtime environments.
 */
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const techs = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS',
  'Firebase', 'Express', 'MongoDB', 'HTML & CSS', 'C',
  'Framer Motion', 'GSAP', 'Socket.io', 'OpenCV', 'Vite'
]

export function LogoTicker() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: "100px" })
  // Duplicate for seamless infinite loop
  const items = [...techs, ...techs]

  return (
    <div ref={containerRef} className="py-12 bg-background border-t border-neutral-100 overflow-hidden flex relative z-20">

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={isInView ? { x: '-50%' } : {}}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex whitespace-nowrap will-change-transform"
      >
        {items.map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-10 text-foreground/40 hover:text-foreground transition-colors duration-300 cursor-default group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 group-hover:bg-neutral-900 transition-colors duration-300 flex-shrink-0" />
            <span className="text-lg font-display font-bold tracking-wide">{tech}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
