import { motion } from 'framer-motion'

export function LogoTicker() {
  const logos = ['HTML', 'CSS', 'C', 'Python']
  
  return (
    <div className="py-12 bg-background border-t border-neutral-100 overflow-hidden flex relative z-20">
      
      {/* Gradients for fading edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      <motion.div
        animate={{ x: "-50%" }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex whitespace-nowrap"
      >
        {/* Repeat enough times to cover ultra-wide monitors since only 4 logos exist */}
        {[...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex items-center space-x-3 px-16 text-foreground/50 grayscale hover:grayscale-0 hover:text-foreground transition-all duration-300 cursor-default">
            <div className="w-4 h-4 rounded-full bg-current"></div>
            <span className="text-xl font-display font-bold">{logo}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
