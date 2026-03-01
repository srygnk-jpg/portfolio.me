"use client"

import { BookOpen, Award, MapPin } from "lucide-react"

export function AboutContent() {
  return (
    <div className="space-y-4 font-mono text-sm h-full overflow-auto">
      <div className="text-terminal-dim text-xs">{"# README.md"}</div>

      <h2 className="text-xl text-primary glow-green font-semibold">
        {">"} Hello, World! 👋
      </h2>

      <p className="leading-relaxed text-foreground text-xs">
        {
          "I'm a backend developer who loves building reliable and efficient systems. I enjoy solving complex problems, designing clean APIs, and making sure everything works smoothly behind the scenes."
        }
      </p>

      {/* Code block — quick facts */}
      <div className="rounded-lg border border-border bg-secondary/20 p-3 text-xs">
        <div className="text-terminal-dim mb-2">{"// quick_facts.ts"}</div>
        <div className="space-y-1">
          {[
            { key: "name", value: '"Sreeyuktha"', color: "text-primary" },
            { key: "role", value: '"Backend Developer"', color: "text-primary" },
            { key: "location", value: '"Calicut, India"', color: "text-primary" },
            { key: "education", value: '"B.Tech Information Technology"', color: "text-primary" },
            { key: "interests", value: '["Development", "AI", "Systems Design"]', color: "text-foreground" },
            { key: "status", value: '"Learning new things everyday 🎯"', color: "text-terminal-cyan" },
          ].map(({ key, value, color }) => (
            <div key={key} className="flex flex-wrap gap-1">
              <span className="text-terminal-cyan">{"const"}</span>
              <span className="text-terminal-yellow">{key}</span>
              <span className="text-terminal-dim">{"="}</span>
              <span className={color}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Education + fun fact */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-border bg-secondary/10 p-3">
          <div className="flex items-center gap-1.5 text-terminal-cyan mb-1.5">
            <BookOpen className="h-3 w-3" />
            <span>Education</span>
          </div>
          <div className="text-foreground text-[11px]">B.Tech Information Technology</div>
          <div className="text-terminal-dim text-[10px] mt-1.5">GEC Bartonhill</div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/10 p-3">
          <div className="flex items-center gap-1.5 text-terminal-yellow mb-1.5">
            <Award className="h-3 w-3" />
            <span>Fun fact</span>
          </div>
          <div className="text-foreground text-[11px]">I debug with console.log</div>
          <div className="text-terminal-dim text-[10px] mt-1.5">and I'm proud of it</div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
        <MapPin className="h-3 w-3 shrink-0" />
        <span>Calicut, India</span>
        <span className="text-terminal-dim">|</span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          curiously building
        </span>
      </div>
    </div>
  )
}
