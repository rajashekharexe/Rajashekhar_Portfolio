import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ScrambleText } from './ScrambleText'
import { Terminal } from './Terminal'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Subtle parallax for the main image
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

  return (
    <section ref={containerRef} className="relative min-h-screen bg-background pt-32 pb-20 px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto min-h-[80vh] relative flex items-center">
        
        {/* The Image (Centered / slightly pulled right, behind text) */}
        <div className="absolute inset-x-0 bottom-0 top-0 z-0 flex items-end justify-center md:pl-20 pointer-events-none">
          <motion.img 
            src="/hero-image.png"
            alt="Futuristic Designer"
            className="h-[95%] w-auto max-w-none object-contain mix-blend-multiply opacity-100 brightness-[1.05] contrast-[1.15]" 
            style={{ y }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-4 h-[80vh]">
          
          {/* Left Column (Huge Text + Bio) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.85] font-display font-black uppercase tracking-tighter mb-6">
                <ScrambleText text="Building" /> <br/> 
                <ScrambleText text="Modern" /> <br/> 
                <ScrambleText text="Software" />
              </h1>
              
              <p className="text-xl md:text-2xl font-medium text-foreground/80 mb-8 max-w-sm leading-tight">
                Robust full-stack development that drives performance and scales securely.
              </p>


            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 md:mt-0"
            >
              <p className="text-sm font-medium text-foreground/70 max-w-[280px] mb-6 leading-relaxed hidden lg:block">
                I'm a Full-Stack Software Engineer specializing in React, TypeScript, and Node.js. I build complete web ecosystems—from fluid frontend interfaces to resilient backend architectures.
              </p>
              
              {/* Interactive Terminal */}
              <Terminal />
              <div className="flex space-x-6 text-foreground/80 font-semibold text-sm">
                <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                <a href="#" className="hover:text-primary transition-colors">Email</a>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Floating Stats) */}
          <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-5 lg:col-start-8 flex flex-col justify-between pt-16 pb-12 z-20">
            
            <motion.div
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[340px] self-start md:self-end text-left sm:backdrop-blur-none bg-white/40 md:bg-transparent p-4 md:p-0 rounded-xl"
            >
              <h3 className="font-display font-black text-4xl md:text-5xl uppercase leading-[0.9] tracking-tight mb-4 text-foreground">Full-Stack<br/>Developer</h3>
              <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed">Architecting robust solutions with React, Tailwind, Express, and modern databases.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[340px] self-start md:self-end text-left sm:backdrop-blur-none bg-white/40 md:bg-transparent p-4 md:p-0 rounded-xl mt-12 md:mt-0"
            >
              <h3 className="font-display font-black text-4xl md:text-5xl uppercase leading-[0.9] tracking-tight mb-4 text-foreground">Production<br/>Ready</h3>
              <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed">Writing clean, maintainable code optimized for high performance and seamless deployment.</p>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}
