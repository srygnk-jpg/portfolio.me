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
      if (x < 0) {
        raf.current = requestAnimationFrame(draw)
        return
      }

      // Outer soft halo
      const outerGrad = ctx.createRadialGradient(x, y, 0, x, y, 320)
      outerGrad.addColorStop(0, "rgba(54, 185, 204, 0.07)")
      outerGrad.addColorStop(0.4, "rgba(54, 185, 204, 0.04)")
      outerGrad.addColorStop(1, "rgba(54, 185, 204, 0)")
      ctx.fillStyle = outerGrad
      ctx.beginPath()
      ctx.arc(x, y, 320, 0, Math.PI * 2)
      ctx.fill()

      // Inner bright core glow
      const innerGrad = ctx.createRadialGradient(x, y, 0, x, y, 80)
      innerGrad.addColorStop(0, "rgba(54, 185, 204, 0.18)")
      innerGrad.addColorStop(0.5, "rgba(54, 185, 204, 0.07)")
      innerGrad.addColorStop(1, "rgba(54, 185, 204, 0)")
      ctx.fillStyle = innerGrad
      ctx.beginPath()
      ctx.arc(x, y, 80, 0, Math.PI * 2)
      ctx.fill()

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
