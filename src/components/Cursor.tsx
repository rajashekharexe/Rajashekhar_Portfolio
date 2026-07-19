import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function Cursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Spring config for the main dot (fast)
  const springConfig = { damping: 25, stiffness: 400, mass: 0.2 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  // Spring config for the trailing ring (slower)
  const ringX = useSpring(cursorX, { damping: 30, stiffness: 200, mass: 0.8 })
  const ringY = useSpring(cursorY, { damping: 30, stiffness: 200, mass: 0.8 })

  const [cursorType, setCursorType] = useState('default')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorContext = target.closest('[data-cursor]')?.getAttribute('data-cursor')
      
      // Try to avoid getComputedStyle if possible by checking tag names first
      const isClickable = target.closest('a') || target.closest('button') || (target.style && target.style.cursor === 'pointer') || window.getComputedStyle(target).cursor === 'pointer'

      if (cursorContext) {
        setCursorType(cursorContext)
      } else if (isClickable) {
        setCursorType('pointer')
      } else {
        setCursorType('default')
      }
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Initial visible state
    setIsVisible(true)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorX, cursorY])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  // Mix-blend-difference requires us to know if it's an icon state
  const isIcon = cursorType === 'play' || cursorType === 'view'

  return (
    <>
      <style>{`
        /* Hide default cursor on devices that support hover */
        @media (hover: hover) and (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
      
      {/* Main morphing cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center justify-center overflow-hidden will-change-transform"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: cursorType === 'default' ? 10 : cursorType === 'pointer' ? 40 : cursorType === 'text' ? 3 : 70,
          height: cursorType === 'default' ? 10 : cursorType === 'pointer' ? 40 : cursorType === 'text' ? 24 : 70,
          borderRadius: cursorType === 'text' ? 2 : 9999,
          backgroundColor: '#fff',
          mixBlendMode: isIcon ? 'normal' : 'difference',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Play Icon */}
        <motion.div
          animate={{ opacity: cursorType === 'play' ? 1 : 0, scale: cursorType === 'play' ? 1 : 0.5 }}
          className="absolute inset-0 flex items-center justify-center text-black"
        >
          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </motion.div>

        {/* View Icon */}
        <motion.div
          animate={{ opacity: cursorType === 'view' ? 1 : 0, scale: cursorType === 'view' ? 1 : 0.5 }}
          className="absolute inset-0 flex items-center justify-center text-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        </motion.div>
      </motion.div>

      {/* Trailing Ring (only visible in default state) */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border-[1.5px] border-white bg-transparent rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: isVisible && cursorType === 'default' ? 0.6 : 0,
          scale: cursorType === 'default' ? 1 : 0.5
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
