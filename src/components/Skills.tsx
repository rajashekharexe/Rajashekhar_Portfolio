import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'

const CHARS = '#';

function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    let iteration = -5;
    let interval: any = null;

    clearInterval(interval);
    
    interval = setInterval(() => {
      if (!ref.current) return;
      
      ref.current.innerText = text
        .split("")
        .map((_, index) => {
          if (index < iteration) {
            return text[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      
      if (iteration >= text.length) { 
        clearInterval(interval);
      }
      
      iteration += 1 / 3; 
    }, 30);
    
    return () => clearInterval(interval);
  }, [isInView, text]);

  return <motion.span ref={ref} className="inline-block relative">{text}</motion.span>;
}

export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Aggressive parallax effects with inertial spring dampers for a luxurious feel
  const rawImgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const imgY = useSpring(rawImgY, { stiffness: 100, damping: 30, restDelta: 0.001 })
  
  const rawImgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05])
  const imgScale = useSpring(rawImgScale, { stiffness: 100, damping: 30, restDelta: 0.001 })
  
  // Massive background text that scrolls horizontally
  const rawBgX = useTransform(scrollYProgress, [0, 1], ["10%", "-50%"])
  const bgX = useSpring(rawBgX, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const skills = [
    { category: "Core Languages", items: ["C", "Python", "TypeScript", "JavaScript"] },
    { category: "Web Development", items: ["HTML & CSS", "React", "Node.js", "Tailwind CSS"] },
    { category: "Specializations", items: ["AI Website Development", "Full-Stack Architecture", "Responsive Design"] }
  ]

  return (
    <section id="skills" ref={containerRef} className="relative py-32 px-8 bg-white overflow-hidden">
      
      {/* Immersive Background Typography */}
      <motion.div 
        style={{ x: bgX }} 
        className="absolute top-[20%] left-0 whitespace-nowrap pointer-events-none select-none z-0"
      >
        <span className="text-[12rem] md:text-[20rem] font-display font-black uppercase text-neutral-200/50 leading-none">
          DEVELOPER ARSENAL
        </span>
      </motion.div>

      <div className="max-w-[1400px] mx-auto min-h-[70vh] flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full items-center">
          
          {/* Left Column (Image) */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center group pointer-events-auto">
            <motion.img 
              src="/skills-image.png"
              alt="Developing on laptop"
              fetchPriority="high"
              className="w-full h-auto object-contain mix-blend-multiply brightness-[1.05] contrast-[1.15] grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 transform-gpu will-change-transform" 
              style={{ y: imgY, scale: imgScale, backfaceVisibility: "hidden" }} 
            />
          </div>

          {/* Right Column (Text & Skills) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 50, skewX: -5 }}
              whileInView={{ opacity: 1, x: 0, skewX: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-[3.5rem] md:text-[5rem] leading-[0.85] font-display font-black uppercase tracking-tighter mb-8 text-neutral-900">
                <div className="flex overflow-hidden">
                  <ScrambleText text="Technical" />
                </div>
                <div className="flex overflow-hidden mt-1">
                  <ScrambleText text="Arsenal" />
                </div>
              </h2>
              
              <p className="text-lg text-neutral-600 font-medium mb-12 max-w-md leading-relaxed">
                Combining foundational programming tools with cutting-edge AI technologies to build modern, scalable web applications.
              </p>
            </motion.div>

            <div className="space-y-12">
              {skills.map((skillGroup, index) => (
                <div key={index}>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                    className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-5"
                  >
                    {skillGroup.category}
                  </motion.h3>
                  
                  <div className="flex flex-wrap gap-4">
                    {skillGroup.items.map((skill, i) => (
                      <motion.span 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 150, 
                          damping: 12, 
                          delay: (index * 0.1) + (i * 0.05) 
                        }}
                        className="px-6 py-3 bg-white border border-neutral-200 shadow-sm rounded-full text-sm font-bold tracking-wide text-neutral-800 hover:bg-neutral-900 hover:text-white hover:shadow-lg transition-all duration-300 cursor-pointer"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
