import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Force scroll to top on reload so it looks clean
    window.scrollTo(0, 0)

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer)
          // Wait briefly at 100% before lifting the curtain
          setTimeout(onComplete, 600)
          return 100
        }
        // Accelerate at the end for punchy feel
        return p + (p > 80 ? 8 : 4)
      })
    }, 40)
    
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none flex flex-col">
      {/* Top Half of the Vault */}
      <motion.div 
        className="w-full h-[50vh] bg-black flex items-end justify-center overflow-hidden"
        initial={{ y: 0 }}
        animate={{ y: progress === 100 ? "-100%" : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
      >
        {/* Text is cut in half by absolute positioning relative to screen center */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-5xl md:text-[8rem] uppercase tracking-tighter text-white overflow-hidden whitespace-nowrap">
          <div className="relative">
            RAJASHEKHAR
            <motion.div 
              className="absolute inset-0 bg-white mix-blend-difference origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Half of the Vault */}
      <motion.div 
        className="w-full h-[50vh] bg-black flex items-start justify-center overflow-hidden relative"
        initial={{ y: 0 }}
        animate={{ y: progress === 100 ? "100%" : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
      >
        <div className="absolute bottom-12 right-12 font-bold text-2xl font-display tracking-widest overflow-hidden text-white">
          <motion.div
             initial={{ y: "100%" }}
             animate={{ y: progress === 100 ? "100%" : 0 }}
             transition={{ duration: 0.4 }}
          >
            {Math.min(progress, 100)}%
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
