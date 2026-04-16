import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface HistoryLine {
  type: 'input' | 'output' | 'system' | 'error'
  text: string
}

export function Terminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'system', text: 'Rajashekhar OS v1.0.0 initialized.' },
    { type: 'system', text: 'Type "help" to see available commands.' }
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    
    setHistory(prev => [...prev, { type: 'input', text: cmd }])

    let output = ''
    let type: 'output' | 'error' = 'output'

    switch (trimmed) {
      case 'help':
        output = 'Available commands:\\n- whoami   : Display profile info\\n- skills   : List technical stack\\n- contact  : View contact details\\n- clear    : Clear terminal'
        break
      case 'whoami':
        output = ' Rajashekhar\\n > Full-Stack Software Engineer\\n > Specializing in React, TypeScript, Node.js\\n > Passionate about creating premium digital experiences.'
        break
      case 'skills':
        output = '> FRONTEND: React, Next.js, Framer Motion, Tailwind CSS\\n> BACKEND: Node.js, Express, Postgres, MongoDB\\n> DEVTOOLS: Git, Docker, Vercel, AWS'
        break
      case 'contact':
        output = 'Email: [REDACTED]\\nGitHub: github.com/rajashekharexe\\nInstagram: @rajashekhar.exe'
        break
      case 'clear':
        setHistory([])
        return
      case 'sudo':
        output = 'Permission denied: This incident will be reported.'
        type = 'error'
        break
      case '':
        return
      default:
        output = `Command not found: ${trimmed}. Type "help" for a list of commands.`
        type = 'error'
    }

    setHistory(prev => [
      ...prev,
      ...output.split('\\n').map(line => ({ type, text: line }))
    ])
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      onClick={() => inputRef.current?.focus()}
      className="w-full max-w-md bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-text mt-8 relative"
    >
      {/* Mac-style Window Header */}
      <div className="flex items-center px-4 py-3 bg-neutral-50/80 border-b border-neutral-200">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="mx-auto text-xs font-mono font-bold text-neutral-400">~/guest@rajashekhar_os</div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 h-56 overflow-y-auto font-mono text-sm bg-neutral-50 scrollbar-hide">
        <div className="flex flex-col gap-1.5">
          {history.map((line, i) => (
            <div key={i} className={`flex ${line.type === 'error' ? 'text-red-500' : line.type === 'system' ? 'text-neutral-400' : 'text-neutral-700'}`}>
              {line.type === 'input' && <span className="text-blue-500 mr-2">❯</span>}
              <span className="whitespace-pre-wrap">{line.text}</span>
            </div>
          ))}
          
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleCommand(input)
              setInput('')
            }}
            className="flex items-center mt-1 text-neutral-700"
          >
            <span className="text-blue-500 mr-2 flex-shrink-0">❯</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent outline-none border-none focus:ring-0 p-0 m-0 text-sm font-inherit placeholder-neutral-300"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck="false"
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </motion.div>
  )
}
