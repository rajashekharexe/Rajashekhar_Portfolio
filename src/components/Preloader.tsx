import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Preloader
 * 
 * WHAT IT DOES:
 * Shows a loading screen with a progress bar. Once it hits 100%, the black "vault" 
 * doors split open (one goes up, one goes down) to reveal the website underneath.
 * 
 * HOW IT WORKS:
 * Uses `setInterval` to fake loading progress. `progress` controls the width of the 
 * loading bar. When `progress === 100`, Framer Motion triggers the exit animations.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - Change loading speed: Scroll down to `setInterval` and change `40` to a higher number (e.g. 100) to make it slower.
 * - Change door colors: Find `className="w-full h-[50vh] bg-black"` and change `bg-black` to `bg-blue-500`.
 */
export function Preloader({ onComplete, onStartExit }: { onComplete: () => void, onStartExit?: () => void }) {
  const [isDone, setIsDone] = useState(false)
  const progress = useMotionValue(0)
  
  // Create smooth motion transforms for the bar and text directly on the GPU
  const scaleX = useTransform(progress, [0, 100], [0, 1])
  const progressText = useTransform(progress, (v) => `LOADING ${Math.min(Math.floor(v), 100)}%`)

  useEffect(() => {
    window.scrollTo(0, 0)

    const controls = animate(progress, 100, {
      duration: 2.8,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        setIsDone(true)
        if (onStartExit) onStartExit()
        setTimeout(onComplete, 1600)
      }
    })
    
    return () => controls.stop()
  }, [onComplete, onStartExit, progress])

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none flex flex-col">
      {/* Top Half of the Vault */}
      <motion.div 
        className="w-full h-[50vh] bg-black"
        initial={{ y: 0 }}
        animate={{ y: isDone ? "-100%" : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
      />
      
      {/* Bottom Half of the Vault */}
      <motion.div 
        className="w-full h-[50vh] bg-black"
        initial={{ y: 0 }}
        animate={{ y: isDone ? "100%" : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
      />

      {/* Minimalist Premium Loading Overlay */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[10001] px-4 overflow-hidden"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: isDone ? 0 : 1, 
          scale: isDone ? 1.05 : 1,
          filter: isDone ? "blur(10px)" : "blur(0px)"
        }}
        style={{ willChange: "transform, opacity, filter" }}
        transition={{ duration: 0.5, ease: "easeIn", delay: 0.3 }}
      >
        <div className="relative flex flex-col items-center w-full max-w-5xl mx-auto">
          {/* Name - Premium Staggered Reveal */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.05, delayChildren: 0.1 }
              }
            }}
            className="flex justify-center font-display font-black text-4xl sm:text-6xl md:text-[7rem] lg:text-[9rem] uppercase tracking-tighter text-white text-center leading-none overflow-hidden pb-2"
          >
            {"RAJASHEKHAR".split("").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { x: -40, opacity: 0, filter: "blur(8px)" },
                  visible: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
                }}
                className="inline-block"
                style={{ willChange: "transform, opacity, filter" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
          
          {/* Sleek Progress Bar */}
          <div className="w-full max-w-[200px] md:max-w-[400px] h-[2px] bg-neutral-900 mt-8 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white origin-left"
              style={{ scaleX }}
            />
          </div>

          {/* Percentage */}
          <motion.div className="mt-4 text-neutral-500 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase">
            {progressText}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
