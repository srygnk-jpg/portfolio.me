"use client"

import { useState, useEffect } from "react"

const bootLines = [
  { text: "UEFI v3.2.1 — Initializing hardware...", delay: 0, color: "dim" },
  { text: "CPU: Intel Core i9-14900K @ 6.0GHz ........... OK", delay: 180, color: "ok" },
  { text: "RAM: 64GB DDR5 @ 5600MHz ..................... OK", delay: 320, color: "ok" },
  { text: "GPU: NVIDIA RTX 4090 24GB .................... OK", delay: 460, color: "ok" },
  { text: "SSD: 2TB NVMe Gen4 ........................... OK", delay: 580, color: "ok" },
  { text: "Network: Ethernet 10Gbps ..................... OK", delay: 680, color: "ok" },
  { text: "", delay: 780, color: "blank" },
  { text: "Loading kernel modules...", delay: 860, color: "info" },
  { text: "  → react-dom v19.2.4", delay: 960, color: "dim" },
  { text: "  → next.js v16.1.6", delay: 1040, color: "dim" },
  { text: "  → tailwindcss v4.2", delay: 1110, color: "dim" },
  { text: "Mounting virtual file systems...", delay: 1200, color: "info" },
  { text: "Starting display server...", delay: 1360, color: "info" },
  { text: "", delay: 1480, color: "blank" },
  { text: "Initializing developer portfolio...", delay: 1580, color: "highlight" },
  { text: "Loading workspace environment...", delay: 1820, color: "info" },
  { text: "Connecting to the internet...", delay: 2000, color: "info" },
  { text: "", delay: 2120, color: "blank" },
  { text: "System ready. Welcome.", delay: 2260, color: "success" },
]

export function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    bootLines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1)
        setProgress(Math.min(100, ((index + 1) / bootLines.length) * 100))
      }, line.delay)
      timers.push(timer)
    })

    const completeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 2900)
    timers.push(completeTimer)

    const doneTimer = setTimeout(() => {
      onComplete()
    }, 3500)
    timers.push(doneTimer)

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const getLineColor = (color: string) => {
    switch(color) {
      case "ok": return "text-terminal-green glow-green"
      case "success": return "text-primary glow-green font-semibold"
      case "highlight": return "text-terminal-cyan glow-cyan"
      case "dim": return "text-terminal-dim"
      case "info": return "text-foreground"
      default: return "text-foreground"
    }
  }

  return (
    <div
      className={`fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6 transition-opacity duration-600 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="noise-bg absolute inset-0" />
      <div className="scanlines absolute inset-0" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* ASCII Logo */}
        <div className="mb-8 text-center flicker">
          <pre className="text-primary glow-green text-xs leading-tight sm:text-sm select-none">
{`
  ██████╗ ███████╗██╗   ██╗ ██████╗ ███████╗
  ██╔══██╗██╔════╝██║   ██║██╔═══██╗██╔════╝
  ██║  ██║█████╗  ██║   ██║██║   ██║███████╗
  ██║  ██║██╔══╝  ╚██╗ ██╔╝██║   ██║╚════██║
  ██████╔╝███████╗ ╚████╔╝ ╚██████╔╝███████║
  ╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝ ╚══════╝
                                    P O R T F O L I O`}
          </pre>
        </div>

        {/* Boot log */}
        <div className="mb-6 font-mono text-xs sm:text-sm min-h-[200px]">
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="flex items-center gap-2 leading-6">
              {line.color === "blank" ? (
                <span>&nbsp;</span>
              ) : (
                <>
                  <span className="text-terminal-dim select-none shrink-0">
                    {"["}
                    {String(i).padStart(2, "0")}
                    {"]"}
                  </span>
                  <span className={getLineColor(line.color)}>{line.text}</span>
                </>
              )}
            </div>
          ))}
          {visibleLines < bootLines.length && (
            <span className="inline-block h-4 w-2 bg-primary cursor-blink ml-8" />
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span className="text-terminal-cyan">boot.progress</span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%`, boxShadow: "0 0 8px oklch(0.75 0.18 165 / 0.6)" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
