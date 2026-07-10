/**
 * ScrambleText Component
 * 
 * WHAT IT DOES:
 * Renders the ScrambleText UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'

const chars = '!<>-_\\/[]{}—=+*^?#________'

export function ScrambleText({ text, className = "" }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text)
  const [hasAnimated, setHasAnimated] = useState(false)

  return (
    <motion.span 
      className={className}
      viewport={{ once: true, margin: "-50px" }}
      onViewportEnter={() => {
        if (hasAnimated) return
        setHasAnimated(true)
        
        let iterations = 0
        const interval = setInterval(() => {
          setDisplayText(text.split('').map((letter, index) => {
            // Keep spaces intact
            if (letter === ' ') return ' '
            if (index < iterations) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          }).join(''))
          
          if(iterations >= text.length) {
            clearInterval(interval)
            setDisplayText(text)
          }
          // The speed of unscrambling. Lower is slower reveal.
          iterations += 1/3
        }, 30)
      }}
    >
      {displayText}
    </motion.span>
  )
}
