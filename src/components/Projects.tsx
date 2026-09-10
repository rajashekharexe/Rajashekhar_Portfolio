import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { DecryptedText } from './DecryptedText'
import { TextRepel } from './TextRepel'
import TiltedCard from './TiltedCard'
import LiquidMedia from './LiquidMedia'
import { useSoundEffects } from '../hooks/useSoundEffects'

/**
 * Project Data Architecture
 * Structured metadata for showcased production systems and interactive applications.
 */
interface Project {
  title: string
  subtitle?: string
  description: string
  tech: string[]
  video?: string  // optional video file path
  image: string   // fallback thumbnail shown before video/gif loads
  gif?: string    // optional GIF — autoplays without hover (e.g. "/project-1.gif")
  link?: string   // live or repository link
}

const projects: Project[] = [
  {
    title: "Apex",
    subtitle: "AI-Powered Career Planning Platform",
    description: "Designed the end-to-end system architecture and user experience for a 3D career roadmap platform that synthesizes adaptive 30-day technical curriculums via LLM APIs. Built in React Three Fiber with geometry instancing sustaining locked 60 FPS performance.",
    tech: ["Google Antigravity", "React Three Fiber", "TypeScript", "LLM APIs", "GSAP"],
    image: "/project-1.png",
    gif: "/project-1.gif",
    link: "https://github.com/rajashekharexe/Apex"
  },
  {
    title: "KAD Multiplier",
    subtitle: "Full-Stack Agricultural E-Commerce",
    description: "Architected database schemas, security rules, and customer checkout flows for a live agricultural e-commerce application. Configured real-time Cloud Firestore snapshot listeners and secure Firebase Authentication to synchronize inventory across active sessions.",
    tech: ["Firebase", "Firestore", "React", "HTML/CSS", "Tailwind CSS"],
    image: "/project-3.png",
    gif: "/project-4.gif",
    link: "https://github.com/rajashekharexe/Soil-Multiplier-"
  },
  {
    title: "Developer Portfolio",
    subtitle: "3D Interactive Web Application",
    description: "Designed and deployed a personal portfolio featuring interactive WebGL particle systems, responsive canvas shaders, and a built-in terminal emulator. Achieved 95+ score on Google Lighthouse audits through aggressive code-splitting and asset compression.",
    tech: ["Google Antigravity", "React", "TypeScript", "Three.js", "Vite", "Framer Motion"],
    image: "/project-2.png",
    gif: "/project-2.gif",
    link: "https://rajashekhar-portfolio-iota.vercel.app"
  }
]

// Premium browser-frame media player — supports GIF (autoplay) and fluid interactive canvas
function ProjectMedia({ project }: { project: Project }) {
  const { playHover } = useSoundEffects()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const hasVideo = Boolean(project.video)
  const isGif = Boolean(project.gif)

  const handleMouseEnter = () => {
    playHover()
    if (hasVideo && !isGif && videoRef.current && !videoFailed) {
      videoRef.current.play().catch(() => setVideoFailed(true))
    }
    setIsPlaying(true)
  }

  const handleMouseLeave = () => {
    if (hasVideo && !isGif && videoRef.current && !videoFailed) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 group/media bg-neutral-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor={isGif ? "view" : "play"}
    >
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-neutral-100 border-b border-neutral-200">
        <span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0" />
        <div className="ml-3 flex-1 bg-white rounded-md px-3 py-1 text-xs font-mono text-neutral-400 truncate border border-neutral-200">
          {project.link ? project.link.replace('https://', '') : `github.com/rajashekharexe/${project.title.toLowerCase().replace(/ /g, '-')}`}
        </div>
        {/* LIVE or GitHub badge */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-2 flex items-center gap-1.5 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-colors flex-shrink-0 ${
              project.link.includes('github.com')
                ? 'bg-neutral-800 hover:bg-neutral-700'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {project.link.includes('github.com') ? (
              <>
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live
              </>
            )}
          </a>
        )}
      </div>

      {/* Media Area */}
      <div className="relative aspect-video bg-neutral-900 overflow-hidden">

        {isGif ? (
          // GIF — always autoplays, no hover needed
          <img
            src={project.gif}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            {/* The actual video is visually hidden but plays in the DOM for the WebGL texture */}
            {hasVideo && !videoFailed && (
              <video
                ref={videoRef}
                src={project.video}
                muted
                loop
                playsInline
                crossOrigin="anonymous"
                preload="none"
                className="opacity-0 absolute pointer-events-none"
                onError={() => setVideoFailed(true)}
              />
            )}

            {/* The WebGL Canvas replaces the visual image/video */}
            <LiquidMedia image={project.image} videoRef={videoRef} isHovered={isPlaying} />

            {/* Hover overlay — play hint */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none z-20 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
              <div className="bg-black/40 backdrop-blur-sm rounded-full p-5 border border-white/20 group-hover/media:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white fill-white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-xs font-bold uppercase tracking-widest">
                Hover to interact
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const ProjectRow = ({ project, index }: { project: Project, index: number }) => {
  const { playHover } = useSoundEffects()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 0"]
  })

  const isEven = index % 2 === 0

  // Parallax on the background number
  const numY = useTransform(scrollYProgress, [0, 1], ["-80%", "80%"])
  const numRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30])
  const numScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.9])
  
  // Media block parallax — refined, not overwhelming
  const imgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const imgScale   = useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0])

  // Text parallax
  const textX = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [isEven ? -150 : 150, 0, 0, isEven ? 150 : -150])
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative py-20 lg:py-32" style={{ perspective: "2000px" }}>

      {/* 3D Background Number */}
      <motion.div
        style={{ y: numY, rotateX: numRotateX, scale: numScale }}
        className={`absolute top-1/4 text-[15rem] md:text-[30rem] font-display font-black text-neutral-200 z-0 pointer-events-none select-none leading-none origin-center ${isEven ? 'right-0 lg:left-0 lg:right-auto' : 'left-0 lg:right-0 lg:left-auto'}`}
      >
        0{index + 1}
      </motion.div>

      {/* Text Block */}
      <motion.div
        style={{ x: textX, opacity: textOpacity }}
        className={`lg:col-span-5 flex flex-col justify-center relative z-10 px-4 lg:px-0 mt-20 lg:mt-0 ${!isEven ? 'lg:order-2 lg:items-end lg:text-right' : 'lg:order-1'}`}
      >
        <span className="text-4xl font-display font-black text-neutral-300 mb-4 block">0{index + 1} //</span>
        <motion.h3 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className={`leading-none font-display font-black uppercase tracking-tight mb-2 text-neutral-900 whitespace-nowrap flex flex-nowrap ${
            project.title.length >= 14
              ? 'text-2xl sm:text-3xl md:text-4xl lg:text-[2.35rem] xl:text-[2.65rem]'
              : 'text-3xl sm:text-4xl md:text-[3.25rem]'
          }`}
        >
          <div className="overflow-hidden pb-2 w-full" style={{ perspective: 1000 }}>
            <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
              <TextRepel 
                text={project.title} 
                radius={90} 
                strength={30} 
                className={`whitespace-nowrap flex-nowrap ${!isEven ? 'justify-end' : 'justify-start'}`}
              />
            </motion.div>
          </div>
        </motion.h3>
        {project.subtitle && (
          <span className="block text-lg font-black text-black italic mb-6">
            {project.subtitle}
          </span>
        )}
        <p className="text-xl text-neutral-600 font-medium mb-12 leading-relaxed max-w-md">
          <DecryptedText text={project.description} speed={30} maxIterations={20} />
        </p>

        <div className={`flex flex-wrap gap-3 ${!isEven ? 'lg:justify-end' : ''}`}>
          {project.tech.map((tech: string, i: number) => (
            <motion.span
              key={i}
              onMouseEnter={playHover}
              whileHover={{ scale: 1.15, translateY: -5, rotateZ: i % 2 === 0 ? 3 : -3 }}
              className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-600 border border-neutral-300 px-5 py-3 rounded-full cursor-pointer hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors shadow-sm"
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Optional live or github link CTA */}
        {project.link && (
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={playHover}
            whileHover={{ x: 4 }}
            className={`mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-900 border-b-2 border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-colors ${!isEven ? 'lg:self-end' : ''}`}
          >
            {project.link.includes('github.com') ? 'View on GitHub' : 'View Live Project'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        )}
      </motion.div>

      {/* Media Block — wrapped in TiltedCard for 3D hover tilt */}
      <motion.div
        style={{ y: imgY, scale: imgScale, opacity: imgOpacity, transformStyle: 'preserve-3d' }}
        className={`lg:col-span-7 relative z-10 px-4 lg:px-0 ${!isEven ? 'lg:order-1' : 'lg:order-2'}`}
      >
        <motion.div
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0 0 0)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <TiltedCard
            containerWidth="100%"
            containerHeight="auto"
            imageWidth="100%"
            imageHeight="auto"
            captionText={project.title}
            rotateAmplitude={10}
            scaleOnHover={1.04}
            showTooltip
            showMobileWarning={false}
          >
            <ProjectMedia project={project} />
          </TiltedCard>
        </motion.div>
      </motion.div>

    </div>
  )
}

/**
 * Projects (Main Component)
 * 
 * WHAT IT DOES:
 * This wraps all the individual project cards and adds the giant "MY PROJECTS" scrolling text in the background.
 * 
 * HOW IT WORKS:
 * Uses Framer Motion's `useScroll` to track when this section is on screen, mapping that scroll progress
 * to move and skew the background text. It then maps over the `projects` array and renders a `ProjectRow` for each.
 */
export function Projects() {
  // containerRef tracks the scroll position of the entire Projects section
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const bgX = useTransform(scrollYProgress, [0, 1], ["20%", "-80%"])
  const bgSkew = useTransform(scrollYProgress, [0, 1], [15, -25])

  return (
    <section id="projects" ref={containerRef} className="py-32 md:py-48 bg-white relative overflow-hidden text-neutral-900 border-t border-neutral-100" style={{ perspective: "1500px" }}>

      {/* Immersive 3D Background Typography */}
      <motion.div
        style={{ x: bgX, skewX: bgSkew }}
        className="absolute top-[2%] left-0 whitespace-nowrap pointer-events-none select-none z-0 transform-gpu"
      >
        <span className="text-[16rem] md:text-[24rem] font-display font-black uppercase text-neutral-100/50 leading-none tracking-tighter">
          MY PROJECTS
        </span>
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        <div className="mb-32 md:mb-48">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }}
            variants={{ hidden: { opacity: 0, y: 50, rotateX: 45 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } } }}
            className="text-[4rem] md:text-[6rem] leading-[0.85] font-display font-black uppercase tracking-tighter origin-bottom text-neutral-900 flex flex-col items-start"
          >
            <div className="overflow-hidden pb-2" style={{ perspective: 1000 }}>
              <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                <TextRepel text="My" radius={120} strength={40} />
              </motion.div>
            </div>
            <div className="overflow-hidden pb-2" style={{ perspective: 1000 }}>
              <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                <TextRepel text="Projects" radius={120} strength={40} />
              </motion.div>
            </div>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-32 h-2 bg-neutral-900 mt-12 origin-left"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-neutral-500 font-medium text-lg max-w-md"
          >
            Hover over any project to watch it in action.
          </motion.p>
        </div>

        <div className="space-y-48 md:space-y-72">
          {projects.map((project, index) => (
            <ProjectRow key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
