/**
 * TiltedCard Component
 * 
 * WHAT IT DOES:
 * Renders the TiltedCard UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import type { SpringOptions } from 'framer-motion'
import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import './TiltedCard.css'

interface TiltedCardProps {
  imageSrc?: React.ComponentProps<'img'>['src']
  altText?: string
  captionText?: string
  containerHeight?: React.CSSProperties['height']
  containerWidth?: React.CSSProperties['width']
  imageHeight?: React.CSSProperties['height']
  imageWidth?: React.CSSProperties['width']
  scaleOnHover?: number
  rotateAmplitude?: number
  showMobileWarning?: boolean
  showTooltip?: boolean
  overlayContent?: React.ReactNode
  displayOverlayContent?: boolean
  children?: React.ReactNode   // ← accept children so we can pass the entire browser-frame
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
}

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.04,
  rotateAmplitude = 10,
  showMobileWarning = false,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  children,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null)

  const x                = useMotionValue(0)
  const y                = useMotionValue(0)
  const rotateX          = useSpring(useMotionValue(0), springValues)
  const rotateY          = useSpring(useMotionValue(0), springValues)
  const scale            = useSpring(1, springValues)
  const opacity          = useSpring(0)
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 })
  const sheenOpacity     = useSpring(0, { stiffness: 200, damping: 25 })

  const [lastY, setLastY] = useState(0)

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return
    const rect    = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width  / 2
    const offsetY = e.clientY - rect.top  - rect.height / 2

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width  / 2)) *  rotateAmplitude)

    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)

    rotateFigcaption.set(-(offsetY - lastY) * 0.6)
    setLastY(offsetY)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
    opacity.set(1)
    sheenOpacity.set(1)
  }

  function handleMouseLeave() {
    opacity.set(0)
    sheenOpacity.set(0)
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    rotateFigcaption.set(0)
  }

  return (
    <figure
      ref={ref}
      className="tilted-card-figure"
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">
          This effect is best experienced on desktop.
        </div>
      )}

      <motion.div
        className="tilted-card-inner"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        {/* Render either a plain <img> or any React children (e.g. browser-frame) */}
        {children ? (
          <div style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' }}>
            {children}
          </div>
        ) : (
          <motion.img
            src={imageSrc}
            alt={altText}
            className="tilted-card-img"
            style={{ width: imageWidth, height: imageHeight }}
          />
        )}

        {displayOverlayContent && overlayContent && (
          <motion.div className="tilted-card-overlay">{overlayContent}</motion.div>
        )}

        {/* Glossy sheen overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)',
            opacity: sheenOpacity,
          }}
        />
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  )
}
