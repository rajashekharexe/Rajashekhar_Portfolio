/**
 * ScrollProgress Component
 * 
 * WHAT IT DOES:
 * Renders the ScrollProgress UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  // Shared spring physics for both bars
  const spring = {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  }

  const scaleX = useSpring(scrollYProgress, spring)
  const scaleY = useSpring(scrollYProgress, spring)

  return (
    <>
      {/* Horizontal — top of page */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-neutral-900 z-[10001] origin-left mix-blend-difference"
        style={{ scaleX }}
      />

      {/* Vertical — right side of page (matches horizontal exactly) */}
      <motion.div
        className="fixed top-0 right-0 bottom-0 w-[3px] bg-neutral-900 z-[10001] origin-top mix-blend-difference"
        style={{ scaleY }}
      />
    </>
  )
}
