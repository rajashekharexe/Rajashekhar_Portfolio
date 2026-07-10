import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { TextRepel } from './TextRepel'

/**
 * Hero Section
 * 
 * WHAT IT DOES:
 * This is the very first section the user sees (the top of the page). It contains your name,
 * a short bio, the "Download CV" button, and a large image on the right side.
 * 
 * HOW IT WORKS:
 * Uses Framer Motion's `staggerChildren` to make the big text ("AI-Powered", "Full-Stack", "Developer") 
 * slide up and un-blur one by one. It uses `useScroll` to create a Parallax effect on the image when you scroll down.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - Change the main text: Scroll down and find `<TextRepel text="AI-Powered" />`. Change the text prop.
 * - Change the button link/color: Find the `<a>` tag with "Download CV" and change the `href` or the Tailwind classes.
 * - Remove Parallax: If sir asks to stop the image from moving on scroll, remove `style={{ y }}` from the image container.
 */
export function Hero({ isReady = true }: { isReady?: boolean }) {
  // Reference to the main container, used to track scrolling for the parallax effect.
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Subtle parallax for the main image
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

  return (
    <section id="about" ref={containerRef} className="relative min-h-screen bg-background pt-32 pb-20 px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto min-h-[80vh] relative flex items-center">
        
        {/* The Image (Centered / slightly pulled right, behind text) */}
        <div className="absolute inset-x-0 bottom-0 top-0 z-0 flex items-end justify-center md:pl-20 pointer-events-none">
          <motion.img 
            src="/hero-image.png"
            alt="Futuristic Designer"
            className="h-[95%] w-auto max-w-none object-contain opacity-100 brightness-[1.05] contrast-[1.1] drop-shadow-2xl" 
            style={{ 
              y,
              WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" 
            }}
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
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.35 // Starts just as vault opens
                  }
                }
              }}
            >
              <h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.85] font-display font-black uppercase tracking-tighter mb-6 text-black flex flex-col items-start" style={{ perspective: 1200 }}>
                <motion.div variants={{
                  hidden: { opacity: 0, y: 120, rotateX: -80, rotateZ: 5, scale: 0.8, filter: "blur(20px)" },
                  visible: { opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } }
                }}>
                  <TextRepel text="AI-Powered" radius={120} strength={40} />
                </motion.div>
                <motion.div variants={{
                  hidden: { opacity: 0, y: 120, rotateX: -80, rotateZ: -5, scale: 0.8, filter: "blur(20px)" },
                  visible: { opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } }
                }}>
                  <TextRepel text="Full-Stack" radius={120} strength={40} />
                </motion.div>
                <motion.div variants={{
                  hidden: { opacity: 0, y: 120, rotateX: -80, rotateZ: 5, scale: 0.8, filter: "blur(20px)" },
                  visible: { opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } }
                }}>
                  <TextRepel text="Developer" radius={120} strength={40} />
                </motion.div>
              </h1>
              
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 } }
                }}
                className="text-xl md:text-2xl font-medium text-black mb-8 max-w-sm leading-tight"
              >
                I build fast, scalable web applications using React, Node.js and AI. Turning ideas into production-ready products.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="mt-12 md:mt-0"
            >
              <p className="text-sm font-medium text-black max-w-[280px] mb-6 leading-relaxed">
                Specializing in modern web ecosystems and AI integration. I architect robust solutions that automate workflows, optimize performance, and deliver exceptional user experiences from end to end.
              </p>
              <div className="flex items-center flex-wrap gap-6 text-black font-semibold text-sm">
                <a href="/resume.pdf" download="Rajashekhar_CV.pdf" className="bg-primary text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors uppercase tracking-widest text-[10px] md:text-xs">Download CV</a>
                <a href="https://www.linkedin.com/in/rajashekhar-exe/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
                <a href="https://github.com/rajashekharexe" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Floating Stats) */}
          <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-5 lg:col-start-8 flex flex-col justify-between pt-8 pb-4 z-20">
            
            <motion.div
              style={{ perspective: 1000 }}
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 80, rotateX: -60, scale: 0.9, filter: "blur(15px)" },
                visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="max-w-[340px] self-start md:self-end text-left sm:backdrop-blur-none bg-white/40 md:bg-transparent p-4 md:p-0 rounded-xl"
            >
              <h3 className="font-display font-black text-4xl md:text-5xl uppercase leading-[0.9] tracking-tight mb-4 text-foreground flex flex-col items-start">
                <TextRepel text="Full-Stack" radius={90} strength={30} />
                <TextRepel text="Developer" radius={90} strength={30} />
              </h3>
              <p className="text-sm md:text-base text-black font-medium leading-relaxed">Architecting robust solutions with React, Tailwind, Express, and modern databases.</p>
            </motion.div>

            <motion.div
              style={{ perspective: 1000 }}
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 80, rotateX: -60, scale: 0.9, filter: "blur(15px)" },
                visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1.4, delay: 0.75, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="max-w-[340px] self-start md:self-end text-left sm:backdrop-blur-none bg-white/40 md:bg-transparent p-4 md:p-0 rounded-xl mt-6 md:mt-0"
            >
              <h3 className="font-display font-black text-4xl md:text-5xl uppercase leading-[0.9] tracking-tight mb-4 text-foreground flex flex-col items-start">
                <TextRepel text="AI" radius={90} strength={30} />
                <TextRepel text="Integration" radius={90} strength={30} />
              </h3>
              <p className="text-sm md:text-base text-black font-medium leading-relaxed">LLM APIs, Prompt Engineering, AI Agents and Automation.</p>
            </motion.div>

            <motion.div
              style={{ perspective: 1000 }}
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 80, rotateX: -60, scale: 0.9, filter: "blur(15px)" },
                visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="max-w-[340px] self-start md:self-end text-left sm:backdrop-blur-none bg-white/40 md:bg-transparent p-4 md:p-0 rounded-xl mt-6 md:mt-0"
            >
              <h3 className="font-display font-black text-4xl md:text-5xl uppercase leading-[0.9] tracking-tight mb-4 text-foreground flex flex-col items-start">
                <TextRepel text="Production" radius={90} strength={30} />
                <TextRepel text="Ready" radius={90} strength={30} />
              </h3>
              <p className="text-sm md:text-base text-black font-medium leading-relaxed">Writing clean, maintainable code optimized for high performance and seamless deployment.</p>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}
