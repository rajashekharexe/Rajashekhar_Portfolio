/**
 * DotField Component
 * 
 * WHAT IT DOES:
 * Renders the DotField UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import { useEffect, useRef, memo } from 'react'
import './DotField.css'

const TWO_PI = Math.PI * 2

interface Dot {
  ax: number; ay: number
  sx: number; sy: number
  vx: number; vy: number
  x: number;  y: number
}

interface DotFieldProps {
  dotRadius?: number
  dotSpacing?: number
  cursorRadius?: number
  cursorForce?: number
  bulgeOnly?: boolean
  bulgeStrength?: number
  glowRadius?: number
  sparkle?: boolean
  waveAmplitude?: number
  gradientFrom?: string
  gradientTo?: string
  glowColor?: string
  className?: string
}

const DotField = memo(({
  dotRadius     = 1.5,
  dotSpacing    = 14,
  cursorRadius  = 500,
  bulgeOnly     = true,
  bulgeStrength = 67,
  glowRadius    = 180,
  sparkle       = false,
  waveAmplitude = 0,
  gradientFrom  = 'rgba(255,255,255,0.75)',
  gradientTo    = 'rgba(255,255,255,0.55)',
  glowColor     = 'rgba(255,255,255,0.12)',
  className,
}: DotFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef   = useRef<SVGCircleElement>(null)
  const dotsRef   = useRef<Dot[]>([])

  // Mouse position IN canvas coordinates (viewport-relative, updated every move)
  const mouseRef  = useRef({ x: -9999, y: -9999 })

  // Canvas's top-left in the viewport — updated on scroll/resize, NOT on mousemove
  const originRef = useRef({ left: 0, top: 0 })

  const rafRef    = useRef<number | null>(null)
  const sizeRef   = useRef({ w: 0, h: 0 })
  const glowOpRef = useRef(0)
  const glowId    = useRef(`dfg-${Math.random().toString(36).slice(2, 9)}`)
  const rebuildRef = useRef<(() => void) | null>(null)

  const propsRef = useRef({ dotRadius, dotSpacing, cursorRadius, bulgeOnly, bulgeStrength, sparkle, waveAmplitude, gradientFrom, gradientTo })
  propsRef.current = { dotRadius, dotSpacing, cursorRadius, bulgeOnly, bulgeStrength, sparkle, waveAmplitude, gradientFrom, gradientTo }

  useEffect(() => {
    const canvas = canvasRef.current
    const glowEl = glowRef.current
    if (!canvas || !canvas.parentElement) return
    const parent = canvas.parentElement

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    /* ── Sizing ─────────────────────────────────────────────────────────── */
    function doResize() {
      const r = parent.getBoundingClientRect()
      const w = r.width, h = r.height
      // DPR=1: canvas dot size is fine at 1px/dot, 4x cheaper on retina
      canvas!.width  = w
      canvas!.height = h
      canvas!.style.width  = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      sizeRef.current   = { w, h }
      originRef.current = { left: r.left, top: r.top }
      buildDots(w, h)
    }

    // Refresh canvas origin on scroll (cheap: no canvas re-draw)
    function updateOrigin() {
      const r = parent.getBoundingClientRect()
      originRef.current = { left: r.left, top: r.top }
    }

    function buildDots(w: number, h: number) {
      const p    = propsRef.current
      const step = p.dotRadius + p.dotSpacing
      const cols = Math.floor(w / step)
      const rows = Math.floor(h / step)
      const padX = (w % step) / 2
      const padY = (h % step) / 2
      const dots: Dot[] = new Array(rows * cols)
      let idx = 0
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step + step / 2
          const ay = padY + row * step + step / 2
          dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay }
        }
      dotsRef.current = dots
    }

    rebuildRef.current = () => { const { w, h } = sizeRef.current; if (w > 0) buildDots(w, h) }

    /* ── Mouse ──────────────────────────────────────────────────────────── */
    function onMouseMove(e: MouseEvent) {
      // Convert viewport coords → canvas coords using cached origin (no DOM read)
      mouseRef.current = {
        x: e.clientX - originRef.current.left,
        y: e.clientY - originRef.current.top,
      }
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    /* ── Render loop (60+ fps unlocked) ───────────────────────────────────── */
    let frame = 0

    function tick(ts: number) {
      rafRef.current = requestAnimationFrame(tick)
      frame++

      const dots = dotsRef.current
      const m    = mouseRef.current
      const { w, h } = sizeRef.current
      const p    = propsRef.current
      const len  = dots.length
      const t    = frame * 0.02 // Adjusted for faster framerate

      const crSq    = p.cursorRadius * p.cursorRadius
      const rad     = p.dotRadius / 2
      const isBulge = p.bulgeOnly

      // Glow tracks mouse
      const glowActive = m.x > 0 && m.x < w && m.y > 0 && m.y < h
      glowOpRef.current += (( glowActive ? 1 : 0) - glowOpRef.current) * 0.08
      if (glowEl) {
        glowEl.setAttribute('cx', String(m.x))
        glowEl.setAttribute('cy', String(m.y))
        glowEl.style.opacity = String(Math.min(glowOpRef.current, 1))
      }

      ctx!.clearRect(0, 0, w, h)

      const grad = ctx!.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, p.gradientFrom)
      grad.addColorStop(1, p.gradientTo)
      ctx!.fillStyle = grad
      ctx!.beginPath()

      for (let i = 0; i < len; i++) {
        const d  = dots[i]
        const dx = m.x - d.ax
        const dy = m.y - d.ay
        const distSq = dx * dx + dy * dy

        if (distSq < crSq) {
          // Always react to cursor — no speed gate
          const dist  = Math.sqrt(distSq)
          if (isBulge) {
            const ratio = 1 - dist / p.cursorRadius
            const push  = ratio * ratio * p.bulgeStrength
            const angle = Math.atan2(dy, dx)
            // Adjusted lerp for 60fps smoothness (was 0.18)
            d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.09
            d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.09
          } else {
            const angle = Math.atan2(dy, dx)
            d.vx -= Math.cos(angle) * (150 / (dist + 1))
            d.vy -= Math.sin(angle) * (150 / (dist + 1))
          }
        } else if (isBulge) {
          // Spring back to anchor
          d.sx += (d.ax - d.sx) * 0.06
          d.sy += (d.ay - d.sy) * 0.06
        }

        if (!isBulge) {
          d.vx *= 0.94; d.vy *= 0.94
          d.x   = d.ax + d.vx; d.y = d.ay + d.vy
          d.sx += (d.x - d.sx) * 0.06
          d.sy += (d.y - d.sy) * 0.06
        }

        let drawX = d.sx, drawY = d.sy
        if (p.waveAmplitude > 0) {
          drawY += Math.sin(d.ax * 0.03 + t) * p.waveAmplitude
          drawX += Math.cos(d.ay * 0.03 + t * 0.7) * p.waveAmplitude * 0.5
        }

        if (p.sparkle) {
          const hash = ((i * 2654435761) ^ (frame >> 3)) >>> 0
          const r    = (hash % 100) < 3 ? rad * 1.8 : rad
          ctx!.moveTo(drawX + r, drawY)
          ctx!.arc(drawX, drawY, r, 0, TWO_PI)
        } else {
          ctx!.moveTo(drawX + rad, drawY)
          ctx!.arc(drawX, drawY, rad, 0, TWO_PI)
        }
      }

      ctx!.fill()
    }

    doResize()

    const resizeObs = new ResizeObserver(() => { setTimeout(doResize, 60) })
    resizeObs.observe(parent)

    // Update canvas origin on scroll — cheap, just reads getBoundingClientRect once
    window.addEventListener('scroll',   updateOrigin, { passive: true })
    window.addEventListener('resize',   updateOrigin, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    // Reset when mouse leaves the parent element
    parent.addEventListener('mouseleave', onMouseLeave)

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      resizeObs.disconnect()
      window.removeEventListener('scroll',    updateOrigin)
      window.removeEventListener('resize',    updateOrigin)
      window.removeEventListener('mousemove', onMouseMove)
      parent.removeEventListener('mouseleave', onMouseLeave)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { rebuildRef.current?.() }, [dotRadius, dotSpacing])

  return (
    <div className={`dot-field-container${className ? ` ${className}` : ''}`}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id={glowId.current}>
            <stop offset="0%"   stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle ref={glowRef} cx="-9999" cy="-9999" r={glowRadius}
          fill={`url(#${glowId.current})`} style={{ opacity: 0, willChange: 'opacity' }} />
      </svg>
    </div>
  )
})

DotField.displayName = 'DotField'
export default DotField
