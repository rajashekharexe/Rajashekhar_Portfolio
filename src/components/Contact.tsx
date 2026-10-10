import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { MagneticButton } from './MagneticButton'
import { TextRepel } from './TextRepel'
import DotField from './DotField'
import { MagneticSatelliteOrbs } from './MagneticSatelliteOrbs'

const MY_EMAIL = 'rajashekhar.exe@gmail.com'


/**
 * Contact Section
 * Particle field canvas backdrop, interactive mail dispatch, and social profiles.
 */
export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle')
  const [senderEmail, setSenderEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!senderEmail || !message) return

    setFormState('loading')

    // Build a mailto: link pre-filled with the sender's email and message
    const subject = encodeURIComponent(`Portfolio Contact from ${senderEmail}`)
    const body = encodeURIComponent(`From: ${senderEmail}\n\n${message}`)
    const mailtoLink = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`

    // Open the user's mail client
    window.open(mailtoLink, '_blank')

    // Brief delay then show success
    setTimeout(() => {
      setFormState('success')
      setSenderEmail('')
      setMessage('')
    }, 800)
  }

  // Reveal the massive name plate at the very bottom as the user hits the end of the scroll
  const textY = useTransform(scrollYProgress, [0, 1], ["50%", "0%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0, 1, 1])
  const textScale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

  return (
    <section id="contact" ref={containerRef} className="pt-32 pb-10 px-8 bg-black text-white relative flex flex-col justify-between min-h-screen">

      {/* ── Animated dot field background ── */}
      <DotField
        dotRadius={1.8}
        dotSpacing={16}
        gradientFrom="rgba(255,255,255,0.75)"
        gradientTo="rgba(255,255,255,0.55)"
        glowColor="rgba(255,255,255,0.22)"
        glowRadius={240}
        bulgeOnly
        bulgeStrength={65}
        cursorRadius={450}
      />

      {/* Background cinematic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] md:w-[50vw] md:h-[50vw] bg-neutral-800/30 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10 flex-grow flex flex-col justify-center">

        <div className="flex flex-col lg:flex-row justify-between items-center mb-32 gap-16">
          <div className="w-full lg:w-1/2">
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
                <h3 className="text-3xl font-display font-black uppercase mb-2">Transmission Initiated</h3>
                <p className="text-neutral-400 font-medium max-w-md">Your mail client should be open and ready. Hit send and I'll get back to you shortly.</p>
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
                  aria-label="Your email address"
                  value={senderEmail}
                  disabled={formState === 'loading'}
                  onChange={e => setSenderEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  className="w-full bg-transparent border-b-2 border-neutral-800 pb-4 text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                />
                <textarea
                  required
                  aria-label="Your message"
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
                      aria-label="Transmit message"
                      className="group flex items-center gap-4 text-2xl md:text-4xl font-display font-black text-white hover:text-neutral-300 transition-colors disabled:opacity-50"
                    >
                      {formState === 'loading' ? 'Opening...' : 'Transmit'}
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

          {/* Right: Magnetic Cosmic Satellite Cluster */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <MagneticSatelliteOrbs />

            <div className="flex flex-wrap items-center justify-between gap-4 text-neutral-400 font-medium text-xs md:text-sm border-t border-neutral-800/80 pt-4">
              <span className="text-white font-bold uppercase tracking-widest text-[11px]">Direct Telemetry</span>
              <div className="flex flex-wrap items-center gap-4">
                <a href={`mailto:${MY_EMAIL}`} className="hover:text-white transition-colors">{MY_EMAIL}</a>
                <span>·</span>
                <a href="https://github.com/rajashekharexe" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                <span>·</span>
                <a href="https://www.linkedin.com/in/rajashekhar-exe/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                <span>·</span>
                <a href="tel:6366052864" className="hover:text-white transition-colors">+91 6366052864</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Massive Bottom Text Reveal — physics repel on hover */}
      <div className="w-full relative z-10 mt-auto overflow-hidden pt-20">
        <motion.div
          style={{ y: textY, opacity: textOpacity, scale: textScale }}
          className="w-full flex justify-center origin-bottom"
        >
          <TextRepel
            text="RAJASHEKHAR"
            radius={200}
            strength={90}
            stiffness={150}
            damping={12}
            mass={0.5}
            className="text-[13vw] font-display font-black uppercase tracking-tighter leading-none text-white"
          />
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-[1400px] mx-auto w-full relative z-10 flex flex-col md:flex-row justify-between items-center text-neutral-500 font-medium text-xs md:text-sm mt-8 pt-8 border-t border-neutral-800/50">
        <p>© 2026 Rajashekhar. All rights reserved.</p>
        <a href={`mailto:${MY_EMAIL}`} className="hover:text-neutral-300 transition-colors mt-2 md:mt-0">
          {MY_EMAIL}
        </a>
      </div>

    </section>
  )
}
