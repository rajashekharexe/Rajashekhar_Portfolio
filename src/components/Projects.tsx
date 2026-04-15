import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const projects = [
  {
    title: "SkillForge AI",
    subtitle: "(in collaboration with Abhishek Pattar)",
    description: "An immersive, award-winning 3D web platform offering a complete AI Career OS. Features seamless neural network environments and fully integrated generative study tools.",
    tech: ["React Three Fiber", "AI APIs", "GSAP"],
    image: "/project-1.png"
  },
  {
    title: "ChatWave",
    description: "A high-performance, real-time messaging ecosystem. Engineered with robust WebSocket architecture, secure authentication, and instant cross-platform media delivery.",
    tech: ["Node.js", "Express", "Socket.io", "React"],
    image: "/project-2.png"
  },
  {
    title: "Face Attendance System",
    description: "A seamless computer vision architecture utilizing Python and modern web frameworks to provide instant facial recognition and automated real-time attendance tracking.",
    tech: ["Python", "OpenCV", "TensorFlow"],
    image: "/project-3.png"
  }
];

const ProjectRow = ({ project, index }: { project: any, index: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 0"]
  })

  const isEven = index % 2 === 0;

  // Extreme 3D Parallax on the background number
  const numY = useTransform(scrollYProgress, [0, 1], ["-80%", "80%"])
  const numRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60])
  const numScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.3, 0.8])
  
  // 3D Matrix Parallax on the image so it physically rotates towards the user
  const imgY = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1.15, 0.6])
  const imgRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [isEven ? -40 : 40, 0, isEven ? 40 : -40])
  const imgRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [35, -5, -35])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  // Scrub-based parallax for text entry
  const textX = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [isEven ? -150 : 150, 0, 0, isEven ? 150 : -150])
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  // Infinite floating animation (separate from scroll mapping) for alive-ness
  const floatingAnimation = {
    y: ["-25px", "25px"],
    transition: {
      duration: 3 + index, // Stagger speeds
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatType: "reverse" as const,
    }
  }

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative py-20 lg:py-32" style={{ perspective: "2000px" }}>
      
      {/* 3D Background Number */}
      <motion.div 
        style={{ y: numY, rotateX: numRotateX, scale: numScale }}
        className={`absolute top-1/4 text-[15rem] md:text-[30rem] font-display font-black text-neutral-200 z-0 pointer-events-none select-none leading-none opacity-100 origin-center ${isEven ? 'right-0 lg:left-0 lg:right-auto' : 'left-0 lg:right-0 lg:left-auto'}`}
      >
        0{index + 1}
      </motion.div>

      {/* Text Block - Alternates sides */}
      <motion.div 
        style={{ x: textX, opacity: textOpacity }}
        className={`lg:col-span-5 flex flex-col justify-center relative z-10 px-4 lg:px-0 mt-20 lg:mt-0 ${!isEven ? 'lg:order-2 lg:items-end lg:text-right' : 'lg:order-1'}`}
      >
        <span className="text-4xl font-display font-black text-neutral-300 mb-4 block">0{index + 1} //</span>
        <h3 className="text-4xl md:text-[3.5rem] leading-none font-display font-black uppercase tracking-tight mb-2">
          {project.title}
        </h3>
        {project.subtitle && (
          <span className="block text-lg font-black text-black italic mb-6">
            {project.subtitle}
          </span>
        )}
        <p className="text-xl text-neutral-600 font-medium mb-12 leading-relaxed max-w-md">
          {project.description}
        </p>
        
        <div className={`flex flex-wrap gap-3 ${!isEven ? 'lg:justify-end' : ''}`}>
          {project.tech.map((tech: string, i: number) => (
            <motion.span 
              key={i} 
              whileHover={{ scale: 1.15, translateY: -5, rotateZ: i % 2 === 0 ? 3 : -3 }}
              className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-600 border border-neutral-300 px-5 py-3 rounded-full cursor-pointer hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors shadow-sm"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Image Block - Enclosed in high-perspective container */}
      <div className={`lg:col-span-7 relative group flex items-center justify-center z-10 px-4 lg:px-0 ${!isEven ? 'lg:order-1' : 'lg:order-2'}`} style={{ perspective: "2500px" }}>
        <motion.div
          style={{ 
            y: imgY, 
            scale: imgScale, 
            rotateY: imgRotateY, 
            rotateX: imgRotateX,
            opacity: imgOpacity,
            transformStyle: "preserve-3d" 
          }}
          className="w-full relative mix-blend-multiply flex justify-center items-center"
        >
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0 0 0 0)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center items-center cursor-none"
            data-cursor-text="VIEW"
          >
            <motion.img 
              animate={floatingAnimation}
              src={project.image} 
              alt={project.title}
              className="w-full md:w-[90%] h-auto object-contain brightness-[1.05] contrast-[1.15] grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
          </motion.div>
        </motion.div>
      </div>

    </div>
  )
}

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Horizontal scroll tracking with 3D Skew
  const bgX = useTransform(scrollYProgress, [0, 1], ["20%", "-80%"])
  const bgSkew = useTransform(scrollYProgress, [0, 1], [15, -25])

  return (
    <section id="projects" ref={containerRef} className="py-32 md:py-48 relative overflow-hidden text-neutral-900 border-t border-neutral-900/10" style={{ perspective: "1500px" }}>
      
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
             initial={{ opacity: 0, y: 50, rotateX: 45 }}
             whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="text-[4rem] md:text-[6rem] leading-[0.85] font-display font-black uppercase tracking-tighter origin-bottom"
           >
             My <br/> Projects
           </motion.h2>
           <motion.div 
             initial={{ scaleX: 0 }}
             whileInView={{ scaleX: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
             className="w-32 h-2 bg-neutral-900 mt-12 origin-left"
           />
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
