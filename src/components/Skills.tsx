import { motion } from 'framer-motion'
import { TextRepel } from './TextRepel'

const PURPLE = '#6366F1'
const GREEN  = '#22C55E'
const ORANGE = '#F97316'

/**
 * AIWidget (Inner Component)
 * 
 * WHAT IT DOES:
 * This renders the "AI Core" widget with the spinning geometric rings and the "System Status" box.
 * 
 * HOW IT WORKS:
 * Uses Framer Motion's `animate={{ rotate: 360 }}` combined with `repeat: Infinity` to create
 * continuously spinning SVG rings.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - To stop the spinning, remove the `animate={{ rotate: 360 }}` prop from the `<motion.svg>` tags.
 * - To change the pulsing green light, look for `bg-green-500` inside the "System Status" block.
 */
function AIWidget() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative w-full h-full min-h-[160px] rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden flex items-center justify-center shadow-sm"
    >
       {/* Animated geometric rings */}
       <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} className="absolute w-[220px] h-[220px] border border-dashed border-neutral-300 rounded-full" />
       <motion.div animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }} className="absolute w-[150px] h-[150px] border border-neutral-300 rounded-full" />
       <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute w-[90px] h-[90px] border border-dashed border-neutral-300 rounded-full opacity-50" />
       
       {/* Glowing Core */}
       <div className="absolute w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-xl z-10">
         <motion.div animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-black rounded-full" />
         <span className="text-white text-xs font-black tracking-widest relative z-10">AI</span>
       </div>

       {/* System Status overlay */}
       <div className="absolute bottom-3 left-4 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-neutral-100 shadow-sm">
         <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">System Core</div>
         <div className="text-[9.5px] font-bold text-green-600 flex items-center gap-1.5 leading-none">
           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           Optimal
         </div>
       </div>
    </motion.div>
  )
}

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
 * Skills Section (Main Component)
 * 
 * WHAT IT DOES:
 * Displays your technical skills grid alongside your photo and the custom AI Widget.
 * 
 * HOW IT WORKS:
 * The layout uses CSS Grid (`grid-cols-12`). The left side takes 4 columns (`col-span-4`),
 * and the right side takes 8 columns (`col-span-8`). 
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - Change the main photo: Find `<img src="/skills-image.png" />` and change the `src`.
 * - Add a new skill category: You would add a new `<div className="bg-white rounded-xl ...">` block inside the right column.
 * - Change heading text: The heading uses `<TextRepel>`. Change the `text` prop to change the words.
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
              <h2 className="text-[3.5rem] md:text-[4.5rem] leading-[0.85] font-display font-black uppercase tracking-tighter mb-2 text-black flex flex-col items-start">
                <TextRepel text="Technical" radius={100} strength={35} />
                <TextRepel text="Arsenal" radius={100} strength={35} />
              </h2>
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
            
            {/* Right: AI Widget */}
            <div className="w-full md:w-[280px] shrink-0">
              <AIWidget />
            </div>
          </div>

          {/* ② Stats */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { emoji: '🏆', value: '5+',  label: 'Projects' },
              { emoji: '💻', value: '3+',  label: 'Years Coding' },
              { emoji: '🚀', value: 'AI',  label: 'Enthusiast' },
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
            <p className="text-[9.5px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">My Skills</p>
            <div className="grid grid-cols-3 gap-3">
              <SkillCard
                emoji="⚡" title="Languages" color={PURPLE}
                skills={['C', 'Python', 'TypeScript', 'JavaScript']}
              />
              <SkillCard
                emoji="🌐" title="Web Dev" color={GREEN}
                skills={['React', 'Next.js', 'Node.js', 'HTML & CSS', 'Tailwind', 'Express']}
              />
              <SkillCard
                emoji="🤖" title="AI & Tools" color={ORANGE}
                skills={['LLM APIs', 'Prompt Eng.', 'AI Workflows', 'OpenCV', 'TensorFlow']}
              />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
