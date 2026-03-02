"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { spotifyNowPlayingText } from "@/lib/spotify"

interface TerminalLine {
  id: number
  type: "input" | "output" | "error" | "success" | "info" | "warning"
  text: string
}

const COMMANDS = [
  "help", "about", "projects", "skills", "experience", "contact",
  "clear", "theme", "whoami", "neofetch", "ls", "pwd", "date", "echo ", "open ", "resume",
  "spotify", "joke", "weather", "ssh hire@me",
]

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
  resume      Download / view resume
  spotify     Show currently playing song
  joke        Fetch a random dev joke
  weather     Show current weather
  ssh hire@me Unlock developer access 🔐`

const SSH_HIRE_FRAMES: [string, TerminalLine["type"], number][] = [
  ["Connecting to hire@me...", "info", 0],
  ["Authenticating...", "info", 500],
  ["Verifying credentials... ██████████ 100%", "info", 900],
  ["", "output", 300],
  ["╔══════════════════════════════════════════╗", "success", 200],
  ["║                                          ║", "success", 60],
  ["║        ✓  ACCESS GRANTED  ✓              ║", "success", 60],
  ["║                                          ║", "success", 60],
  ["╚══════════════════════════════════════════╝", "success", 60],
  ["", "output", 200],
  ["  Name    : Sreeyuktha", "output", 150],
  ["  Role    : Backend Developer", "output", 120],
  ["  Stack   : Java · Spring Boot · Python · AI", "output", 120],
  ["  Base    : Calicut, Kerala 🇮🇳", "output", 120],
  ["", "output", 80],
  ["  📧  srygnk@gmail.com", "success", 150],
  ["  🔗  linkedin.com/in/sreeyukthagnk", "success", 100],
  ["", "output", 80],
  ["  → Open contact window to get in touch!", "info", 200],
  ["", "output", 0],
]

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

async function spotifyNowPlaying(): Promise<string> {
  return spotifyNowPlayingText()
}

async function fetchJoke(): Promise<string> {
  try {
    const res = await fetch("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart")
    const data = await res.json()
    if (data.type === "twopart") return `Q: ${data.setup}\nA: ${data.delivery}`
    return data.joke
  } catch {
    return "✗ Could not fetch a joke."
  }
}

async function fetchWeather(): Promise<string> {
  try {
    const geoRes = await fetch("https://ipapi.co/json/")
    const geo = await geoRes.json()
    const city = geo.city || "Unknown"
    const country = geo.country_name || ""
    const lat = geo.latitude
    const lon = geo.longitude
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`
    )
    const data = await res.json()
    const c = data.current
    const WMO: Record<number, string> = {
      0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
      61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
      71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
      80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
      95: "Thunderstorm", 99: "Thunderstorm with hail",
    }
    const desc = WMO[c.weather_code] ?? "Unknown"
    return `⛅ Weather — ${city}, ${country}\n  Condition : ${desc}\n  Temp      : ${c.temperature_2m}°C (feels like ${c.apparent_temperature}°C)\n  Humidity  : ${c.relative_humidity_2m}%\n  Wind      : ${c.wind_speed_10m} km/h`
  } catch {
    return "✗ Could not fetch weather."
  }
}

const COOLDOWN_MS = 10_000
const commandCooldowns: Record<string, number> = {}

function isOnCooldown(cmd: string): boolean {
  const last = commandCooldowns[cmd] ?? 0
  return Date.now() - last < COOLDOWN_MS
}

function setCooldown(cmd: string) {
  commandCooldowns[cmd] = Date.now()
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

let lineIdCounter = 0
const nextId = () => ++lineIdCounter

// [text, type, delay-ms after previous]
const BOOT_SCRIPT: [string, TerminalLine["type"], number][] = [
  ["$ whoami", "input", 0],
  ["Sreeyuktha — software engineer, Calicut.", "success", 300],
  ["", "output", 100],
  ["$ cat about.txt", "input", 400],
  ["Endlessly curious about AI and all things cool on the internet.", "output", 300],
  ["Figuring things out, building fast, turning random curiosity", "output", 200],
  ["into real, working stuff.", "output", 200],
  ["", "output", 100],
  ["Mostly living in the backend — quietly making things", "output", 200],
  ["reliable and smooth.", "output", 200],
  ["", "output", 100],
  ["Also into calligraphy. Good software and good strokes", "output", 200],
  ["both come down to patience and clean lines.", "output", 200],
  ["", "output", 200],
  ["──────────────────────────────────────────", "info", 300],
  ["Welcome to DevOS Terminal v1.0", "info", 200],
  ['Type "help" to see available commands.', "info", 200],
  ["", "output", 0],
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

  // Boot script typewriter effect
  useEffect(() => {
    if (welcomeIndex >= BOOT_SCRIPT.length) return
    const [text, type, delay] = BOOT_SCRIPT[welcomeIndex]
    const timer = setTimeout(() => {
      setLines((prev) => [...prev, { id: nextId(), text, type }])
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
        { id: nextId(), type: "input" as const, text: `~ $ ${cmd}` },
      ]

      if (!trimmed) {
        setLines(newLines)
        return
      }

      setHistory((prev) => [cmd, ...prev])
      setHistoryIndex(-1)

      switch (trimmed) {
        case "help":
          newLines.push({ id: nextId(), type: "output", text: HELP_TEXT })
          break
        case "clear":
          setLines([])
          return
        case "whoami":
          newLines.push({
            id: nextId(), type: "success",
            text: "Developer | Builder | Open Source Enthusiast",
          })
          break
        case "neofetch":
          newLines.push({ id: nextId(), type: "output", text: NEOFETCH })
          break
        case "ls":
          newLines.push({
            id: nextId(), type: "output",
            text: "drwxr-xr-x  about/      drwxr-xr-x  projects/\ndrwxr-xr-x  skills/     drwxr-xr-x  experience/\ndrwxr-xr-x  contact/",
          })
          break
        case "pwd":
          newLines.push({ id: nextId(), type: "output", text: "/home/dev/portfolio" })
          break
        case "date":
          newLines.push({ id: nextId(), type: "output", text: new Date().toString() })
          break
        case "resume":
          newLines.push({ id: nextId(), type: "info", text: "→ Opening resume..." })
          newLines.push({
            id: nextId(), type: "warning",
            text: "[INFO] resume.pdf not found in /public — add your resume to /public/resume.pdf",
          })
          break
        case "about":
        case "projects":
        case "skills":
        case "experience":
        case "contact":
          newLines.push({ id: nextId(), type: "success", text: `→ Opening ${trimmed}...` })
          onCommand(trimmed)
          break
        case "theme":
          newLines.push({ id: nextId(), type: "success", text: "→ Toggling theme..." })
          onCommand(trimmed)
          break
        case "spotify":
        case "joke":
        case "weather": {
          if (isOnCooldown(trimmed)) {
            const secs = Math.ceil((COOLDOWN_MS - (Date.now() - commandCooldowns[trimmed])) / 1000)
            newLines.push({ id: nextId(), type: "warning", text: `⏳ Please wait ${secs}s before using ${trimmed} again.` })
            break
          }
          setCooldown(trimmed)
          const loadingId = nextId()
          const loadingMsg = trimmed === "spotify" ? "♪ Fetching Spotify..." : trimmed === "joke" ? "⏳ Fetching joke..." : "⏳ Fetching weather..."
          newLines.push({ id: loadingId, type: "info", text: loadingMsg })
          setLines(newLines)
          const fetcher = trimmed === "spotify" ? spotifyNowPlaying : trimmed === "joke" ? fetchJoke : fetchWeather
          fetcher().then((result) => {
            setLines((prev) => [
              ...prev.filter((l) => l.id !== loadingId),
              { id: nextId(), type: "success", text: result },
            ])
          })
          return
        }
        case "ssh hire@me": {
          // Typewriter-style animated access-granted sequence
          setLines([
            ...newLines,
          ])
          let accumulated: TerminalLine[] = [...newLines]
          let delay = 0
          SSH_HIRE_FRAMES.forEach(([text, type, frameDelay]) => {
            delay += frameDelay
            const id = nextId()
            setTimeout(() => {
              accumulated = [...accumulated, { id, type, text }]
              setLines([...accumulated])
            }, delay)
          })
          return
        }
        default:
          if (trimmed.startsWith("echo ")) {
            newLines.push({ id: nextId(), type: "output", text: cmd.slice(5) })
          } else if (trimmed.startsWith("open ")) {
            const url = cmd.slice(5).trim()
            if (!isValidUrl(url)) {
              newLines.push({ id: nextId(), type: "error", text: `✗ Invalid URL: ${url}` })
            } else {
              const fullUrl = url.startsWith("http") ? url : `https://${url}`
              newLines.push({ id: nextId(), type: "info", text: `→ Opening: ${fullUrl}` })
              window.open(fullUrl, "_blank", "noopener,noreferrer")
            }
          } else {
            newLines.push({ id: nextId(), type: "error", text: `command not found: ${trimmed}` })
            newLines.push({ id: nextId(), type: "info", text: 'Type "help" for available commands.' })
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
      const matches = COMMANDS.filter((c) => c.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        const newLines = [...lines, { id: nextId(), type: "input" as const, text: `~ $ ${input}` }]
        newLines.push({ id: nextId(), type: "output", text: matches.join("    ") })
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
        {lines.map((line) => (
          <div key={line.id} className="leading-relaxed whitespace-pre-wrap">
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
              line.text.startsWith("──")
                ? <span className="text-border/60">{line.text}</span>
                : <span className="text-terminal-dim">{line.text}</span>
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
