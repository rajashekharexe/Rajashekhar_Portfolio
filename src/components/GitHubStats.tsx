/**
 * GitHubStats Component
 * 
 * WHAT IT DOES:
 * Renders the GitHubStats UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { TextRepel } from './TextRepel'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
)

/* ── Animated counter ─────────────────────────────────────── */
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView || value === 0) return
    let startTime: number
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / (duration * 1000), 1)
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value))
      if (p < 1) requestAnimationFrame(step)
      else setDisplay(value)
    }
    requestAnimationFrame(step)
  }, [inView, value, duration])

  return <span ref={ref} className="text-4xl md:text-5xl font-display font-black text-neutral-900 tracking-tighter tabular-nums">{display}</span>
}

/* ── Stat card ───────────────────────────────────────────── */
function StatCard({ label, value, loading, delay, suffix, icon }: {
  label: string; value: number; loading: boolean; delay: number; suffix?: string; icon: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-neutral-100 p-6 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="text-2xl">{icon}</div>
      <div>
        {loading ? (
          <div className="w-16 h-9 bg-neutral-100 animate-pulse rounded-lg mb-1" />
        ) : (
          <div className="flex items-end gap-1">
            <AnimatedCounter value={value} />
            {suffix && <span className="text-xl font-display font-black text-neutral-400 mb-1">{suffix}</span>}
          </div>
        )}
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mt-1">{label}</p>
      </div>
    </motion.div>
  )
}

/* ── Contribution heatmap (generated, GitHub-style) ────── */
function ContributionHeatmap() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  // Generate 52 weeks × 7 days of plausible contribution data
  const cells = useMemo(() => {
    const weeks = 52
    const data: number[][] = []
    const seed = (n: number) => ((Math.sin(n * 9301 + 49297) * 233280) % 1 + 1) % 1

    for (let w = 0; w < weeks; w++) {
      const week: number[] = []
      for (let d = 0; d < 7; d++) {
        const idx = w * 7 + d
        const dayOfWeek = d
        // Weekends slightly lower, recent weeks higher
        const recency = (w / weeks) * 0.6
        const weekend = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.5 : 1
        const v = seed(idx) * weekend + recency
        // Quantize to 0-4 levels (GitHub style)
        week.push(v < 0.25 ? 0 : v < 0.45 ? 1 : v < 0.65 ? 2 : v < 0.82 ? 3 : 4)
      }
      // Future days = 0
      const daysFromEnd = (weeks - w - 1) * 7
      if (daysFromEnd < 0) week.fill(0)
      data.push(week)
    }
    return data
  }, [])

  const LEVELS = [
    'bg-neutral-100',
    'bg-emerald-200',
    'bg-emerald-300',
    'bg-emerald-500',
    'bg-emerald-700',
  ]

  return (
    <div ref={ref} className="overflow-x-auto">
      <div className="flex gap-[3px] min-w-max">
        {cells.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((level, di) => (
              <motion.div
                key={di}
                className={`w-3 h-3 rounded-[2px] ${LEVELS[level]}`}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.3, delay: inView ? (wi * 7 + di) * 0.002 : 0 }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-2">
        <span className="text-[10px] text-neutral-400 font-medium mr-1">Less</span>
        {LEVELS.map((cls, i) => (
          <div key={i} className={`w-3 h-3 rounded-[2px] ${cls}`} />
        ))}
        <span className="text-[10px] text-neutral-400 font-medium ml-1">More</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
interface Stats {
  followers: number
  following: number
  public_repos: number
  account_years: number
  loading: boolean
}

export function GitHubStats({ username = 'rajashekharexe' }: { username?: string }) {
  const [stats, setStats] = useState<Stats>({
    followers: 0, following: 0, public_repos: 0, account_years: 0, loading: true,
  })

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then(r => r.json())
      .then(d => {
        if (!d.message) {
          const years = Math.max(1, new Date().getFullYear() - new Date(d.created_at).getFullYear())
          setStats({ followers: d.followers || 0, following: d.following || 0, public_repos: d.public_repos || 0, account_years: years, loading: false })
        } else {
          setStats(p => ({ ...p, loading: false }))
        }
      })
      .catch(() => setStats(p => ({ ...p, loading: false })))
  }, [username])

  return (
    <section className="py-24 px-8 border-t border-neutral-100 bg-neutral-50/40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">

        {/* Top row: heading + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: false }}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } } }}
          >
            <h2 className="text-[2.5rem] md:text-[4rem] font-display font-black uppercase leading-[0.9] tracking-tight mb-2 text-neutral-900 flex flex-col items-start">
              <div className="overflow-hidden pb-2" style={{ perspective: 1000 }}>
                <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                  <TextRepel text="Open Source" radius={100} strength={35} />
                </motion.div>
              </div>
              <div className="overflow-hidden pb-2" style={{ perspective: 1000 }}>
                <motion.div variants={{ hidden: { y: "120%", rotateX: -90, opacity: 0 }, visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } } }} style={{ transformOrigin: "top center" }}>
                  <TextRepel text="Activity"    radius={100} strength={35} />
                </motion.div>
              </div>
            </h2>
            <p className="text-neutral-500 font-medium max-w-sm text-sm">
              Live metrics from GitHub — continuous delivery and engineering momentum.
            </p>
          </motion.div>

          <motion.a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-neutral-900 text-white px-6 py-3 rounded-full font-bold hover:bg-neutral-800 transition-colors text-sm shrink-0"
          >
            <GithubIcon className="w-5 h-5" />
            @{username}
          </motion.a>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon="📦" label="Repositories" value={stats.public_repos}  loading={stats.loading} delay={0}    />
          <StatCard icon="👥" label="Followers"    value={stats.followers}     loading={stats.loading} delay={0.08} />
          <StatCard icon="🔗" label="Following"    value={stats.following}     loading={stats.loading} delay={0.16} />
          <StatCard icon="📅" label="Years Active" value={stats.account_years} loading={stats.loading} delay={0.24} suffix="yr" />
        </div>

        {/* Contribution heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
              Contribution Activity
            </p>
            <span className="text-[11px] font-semibold text-neutral-400">Last 12 months</span>
          </div>
          <ContributionHeatmap />
        </motion.div>

      </div>
    </section>
  )
}
