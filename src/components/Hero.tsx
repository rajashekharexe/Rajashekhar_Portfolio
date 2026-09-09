import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { TextRepel } from './TextRepel'

/**
 * Hero Section
 * Primary viewport with kinetic typography, parallax depth layers, and call-to-actions.
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
    <section id="about" ref={containerRef} className="relative min-h-screen bg-background pt-16 md:pt-20 pb-6 px-6 md:px-12 overflow-hidden flex flex-col justify-center">
      <div className="max-w-[1400px] w-full mx-auto relative flex-1 flex items-center">
        
        {/* The Image (Centered behind text) */}
        <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none">
          <motion.img 
            src="/hero-image.png"
            alt="Rajashekhar - Web Developer & System Designer"
            className="h-[88%] md:h-[92%] w-auto max-w-none object-contain opacity-100 brightness-[1.05] contrast-[1.1]" 
            style={{ 
              y,
              WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" 
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4">
          
          {/* Left Column (Huge Text + Bio + CTAs) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 flex flex-col gap-3.5">
            <motion.div
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.4
                  }
                }
              }}
            >
              <h1 className="text-[2.6rem] sm:text-[3.2rem] md:text-[3.6rem] lg:text-[4.2rem] xl:text-[4.5rem] leading-[0.88] font-display font-black uppercase tracking-tighter mb-3 text-black flex flex-col items-start">
                <div className="overflow-hidden pb-1" style={{ perspective: 1200 }}>
                  <motion.div 
                    variants={{
                      hidden: { y: "120%", rotateX: -90, opacity: 0 },
                      visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }
                    }} 
                    style={{ transformOrigin: "top center" }}
                  >
                    <TextRepel text="AI-Powered" radius={110} strength={35} />
                  </motion.div>
                </div>
                <div className="overflow-hidden pb-1" style={{ perspective: 1200 }}>
                  <motion.div 
                    variants={{
                      hidden: { y: "120%", rotateX: -90, opacity: 0 },
                      visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }
                    }} 
                    style={{ transformOrigin: "top center" }}
                  >
                    <TextRepel text="Web" radius={110} strength={35} />
                  </motion.div>
                </div>
                <div className="overflow-hidden pb-1" style={{ perspective: 1200 }}>
                  <motion.div 
                    variants={{
                      hidden: { y: "120%", rotateX: -90, opacity: 0 },
                      visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }
                    }} 
                    style={{ transformOrigin: "top center" }}
                  >
                    <TextRepel text="Developer" radius={110} strength={35} />
                  </motion.div>
                </div>
                <div className="overflow-hidden pb-1" style={{ perspective: 1200 }}>
                  <motion.div 
                    variants={{
                      hidden: { y: "120%", rotateX: -90, opacity: 0 },
                      visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }
                    }} 
                    style={{ transformOrigin: "top center" }}
                  >
                    <TextRepel text="& Designer" radius={110} strength={35} />
                  </motion.div>
                </div>
              </h1>
              
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.75 } }
                }}
                className="text-base md:text-lg font-semibold text-black max-w-sm leading-snug mb-2"
              >
                Web Developer & System Designer. Specializing in HTML, CSS, Firebase & AI-assisted web engineering.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              <p className="text-xs md:text-sm font-medium text-neutral-700 max-w-[340px] mb-4 leading-relaxed">
                Final-year BCA student architecting scalable database schemas, responsive UI workflows, and modern 3D WebGL experiences. Winner of 4th place at IEEE AI Arena 2.0.
              </p>
              <div className="flex items-center flex-wrap gap-5 text-black font-semibold text-sm">
                <a 
                  href="/resume.pdf" 
                  download="Rajashekhar_Amarappagol_Resume.pdf" 
                  className="bg-primary hover:bg-[#e04100] text-white px-6 py-2.5 rounded-full transition-all uppercase tracking-widest text-[11px] font-bold shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <span>Download CV</span>
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/rajashekhar-exe/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-xs md:text-sm">LinkedIn</a>
                <a href="https://github.com/rajashekharexe" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-xs md:text-sm">GitHub</a>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Original 3 Stat Blocks - neatly sized & aligned) */}
          <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-5 lg:col-start-8 flex flex-col gap-4 md:gap-5 z-20 self-center">
            
            <motion.div
              style={{ perspective: 1000 }}
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delayChildren: 0.9, staggerChildren: 0.08, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="max-w-[340px] self-start md:self-end text-left"
            >
              <h3 className="font-display font-black text-2xl md:text-3xl lg:text-[2rem] uppercase leading-[0.92] tracking-tight mb-1 text-foreground flex flex-col items-start">
                <div className="overflow-hidden pb-1" style={{ perspective: 1000 }}>
                  <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                    <TextRepel text="System" radius={80} strength={25} />
                  </motion.div>
                </div>
                <div className="overflow-hidden pb-1" style={{ perspective: 1000 }}>
                  <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                    <TextRepel text="Designer" radius={80} strength={25} />
                  </motion.div>
                </div>
              </h3>
              <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">
                Designing database schemas, Firebase security rules, and end-to-end user workflows.
              </motion.p>
            </motion.div>

            <motion.div
              style={{ perspective: 1000 }}
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delayChildren: 1.05, staggerChildren: 0.08, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="max-w-[340px] self-start md:self-end text-left"
            >
              <h3 className="font-display font-black text-2xl md:text-3xl lg:text-[2rem] uppercase leading-[0.92] tracking-tight mb-1 text-foreground flex flex-col items-start">
                <div className="overflow-hidden pb-1" style={{ perspective: 1000 }}>
                  <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                    <TextRepel text="AI-Assisted" radius={80} strength={25} />
                  </motion.div>
                </div>
                <div className="overflow-hidden pb-1" style={{ perspective: 1000 }}>
                  <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                    <TextRepel text="Stack" radius={80} strength={25} />
                  </motion.div>
                </div>
              </h3>
              <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">
                Building with Google Antigravity, React, TypeScript, and Three.js physics.
              </motion.p>
            </motion.div>

            <motion.div
              style={{ perspective: 1000 }}
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delayChildren: 1.2, staggerChildren: 0.08, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="max-w-[340px] self-start md:self-end text-left"
            >
              <h3 className="font-display font-black text-2xl md:text-3xl lg:text-[2rem] uppercase leading-[0.92] tracking-tight mb-1 text-foreground flex flex-col items-start">
                <div className="overflow-hidden pb-1" style={{ perspective: 1000 }}>
                  <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                    <TextRepel text="Shipped" radius={80} strength={25} />
                  </motion.div>
                </div>
                <div className="overflow-hidden pb-1" style={{ perspective: 1000 }}>
                  <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                    <TextRepel text="Live" radius={80} strength={25} />
                  </motion.div>
                </div>
              </h3>
              <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">
                Multiple production apps deployed on Vercel and Firebase with 95+ Lighthouse performance.
              </motion.p>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}
