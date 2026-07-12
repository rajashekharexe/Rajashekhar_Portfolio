import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion'
import { useRef, useCallback, useEffect } from 'react'
import { TextRepel } from './TextRepel'

/**
 * Experience Section Component
 * 
 * WHAT IT DOES:
 * Displays your work history and timeline. It features an interactive "spotlight" effect 
 * where hovering over the dark timeline reveals a bright, colored version underneath the mouse.
 * 
 * HOW IT WORKS:
 * 1. Tracks mouse movement via `useMotionValue` (no React re-renders = high performance).
 * 2. Uses a CSS `clip-path` circle mapped to the mouse coordinates to reveal a duplicated, bright version of the timeline layer.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks you to add a new job experience, scroll down inside this file and find the `experiences` array. Add a new object `{ year, role, company, desc }` there.
 * - To disable the spotlight effect, simply delete the `<motion.div>` that has `style={{ clipPath }}`.
 */
export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const bgX      = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const textY    = useTransform(scrollYProgress, [0, 1], ['20%', '-20%'])
  const lineScale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])

  // ── MotionValues for mouse — zero React re-renders on move ──────────────
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const clipPath = useMotionTemplate`circle(150px at ${mouseX}px ${mouseY}px)`

  // Cache the section's viewport rect — refresh on scroll/resize, NOT on mousemove
  const rectRef = useRef({ left: 0, top: 0 })

  const updateRect = useCallback(() => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    rectRef.current = { left: r.left, top: r.top }
  }, [])

  useEffect(() => {
    updateRect()
    window.addEventListener('scroll', updateRect, { passive: true })
    window.addEventListener('resize', updateRect, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateRect)
      window.removeEventListener('resize', updateRect)
    }
  }, [updateRect])

  // Hot path: only reads JS values — no DOM queries
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX - rectRef.current.left)
    mouseY.set(e.clientY - rectRef.current.top)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-1000)
    mouseY.set(-1000)
  }, [mouseX, mouseY])

  return (
    <section
      id="experience"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-32 px-8 bg-neutral-50 relative overflow-hidden"
    >

      {/* Watermark text — base layer (light) */}
      <motion.div
        style={{ x: bgX }}
        className="absolute top-[10%] left-0 whitespace-nowrap pointer-events-none select-none z-0"
      >
        <span className="text-[12rem] md:text-[22rem] font-display font-black uppercase text-neutral-200 leading-none tracking-tighter">
          EXPERIENCE
        </span>
      </motion.div>

      {/* Watermark text — dark layer revealed by cursor circle */}
      <motion.div
        style={{ x: bgX, clipPath }}
        className="absolute top-[10%] left-0 whitespace-nowrap pointer-events-none select-none z-0"
      >
        <span className="text-[12rem] md:text-[22rem] font-display font-black uppercase text-neutral-900 leading-none tracking-tighter drop-shadow-md">
          EXPERIENCE
        </span>
      </motion.div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

        {/* Left: Title */}
        <div className="lg:w-5/12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }}
            variants={{ hidden: { opacity: 0, y: 50, rotateX: 45 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } } }}
            className="origin-bottom"
          >
            <span className="text-xl font-display font-bold text-neutral-500 tracking-[0.2em] uppercase mb-4 block">
              Experience //
            </span>
            <h2 className="text-[3.5rem] md:text-[5.5rem] leading-[0.85] font-display font-black uppercase tracking-tighter text-neutral-900 mb-8 flex flex-col items-start">
              <div className="overflow-hidden pb-2" style={{ perspective: 1000 }}>
                <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                  <TextRepel text="Driven by" radius={120} strength={45} />
                </motion.div>
              </div>
              <div className="overflow-hidden pb-2" style={{ perspective: 1000 }}>
                <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                  <TextRepel text="Curiosity" radius={120} strength={45} />
                </motion.div>
              </div>
              <div className="overflow-hidden pb-2" style={{ perspective: 1000 }}>
                <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                  <TextRepel text="& Code."   radius={120} strength={45} />
                </motion.div>
              </div>
            </h2>
            <motion.div
              style={{ scaleX: lineScale }}
              className="w-32 h-2 bg-neutral-900 origin-left"
            />
          </motion.div>
        </div>

        {/* Right: Manifesto */}
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-7/12"
        >
          <div className="relative bg-white/50 backdrop-blur-md border border-neutral-200/50 p-8 md:p-12 rounded-[2rem] shadow-xl">
            <span className="absolute -top-12 -left-4 md:-left-8 text-[10rem] font-display font-black text-neutral-200 leading-none h-10 select-none z-0">"</span>

            <p className="text-xl md:text-2xl text-neutral-900 font-medium leading-relaxed relative z-10 mb-8">
              I am currently pursuing my BCA with a deep passion for software engineering, concentrating my energy directly on{' '}
              <strong className="text-black border-b border-black pb-1">building real-world applications.</strong>
            </p>
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-8 relative z-10">
              While I may be at the beginning of my professional journey, I haven't waited for graduation to start engineering. I've dedicated my time to architecting full-stack web platforms, integrating generative AI applications, and deploying real-time socket environments from the ground up.
            </p>
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed relative z-10 mb-12">
              I am a rapid learner, deeply obsessed with clean code and flawless UI/UX, and I am actively looking for opportunities to bring my dedication and developer mindset to a forward-thinking codebase.
            </p>

            <div className="grid grid-cols-2 gap-8 border-t border-neutral-200 pt-10 relative z-10">
              <div>
                <span className="block text-5xl font-display font-black text-neutral-900 mb-2 flex">
                  <TextRepel text="100%" radius={80} strength={25} />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Dedicated Learner</span>
              </div>
              <div>
                <span className="block text-5xl font-display font-black text-neutral-900 mb-2 flex">
                  <TextRepel text="24/7" radius={80} strength={25} />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Builder Mindset</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
