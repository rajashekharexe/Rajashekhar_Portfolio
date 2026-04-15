import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function Cursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if hovering over a clickable element
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null

      setIsHovering(isClickable)
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseover', updateHoverState)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', updateHoverState)
    }
  }, [])

  // Do not render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <>
      <style>{`
        /* Hide default cursor on devices that support hover */
        @media (hover: hover) and (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
      
      {/* Outer Trailing Glass Ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border-[1.5px] border-neutral-400/50 bg-white/5 backdrop-blur-[2px] rounded-full pointer-events-none z-[9998] flex items-center justify-center"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.5 : 1,
          opacity: mousePosition.x === 0 && mousePosition.y === 0 ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.2 }}
      />
      
      {/* Inner Sharp Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-neutral-800 rounded-full pointer-events-none z-[9999]"
        style={{ mixBlendMode: 'difference' }}
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isHovering ? 0 : 1,
          backgroundColor: isHovering ? "white" : "white",
          opacity: mousePosition.x === 0 && mousePosition.y === 0 ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 28, mass: 0.1 }}
      />
    </>
  )
}
