/**
 * PhysicsPlayground Component
 * 
 * WHAT IT DOES:
 * Renders the PhysicsPlayground UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { useRef } from 'react'
import { TextRepel } from './TextRepel'
import Galaxy from './Galaxy'

/* ── Glassmorphism button ── */
function GlassButton({ children, href }: { children: React.ReactNode; href?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="relative inline-flex"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group inline-flex items-center justify-center px-9 py-3.5 rounded-full cursor-pointer select-none overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1c1c1c 0%, #0d0d0d 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.09), 0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        <span className="absolute inset-0 pointer-events-none rounded-full"
          style={{ background: 'radial-gradient(ellipse 80% 65% at 50% 50%, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 45%, transparent 72%)' }}
        />
        <span className="absolute top-0 left-[12%] right-[12%] h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
        />
        {[0, 1, 2, 3].map(i => (
          <motion.span key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-white/50 pointer-events-none"
            style={{ left: `${18 + i * 21}%`, top: `${22 + (i % 2) * 44}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5], y: [0, -5, 0] }}
            transition={{ duration: 1.8 + i * 0.5, repeat: Infinity, delay: i * 0.45, ease: 'easeInOut' }}
          />
        ))}
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-full"
          style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)' }}
        />
        <span className="relative z-10 text-xs font-bold tracking-[0.18em] uppercase"
          style={{
            color: 'transparent',
            backgroundImage: 'linear-gradient(180deg,#ffffff 0%,#999999 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            textShadow: '0 0 18px rgba(255,255,255,0.35)',
          }}
        >
          {children}
        </span>
      </a>
    </motion.div>
  )
}

export function PhysicsPlayground() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  const progress = useTransform(scrollY, (y) => {
    const el = sectionRef.current
    if (!el) return 0
    const scrollable = el.offsetHeight - window.innerHeight
    if (scrollable <= 0) return 0
    return Math.max(0, Math.min(1, (y - el.offsetTop) / scrollable))
  })

  const headingY  = useTransform(progress, [0, 0.22], ['0%', '-130%'])
  const headingOp = useTransform(progress, [0, 0.18], [1, 0])
  const hintOp    = useTransform(progress, [0, 0.06], [1, 0])

  // ── GPU-composited expand: clip-path instead of top/left/right/bottom ──
  // Animating layout properties (top/left/right/bottom) causes a reflow every
  // scroll frame. clip-path is handled entirely on the compositor thread.
  const cT = useTransform(progress, [0, 0.40], [168, 0])   // top inset px
  const cS = useTransform(progress, [0, 0.40], [28,  0])   // side inset px
  const cB = useTransform(progress, [0, 0.40], [28,  0])   // bottom inset px
  const cR = useTransform(progress, [0, 0.36], [18,  0])   // border-radius px
  const clipPath = useMotionTemplate`inset(${cT}px ${cS}px ${cB}px ${cS}px round ${cR}px)`

  return (
    <section
      ref={sectionRef}
      id="galaxy"
      style={{ minHeight: '320vh', position: 'relative' }}
      className="bg-[#020208]"
    >
      {/* Sticky viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', willChange: 'transform' }} className="bg-[#020208]">

        {/* Heading — slides up as you scroll */}
        <motion.div
          style={{ y: headingY, opacity: headingOp }}
          className="absolute top-0 left-0 right-0 z-20 text-center pt-12 px-8 pointer-events-none"
        >
          <h2 className="text-[2.5rem] md:text-[4.5rem] font-display font-black uppercase leading-[0.85] tracking-tighter mb-4 text-white flex flex-col items-center">
            <TextRepel text="Tech"     radius={100} strength={35} className="text-white" />
            <TextRepel text="Universe" radius={100} strength={35} className="text-white" />
          </h2>
          <p className="text-neutral-500 text-sm font-medium mb-4">
            ✦ Move cursor to warp stars · Scroll to go full screen
          </p>
          <div className="pointer-events-auto flex justify-center mb-4">
            <GlassButton href="https://github.com/rajashekharexe">View My GitHub</GlassButton>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {['WebGL GLSL', 'Star Field', 'Mouse Interaction'].map(t => (
              <span key={t} className="text-[10px] font-mono border border-white/8 text-neutral-600 px-2.5 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </motion.div>

        {/* ── Galaxy canvas ──────────────────────────────────────────────────
            Uses clip-path (GPU compositor) instead of top/left/right/bottom
            (layout), so scrolling is zero-jank.                             */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,               // always covers full sticky viewport
            clipPath,               // ← GPU only, no layout reflow
            willChange: 'clip-path',
          }}
        >
          <div className="absolute inset-0 bg-[#020208]" />
          <Galaxy
            density={1.3}
            hueShift={0}
            saturation={0}          // ← pure white stars
            glowIntensity={0.5}
            speed={0.8}
            rotationSpeed={0.04}
            twinkleIntensity={0.6}
            mouseRepulsion
            repulsionStrength={3}
            transparent
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOp }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none"
        >
          <span className="text-neutral-600 text-[10px] font-mono uppercase tracking-widest">Scroll to expand</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="text-neutral-700 text-base"
          >↓</motion.div>
        </motion.div>

      </div>
    </section>
  )
}
