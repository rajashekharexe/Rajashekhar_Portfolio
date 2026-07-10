/**
 * DecryptedText Component
 * 
 * WHAT IT DOES:
 * Renders the DecryptedText UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

interface DecryptedTextProps {
  text: string
  className?: string
  speed?: number // speed in ms per iteration
  maxIterations?: number
  delay?: number // delay before starting in ms
  animateOnHover?: boolean
}

const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
const numberChars = "0123456789"

// Helper to scramble while keeping letter widths and punctuation identical
function getScrambledChar(char: string) {
  if (char === " ") return " "
  if (/[a-z]/.test(char)) {
    return lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
  }
  if (/[A-Z]/.test(char)) {
    return uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
  }
  if (/[0-9]/.test(char)) {
    return numberChars[Math.floor(Math.random() * numberChars.length)]
  }
  return char
}

export function DecryptedText({
  text,
  className = "",
  speed = 35,
  maxIterations = 24,
  delay = 0,
  animateOnHover = true
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState("")
  const ref = useRef<HTMLSpanElement>(null)
  
  // Triggers only when the element is 100px inside the viewport
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isAnimating, setIsAnimating] = useState(false)
  const [triggerCount, setTriggerCount] = useState(0)

  // Trigger when element scrolls into view
  useEffect(() => {
    if (isInView) {
      setTriggerCount(prev => prev + 1)
    }
  }, [isInView])

  useEffect(() => {
    if (triggerCount === 0) return

    let isMounted = true
    let timeoutId: any
    setIsAnimating(true)

    const startAnimation = () => {
      let iteration = 0
      const length = text.length
      
      const interval = setInterval(() => {
        if (!isMounted) {
          clearInterval(interval)
          return
        }

        const nextText = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " "
            const revealProgress = iteration / maxIterations
            const thresholdIndex = Math.floor(revealProgress * length)
            
            if (index < thresholdIndex) {
              return text[index]
            }
            return getScrambledChar(text[index])
          })
          .join("")

        setDisplayText(nextText)

        if (iteration >= maxIterations) {
          setDisplayText(text)
          clearInterval(interval)
          setIsAnimating(false)
        }

        iteration++
      }, speed)

      return () => clearInterval(interval)
    }

    if (delay > 0) {
      timeoutId = setTimeout(startAnimation, delay)
    } else {
      startAnimation()
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      isMounted = false
    }
  }, [triggerCount, text, speed, maxIterations, delay])

  // Setup static scrambled text initially matching character sizes and spacing
  useEffect(() => {
    if (triggerCount === 0) {
      const initial = text
        .split("")
        .map(char => getScrambledChar(char))
        .join("")
      setDisplayText(initial)
    }
  }, [triggerCount, text])

  const handleMouseEnter = () => {
    if (animateOnHover && !isAnimating) {
      setTriggerCount(prev => prev + 1)
    }
  }

  return (
    <span 
      ref={ref} 
      className={className}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </span>
  )
}
