/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Physics, RigidBody, BallCollider, CuboidCollider, type RapierRigidBody } from '@react-three/rapier'
import { useInView } from 'framer-motion'
import * as THREE from 'three'

interface SkillItem {
  name: string
  color: string
  radius: number
  initialPos: [number, number, number]
}

const SKILL_ITEMS: SkillItem[] = [
  { name: 'React',      color: '#61DAFB', radius: 0.95, initialPos: [-2.5, 6, 0] },
  { name: 'TypeScript', color: '#3178C6', radius: 0.95, initialPos: [-0.8, 7.5, 0.2] },
  { name: 'Python',     color: '#FCD34D', radius: 0.95, initialPos: [1.2, 5.5, -0.2] },
  { name: 'Node.js',    color: '#22C55E', radius: 0.90, initialPos: [2.8, 7, 0.1] },
  { name: 'Three.js',   color: '#A855F7', radius: 0.92, initialPos: [-1.8, 9, -0.1] },
  { name: 'Firebase',   color: '#F97316', radius: 0.90, initialPos: [0.2, 9.5, 0.2] },
  { name: 'AI Core',    color: '#EC4899', radius: 0.95, initialPos: [2.2, 8.5, -0.2] },
  { name: 'OpenCV',     color: '#3B82F6', radius: 0.85, initialPos: [-2.2, 11, 0.1] },
  { name: 'Tailwind',   color: '#06B6D4', radius: 0.88, initialPos: [-0.3, 11.5, -0.1] },
  { name: 'MongoDB',    color: '#10B981', radius: 0.88, initialPos: [1.8, 11, 0.2] },
  { name: 'Vite',       color: '#EAB308', radius: 0.85, initialPos: [-1.2, 13, 0] },
  { name: 'Next.js',    color: '#FFFFFF', radius: 0.92, initialPos: [1.0, 13.5, -0.1] },
]

function createOrbTexture(name: string, color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  // Deep obsidian gradient base
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 512)
  bgGrad.addColorStop(0, '#12131a')
  bgGrad.addColorStop(0.5, '#1e1f29')
  bgGrad.addColorStop(1, '#0f1015')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 1024, 512)

  // Draw two identical badges on front & back faces
  const centers = [256, 768]
  for (const cx of centers) {
    // Glowing accent border ring
    ctx.shadowColor = color
    ctx.shadowBlur = 18
    ctx.strokeStyle = color
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.arc(cx, 256, 175, 0, Math.PI * 2)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Inner subtle glass ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(cx, 256, 150, 0, Math.PI * 2)
    ctx.stroke()

    // Tech name label
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 52px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(name, cx, 256)

    // Vibrant accent pip
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(cx, 315, 9, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

interface PhysicsOrbProps {
  item: SkillItem
  onHover: (name: string | null) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

function PhysicsOrb({ item, onHover }: PhysicsOrbProps) {
  const rigidRef = useRef<RapierRigidBody>(null)
  const [isDragged, setIsDragged] = useState(false)
  const dragPlanePoint = useRef(new THREE.Vector3())
  const prevPointer = useRef(new THREE.Vector3())
  const pointerVelocity = useRef(new THREE.Vector3())

  const texture = useMemo(() => createOrbTexture(item.name, item.color), [item.name, item.color])

  useFrame((state) => {
    if (!rigidRef.current) return

    if (isDragged) {
      // Unproject pointer into 3D world space at z = 0 plane
      const vec = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5)
      vec.unproject(state.camera)
      const dir = vec.sub(state.camera.position).normalize()
      const distance = -state.camera.position.z / dir.z
      const targetPos = state.camera.position.clone().add(dir.multiplyScalar(distance))

      // Keep inside container boundary
      targetPos.x = Math.max(-3.8, Math.min(3.8, targetPos.x))
      targetPos.y = Math.max(-3.8, Math.min(4.2, targetPos.y))
      targetPos.z = Math.max(-1.2, Math.min(1.2, targetPos.z))

      // Measure fling velocity
      pointerVelocity.current.copy(targetPos).sub(prevPointer.current)
      prevPointer.current.copy(targetPos)

      rigidRef.current.setNextKinematicTranslation(targetPos)
      rigidRef.current.wakeUp()
    }
  })

  return (
    <RigidBody
      ref={rigidRef}
      position={item.initialPos}
      type={isDragged ? 'kinematicPosition' : 'dynamic'}
      colliders={false}
      restitution={0.78} // Satisfying bounce!
      friction={0.2}
      linearDamping={0.4}
      angularDamping={0.4}
      canSleep={true}
    >
      <BallCollider args={[item.radius]} />
      <mesh
        castShadow
        onPointerOver={() => {
          document.body.style.cursor = 'grab'
          onHover(item.name)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
          onHover(null)
        }}
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
          document.body.style.cursor = 'grabbing'
          setIsDragged(true)
          dragPlanePoint.current.copy(e.point)
          prevPointer.current.copy(e.point)
          rigidRef.current?.wakeUp()
        }}
        onPointerUp={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
          document.body.style.cursor = 'grab'
          setIsDragged(false)

          // Transfer release fling impulse
          if (rigidRef.current) {
            rigidRef.current.applyImpulse(
              {
                x: pointerVelocity.current.x * 35,
                y: pointerVelocity.current.y * 35,
                z: pointerVelocity.current.z * 15,
              },
              true
            )
          }
        }}
      >
        <sphereGeometry args={[item.radius, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.15}
          metalness={0.25}
          envMapIntensity={1.2}
        />
      </mesh>
    </RigidBody>
  )
}

export function SkillsTerrarium() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: '200px' })
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [impulseKey, setImpulseKey] = useState(0)

  // Trigger global shake/pop impulse across all rigidbodies
  const triggerImpulse = () => {
    setImpulseKey((k) => k + 1)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[360px] rounded-2xl border border-neutral-200 bg-neutral-900 overflow-hidden shadow-lg flex flex-col group select-none"
    >
      {/* HUD Header */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-200">
            {hoveredSkill ? `Grabbed: ${hoveredSkill}` : 'Physics Terrarium // Rapier 3D'}
          </span>
        </div>

        {/* Action Button: Antigravity Nudge */}
        <button
          onClick={triggerImpulse}
          aria-label="Shake and bounce physics orbs"
          className="pointer-events-auto flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold tracking-wider backdrop-blur-md border border-white/15 transition-all cursor-pointer"
        >
          <span>✦ Zero-G Bounce</span>
        </button>
      </div>

      {/* Instruction tooltip badge */}
      <div className="absolute bottom-3 left-4 z-20 pointer-events-none">
        <span className="text-[10px] font-mono text-neutral-400 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/5">
          Drag & fling tech marbles · Real collision physics
        </span>
      </div>

      {/* Three.js + Rapier Canvas */}
      <Canvas
        key={impulseKey}
        frameloop={isInView ? 'always' : 'never'}
        camera={{ position: [0, 0, 14], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 7]} intensity={2.0} />
        <pointLight position={[-5, -2, 5]} intensity={1.0} color="#6366F1" />
        <pointLight position={[5, -2, 5]} intensity={1.0} color="#22C55E" />

        <Physics gravity={[0, -28, 0]}>
          {/* Glass Enclosure Boundaries (floor, ceiling, walls, front/back) */}
          {/* Floor */}
          <RigidBody type="fixed" position={[0, -4.6, 0]}>
            <CuboidCollider args={[8, 0.4, 4]} restitution={0.7} />
          </RigidBody>
          {/* Left Wall */}
          <RigidBody type="fixed" position={[-4.5, 2, 0]}>
            <CuboidCollider args={[0.4, 8, 4]} restitution={0.7} />
          </RigidBody>
          {/* Right Wall */}
          <RigidBody type="fixed" position={[4.5, 2, 0]}>
            <CuboidCollider args={[0.4, 8, 4]} restitution={0.7} />
          </RigidBody>
          {/* Ceiling */}
          <RigidBody type="fixed" position={[0, 8.5, 0]}>
            <CuboidCollider args={[8, 0.4, 4]} restitution={0.7} />
          </RigidBody>
          {/* Back Glass */}
          <RigidBody type="fixed" position={[0, 2, -2.2]}>
            <CuboidCollider args={[8, 8, 0.4]} restitution={0.7} />
          </RigidBody>
          {/* Front Glass */}
          <RigidBody type="fixed" position={[0, 2, 2.2]}>
            <CuboidCollider args={[8, 8, 0.4]} restitution={0.7} />
          </RigidBody>

          {/* 12 Interactive Physics Skill Orbs */}
          {SKILL_ITEMS.map((item) => (
            <PhysicsOrb
              key={item.name}
              item={item}
              onHover={setHoveredSkill}
              containerRef={containerRef}
            />
          ))}
        </Physics>
      </Canvas>
    </div>
  )
}
export default SkillsTerrarium
