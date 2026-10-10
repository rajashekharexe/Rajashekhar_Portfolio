import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { TextRepel } from './TextRepel'

const SkillsTerrarium = lazy(() => import('./SkillsTerrarium'))

const PURPLE = '#6366F1'
const GREEN  = '#22C55E'
const ORANGE = '#F97316'
const BLUE   = '#2563EB'

/* ── Skill badge chip ────────────────────────────────────────── */
function Badge({ name, color }: { name: string; color: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.06, y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-[13px] font-bold
                 bg-neutral-50 border border-neutral-200 text-neutral-700
                 hover:text-white transition-colors duration-200 cursor-default select-none"
      style={{
        '--hover-bg': color,
      } as React.CSSProperties}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = color
        ;(e.currentTarget as HTMLElement).style.borderColor = color
        ;(e.currentTarget as HTMLElement).style.color = '#fff'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.background = ''
        ;(e.currentTarget as HTMLElement).style.borderColor = ''
        ;(e.currentTarget as HTMLElement).style.color = ''
      }}
    >
      {name}
    </motion.span>
  )
}

/* ── Category card ────────────────────────────────────────────── */
function SkillCard({ emoji, title, color, skills }: {
  emoji: string; title: string; color: string; skills: string[]
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-base">{emoji}</span>
        <span className="text-[9.5px] font-black uppercase tracking-widest" style={{ color }}>
          {title}
        </span>
      </div>
      {/* Badge grid */}
      <div className="flex flex-wrap gap-1.5">
        {skills.map(s => <Badge key={s} name={s} color={color} />)}
      </div>
    </div>
  )
}

/**
 * Skills Section
 * Technical proficiency matrix categorized into language, web, database, AI, and devops layers.
 */
export function Skills() {
  return (
    <section
      id="skills"
      className="bg-white relative overflow-hidden"
      style={{ borderTop: '1px solid #f0f0f0', minHeight: '100vh' }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[42%_58%] min-h-screen">

        {/* ── Left: Photo ──────────────────────────────────── */}
        <div className="hidden lg:flex items-center justify-center overflow-hidden bg-white">
          <img
            src="/skills-image.png"
            alt="Rajashekhar"
            className="w-full max-w-[460px] h-auto object-contain mix-blend-multiply brightness-[1.02] will-change-transform"
            fetchPriority="high"
          />
        </div>

        {/* ── Right: All content ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center py-10 px-8 lg:pl-10 lg:pr-14 min-h-screen gap-7"
        >

          {/* ① Top Row: Heading + AI Widget */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Left: Heading */}
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: PURPLE }}>
                Skills
              </p>
              <motion.h2 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="text-[3.5rem] md:text-[4.5rem] leading-[0.85] font-display font-black uppercase tracking-tighter mb-2 text-black flex flex-col items-start"
              >
                <div className="overflow-hidden pb-2" style={{ perspective: 1000 }}>
                  <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                    <TextRepel text="Technical" radius={100} strength={35} />
                  </motion.div>
                </div>
                <div className="overflow-hidden pb-2" style={{ perspective: 1000 }}>
                  <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                    <TextRepel text="Arsenal" radius={100} strength={35} />
                  </motion.div>
                </div>
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-[3px] w-8 origin-left rounded-full mb-3"
                style={{ background: PURPLE }}
              />
              <p className="text-neutral-500 text-[13px] leading-relaxed max-w-[380px]">
                Combining foundational programming tools with cutting-edge AI technologies to build modern, scalable web applications.
              </p>
            </div>
            
            {/* Right: Skills 3D Physics Terrarium */}
            <div className="w-full md:w-[320px] lg:w-[360px] shrink-0">
              <Suspense
                fallback={
                  <div className="w-full h-[320px] rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 font-mono text-xs">
                    Initializing Physics Terrarium...
                  </div>
                }
              >
                <SkillsTerrarium />
              </Suspense>
            </div>
          </div>

          {/* ② Stats */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { emoji: '🥈', value: '2nd Place', label: 'IEEE GAMEATHON' },
              { emoji: '🏆', value: 'Top 6%',    label: 'IEEE AI Arena 2.0' },
              { emoji: '🎯', value: '95/100',    label: 'Class 12 CS' },
              { emoji: '🎓', value: '2027',      label: 'BCA Final Year' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-neutral-100 shadow-sm">
                <span className="text-sm">{s.emoji}</span>
                <div>
                  <div className="text-sm font-black text-neutral-900 leading-none">{s.value}</div>
                  <div className="text-[9.5px] text-neutral-400 font-medium mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ③ Skill badge cards */}
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">Technical Competencies</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SkillCard
                emoji="⚡" title="Core & Languages (Hands-on)" color={PURPLE}
                skills={['HTML5', 'CSS3', 'JavaScript', 'Python', 'SQL']}
              />
              <SkillCard
                emoji="🗄️" title="Backend & Databases" color={GREEN}
                skills={['Firebase', 'Firestore', 'Auth', 'MongoDB', 'REST APIs', 'System Design']}
              />
              <SkillCard
                emoji="🤖" title="AI-Assisted Frameworks" color={ORANGE}
                skills={['React.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Three.js / R3F']}
              />
              <SkillCard
                emoji="🛠️" title="Tools & Platforms" color={BLUE}
                skills={['Google Antigravity', 'Git', 'GitHub', 'VS Code', 'Vercel']}
              />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
