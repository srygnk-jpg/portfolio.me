"use client"

import { experiences } from "@/lib/data"

export function ExperienceContent() {
  return (
    <div className="space-y-3 font-mono text-sm h-full overflow-auto">
      <div className="text-terminal-dim text-xs">{"$ git log --oneline --graph --all career.json"}</div>
      <div className="space-y-5 border-l-2 border-border pl-4 ml-2">
        {experiences.map((exp, i) => (
          <div key={i} className="relative animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`absolute -left-[22px] top-1.5 h-3 w-3 rounded-full border-2 border-background ${exp.dot}`} />
            <div className="text-[10px] text-terminal-dim mb-0.5 font-mono">{exp.log}</div>
            <div className="flex items-baseline gap-2 flex-wrap">
              {exp.date && (
                <>
                  <span className="text-xs text-terminal-yellow font-mono">{exp.date}</span>
                  <span className="text-terminal-dim text-[10px]">—</span>
                </>
              )}
              <span className="text-xs text-foreground font-semibold">{exp.role}</span>
            </div>
            <div className="text-xs text-terminal-cyan mb-1">{exp.company}</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{exp.description}</p>
            <div className="flex flex-wrap gap-1">
              {exp.tech.map((t) => (
                <span
                  key={t}
                  className="rounded bg-secondary px-1.5 py-0.5 text-[9px] text-foreground border border-border/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
