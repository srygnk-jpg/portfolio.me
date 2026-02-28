"use client"

import { useState, useCallback, useEffect } from "react"
import { BootScreen } from "@/components/boot-screen"
import { Desktop } from "@/components/desktop"
import { MobileLayout } from "@/components/mobile-layout"

export default function Home() {
  const [booted, setBooted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      {!booted && <BootScreen onComplete={handleBootComplete} />}
      {booted && isMobile && <MobileLayout />}
      {booted && !isMobile && <Desktop />}
    </main>
  )
}
