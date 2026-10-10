/**
 * AmbientHeroOrbs Component
 * High-performance, luminous glassmorphic physics orbs with harmonic drift,
 * fluid cursor repulsion, and ambient micro-particle sparkle field.
 */
import { useEffect, useRef } from 'react'

interface Orb {
  baseX: number
  baseY: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  floatSpeed: number
  floatAngle: number
  floatRadius: number
  colorCore: string
  colorMid: string
  colorEdge: string
  specularColor: string
}

interface Sparkle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  baseAlpha: number
  pulseSpeed: number
  phase: number
}

export function AmbientHeroOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let isVisible = true
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    // Mouse coordinates relative to canvas
    const mouse = { x: -9999, y: -9999, isHovered: false }

    const resize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      initOrbs()
    }

    let orbs: Orb[] = []
    let sparkles: Sparkle[] = []

    const initOrbs = () => {
      // 5 carefully tuned chromatic glass orbs placed across the hero canvas
      orbs = [
        {
          baseX: width * 0.18,
          baseY: height * 0.35,
          x: width * 0.18,
          y: height * 0.35,
          vx: 0,
          vy: 0,
          radius: Math.min(width, height) * 0.18,
          floatSpeed: 0.0012,
          floatAngle: 0,
          floatRadius: 28,
          colorCore: 'rgba(99, 102, 241, 0.45)', // Indigo
          colorMid: 'rgba(139, 92, 246, 0.18)',
          colorEdge: 'rgba(99, 102, 241, 0)',
          specularColor: 'rgba(255, 255, 255, 0.65)',
        },
        {
          baseX: width * 0.82,
          baseY: height * 0.28,
          x: width * 0.82,
          y: height * 0.28,
          vx: 0,
          vy: 0,
          radius: Math.min(width, height) * 0.22,
          floatSpeed: 0.0009,
          floatAngle: Math.PI * 0.7,
          floatRadius: 36,
          colorCore: 'rgba(56, 189, 248, 0.40)', // Sky Cyan
          colorMid: 'rgba(99, 102, 241, 0.15)',
          colorEdge: 'rgba(56, 189, 248, 0)',
          specularColor: 'rgba(255, 255, 255, 0.7)',
        },
        {
          baseX: width * 0.52,
          baseY: height * 0.72,
          x: width * 0.52,
          y: height * 0.72,
          vx: 0,
          vy: 0,
          radius: Math.min(width, height) * 0.20,
          floatSpeed: 0.0014,
          floatAngle: Math.PI * 1.3,
          floatRadius: 32,
          colorCore: 'rgba(244, 63, 94, 0.35)', // Rose
          colorMid: 'rgba(249, 115, 22, 0.14)',
          colorEdge: 'rgba(244, 63, 94, 0)',
          specularColor: 'rgba(255, 255, 255, 0.6)',
        },
        {
          baseX: width * 0.35,
          baseY: height * 0.82,
          x: width * 0.35,
          y: height * 0.82,
          vx: 0,
          vy: 0,
          radius: Math.min(width, height) * 0.14,
          floatSpeed: 0.0018,
          floatAngle: Math.PI * 0.4,
          floatRadius: 24,
          colorCore: 'rgba(34, 197, 94, 0.35)', // Emerald
          colorMid: 'rgba(16, 185, 129, 0.12)',
          colorEdge: 'rgba(34, 197, 94, 0)',
          specularColor: 'rgba(255, 255, 255, 0.55)',
        },
        {
          baseX: width * 0.68,
          baseY: height * 0.48,
          x: width * 0.68,
          y: height * 0.48,
          vx: 0,
          vy: 0,
          radius: Math.min(width, height) * 0.16,
          floatSpeed: 0.0011,
          floatAngle: Math.PI * 1.8,
          floatRadius: 30,
          colorCore: 'rgba(168, 85, 247, 0.35)', // Purple
          colorMid: 'rgba(236, 72, 153, 0.12)',
          colorEdge: 'rgba(168, 85, 247, 0)',
          specularColor: 'rgba(255, 255, 255, 0.65)',
        },
      ]

      // Stardust sparkle field
      sparkles = Array.from({ length: 32 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    initOrbs()

    /* ── Mouse interaction ────────────────────────────────── */
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.isHovered = true
    }

    const handleMouseLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      mouse.isHovered = false
    }

    window.addEventListener('resize', resize, { passive: true })
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    /* ── IntersectionObserver: freeze completely when off-screen ── */
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { rootMargin: '200px' }
    )
    observer.observe(canvas)

    let time = 0

    /* ── Render Loop ────────────────────────────────────────── */
    const render = () => {
      animationFrameId = requestAnimationFrame(render)
      if (!isVisible) return

      time++
      ctx.clearRect(0, 0, width, height)

      // 1. Draw Stardust Particles
      ctx.fillStyle = '#ffffff'
      for (const sp of sparkles) {
        sp.x += sp.vx
        sp.y += sp.vy
        if (sp.x < 0) sp.x = width
        if (sp.x > width) sp.x = 0
        if (sp.y < 0) sp.y = height
        if (sp.y > height) sp.y = 0

        // Gentle sparkle pulse
        const alpha = sp.baseAlpha + Math.sin(time * sp.pulseSpeed + sp.phase) * 0.2
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Update & Draw Physics Orbs
      for (const orb of orbs) {
        // A. Harmonic natural drift
        orb.floatAngle += orb.floatSpeed
        const targetX = orb.baseX + Math.cos(orb.floatAngle) * orb.floatRadius
        const targetY = orb.baseY + Math.sin(orb.floatAngle * 1.3) * orb.floatRadius

        // B. Cursor Repulsion Physics
        if (mouse.isHovered) {
          const dx = orb.x - mouse.x
          const dy = orb.y - mouse.y
          const dist = Math.hypot(dx, dy)
          const repulsionRadius = orb.radius * 2.2

          if (dist < repulsionRadius && dist > 1) {
            const force = ((repulsionRadius - dist) / repulsionRadius) ** 1.8 * 8
            const angle = Math.atan2(dy, dx)
            orb.vx += Math.cos(angle) * force
            orb.vy += Math.sin(angle) * force
          }
        }

        // C. Elastic Spring Return to Target
        const springK = 0.035
        const damp = 0.88
        orb.vx += (targetX - orb.x) * springK
        orb.vy += (targetY - orb.y) * springK
        orb.vx *= damp
        orb.vy *= damp

        orb.x += orb.vx
        orb.y += orb.vy

        // D. Draw Luminous Glass Gradient
        ctx.globalAlpha = 1.0
        const grad = ctx.createRadialGradient(
          orb.x - orb.radius * 0.25,
          orb.y - orb.radius * 0.25,
          orb.radius * 0.05,
          orb.x,
          orb.y,
          orb.radius
        )
        grad.addColorStop(0, orb.colorCore)
        grad.addColorStop(0.55, orb.colorMid)
        grad.addColorStop(1, orb.colorEdge)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fill()

        // E. Specular Glass Arc Highlight (adds realistic 3D bubble/lens refraction)
        ctx.strokeStyle = orb.specularColor
        ctx.lineWidth = Math.max(1.5, orb.radius * 0.02)
        ctx.beginPath()
        ctx.arc(
          orb.x - orb.radius * 0.15,
          orb.y - orb.radius * 0.15,
          orb.radius * 0.72,
          Math.PI * 1.15,
          Math.PI * 1.65
        )
        ctx.stroke()
      }

      ctx.globalAlpha = 1.0
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      style={{
        mixBlendMode: 'multiply',
        opacity: 0.85,
      }}
    />
  )
}
export default AmbientHeroOrbs
