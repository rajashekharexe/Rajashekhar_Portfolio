import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Smooth parallax for the background typography
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
  
  // Subtle vertical floating for the manifesto text box
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])
  
  // Scale down the line based on scroll
  const lineScale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    // Calculate mouse position relative to this section
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }

  return (
    <section 
      id="experience" 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="py-32 md:py-48 px-8 bg-neutral-900 text-white relative overflow-hidden"
    >
      
      {/* Background Typography - Dark mode base layer */}
      <motion.div 
        style={{ x: bgX }} 
        className="absolute top-[10%] left-0 whitespace-nowrap pointer-events-none select-none z-0"
      >
        <span className="text-[12rem] md:text-[22rem] font-display font-black uppercase text-neutral-800/40 leading-none tracking-tighter">
          EXPERIENCE
        </span>
      </motion.div>

      {/* Mask Reveal Top Layer - Vivid White, revealed only by cursor */}
      <motion.div 
        style={{ x: bgX }} 
        className="absolute top-[10%] left-0 whitespace-nowrap pointer-events-none select-none z-0"
        animate={{
          clipPath: `circle(150px at ${mousePosition.x}px ${mousePosition.y}px)`
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      >
        <span className="text-[12rem] md:text-[22rem] font-display font-black uppercase text-white leading-none tracking-tighter drop-shadow-2xl">
          EXPERIENCE
        </span>
      </motion.div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Left Side: Massive Title */}
        <div className="lg:w-5/12">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="origin-bottom"
          >
            <span className="text-xl font-display font-bold text-neutral-500 tracking-[0.2em] uppercase mb-4 block">
              Experience //
            </span>
            <h2 className="text-[3.5rem] md:text-[5.5rem] leading-[0.85] font-display font-black uppercase tracking-tighter text-white mb-8">
              Driven by <br/> Curiosity <br/> & Code.
            </h2>
            <motion.div 
              style={{ scaleX: lineScale }}
              className="w-32 h-2 bg-white origin-left"
            />
          </motion.div>
        </div>

        {/* Right Side: The "No Experience" Manifesto */}
        <motion.div 
          style={{ y: textY }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-7/12"
        >
          <div className="relative bg-neutral-800/30 backdrop-blur-md border border-neutral-700/50 p-8 md:p-12 rounded-[2rem] shadow-2xl">
            {/* Accent Quote Mark */}
            <span className="absolute -top-12 -left-4 md:-left-8 text-[10rem] font-display font-black text-neutral-800 leading-none h-10 select-none z-0">"</span>
            
            <p className="text-xl md:text-2xl text-neutral-200 font-medium leading-relaxed relative z-10 mb-8">
              I am currently pursuing my BCA with a deep passion for software engineering, concentrating my energy directly on <strong className="text-white border-b border-white pb-1">building real-world applications.</strong>
            </p>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed mb-8 relative z-10">
              While I may be at the beginning of my professional journey, I haven't waited for graduation to start engineering. I've dedicated my time to architecting full-stack web platforms, integrating generative AI applications, and deploying real-time socket environments from the ground up.
            </p>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed relative z-10 mb-12">
              I am a rapid learner, deeply obsessed with clean code and flawless UI/UX, and I am actively looking for opportunities to bring my dedication and developer mindset to a forward-thinking codebase.
            </p>

            <div className="grid grid-cols-2 gap-8 border-t border-neutral-700 pt-10 relative z-10">
              <div>
                <span className="block text-5xl font-display font-black text-white mb-2">100%</span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Dedicated Learner</span>
              </div>
              <div>
                <span className="block text-5xl font-display font-black text-white mb-2">24/7</span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Builder Mindset</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
