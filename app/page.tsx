"use client"

import { useState, useCallback } from "react"
import { BootScreen } from "@/components/boot-screen"
import { Desktop } from "@/components/desktop"

export default function Home() {
  const [booted, setBooted] = useState(false)

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      {!booted && <BootScreen onComplete={handleBootComplete} />}
      {booted && <Desktop />}
    </main>
  )
}
