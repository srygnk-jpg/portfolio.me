"use client"

import { useState, useCallback, useEffect } from "react"
import {
  TerminalSquare,
  User,
  FolderKanban,
  Layers,
  Briefcase,
  MessageSquare,
  Activity,
  Cpu,
  HardDrive,
  Clock,
  Globe,
  Music2,
} from "lucide-react"
import { OsWindow } from "./os-window"
import { Terminal } from "./terminal"
import { Taskbar } from "./taskbar"
import { AboutContent } from "./windows/AboutContent"
import { ProjectsContent } from "./windows/ProjectsContent"
import { SkillsContent } from "./windows/SkillsContent"
import { ExperienceContent } from "./windows/ExperienceContent"
import { ContactContent } from "./windows/ContactContent"
import { MusicContent } from "./windows/MusicContent"
import { useAnimatedStat } from "@/hooks/use-animated-stat"

interface WindowState {
  id: string
  title: string
  isMinimized: boolean
  zIndex: number
  defaultPosition: { x: number; y: number }
  defaultSize: { width: number; height: number }
}

const windowConfigs: Record<
  string,
  {
    title: string
    icon: React.ReactNode
    defaultPosition: { x: number; y: number }
    defaultSize: { width: number; height: number }
  }
> = {
  terminal: {
    title: "terminal@devos:~",
    icon: <TerminalSquare className="h-3.5 w-3.5" />,
    defaultPosition: { x: 60, y: 40 },
    defaultSize: { width: 620, height: 420 },
  },
  about: {
    title: "README.md",
    icon: <User className="h-3.5 w-3.5" />,
    defaultPosition: { x: 180, y: 70 },
    defaultSize: { width: 560, height: 480 },
  },
  projects: {
    title: "~/projects",
    icon: <FolderKanban className="h-3.5 w-3.5" />,
    defaultPosition: { x: 260, y: 55 },
    defaultSize: { width: 580, height: 520 },
  },
  skills: {
    title: "skills.json",
    icon: <Layers className="h-3.5 w-3.5" />,
    defaultPosition: { x: 300, y: 90 },
    defaultSize: { width: 520, height: 480 },
  },
  experience: {
    title: "git log --career",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    defaultPosition: { x: 220, y: 65 },
    defaultSize: { width: 540, height: 500 },
  },
  contact: {
    title: "contact_form.sh",
    icon: <MessageSquare className="h-3.5 w-3.5" />,
    defaultPosition: { x: 340, y: 80 },
    defaultSize: { width: 500, height: 460 },
  },
  music: {
    title: "music.analytics",
    icon: <Music2 className="h-3.5 w-3.5" />,
    defaultPosition: { x: 160, y: 60 },
    defaultSize: { width: 560, height: 560 },
  },
}

export function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [nextZIndex, setNextZIndex] = useState(10)
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)

  // Animated stats
  const cpuStat = useAnimatedStat(42, 18, 2000)
  const memStat = useAnimatedStat(67, 10, 3000)
  const netStat = useAnimatedStat(28, 20, 1500)

  // Clock
  const [clockTime, setClockTime] = useState("")
  useEffect(() => {
    const update = () =>
      setClockTime(
        new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      )
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  // Open terminal by default
  useEffect(() => {
    openWindow("terminal")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openWindow = useCallback(
    (id: string) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === id)
        if (existing) {
          return prev.map((w) =>
            w.id === id
              ? { ...w, isMinimized: false, zIndex: nextZIndex }
              : w
          )
        }
        const config = windowConfigs[id]
        if (!config) return prev
        return [
          ...prev,
          {
            id,
            title: config.title,
            isMinimized: false,
            zIndex: nextZIndex,
            defaultPosition: config.defaultPosition,
            defaultSize: config.defaultSize,
          },
        ]
      })
      setNextZIndex((z) => z + 1)
      setActiveWindowId(id)
    },
    [nextZIndex]
  )

  const closeWindow = useCallback(
    (id: string) => {
      setWindows((prev) => prev.filter((w) => w.id !== id))
      if (activeWindowId === id) setActiveWindowId(null)
    },
    [activeWindowId]
  )

  const minimizeWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
      )
      if (activeWindowId === id) setActiveWindowId(null)
    },
    [activeWindowId]
  )

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
        )
      )
      setNextZIndex((z) => z + 1)
      setActiveWindowId(id)
    },
    [nextZIndex]
  )

  const handleTerminalCommand = useCallback(
    (cmd: string) => {
      if (cmd === "theme") {
        document.documentElement.classList.toggle("dark")
        return
      }
      if (["about", "projects", "skills", "experience", "contact", "music"].includes(cmd)) {
        openWindow(cmd)
      }
    },
    [openWindow]
  )

  const handleTaskbarWindowClick = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id)
      if (win?.isMinimized) {
        focusWindow(id)
      } else if (activeWindowId === id) {
        minimizeWindow(id)
      } else {
        focusWindow(id)
      }
    },
    [windows, activeWindowId, focusWindow, minimizeWindow]
  )

  const renderWindowContent = (id: string) => {
    switch (id) {
      case "terminal":
        return <Terminal onCommand={handleTerminalCommand} />
      case "about":
        return <AboutContent />
      case "projects":
        return <ProjectsContent />
      case "skills":
        return <SkillsContent />
      case "experience":
        return <ExperienceContent />
      case "contact":
        return <ContactContent />
      case "music":
        return <MusicContent />
      default:
        return null
    }
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background grid-bg noise-bg">
      {/* Desktop area */}
      <div className="relative h-[calc(100vh-48px)]">

        {/* Desktop widgets — always visible on lg+ */}
        <div className="absolute right-6 top-6 z-[1] hidden lg:flex flex-col gap-4 w-80 animate-fade-in-up">
          {/* Profile widget */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 text-primary text-2xl font-bold font-mono border border-primary/20">
                {/* Replace "s" with your initial */}
                S
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background pulse-glow" title="Online" />
              </div>
              <div>
                {/* TODO: PERSONALIZE — replace name & role */}
                <div className="text-base text-foreground font-semibold font-mono">sreeyuktha</div>
                <div className="text-xs text-terminal-cyan mt-0.5">Backend Developer</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["Java", "Spring Boot", "AI Tools"].map((t) => (
                <span key={t} className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-[11px] text-primary font-mono">{t}</span>
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              <span className="text-primary">●</span> Available for opportunities
            </div>
          </div>

          {/* System Stats widget */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono">system.monitor</span>
            </div>
            <div className="space-y-4">
              {[
                { label: "CPU", value: cpuStat, icon: <Cpu className="h-3.5 w-3.5 text-terminal-cyan" />, color: "bg-terminal-cyan" },
                { label: "MEM", value: memStat, icon: <HardDrive className="h-3.5 w-3.5 text-terminal-yellow" />, color: "bg-terminal-yellow" },
                { label: "NET", value: netStat, icon: <Globe className="h-3.5 w-3.5 text-primary" />, color: "bg-primary" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {stat.icon}
                  <span className="text-xs text-muted-foreground w-9 font-mono">{stat.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stat.color} transition-all duration-700`}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-terminal-dim w-9 text-right font-mono tabular-nums">{stat.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clock + Quick Links widget */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono">quick_access</span>
            </div>
            <div className="text-center font-mono text-3xl text-foreground tabular-nums mb-4 glow-green text-primary tracking-wider">
              {clockTime}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["about", "projects", "skills", "contact"].map((id) => (
                <button
                  key={id}
                  onClick={() => openWindow(id)}
                  className="rounded-lg bg-secondary/50 px-3 py-2.5 text-xs text-muted-foreground transition-all hover:bg-secondary hover:text-primary hover:border-primary/20 border border-transparent capitalize font-mono"
                >
                  ./{id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop hint */}
        {windows.length <= 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1] animate-fade-in-up">
            <div className="glass rounded-full px-5 py-2 text-xs text-muted-foreground font-mono">
              <span className="text-primary">$</span> type{" "}
              <kbd className="rounded bg-secondary px-1 text-terminal-cyan">help</kbd>{" "}
              in the terminal or click taskbar icons to explore
            </div>
          </div>
        )}

        {/* Windows */}
        {windows.map((win) => {
          const config = windowConfigs[win.id]
          return (
            <OsWindow
              key={win.id}
              id={win.id}
              title={win.title}
              icon={config?.icon}
              isActive={activeWindowId === win.id}
              isMinimized={win.isMinimized}
              defaultPosition={win.defaultPosition}
              defaultSize={win.defaultSize}
              onFocus={focusWindow}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              zIndex={win.zIndex}
            >
              {renderWindowContent(win.id)}
            </OsWindow>
          )
        })}
      </div>

      {/* Taskbar */}
      <Taskbar
        openWindows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={handleTaskbarWindowClick}
        onIconClick={openWindow}
      />
    </div>
  )
}
