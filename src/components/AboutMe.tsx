import { Lanyard } from './Lanyard'
import heroImage from '../assets/id_photo.png'
import { TextRepel } from './TextRepel'
import TextType from './TextType'
import { useRef } from 'react'
import { useInView, motion, useScroll, useTransform } from 'framer-motion'

export function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const cardY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section id="about-me" ref={containerRef} className="relative w-full bg-background py-20 px-8 border-t border-neutral-800">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        
        {/* Left side: 3D ID Card */}
        <motion.div style={{ y: cardY }} className="relative w-full md:w-1/2 flex justify-center h-[700px]">
          <Lanyard position={[0, 0, 13]} gravity={[0, -40, 0]} frontImage={heroImage} triggerSwing={isInView} />
        </motion.div>
        
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
              text={`Hey, I'm Rajashekhar Amarappagol! I'm a final-year BCA student, Web Developer, and System Designer passionate about building clean, responsive web applications with rock-solid foundations.\n\nMy core strength lies in designing end-to-end system architectures, database schemas in Firebase and MongoDB, and intuitive interface workflows. I pair my foundational skills in HTML, CSS, and web protocols with Google Antigravity as an AI pair-programmer to implement modern React, TypeScript, and Three.js components.\n\nI take full ownership of my software—from architecture and security rules to rigorous debugging, state management, and production deployment on Vercel and Firebase. Recently, I secured 4th place out of 69 teams at the IEEE AI Arena 2.0 hackathon.\n\nBeyond standard web development, I love tactile, physics-driven interactions. Go ahead—grab my 3D ID badge on the left and toss it around!`}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
