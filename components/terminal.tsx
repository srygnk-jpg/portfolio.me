"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "info" | "warning"
  text: string
}

const HELP_TEXT = `Available commands:
  help        Show this help message
  about       Open about window
  projects    Open projects window
  skills      Open skills window
  experience  Open experience window
  contact     Open contact window
  clear       Clear terminal
  theme       Toggle dark / light mode
  whoami      Display user info
  neofetch    System information
  ls          List available sections
  pwd         Print working directory
  date        Show current date & time
  echo [msg]  Print a message
  resume      Download / view resume`

const NEOFETCH = `
       .--.         dev@portfolio
      |o_o |        ───────────────────
      |:_/ |        OS: DevOS 2026.1
     //   \\ \\       Host: Next.js 16
    (|     | )      Kernel: React 19.2
   /'\\_   _/\`\\     Shell: zsh v5.9
   \\___)=(___/      Resolution: ∞ × ∞
                    DE: TailwindCSS 4.2
                    Theme: Neon Dark [GTK3]
                    Icons: Lucide
                    Terminal: DevTerm v1.0
                    CPU: TypeScript 5.7
                    GPU: Framer Motion
                    Memory: Infinite ideas™`

const WELCOME_LINES = [
  { text: "Welcome to DevOS Terminal v1.0", type: "info" as const },
  { text: 'Type "help" to see available commands.', type: "info" as const },
  { text: "", type: "output" as const },
]

interface TerminalProps {
  onCommand: (cmd: string) => void
}

export function Terminal({ onCommand }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [welcomeIndex, setWelcomeIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Typewriter effect for welcome message
  useEffect(() => {
    if (welcomeIndex >= WELCOME_LINES.length) return
    const delay = welcomeIndex === 0 ? 200 : 400
    const timer = setTimeout(() => {
      setLines((prev) => [...prev, WELCOME_LINES[welcomeIndex]])
      setWelcomeIndex((i) => i + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [welcomeIndex])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const processCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase()
      const newLines: TerminalLine[] = [
        ...lines,
        { type: "input" as const, text: `~ $ ${cmd}` },
      ]

      if (!trimmed) {
        setLines(newLines)
        return
      }

      setHistory((prev) => [cmd, ...prev])
      setHistoryIndex(-1)

      switch (trimmed) {
        case "help":
          newLines.push({ type: "output", text: HELP_TEXT })
          break
        case "clear":
          setLines([])
          return
        case "whoami":
          newLines.push({
            type: "success",
            text: "Developer | Builder | Open Source Enthusiast",
          })
          break
        case "neofetch":
          newLines.push({ type: "output", text: NEOFETCH })
          break
        case "ls":
          newLines.push({
            type: "output",
            text: "drwxr-xr-x  about/      drwxr-xr-x  projects/\ndrwxr-xr-x  skills/     drwxr-xr-x  experience/\ndrwxr-xr-x  contact/",
          })
          break
        case "pwd":
          newLines.push({ type: "output", text: "/home/dev/portfolio" })
          break
        case "date":
          newLines.push({
            type: "output",
            text: new Date().toString(),
          })
          break
        case "resume":
          newLines.push({
            type: "info",
            text: "→ Opening resume...",
          })
          newLines.push({
            type: "warning",
            text: "[INFO] resume.pdf not found in /public — add your resume to /public/resume.pdf",
          })
          break
        case "about":
        case "projects":
        case "skills":
        case "experience":
        case "contact":
          newLines.push({
            type: "success",
            text: `→ Opening ${trimmed}...`,
          })
          onCommand(trimmed)
          break
        case "theme":
          newLines.push({
            type: "success",
            text: "→ Toggling theme...",
          })
          onCommand(trimmed)
          break
        default:
          if (trimmed.startsWith("echo ")) {
            newLines.push({
              type: "output",
              text: cmd.slice(5),
            })
          } else if (trimmed.startsWith("open ")) {
            const url = cmd.slice(5).trim()
            newLines.push({
              type: "info",
              text: `→ Opening: ${url}`,
            })
            window.open(url.startsWith("http") ? url : `https://${url}`, "_blank")
          } else {
            newLines.push({
              type: "error",
              text: `command not found: ${trimmed}`,
            })
            newLines.push({
              type: "info",
              text: 'Type "help" for available commands.',
            })
          }
      }

      setLines(newLines)
    },
    [lines, onCommand]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(input)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = Math.min(historyIndex + 1, history.length - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      } else {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      const commands = [
        "help", "about", "projects", "skills", "experience", "contact",
        "clear", "theme", "whoami", "neofetch", "ls", "pwd", "date", "echo ", "open ", "resume",
      ]
      const matches = commands.filter((c) => c.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        const newLines = [...lines, { type: "input" as const, text: `~ $ ${input}` }]
        newLines.push({ type: "output", text: matches.join("    ") })
        setLines(newLines)
      }
    }
  }

  return (
    <div
      className="flex h-full flex-col font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
      role="application"
      aria-label="Terminal"
    >
      <div ref={scrollRef} className="flex-1 overflow-auto pb-2 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed whitespace-pre-wrap">
            {line.type === "input" && (
              <span className="text-primary glow-green">{line.text}</span>
            )}
            {line.type === "output" && (
              <span className="text-foreground">{line.text}</span>
            )}
            {line.type === "error" && (
              <span className="text-terminal-red">{line.text}</span>
            )}
            {line.type === "success" && (
              <span className="text-terminal-cyan glow-cyan">{line.text}</span>
            )}
            {line.type === "info" && (
              <span className="text-terminal-dim">{line.text}</span>
            )}
            {line.type === "warning" && (
              <span className="text-terminal-yellow">{line.text}</span>
            )}
          </div>
        ))}
      </div>

      {/* Input line */}
      <div className="flex items-center gap-2 border-t border-border pt-2 mt-1">
        <span className="text-primary glow-green shrink-0 select-none">{"~ $"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-foreground outline-none caret-primary placeholder:text-terminal-dim"
          placeholder="type a command..."
          spellCheck={false}
          autoComplete="off"
          autoFocus
          aria-label="Terminal input"
        />
        <span className="inline-block h-4 w-2 bg-primary cursor-blink" aria-hidden="true" />
      </div>
    </div>
  )
}
