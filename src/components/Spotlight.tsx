/**
 * Spotlight Component
 * 
 * WHAT IT DOES:
 * Renders the Spotlight UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import { useEffect, useRef } from 'react'

export function Spotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable on mobile/touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let animationFrameId: number
    let targetX = -1000
    let targetY = -1000
    let currentX = -1000
    let currentY = -1000

    const updateMousePosition = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const loop = () => {
      // Linear interpolation (lerp) for smooth trailing
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15
      
      if (spotlightRef.current) {
        // Direct DOM manipulation + translate3d bypasses React render and utilizes GPU acceleration
        spotlightRef.current.style.transform = `translate3d(${currentX - 350}px, ${currentY - 350}px, 0)`
      }
      
      animationFrameId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', updateMousePosition)
    loop()

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <div
      ref={spotlightRef}
      className="fixed top-0 left-0 w-[700px] h-[700px] pointer-events-none z-[1] mix-blend-difference opacity-15 will-change-transform"
      style={{
        transform: `translate3d(-1000px, -1000px, 0)`,
        background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 65%)`
      }}
    />
  )
}
