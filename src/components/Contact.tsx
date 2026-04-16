import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { MagneticButton } from './MagneticButton'

// Generic SVGs to avoid Lucide version mismatch errors
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
)

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!email || !message) return
    setFormState('loading')
    // Mocking an async serverless function payload delivery
    await new Promise(resolve => setTimeout(resolve, 2000))
    setFormState('success')
    setEmail('')
    setMessage('')
  }

  // Reveal the massive name plate at the very bottom as the user hits the end of the scroll
  const textY = useTransform(scrollYProgress, [0, 1], ["50%", "0%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0, 1, 1])
  const textScale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

  return (
    <section id="contact" ref={containerRef} className="pt-32 pb-10 px-8 bg-black text-white relative flex flex-col justify-between min-h-screen">
      
      {/* Background cinematic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] md:w-[50vw] md:h-[50vw] bg-neutral-800/30 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10 flex-grow flex flex-col justify-center">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-32 gap-16">
          <div className="w-full lg:w-2/3">
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-neutral-400 font-medium text-xl md:text-3xl mb-12"
            >
              Ready to engineer something extraordinary?
            </motion.p>
            
            {formState === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-8 border border-neutral-800 rounded-2xl bg-neutral-900/50 backdrop-blur-md flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-3xl font-display font-black uppercase mb-2">Transmission Received</h3>
                <p className="text-neutral-400 font-medium max-w-md">Your message has been securely delivered to my inbox. I will initialize a response sequence shortly.</p>
                <button onClick={() => setFormState('idle')} className="mt-8 text-sm uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-colors border-b border-neutral-700 pb-1">Send Another</button>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleFormSubmit}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex flex-col gap-6"
              >
                <input 
                  type="email" 
                  required
                  value={email}
                  disabled={formState === 'loading'}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL" 
                  className="w-full bg-transparent border-b-2 border-neutral-800 pb-4 text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                />
                <textarea 
                  required
                  value={message}
                  disabled={formState === 'loading'}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="INITIALIZE MESSAGE..." 
                  rows={3}
                  className="w-full bg-transparent border-b-2 border-neutral-800 pt-4 pb-4 text-xl md:text-3xl lg:text-4xl font-display font-bold text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors resize-none disabled:opacity-50"
                ></textarea>
                <div className="flex justify-start mt-6">
                  <MagneticButton>
                    <button 
                      type="submit" 
                      disabled={formState === 'loading'}
                      className="group flex items-center gap-4 text-2xl md:text-4xl font-display font-black text-white hover:text-neutral-300 transition-colors disabled:opacity-50"
                    >
                      {formState === 'loading' ? 'Encrypting...' : 'Transmit'} 
                      <span className="bg-white text-black p-4 rounded-full group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                        {formState === 'loading' ? (
                          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 stroke-[3]" />
                        )}
                      </span>
                    </button>
                  </MagneticButton>
                </div>
              </motion.form>
            )}
          </div>

          <div className="flex flex-row lg:flex-col gap-8 lg:gap-4 text-neutral-400 font-medium text-lg w-full lg:w-auto justify-between lg:justify-start border-t border-neutral-800 lg:border-none pt-8 lg:pt-0">
            <span className="text-white font-bold uppercase tracking-widest text-sm mb-2 hidden lg:block">Connect</span>
            <div className="flex lg:flex-col gap-6 lg:gap-4 w-full justify-around lg:justify-start">
              <MagneticButton>
                <a href="tel:6366052864" className="flex items-center gap-3 hover:text-white transition-colors group p-2">
                  <PhoneIcon className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                  <span className="hidden md:inline">+91 6366052864</span>
                </a>
              </MagneticButton>
              <MagneticButton>
                <a href="https://github.com/rajashekharexe" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group p-2">
                  <GithubIcon className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                  <span className="hidden md:inline">GitHub</span>
                </a>
              </MagneticButton>
              <MagneticButton>
                <a href="https://www.instagram.com/rajashekhar.exe/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group p-2">
                  <InstagramIcon className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                  <span className="hidden md:inline">Instagram</span>
                </a>
              </MagneticButton>
              <MagneticButton>
                <a href="#" className="flex items-center gap-3 hover:text-white transition-colors group p-2">
                  <LinkedinIcon className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                  <span className="hidden md:inline">LinkedIn</span>
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>

      </div>

      {/* Massive Bottom Text Reveal - Expands as you hit the bottom bounds of the page */}
      <div className="w-full relative z-10 mt-auto overflow-hidden pt-20">
        <motion.div 
          style={{ y: textY, opacity: textOpacity, scale: textScale }}
          className="w-full flex justify-center origin-bottom"
        >
          <h1 className="text-[13vw] font-display font-black uppercase tracking-tighter leading-none text-white whitespace-nowrap">
            RAJASHEKHAR
          </h1>
        </motion.div>
      </div>

      {/* Minimalist Footer Meta */}
      <div className="max-w-[1400px] mx-auto w-full relative z-10 flex flex-col md:flex-row justify-between items-center text-neutral-500 font-medium text-xs md:text-sm mt-8 pt-8 border-t border-neutral-800/50">
        <p>© 2026 Rajashekhar. All rights reserved.</p>
      </div>

    </section>
  )
}
