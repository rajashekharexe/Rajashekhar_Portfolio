import { useEffect, useState } from 'react'

export function Spotlight() {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 }) // Start off-screen

  useEffect(() => {
    // Disable on mobile where hover doesn't exist
    if (window.matchMedia('(pointer: coarse)').matches) return

    let animationFrameId: number;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const updateMousePosition = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    // Use pure manual lerp (linear interpolation) outside framer-motion for absolute zero-latency volumetric tracking
    const loop = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      setMousePosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', updateMousePosition)
    loop();

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <div
      className="fixed top-0 left-0 w-[1000px] h-[1000px] pointer-events-none z-[1] mix-blend-difference opacity-50"
      style={{
        transform: `translate(${mousePosition.x - 500}px, ${mousePosition.y - 500}px)`,
        background: `radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 65%)`
      }}
    />
  )
}
