/**
 * MagneticSatelliteOrbs Component
 * Interactive cosmic satellite cluster with orbital harmonic physics,
 * magnetic cursor attraction, and elastic collision avoidance.
 */
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Satellite {
  id: string
  label: string
  sublabel: string
  icon: string
  color: string
  glowColor: string
  orbitRadius: number
  orbitSpeed: number
  orbitAngle: number
  size: number
  href: string
  isDownload?: boolean
  // Physics coordinates
  x: number
  y: number
  vx: number
  vy: number
}

const SATELLITES_DATA: Omit<Satellite, 'x' | 'y' | 'vx' | 'vy'>[] = [
  {
    id: 'github',
    label: 'GitHub',
    sublabel: '5+ Repos · @rajashekharexe',
    icon: '📦',
    color: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.45)',
    orbitRadius: 105,
    orbitSpeed: 0.008,
    orbitAngle: 0,
    size: 52,
    href: 'https://github.com/rajashekharexe',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    sublabel: 'Professional Network',
    icon: '🔗',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    orbitRadius: 145,
    orbitSpeed: -0.006,
    orbitAngle: Math.PI * 0.45,
    size: 50,
    href: 'https://www.linkedin.com/in/rajashekhar-exe/',
  },
  {
    id: 'resume',
    label: 'Resume CV',
    sublabel: 'Verified PDF Download',
    icon: '📄',
    color: '#22C55E',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    orbitRadius: 185,
    orbitSpeed: 0.005,
    orbitAngle: Math.PI * 0.95,
    size: 56,
    href: '/resume.pdf',
    isDownload: true,
  },
  {
    id: 'email',
    label: 'Email',
    sublabel: 'Direct Transmission',
    icon: '✉️',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    orbitRadius: 125,
    orbitSpeed: -0.007,
    orbitAngle: Math.PI * 1.45,
    size: 48,
    href: 'mailto:rajashekhar.exe@gmail.com',
  },
  {
    id: 'certs',
    label: 'Azure AI',
    sublabel: 'Microsoft Certified Associate',
    icon: '🏆',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    orbitRadius: 165,
    orbitSpeed: 0.0065,
    orbitAngle: Math.PI * 1.85,
    size: 48,
    href: 'https://learn.microsoft.com/en-us/users/rajashekhar-exe/',
  },
]

export function MagneticSatelliteOrbs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: '200px' })
  const [hoveredNode, setHoveredNode] = useState<Satellite | null>(null)

  const satellitesRef = useRef<Satellite[]>(
    SATELLITES_DATA.map((s) => ({
      ...s,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    }))
  )

  const mouseRef = useRef({ x: -9999, y: -9999, isInside: false })
  const [, setTick] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animId: number

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
        isInside: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, isInside: false }
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    /* ── Physics Loop ────────────────────────────────────────── */
    const updatePhysics = () => {
      animId = requestAnimationFrame(updatePhysics)
      if (!isInView) return

      const sats = satellitesRef.current
      const mouse = mouseRef.current

      for (let i = 0; i < sats.length; i++) {
        const s = sats[i]

        // 1. Orbital natural drift around center (0, 0)
        s.orbitAngle += s.orbitSpeed
        const targetX = Math.cos(s.orbitAngle) * s.orbitRadius
        const targetY = Math.sin(s.orbitAngle) * s.orbitRadius

        // 2. Magnetic Attraction to Cursor
        if (mouse.isInside) {
          const dx = mouse.x - s.x
          const dy = mouse.y - s.y
          const dist = Math.hypot(dx, dy)
          const magnetRadius = 140

          if (dist < magnetRadius && dist > 1) {
            // Inverse magnetic pull
            const pullForce = ((magnetRadius - dist) / magnetRadius) ** 1.5 * 3.5
            s.vx += (dx / dist) * pullForce
            s.vy += (dy / dist) * pullForce
          }
        }

        // 3. Elastic Spring Return to Orbit
        const springK = 0.04
        const damping = 0.85
        s.vx += (targetX - s.x) * springK
        s.vy += (targetY - s.y) * springK
        s.vx *= damping
        s.vy *= damping

        // 4. Inter-satellite collision repulsion
        for (let j = i + 1; j < sats.length; j++) {
          const other = sats[j]
          const cdx = s.x - other.x
          const cdy = s.y - other.y
          const cDist = Math.hypot(cdx, cdy)
          const minDist = (s.size + other.size) * 0.55

          if (cDist < minDist && cDist > 0.1) {
            const push = ((minDist - cDist) / minDist) * 1.8
            const nx = cdx / cDist
            const ny = cdy / cDist
            s.vx += nx * push
            s.vy += ny * push
            other.vx -= nx * push
            other.vy -= ny * push
          }
        }

        s.x += s.vx
        s.y += s.vy
      }

      setTick((t) => (t + 1) % 60)
    }

    animId = requestAnimationFrame(updatePhysics)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isInView])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[440px] flex items-center justify-center select-none overflow-hidden rounded-3xl border border-neutral-800/60 bg-neutral-950/60 backdrop-blur-xl group"
    >
      {/* Background Starfield Radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Orbit Rings (Faint SVG paths) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-neutral-800/40">
        <circle cx="50%" cy="50%" r="105" fill="none" strokeDasharray="4 6" />
        <circle cx="50%" cy="50%" r="145" fill="none" strokeDasharray="3 8" />
        <circle cx="50%" cy="50%" r="185" fill="none" strokeDasharray="2 10" />
      </svg>

      {/* Center Gravitational Singularity Core */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-black border border-white/20 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] group/core">
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-white/10"
        />
        <span className="text-xl">🪐</span>
        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold mt-1">
          Nexus
        </span>
      </div>

      {/* Satellites */}
      {satellitesRef.current.map((sat) => {
        const isHovered = hoveredNode?.id === sat.id

        return (
          <a
            key={sat.id}
            href={sat.href}
            target={sat.isDownload ? undefined : '_blank'}
            download={sat.isDownload ? 'Rajashekhar_Amarappagol_Resume.pdf' : undefined}
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredNode(sat)}
            onMouseLeave={() => setHoveredNode(null)}
            className="absolute z-20 flex flex-col items-center justify-center cursor-pointer transition-transform duration-75"
            style={{
              transform: `translate3d(${sat.x}px, ${sat.y}px, 0)`,
              width: `${sat.size}px`,
              height: `${sat.size}px`,
            }}
          >
            {/* Pulsing Aura Halo */}
            <div
              className="absolute inset-0 rounded-full transition-transform duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${sat.glowColor} 0%, transparent 70%)`,
                transform: isHovered ? 'scale(1.8)' : 'scale(1.2)',
              }}
            />

            {/* Satellite Body Glass Sphere */}
            <div
              className="relative w-full h-full rounded-full flex items-center justify-center text-lg border transition-all duration-300 shadow-lg"
              style={{
                backgroundColor: isHovered ? '#ffffff' : 'rgba(15, 15, 20, 0.85)',
                borderColor: sat.color,
                color: isHovered ? '#000000' : '#ffffff',
                boxShadow: `0 0 16px ${sat.glowColor}`,
                transform: isHovered ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              <span>{sat.icon}</span>
            </div>

            {/* Micro Badge Label */}
            <span
              className="absolute -bottom-5 text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/80 text-white border border-white/10 whitespace-nowrap pointer-events-none"
              style={{ color: sat.color }}
            >
              {sat.label}
            </span>
          </a>
        )
      })}

      {/* Interactive HUD Telemetry Card when Hovered */}
      <div className="absolute bottom-3 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 shadow-xl">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: hoveredNode ? hoveredNode.color : '#22C55E' }}
          />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-200">
            {hoveredNode
              ? `${hoveredNode.label} // ${hoveredNode.sublabel}`
              : 'Cosmic Satellite Cluster · Hover to attract'}
          </span>
        </div>

        <span className="hidden sm:inline-block text-[10px] font-mono text-neutral-500">
          Magnetic Orbit Physics // 60 FPS
        </span>
      </div>
    </div>
  )
}
export default MagneticSatelliteOrbs
