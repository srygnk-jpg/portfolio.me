"use client"

import { useState, useEffect } from "react"
import { Music2 } from "lucide-react"
import { fetchNowPlaying, type NowPlayingData } from "@/lib/spotify"

export { type NowPlayingData }

export function useNowPlaying() {
  const [track, setTrack] = useState<NowPlayingData | null>(null)

  useEffect(() => {
    let cancelled = false
    const poll = async () => {
      const data = await fetchNowPlaying()
      if (cancelled) return
      setTrack(data?.isPlaying ? data : null)
    }
    poll()
    const interval = setInterval(poll, 30_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return track
}

export function NowPlaying() {
  const [track, setTrack] = useState<NowPlayingData | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false
    const poll = async () => {
      const data = await fetchNowPlaying()
      if (cancelled) return
      if (data?.isPlaying) {
        setTrack(data)
        setVisible(true)
      } else {
        setVisible(false)
        setTimeout(() => { if (!cancelled) setTrack(null) }, 500)
      }
    }
    poll()
    const interval = setInterval(poll, 30_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  if (!track) return null

  return (
    <div
      className={`
        fixed top-14 left-1/2 -translate-x-1/2 z-[9999]
        transition-all duration-500 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
      `}
    >
      <div className="flex items-center gap-2.5 glass border border-primary/20 rounded-full px-3 py-2 hover:border-primary/40 transition-colors duration-200">
        <div className="flex-shrink-0 h-7 w-7 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          {track.albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.albumArt} alt="album art" className="h-full w-full object-cover" />
          ) : (
            <Music2 className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
        <div className="flex items-end gap-[2px] h-3.5 flex-shrink-0">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-sm bg-primary animate-music-bar"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <div className="flex items-baseline gap-1.5 font-mono whitespace-nowrap">
          <span className="text-xs text-foreground font-semibold">{track.title}</span>
          <span className="text-[10px] text-muted-foreground">{track.artist}</span>
        </div>
      </div>
    </div>
  )
}
