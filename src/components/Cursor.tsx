import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function Cursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState("")

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

      const customTextTarget = target.closest('[data-cursor-text]') as HTMLElement
      if (customTextTarget) {
        setCursorText(customTextTarget.dataset.cursorText || "")
        setIsHovering(true)
      } else {
        setCursorText("")
        setIsHovering(isClickable)
      }
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
      
      {/* High-Contrast Awwwards Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[10000] flex items-center justify-center overflow-hidden"
        style={{ mixBlendMode: 'difference' }}
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: cursorText ? 10 : (isHovering ? 6 : 1),
          opacity: mousePosition.x === 0 && mousePosition.y === 0 ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.1 }}
      >
        {cursorText && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ mixBlendMode: 'normal' }}
            className="text-[1.5px] font-black tracking-widest text-black uppercase"
          >
            {cursorText}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}
