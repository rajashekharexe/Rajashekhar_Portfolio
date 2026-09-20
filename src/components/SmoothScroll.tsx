/**
 * SmoothScroll Component
 * Integrates Lenis smooth scrolling with inertia lerping for high refresh rate viewports.
 */
import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    // lerp 0.1 → responsive and snappy without floaty scroll lag, while remaining silky smooth
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, syncTouch: true, wheelMultiplier: 1.0 }}>
      {children}
    </ReactLenis>
  )
}
