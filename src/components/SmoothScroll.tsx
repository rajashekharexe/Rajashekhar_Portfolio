/**
 * SmoothScroll Component
 * Integrates Lenis smooth scrolling with inertia lerping for high refresh rate viewports.
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
