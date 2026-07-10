import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TextRepel } from './TextRepel'

interface HistoryLine {
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'info' | 'spacer'
  text: string
}

const BOOT_LINES: HistoryLine[] = [
  { type: 'system', text: '  ██████╗  █████╗      ██╗ ██████╗ ███████╗' },
  { type: 'system', text: '  ██╔══██╗██╔══██╗     ██║██╔═══██╗██╔════╝' },
  { type: 'system', text: '  ██████╔╝███████║     ██║██║   ██║███████╗ ' },
  { type: 'system', text: '  ██╔══██╗██╔══██║██   ██║██║   ██║╚════██║ ' },
  { type: 'system', text: '  ██║  ██║██║  ██║╚█████╔╝╚██████╔╝███████║ ' },
  { type: 'system', text: '  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝  ╚═════╝ ╚══════╝ ' },
  { type: 'spacer', text: '' },
  { type: 'info',   text: '  Rajashekhar OS  v2.0.0  —  AI-Empowered Build' },
  { type: 'system', text: '  © 2026 Rajashekhar. All systems operational.' },
  { type: 'spacer', text: '' },
  { type: 'output', text: '  Type "help" to see all available commands.' },
  { type: 'spacer', text: '' },
]

/**
 * COMMANDS Dictionary
 * 
 * WHAT IT DOES:
 * Stores every available command the user can type, and the array of text lines it returns.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * To add a new command, simply add it to this object. For example:
 * `hello: () => [{ type: 'success', text: 'Hello World!' }],`
 */
const COMMANDS: Record<string, () => HistoryLine[]> = {
  help: () => [
    { type: 'info',    text: '┌──────────────────────────────────────────────────┐' },
    { type: 'info',    text: '│              AVAILABLE COMMANDS                  │' },
    { type: 'info',    text: '├──────────────────┬───────────────────────────────┤' },
    { type: 'info',    text: '│  whoami          │  Display profile & bio        │' },
    { type: 'info',    text: '│  skills          │  List technical stack         │' },
    { type: 'info',    text: '│  projects        │  Show all projects             │' },
    { type: 'info',    text: '│  experience      │  Work & education history     │' },
    { type: 'info',    text: '│  contact         │  Get in touch                 │' },
    { type: 'info',    text: '│  ai              │  AI-powered philosophy        │' },
    { type: 'info',    text: '│  ls              │  List portfolio sections      │' },
    { type: 'info',    text: '│  date            │  Show current date & time     │' },
    { type: 'info',    text: '│  clear           │  Clear the terminal           │' },
    { type: 'info',    text: '└──────────────────┴───────────────────────────────┘' },
    { type: 'spacer',  text: '' },
  ],

  whoami: () => [
    { type: 'success', text: '  ╔═══════════════════════════════════════╗' },
    { type: 'success', text: '  ║         RAJASHEKHAR                   ║' },
    { type: 'success', text: '  ║   Full-Stack Software Engineer         ║' },
    { type: 'success', text: '  ╚═══════════════════════════════════════╝' },
    { type: 'spacer',  text: '' },
    { type: 'output',  text: '  › Role      :  AI-Empowered Full-Stack Engineer' },
    { type: 'output',  text: '  › Focus     :  React · TypeScript · Node.js · AI' },
    { type: 'output',  text: '  › Location  :  India' },
    { type: 'output',  text: '  › Status    :  Open to exciting opportunities 🟢' },
    { type: 'spacer',  text: '' },
    { type: 'info',    text: '  I build complete web ecosystems — from pixel-perfect' },
    { type: 'info',    text: '  frontends to resilient backend architectures, powered' },
    { type: 'info',    text: '  by cutting-edge AI workflows and LLMs.' },
    { type: 'spacer',  text: '' },
  ],

  skills: () => [
    { type: 'info',    text: '  ── CORE LANGUAGES ──────────────────────────────' },
    { type: 'success', text: '  ● C          ● Python     ● TypeScript  ● JavaScript' },
    { type: 'spacer',  text: '' },
    { type: 'info',    text: '  ── WEB DEVELOPMENT ─────────────────────────────' },
    { type: 'success', text: '  ● React      ● Next.js    ● Node.js     ● Express' },
    { type: 'success', text: '  ● Tailwind   ● HTML/CSS   ● GraphQL     ● Socket.io' },
    { type: 'spacer',  text: '' },
    { type: 'info',    text: '  ── DATABASES & CLOUD ───────────────────────────' },
    { type: 'success', text: '  ● MongoDB    ● Firebase   ● PostgreSQL  ● Firestore' },
    { type: 'spacer',  text: '' },
    { type: 'info',    text: '  ── AI & MACHINE LEARNING ───────────────────────' },
    { type: 'success', text: '  ● TensorFlow ● OpenCV     ● LLM APIs   ● Prompt Eng.' },
    { type: 'spacer',  text: '' },
    { type: 'info',    text: '  ── DEV TOOLS ────────────────────────────────────' },
    { type: 'success', text: '  ● Git        ● Docker     ● Vercel      ● GitHub Actions' },
    { type: 'spacer',  text: '' },
  ],

  projects: () => [
    { type: 'info',    text: '  ── MY PROJECTS ──────────────────────────────────' },
    { type: 'spacer',  text: '' },
    { type: 'success', text: '  [01] APEX' },
    { type: 'output',  text: '       AI-architected Career OS — 3D web, neural study engine' },
    { type: 'output',  text: '       Stack: React Three Fiber · AI APIs · GSAP' },
    { type: 'spacer',  text: '' },
    { type: 'success', text: '  [02] CHATWAVE' },
    { type: 'output',  text: '       Real-time messaging with WebSocket & AI-assisted architecture' },
    { type: 'output',  text: '       Stack: Node.js · Express · Socket.io · React' },
    { type: 'spacer',  text: '' },
    { type: 'success', text: '  [03] FACE ATTENDANCE SYSTEM' },
    { type: 'output',  text: '       AI-generated CV pipeline for instant facial recognition' },
    { type: 'output',  text: '       Stack: Python · OpenCV · TensorFlow' },
    { type: 'spacer',  text: '' },
    { type: 'success', text: '  [04] KAD MULTIPLIER' },
    { type: 'output',  text: '       AI-developed full-stack e-commerce with real-time Firebase' },
    { type: 'output',  text: '       Stack: React · Firebase · Firestore · Tailwind' },
    { type: 'spacer',  text: '' },
  ],

  experience: () => [
    { type: 'info',    text: '  ── EXPERIENCE & EDUCATION ──────────────────────' },
    { type: 'spacer',  text: '' },
    { type: 'success', text: '  2023 → Present' },
    { type: 'output',  text: '  AI-Empowered Full-Stack Developer (Self-directed)' },
    { type: 'output',  text: '  Building production-grade web applications using AI agents,' },
    { type: 'output',  text: '  LLMs, React, Node.js and modern cloud infrastructure.' },
    { type: 'spacer',  text: '' },
    { type: 'success', text: '  2021 → 2023' },
    { type: 'output',  text: '  Computer Science Engineering — Undergraduate' },
    { type: 'output',  text: '  Specialized in algorithms, systems, and ML fundamentals.' },
    { type: 'spacer',  text: '' },
    { type: 'info',    text: '  ── KEY METRICS ─────────────────────────────────' },
    { type: 'output',  text: '  › 100% Attendance  ·  24/7 Builder Mentality' },
    { type: 'output',  text: '  › 4 Production Projects  ·  AI-First Workflow' },
    { type: 'spacer',  text: '' },
  ],

  contact: () => [
    { type: 'info',    text: '  ── CONTACT DETAILS ─────────────────────────────' },
    { type: 'spacer',  text: '' },
    { type: 'success', text: '  📧  Email    :  amogsiddaamarappagol@gmail.com' },
    { type: 'success', text: '  📱  Phone    :  +91 6366052864' },
    { type: 'success', text: '  🐙  GitHub   :  github.com/rajashekharexe' },
    { type: 'success', text: '  💼  LinkedIn :  linkedin.com/in/rajashekhar-exe' },
    { type: 'success', text: '  📸  Instagram:  @rajashekhar.exe' },
    { type: 'spacer',  text: '' },
    { type: 'info',    text: '  Available for freelance, full-time & collaborations.' },
    { type: 'spacer',  text: '' },
  ],

  ai: () => [
    { type: 'info',    text: '  ── AI-EMPOWERED DEVELOPMENT ─────────────────────' },
    { type: 'spacer',  text: '' },
    { type: 'output',  text: '  I don\'t just use AI as a tool — I integrate it' },
    { type: 'output',  text: '  as a core engineering workflow:' },
    { type: 'spacer',  text: '' },
    { type: 'success', text: '  › AI Agent Orchestration  → Automate complex pipelines' },
    { type: 'success', text: '  › Prompt Engineering       → Precision-guided code gen' },
    { type: 'success', text: '  › LLM-Assisted Design      → Architecture at 10× speed' },
    { type: 'success', text: '  › AI-Driven Testing        → Smarter, faster QA' },
    { type: 'spacer',  text: '' },
    { type: 'info',    text: '  Every project in this portfolio was architected' },
    { type: 'info',    text: '  and built using advanced AI-empowered workflows.' },
    { type: 'spacer',  text: '' },
  ],

  ls: () => [
    { type: 'output',  text: '  drwxr-xr-x  hero/         → Landing & intro section' },
    { type: 'output',  text: '  drwxr-xr-x  skills/       → Tech stack & specializations' },
    { type: 'output',  text: '  drwxr-xr-x  projects/     → Portfolio of work' },
    { type: 'output',  text: '  drwxr-xr-x  github-stats/ → Open source activity' },
    { type: 'output',  text: '  drwxr-xr-x  terminal/     → You are here 📍' },
    { type: 'output',  text: '  drwxr-xr-x  experience/   → Work history' },
    { type: 'output',  text: '  drwxr-xr-x  contact/      → Get in touch' },
    { type: 'output',  text: '  -rw-r--r--  README.md     → Open to opportunities' },
    { type: 'spacer',  text: '' },
  ],

  date: () => [
    {
      type: 'success',
      text: `  ${new Date().toLocaleString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: '2-digit', minute: '2-digit',
        second: '2-digit', timeZoneName: 'short',
      })}`,
    },
    { type: 'spacer', text: '' },
  ],

  sudo: () => [
    { type: 'error',  text: '  [sudo] password for guest: ************' },
    { type: 'error',  text: '  sudo: permission denied. This incident has been reported. 🚨' },
    { type: 'spacer', text: '' },
  ],
}

/**
 * Terminal (Main Component)
 * 
 * WHAT IT DOES:
 * Renders a fully functional, interactive command-line interface directly on the website.
 * 
 * HOW IT WORKS:
 * - `input` tracks what the user is currently typing.
 * - `history` is an array of all previous inputs and outputs.
 * - `handleCommand` intercepts the Enter key, checks if the typed command exists in the `COMMANDS` object above, and appends the response to `history`.
 * - It also handles Arrow Up/Down for command history, and Tab for autocomplete.
 */
export function Terminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryLine[]>(BOOT_LINES)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [blink, setBlink] = useState(true)
  const inputRef  = useRef<HTMLInputElement>(null)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const bodyRef    = useRef<HTMLDivElement>(null)   // terminal scroll container

  // Scroll ONLY the terminal body — never the page
  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [history])

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(id)
  }, [])

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    setCmdHistory(prev => [...prev, trimmed])
    setHistoryIdx(-1)
    setHistory(prev => [...prev, { type: 'input', text: cmd }])

    if (trimmed === 'clear') {
      setHistory([])
      return
    }

    const fn = COMMANDS[trimmed]
    if (fn) {
      setHistory(prev => [...prev, ...fn()])
    } else {
      setHistory(prev => [
        ...prev,
        { type: 'error', text: `  bash: ${trimmed}: command not found. Type "help" for available commands.` },
        { type: 'spacer', text: '' },
      ])
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(newIdx)
      setInput(cmdHistory[cmdHistory.length - 1 - newIdx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newIdx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(newIdx)
      setInput(newIdx === -1 ? '' : cmdHistory[cmdHistory.length - 1 - newIdx] ?? '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const cmds = Object.keys(COMMANDS).concat(['clear'])
      const match = cmds.find(c => c.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    }
  }

  const lineColor = (type: HistoryLine['type']) => {
    switch (type) {
      case 'input':   return 'text-white'
      case 'success': return 'text-green-400'
      case 'info':    return 'text-cyan-400'
      case 'error':   return 'text-red-400'
      case 'system':  return 'text-neutral-600'
      case 'spacer':  return ''
      default:        return 'text-neutral-300'
    }
  }

  return (
    <section className="py-24 px-8 bg-neutral-50/50 border-t border-neutral-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-[2.5rem] md:text-[4rem] font-display font-black uppercase leading-[0.9] tracking-tight mb-4 text-neutral-900 flex flex-col items-center">
          <TextRepel text="Command" radius={100} strength={35} />
          <TextRepel text="Center"  radius={100} strength={35} />
        </h2>
        <p className="text-neutral-500 font-medium max-w-sm mx-auto">
          Interact directly with the system. Try{' '}
          {['whoami', 'skills', 'projects'].map((cmd, i) => (
            <span key={cmd}>
              <button
                onClick={() => handleCommand(cmd)}
                className="font-mono text-sm bg-neutral-900 text-orange-400 px-1.5 py-0.5 rounded hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                {cmd}
              </button>
              {i < 2 ? ', ' : ''}
            </span>
          ))}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onClick={() => inputRef.current?.focus()}
        className="w-full max-w-4xl mx-auto bg-[#0d1117] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl cursor-text"
      >
        {/* Mac-style header */}
        <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-neutral-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto text-xs font-mono font-semibold text-neutral-500">
            ~/guest@rajashekhar_os — bash
          </div>
          <div className="text-[10px] font-mono text-neutral-700 hidden sm:block">
            ↑↓ history · Tab autocomplete
          </div>
        </div>

        {/* Terminal body — ref here so we scroll it directly */}
        <div ref={bodyRef} className="p-5 h-80 overflow-y-auto font-mono text-sm scrollbar-hide">
          <div className="flex flex-col gap-0.5">
            {history.map((line, i) => (
              <div key={i} className={`flex leading-relaxed ${lineColor(line.type)}`}>
                {line.type === 'input' && (
                  <span className="text-green-400 mr-2 flex-shrink-0 select-none">
                    rajashekhar@portfolio:~$
                  </span>
                )}
                <span className="whitespace-pre-wrap text-xs md:text-sm">{line.text}</span>
              </div>
            ))}

            {/* Input row */}
            <form
              onSubmit={e => {
                e.preventDefault()
                handleCommand(input)
                setInput('')
              }}
              className="flex items-center mt-1"
            >
              <span className="text-green-400 mr-2 flex-shrink-0 select-none text-xs md:text-sm whitespace-nowrap">
                rajashekhar@portfolio:~$
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent outline-none border-none text-white text-xs md:text-sm font-mono caret-transparent"
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                />
                {/* Blinking block cursor */}
                <span
                  className="absolute pointer-events-none text-white text-xs md:text-sm font-mono"
                  style={{
                    left: `${input.length}ch`,
                    opacity: blink ? 1 : 0,
                    transition: 'opacity 0.1s',
                  }}
                >
                  █
                </span>
              </div>
            </form>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Footer status bar */}
        <div className="px-5 py-2 bg-[#161b22] border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono">
          <span className="text-green-500">● ONLINE</span>
          <span className="text-neutral-600">Rajashekhar OS v2.0.0</span>
          <span className="text-neutral-600">{cmdHistory.length} commands run</span>
        </div>
      </motion.div>
    </section>
  )
}
