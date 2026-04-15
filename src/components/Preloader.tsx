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

      {/* Loading Percentage Number */}
      <div className="absolute bottom-12 right-12 font-bold text-2xl font-display tracking-widest overflow-hidden text-white z-[10001]">
        <motion.div
           initial={{ y: "100%" }}
           animate={{ y: progress === 100 ? "100%" : 0 }}
           transition={{ duration: 0.3 }}
        >
          {Math.min(progress, 100)}%
        </motion.div>
      </div>

      {/* Centered Typography Mask */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[10001]"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: progress === 100 ? 0 : 1, 
          scale: progress === 100 ? 1.05 : 1,
          filter: progress === 100 ? "blur(10px)" : "blur(0px)" 
        }}
        transition={{ duration: 0.4, ease: "easeIn" }}
      >
        <div className="font-display font-black text-5xl md:text-[8rem] uppercase tracking-tighter text-white whitespace-nowrap relative">
          RAJASHEKHAR
          
          <motion.div 
            className="absolute inset-0 bg-white mix-blend-difference origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>
    </div>
  )
}
