/**
 * SmoothScroll Component
 * 
 * WHAT IT DOES:
 * Renders the SmoothScroll UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    // lerp 0.08 → smoother on high refresh rate monitors (144hz)
    // syncTouch: native-speed touch, no added delay
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, syncTouch: false, touchMultiplier: 1.5 }}>
      {children}
    </ReactLenis>
  )
}
