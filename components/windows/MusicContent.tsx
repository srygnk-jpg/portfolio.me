"use client"

import { useState, useEffect } from "react"
import { Music2, Disc3, Star, Zap } from "lucide-react"

interface MusicData {
  updatedAt: string
  weekLabel: string
  totalHours: number
  recruiterQuote: string
  genres: { name: string; hours: number; color: string }[]
  topArtists: { name: string; hours: number }[]
  topTracks: { rank: number; title: string; artist: string; plays: number }[]
  moods: { label: string; color: string; bg: string; border: string }[]
  moodAnalysis: string
}

const GENRE_COLORS = [
  "#39d98a", "#36b9cc", "#f0c419", "#e67e3c", "#9b59b6",
  "#e74c3c", "#1abc9c", "#3498db", "#e91e63", "#00bcd4",
]

const MOOD_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  Focus:    { color: "text-primary",        bg: "bg-primary/10",        border: "border-primary/20" },
  Energetic:{ color: "text-terminal-cyan",  bg: "bg-terminal-cyan/10",  border: "border-terminal-cyan/20" },
  Deep:     { color: "text-terminal-yellow", bg: "bg-terminal-yellow/10", border: "border-terminal-yellow/20" },
  Chill:    { color: "text-accent",         bg: "bg-accent/10",         border: "border-accent/20" },
}

function transformN8nData(raw: Record<string, unknown>): MusicData {
  let spotify: Record<string, unknown> = raw
  if (typeof raw.formattedData === "string") {
    try { spotify = JSON.parse(raw.formattedData) } catch { }
  } else if (typeof raw.formattedData === "object" && raw.formattedData) {
    spotify = raw.formattedData as Record<string, unknown>
  }

  const topGenres = (raw.topGenres || []) as { name: string; count: number }[]
  const totalGenreCount = topGenres.reduce((s, g) => s + g.count, 0) || 1
  const genres = topGenres.map((g, i) => ({
    name: g.name.charAt(0).toUpperCase() + g.name.slice(1),
    hours: Math.round((g.count / totalGenreCount) * 30 * 10) / 10,
    color: GENRE_COLORS[i % GENRE_COLORS.length],
  }))

  const rawArtists = (spotify.topArtists || raw.topArtists || []) as { name: string; popularity?: number }[]
  const topArtists = rawArtists.slice(0, 5).map((a, i) => ({
    name: a.name,
    hours: Math.round((((a.popularity || 50) / 100) * 10 - i * 1.2) * 10) / 10 || (8 - i * 1.5),
  }))

  const rawTracks = (spotify.recentlyPlayed || raw.recentlyPlayed || []) as { trackName: string; artist: string }[]
  const trackCounts: Record<string, { title: string; artist: string; plays: number }> = {}
  rawTracks.forEach((t) => {
    const key = `${t.trackName}|${t.artist}`
    if (!trackCounts[key]) trackCounts[key] = { title: t.trackName, artist: t.artist, plays: 0 }
    trackCounts[key].plays++
  })
  const topTracks = Object.values(trackCounts)
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 5)
    .map((t, i) => ({ rank: i + 1, ...t }))

  const moodLabels = (raw.moodLabels || ["Focus", "Energetic"]) as string[]
  const moods = moodLabels.map((label) => ({
    label,
    ...(MOOD_STYLES[label] || MOOD_STYLES.Focus),
  }))

  const ts = (spotify.timestamp as string) || (raw.timestamp as string) || new Date().toISOString()
  const d = new Date(ts)
  const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay())
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6)
  const fmt = (dt: Date) => dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return {
    updatedAt: ts,
    weekLabel: `${fmt(weekStart)} – ${fmt(weekEnd)}`,
    totalHours: genres.reduce((s, g) => s + g.hours, 0),
    recruiterQuote: (raw.recruiterQuote as string) || "Listening to great music while coding.",
    genres,
    topArtists,
    topTracks,
    moods,
    moodAnalysis: (raw.moodAnalysis as string) || "Analyzing listening patterns...",
  }
}

function isAlreadyFormatted(d: Record<string, unknown>): boolean {
  return (
    Array.isArray(d.genres) &&
    Array.isArray(d.topArtists) &&
    (d.genres as unknown[]).length > 0 &&
    typeof (d.genres as Record<string, unknown>[])[0]?.hours === "number"
  )
}

function GenrePieChart({ genres }: { genres: MusicData["genres"] }) {
  const total = genres.reduce((s, g) => s + g.hours, 0)
  let cumAngle = -Math.PI / 2
  const cx = 60; const cy = 60; const r = 48; const inner = 28

  const slices = genres.map((g) => {
    const angle = (g.hours / total) * 2 * Math.PI
    const x1 = cx + r * Math.cos(cumAngle)
    const y1 = cy + r * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = cx + r * Math.cos(cumAngle)
    const y2 = cy + r * Math.sin(cumAngle)
    const ix1 = cx + inner * Math.cos(cumAngle - angle)
    const iy1 = cy + inner * Math.sin(cumAngle - angle)
    const ix2 = cx + inner * Math.cos(cumAngle)
    const iy2 = cy + inner * Math.sin(cumAngle)
    const large = angle > Math.PI ? 1 : 0
    return {
      d: `M${ix1},${iy1} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${ix2},${iy2} A${inner},${inner} 0 ${large} 0 ${ix1},${iy1} Z`,
      color: g.color,
      name: g.name,
      pct: Math.round((g.hours / total) * 100),
    }
  })

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" className="w-24 h-24 shrink-0">
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.color} opacity={0.85} className="transition-opacity hover:opacity-100" />
        ))}
        <text x="60" y="56" textAnchor="middle" fontSize="9" fill="oklch(0.85 0.02 165)" fontFamily="monospace">total</text>
        <text x="60" y="68" textAnchor="middle" fontSize="11" fill="oklch(0.75 0.18 165)" fontFamily="monospace" fontWeight="bold">
          {total.toFixed(0)}h
        </text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-muted-foreground truncate flex-1">{s.name}</span>
            <span className="text-terminal-dim tabular-nums">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArtistBar({ name, hours, maxHours, delay }: { name: string; hours: number; maxHours: number; delay: number }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth((hours / maxHours) * 100), 200 + delay)
    return () => clearTimeout(t)
  }, [hours, maxHours, delay])
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[11px] text-muted-foreground truncate">{name}</span>
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all duration-700 ease-out" style={{ width: `${width}%` }} />
      </div>
      <span className="w-10 text-right text-[10px] text-terminal-dim tabular-nums">{hours}h</span>
    </div>
  )
}

export function MusicContent() {
  const [data, setData] = useState<MusicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_MUSIC_DATA_URL
      || `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/music-data.json`
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setData(isAlreadyFormatted(d) ? (d as MusicData) : transformN8nData(d))
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-xs text-terminal-dim">
        <span className="animate-pulse">$ fetching music.analytics...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 font-mono text-xs">
        <span className="text-terminal-red">⚠ Failed to load music-data.json</span>
        <span className="text-terminal-dim">Check your network connection or Gist URL.</span>
      </div>
    )
  }

  const maxArtistHours = Math.max(...data.topArtists.map((a) => a.hours))
  const updatedDate = new Date(data.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return (
    <div className="space-y-4 font-mono text-sm h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music2 className="h-4 w-4 text-primary" />
          <span className="text-xs text-terminal-dim">music.analytics — {data.weekLabel}</span>
        </div>
        <span className="text-[9px] rounded-full border border-primary/20 bg-primary/10 text-primary px-2 py-0.5">
          Updated {updatedDate}
        </span>
      </div>

      {/* Recruiter Quote */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="text-[10px] text-terminal-dim mb-1">{"// this_week.summary"}</div>
        <p className="text-xs text-foreground leading-relaxed italic">"{data.recruiterQuote}"</p>
      </div>

      {/* Genre Pie Chart */}
      <div className="rounded-lg border border-border bg-secondary/10 p-3">
        <div className="text-[10px] text-terminal-cyan mb-2.5 flex items-center gap-1.5">
          <Disc3 className="h-3 w-3" />
          genre_breakdown.svg
        </div>
        <GenrePieChart genres={data.genres} />
      </div>

      {/* Top Artists */}
      <div className="rounded-lg border border-border bg-secondary/10 p-3 space-y-2">
        <div className="text-[10px] text-terminal-yellow mb-1 flex items-center gap-1.5">
          <Star className="h-3 w-3" />
          top_artists — listening hours
        </div>
        {data.topArtists.map((a, i) => (
          <ArtistBar key={a.name} name={a.name} hours={a.hours} maxHours={maxArtistHours} delay={i * 80} />
        ))}
      </div>

      {/* Top Tracks */}
      <div className="rounded-lg border border-border bg-secondary/10 p-3">
        <div className="text-[10px] text-terminal-cyan mb-2 flex items-center gap-1.5">
          <Music2 className="h-3 w-3" />
          top_tracks.json
        </div>
        <div className="space-y-1.5">
          {data.topTracks.map((t) => (
            <div key={t.rank} className="flex items-center gap-2 text-[11px]">
              <span className="w-4 text-right text-terminal-dim tabular-nums shrink-0">{t.rank}.</span>
              <span className="flex-1 text-foreground truncate">{t.title}</span>
              <span className="text-muted-foreground truncate max-w-[90px]">{t.artist}</span>
              <span className="text-terminal-dim tabular-nums shrink-0">{t.plays}×</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Tags + LLM Analysis */}
      <div className="rounded-lg border border-border bg-secondary/10 p-3">
        <div className="text-[10px] text-terminal-dim mb-2 flex items-center gap-1.5">
          <Zap className="h-3 w-3" />
          llm_mood_analysis
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {data.moods.map((m) => (
            <span
              key={m.label}
              className={`rounded-full px-2.5 py-0.5 text-[10px] border font-semibold ${m.color} ${m.bg} ${m.border}`}
            >
              {m.label}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{data.moodAnalysis}</p>
      </div>

      {/* n8n Attribution Badge */}
      <div className="flex items-center justify-center pt-1 pb-2">
        <span className="text-[10px] text-terminal-dim border border-border/50 rounded-full px-3 py-1 flex items-center gap-1.5">
          <span className="text-primary">⚡</span>
          Powered by n8n + Spotify API · auto-updated every Sunday
        </span>
      </div>
    </div>
  )
}
