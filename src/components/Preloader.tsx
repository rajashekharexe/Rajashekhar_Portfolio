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
    <motion.div 
      className="fixed inset-0 z-[10000] bg-black text-white flex flex-col items-center justify-center pointer-events-none overflow-hidden"
      initial={{ y: 0 }}
      animate={{ y: progress === 100 ? "-100%" : 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.7 }}
    >
      <div className="relative overflow-hidden">
        <motion.div 
          className="font-display font-black text-5xl md:text-[8rem] uppercase tracking-tighter"
        >
          RAJASHEKHAR
        </motion.div>
        
        {/* Loading fill effect over text */}
        <motion.div 
          className="absolute inset-0 bg-white mix-blend-difference origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="absolute bottom-12 right-12 font-bold text-2xl font-display tracking-widest overflow-hidden">
        <motion.div
           initial={{ y: "100%" }}
           animate={{ y: progress === 100 ? "-100%" : 0 }}
           transition={{ duration: 0.4 }}
        >
          {Math.min(progress, 100)}%
        </motion.div>
      </div>
    </motion.div>
  )
}
