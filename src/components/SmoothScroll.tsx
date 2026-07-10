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
    // lerp 0.12 (was 0.05) → snappy but still smooth
    // duration 1.0 (was 1.5) → no more 1.5s lag after wheel stop
    // syncTouch: native-speed touch, no added delay
    <ReactLenis root options={{ lerp: 0.12, duration: 1.0, smoothWheel: true, syncTouch: false, touchMultiplier: 1.5 }}>
      {children}
    </ReactLenis>
  )
}
