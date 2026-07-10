import { useEffect, useRef } from 'react'

/**
 * Custom Cursor Component
 * 
 * WHAT IT DOES:
 * Hides the default computer mouse cursor and replaces it with a custom white dot and a trailing ring.
 * The cursor also changes color dynamically depending on what background it is hovering over (using mix-blend-difference).
 * 
 * HOW IT WORKS:
 * We use a `requestAnimationFrame` loop to continuously update the position of the custom cursor `div`s.
 * The outer ring uses "Lerp" (Linear Interpolation) physics to follow the inner dot smoothly with a slight delay.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to turn the cursor off entirely, remove `<Cursor />` from `App.tsx`.
 * - If sir asks to change the cursor color, scroll down to the bottom of this file and change `bg-white` and `border-white` to another Tailwind color class.
 */
export function Cursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable on mobile/touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let targetX = 0
    let targetY = 0
    let outerX = 0
    let outerY = 0
    let isHovering = false
    let isVisible = false
    let animationFrameId: number

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      
      if (!isVisible) {
        isVisible = true
        if (outerRef.current) outerRef.current.style.opacity = '1'
        if (innerRef.current) innerRef.current.style.opacity = '1'
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if hovering over a clickable element
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null

      isHovering = isClickable
    }

    const updatePosition = () => {
      // Lerp for smooth trailing effect (physics simulation)
      outerX += (targetX - outerX) * 0.22
      outerY += (targetY - outerY) * 0.22

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outerX - 24}px, ${outerY - 24}px, 0) scale(${isHovering ? 1.5 : 1})`
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${targetX - 5}px, ${targetY - 5}px, 0) scale(${isHovering ? 0 : 1})`
      }

      animationFrameId = requestAnimationFrame(updatePosition)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    updatePosition()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(animationFrameId)
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
      
      {/* Outer Trailing Ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-12 h-12 border-[1.5px] border-white bg-transparent rounded-full pointer-events-none z-[9998] opacity-0 mix-blend-difference transition-opacity duration-300 will-change-transform"
      />
      
      {/* Inner Sharp Dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[9999] opacity-0 mix-blend-difference transition-opacity duration-300 will-change-transform"
      />
    </>
  )
}
