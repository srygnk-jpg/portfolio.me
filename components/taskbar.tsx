"use client"

import { useState, useEffect, useCallback } from "react"
import {
  TerminalSquare,
  User,
  FolderKanban,
  Layers,
  Briefcase,
  MessageSquare,
  Wifi,
  BatteryFull,
  Volume2,
  Moon,
  Music2,
} from "lucide-react"

interface TaskbarProps {
  openWindows: { id: string; title: string; isMinimized: boolean }[]
  activeWindowId: string | null
  onWindowClick: (id: string) => void
  onIconClick: (id: string) => void
}

interface Toast {
  id: number
  icon: string
  title: string
  body: string
}

const desktopIcons = [
  { id: "terminal", label: "Terminal", icon: TerminalSquare },
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "contact", label: "Contact", icon: MessageSquare },
  { id: "music", label: "Music Analytics", icon: Music2 },
]

let toastIdCounter = 0

export function Taskbar({
  openWindows,
  activeWindowId,
  onWindowClick,
  onIconClick,
}: TaskbarProps) {
  const [time, setTime] = useState("")
  const [dateStr, setDateStr] = useState("")
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      )
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const pushToast = useCallback((icon: string, title: string, body: string) => {
    const id = ++toastIdCounter
    setToasts((prev) => [...prev, { id, icon, title, body }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  // Light mode is forbidden here — light attracts bugs 🐛
  const handleThemeClick = () => {
    pushToast(
      "🐛",
      "Light mode? Really?",
      "Light attracts bugs. Dark mode only."
    )
  }

  // Battery? More like caffeine meter
  const handleBatteryClick = () => {
    pushToast(
      "☕",
      "Power source",
      "Powered by caffeine — 99% charged."
    )
  }

  return (
    <>
      {/* Easter egg toasts — bottom-right, above taskbar */}
      <div className="fixed bottom-14 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-slide-in flex items-start gap-3 rounded-lg border border-border bg-card/95 backdrop-blur-xl px-4 py-3 shadow-2xl shadow-black/40 min-w-[240px] max-w-xs"
          >
            <span className="text-xl leading-none mt-0.5">{toast.icon}</span>
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-foreground leading-tight">
                {toast.title}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {toast.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] flex h-12 items-center justify-between gap-2 border-t border-border bg-card/95 px-3 backdrop-blur-xl">
        {/* App launcher / start — logo */}
        <div className="flex items-center gap-1">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-primary hover:bg-primary/10 transition-colors font-mono text-xs font-bold mr-1"
            title="DevOS"
            aria-label="DevOS home"
          >
            {"</>"}
          </button>

          {/* Separator */}
          <div className="h-5 w-px bg-border mx-1" />

          {desktopIcons.map((icon) => {
            const Icon = icon.icon
            const isOpen = openWindows.some((w) => w.id === icon.id)
            const isActive =
              openWindows.some((w) => w.id === icon.id && !w.isMinimized) &&
              activeWindowId === icon.id
            return (
              <button
                key={icon.id}
                onClick={() => onIconClick(icon.id)}
                className={`group relative flex h-8 w-8 items-center justify-center rounded-md transition-colors ${isActive
                  ? "bg-primary/20 text-primary"
                  : isOpen
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                aria-label={`Open ${icon.label}`}
              >
                <Icon className="h-4 w-4" />
                {isOpen && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full transition-colors ${isActive ? "bg-primary" : "bg-primary/50"
                      }`}
                  />
                )}
                {/* Tooltip */}
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover border border-border px-2 py-1 text-[10px] text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 font-mono">
                  {icon.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Open Windows */}
        <div className="flex flex-1 items-center gap-1 overflow-x-auto px-3">
          {openWindows.map((win) => (
            <button
              key={win.id}
              onClick={() => onWindowClick(win.id)}
              className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs transition-all truncate max-w-36 font-mono ${activeWindowId === win.id && !win.isMinimized
                ? "bg-primary/15 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent"
                } ${win.isMinimized ? "opacity-40" : ""}`}
            >
              <span className="truncate">{win.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
          {/* Theme toggle — always stays dark, but fires the bug toast */}
          <button
            onClick={handleThemeClick}
            className="group relative flex h-6 w-6 items-center justify-center rounded hover:text-foreground hover:bg-secondary transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Moon className="h-3.5 w-3.5" />
            {/* Tooltip */}
            <span className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-md bg-popover border border-border px-2 py-1 text-[10px] text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 font-mono">
              Toggle theme
            </span>
          </button>

          <Wifi className="h-3.5 w-3.5" aria-label="WiFi" />
          <Volume2 className="h-3.5 w-3.5" aria-label="Volume" />

          {/* Battery — powered by caffeine */}
          <button
            onClick={handleBatteryClick}
            className="group relative flex h-6 w-6 items-center justify-center rounded hover:text-foreground hover:bg-secondary transition-colors"
            title="Battery"
            aria-label="Battery"
          >
            <BatteryFull className="h-3.5 w-3.5" />
            {/* Tooltip */}
            <span className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-md bg-popover border border-border px-2 py-1 text-[10px] text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 font-mono">
              Battery
            </span>
          </button>

          <div className="h-5 w-px bg-border mx-0.5" />
          <div className="flex flex-col items-end text-[10px] leading-tight">
            <span className="text-foreground tabular-nums font-mono">{time}</span>
            <span className="text-terminal-dim">{dateStr}</span>
          </div>
        </div>
      </div>
    </>
  )
}
