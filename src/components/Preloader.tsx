import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Signature } from './Signature'

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
export function Preloader({ onComplete }: { onComplete: () => void }) {
  // `progress` stores a number from 0 to 100.
  const [progress, setProgress] = useState(0)
  const [fontSize, setFontSize] = useState(64)

  useEffect(() => {
    // Force scroll to top on reload so it looks clean
    window.scrollTo(0, 0)

    const handleResize = () => {
      setFontSize(window.innerWidth < 768 ? 44 : 72)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer)
          // Wait briefly at 100% before lifting the curtain, and wait for the door animation (1.1s) to finish
          setTimeout(onComplete, 1200)
          return 100
        }
        // Accelerate at the end for punchy feel
        return p + (p > 80 ? 8 : 4)
      })
    }, 40)
    
    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none flex flex-col">
      {/* Top Half of the Vault */}
      <motion.div 
        className="w-full h-[50vh] bg-black"
        initial={{ y: 0 }}
        animate={{ y: progress === 100 ? "-100%" : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      />
      
      {/* Bottom Half of the Vault */}
      <motion.div 
        className="w-full h-[50vh] bg-black"
        initial={{ y: 0 }}
        animate={{ y: progress === 100 ? "100%" : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      />

      {/* Minimalist Premium Loading Overlay */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[10001] px-4 overflow-hidden"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: progress === 100 ? 0 : 1, 
          scale: progress === 100 ? 1.05 : 1,
          filter: progress === 100 ? "blur(10px)" : "blur(0px)" 
        }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        <div className="relative flex flex-col items-center w-full max-w-5xl mx-auto">
          {/* Name */}
          <div className="font-display font-black text-4xl sm:text-6xl md:text-[7rem] lg:text-[9rem] uppercase tracking-tighter text-white text-center leading-none">
            RAJASHEKHAR
          </div>
          
          {/* Sleek Progress Bar */}
          <div className="w-full max-w-[200px] md:max-w-[400px] h-[2px] bg-neutral-900 mt-8 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white origin-left"
              animate={{ scaleX: progress / 100 }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>

          {/* Percentage */}
          <div className="mt-4 text-neutral-500 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase">
            Loading {Math.min(progress, 100)}%
          </div>
        </div>
      </motion.div>
    </div>
  )
}
