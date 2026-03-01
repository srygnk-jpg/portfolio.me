"use client"

import { useState, useEffect } from "react"
import { Code2, Terminal, Globe } from "lucide-react"
import { skillCategories } from "@/lib/data"

const SKILL_ICONS: Record<string, React.ReactNode> = {
  Backend: <Code2 className="h-3.5 w-3.5" />,
  "DevOps & Tools": <Terminal className="h-3.5 w-3.5" />,
  "AI tools": <Globe className="h-3.5 w-3.5" />,
}

function AnimatedBar({ level, color }: { level: number; color: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setWidth(level), 150)
    return () => clearTimeout(timer)
  }, [level])
  return (
    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export function SkillsContent() {
  return (
    <div className="space-y-5 font-mono text-sm h-full overflow-auto">
      <div className="text-terminal-dim text-xs">{"$ cat skills.json | jq . | pretty-print"}</div>
      {skillCategories.map((cat, ci) => (
        <div key={cat.category} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={cat.color}>{SKILL_ICONS[cat.category]}</span>
            <span className={`text-xs font-semibold ${cat.color}`}>{cat.category}</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-2 pl-2">
            {cat.skills.map((skill, si) => (
              <div key={skill.name} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-[11px] text-muted-foreground truncate">{skill.name}</span>
                <AnimatedBar
                  level={skill.level}
                  color={cat.barColor}
                  key={`${ci}-${si}`}
                />
                <span className="w-9 text-right text-[10px] text-terminal-dim tabular-nums">{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
