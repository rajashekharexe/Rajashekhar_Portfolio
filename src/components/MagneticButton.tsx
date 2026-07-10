import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

/**
 * MagneticButton
 * 
 * WHAT IT DOES:
 * A wrapper component that makes anything inside it "stick" to your mouse cursor slightly when you hover over it (like a magnet).
 * Used for the Navbar links and GitHub button.
 * 
 * HOW IT WORKS:
 * `handleMouse` calculates the distance between your cursor (`clientX`) and the exact center of the button (`middleX`).
 * It sets the Framer Motion `animate` position to a fraction of that distance (e.g. `* 0.3`), pulling the button towards the mouse.
 */
export function MagneticButton({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current!.getBoundingClientRect()
    // Calculate distance from center of element
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    
    // Magnetic pull strength factors
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}
