"use client"

import { useEffect, useRef } from "react"

export function MouseGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const CELL = 48
    const RADIUS = 180

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 }
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { x, y } = mouse.current

      // clip to radial area
      ctx.save()
      const clip = new Path2D()
      clip.arc(x, y, RADIUS, 0, Math.PI * 2)
      ctx.clip(clip)

      // create radial gradient mask for fade at edges
      const grad = ctx.createRadialGradient(x, y, 0, x, y, RADIUS)
      grad.addColorStop(0, "rgba(54, 185, 204, 0.6)")
      grad.addColorStop(0.6, "rgba(54, 185, 204, 0.35)")
      grad.addColorStop(1, "rgba(54, 185, 204, 0)")

      ctx.strokeStyle = grad
      ctx.lineWidth = 0.7

      // vertical lines
      const startX = Math.floor((x - RADIUS) / CELL) * CELL
      const endX = Math.ceil((x + RADIUS) / CELL) * CELL
      const startY = Math.floor((y - RADIUS) / CELL) * CELL
      const endY = Math.ceil((y + RADIUS) / CELL) * CELL

      for (let lx = startX; lx <= endX; lx += CELL) {
        ctx.beginPath()
        ctx.moveTo(lx, startY)
        ctx.lineTo(lx, endY)
        ctx.stroke()
      }

      // horizontal lines
      for (let ly = startY; ly <= endY; ly += CELL) {
        ctx.beginPath()
        ctx.moveTo(startX, ly)
        ctx.lineTo(endX, ly)
        ctx.stroke()
      }

      ctx.restore()

      raf.current = requestAnimationFrame(draw)
    }

    raf.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[0]"
    />
  )
}
