"use client"

import { useState, useRef, useCallback, type ReactNode } from "react"

interface WindowProps {
  id: string
  title: string
  icon?: ReactNode
  children: ReactNode
  isActive: boolean
  isMinimized: boolean
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
  onFocus: (id: string) => void
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  zIndex: number
}

export function OsWindow({
  id,
  title,
  icon,
  children,
  isActive,
  isMinimized,
  defaultPosition = { x: 100, y: 60 },
  defaultSize = { width: 640, height: 440 },
  onFocus,
  onClose,
  onMinimize,
  zIndex,
}: WindowProps) {
  const [position, setPosition] = useState(defaultPosition)
  const [size] = useState(defaultSize)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isEntering] = useState(true)
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      onFocus(id)
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        posX: position.x,
        posY: position.y,
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return
        const dx = e.clientX - dragRef.current.startX
        const dy = e.clientY - dragRef.current.startY
        setPosition({
          x: dragRef.current.posX + dx,
          y: Math.max(0, dragRef.current.posY + dy),
        })
        if (isMaximized) setIsMaximized(false)
      }

      const handleMouseUp = () => {
        dragRef.current = null
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [id, onFocus, position, isMaximized]
  )

  const handleTitleBarDoubleClick = useCallback(() => {
    setIsMaximized((prev) => !prev)
  }, [])

  if (isMinimized) return null

  const windowStyle = isMaximized
    ? { top: 0, left: 0, width: "100%", height: "calc(100% - 48px)", zIndex }
    : {
      top: position.y,
      left: position.x,
      width: size.width,
      height: size.height,
      zIndex,
    }

  return (
    <div
      ref={windowRef}
      className={`fixed glass rounded-xl overflow-hidden shadow-2xl flex flex-col transition-shadow duration-200 ${isEntering ? "animate-fade-in-up" : ""
        } ${isActive
          ? "shadow-primary/20 ring-1 ring-primary/25"
          : "shadow-black/40"
        }`}
      style={windowStyle}
      onMouseDown={() => onFocus(id)}
    >
      {/* Title Bar */}
      <div
        className={`window-drag flex h-10 items-center gap-3 px-3 select-none ${isActive
            ? "bg-secondary/90 border-b border-border"
            : "bg-secondary/50 border-b border-border/50"
          }`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleTitleBarDoubleClick}
      >
        {/* macOS-style traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose(id)
            }}
            className="group h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center transition-opacity hover:opacity-90"
            aria-label="Close window"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[#820005] text-[8px] font-bold leading-none">×</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMinimize(id)
            }}
            className="group h-3 w-3 rounded-full bg-[#febc2e] border border-[#d4a017] flex items-center justify-center transition-opacity hover:opacity-90"
            aria-label="Minimize window"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[#7d4e00] text-[8px] font-bold leading-none">−</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsMaximized(!isMaximized)
            }}
            className="group h-3 w-3 rounded-full bg-[#28c840] border border-[#1da030] flex items-center justify-center transition-opacity hover:opacity-90"
            aria-label="Maximize window"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[#0a4300] text-[8px] font-bold leading-none">+</span>
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {icon && <span className={`shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}>{icon}</span>}
          <span className={`text-xs truncate font-mono ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
            {title}
          </span>
        </div>

        {/* Tab dots / active indicator */}
        <div className="shrink-0 flex gap-1">
          {isActive && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 text-sm">{children}</div>
    </div>
  )
}
