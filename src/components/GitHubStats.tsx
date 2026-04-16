import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
)

interface Stats {
  followers: number
  public_repos: number
  following: number
  loading: boolean
}

export function GitHubStats({ username = 'rajashekharexe' }: { username?: string }) {
  const [stats, setStats] = useState<Stats>({
    followers: 0,
    public_repos: 0,
    following: 0,
    loading: true
  })

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then(res => res.json())
      .then(data => {
        if (!data.message) { // no error
          setStats({
            followers: data.followers || 0,
            public_repos: data.public_repos || 0,
            following: data.following || 0,
            loading: false
          })
        }
      })
      .catch(() => {
        setStats(prev => ({ ...prev, loading: false }))
      })
  }, [username])

  return (
    <section className="py-24 px-8 border-t border-neutral-100 flex justify-center">
      <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center justify-between gap-12">
        
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[2.5rem] md:text-[4rem] font-display font-black uppercase leading-[0.9] tracking-tight mb-4 text-neutral-900">
              Open Source <br /> Activity
            </h2>
            <p className="text-neutral-500 font-medium max-w-sm mb-6">
              Live metrics fetched directly from the GitHub API, proving continuous delivery and engineering momentum.
            </p>
            <a 
              href={`https://github.com/${username}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-neutral-900 text-white px-6 py-3 rounded-full font-bold hover:bg-neutral-800 transition-colors"
            >
              <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              View Profile
            </a>
          </motion.div>
        </div>

        <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-neutral-50 border border-neutral-100 p-8 rounded-2xl flex flex-col justify-center items-center text-center"
          >
            <h4 className="text-neutral-400 font-bold uppercase tracking-widest text-xs mb-2">Repositories</h4>
            {stats.loading ? (
              <div className="w-16 h-12 bg-neutral-200 animate-pulse rounded-md"></div>
            ) : (
              <span className="text-5xl md:text-6xl font-display font-black text-neutral-900 tracking-tighter">
                {stats.public_repos}
              </span>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-neutral-50 border border-neutral-100 p-8 rounded-2xl flex flex-col justify-center items-center text-center"
          >
            <h4 className="text-neutral-400 font-bold uppercase tracking-widest text-xs mb-2">Followers</h4>
            {stats.loading ? (
              <div className="w-16 h-12 bg-neutral-200 animate-pulse rounded-md"></div>
            ) : (
              <span className="text-5xl md:text-6xl font-display font-black text-neutral-900 tracking-tighter">
                {stats.followers}
              </span>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
