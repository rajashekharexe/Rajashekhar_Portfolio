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
