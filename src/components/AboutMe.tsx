import { Lanyard } from './Lanyard'
import heroImage from '../assets/id_photo.png'
import { TextRepel } from './TextRepel'
import TextType from './TextType'
import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'

export function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  return (
    <section id="about-me" ref={containerRef} className="relative w-full bg-background py-20 px-8 border-t border-neutral-800">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        
        {/* Left side: 3D ID Card */}
        <div className="relative w-full md:w-1/2 flex justify-center h-[700px]">
          <Lanyard position={[0, 0, 13]} gravity={[0, -40, 0]} frontImage={heroImage} triggerSwing={isInView} />
        </div>
        
        {/* Right side: Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-display font-black mb-8 tracking-tight text-black uppercase"
          >
            <TextRepel text="ABOUT ME" />
          </motion.h2>
          <div className="text-lg md:text-xl font-sans font-medium text-neutral-800 leading-[1.8] tracking-wide whitespace-pre-wrap">
            <TextType 
              as="p"
              loop={false}
              typingSpeed={10}
              variableSpeed={{ min: 8, max: 15 }}
              startOnVisible={true}
              text={`Hey, I'm Rajshekhar! I'm a passionate full-stack engineer who thrives on building seamless, high-performance web applications that don't just work—they leave a lasting impression.\n\nMy expertise lies in blending robust backend architecture with cutting-edge frontend technologies like React, Node.js, and TypeScript. I obsess over the small details, ensuring every line of code translates into a flawless user experience.\n\nBeyond the traditional web stack, I'm deeply fascinated by the intersection of 3D graphics and UI design. When I'm not writing server logic, you'll find me experimenting with WebGL, Three.js, and physics engines to bring interfaces to life and push the boundaries of what a browser can do.\n\nI believe the web should be fun, interactive, and beautiful. Go ahead—grab my ID badge on the left and toss it around!`}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
