"use client"

import { useState } from "react"
import { Github, Globe, GitBranch } from "lucide-react"
import { projects } from "@/lib/data"

export function ProjectsContent() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-3 font-mono text-sm h-full overflow-auto">
      <div className="text-terminal-dim text-xs">{"~/projects $ ls -la --sort=stars"}</div>
      <div className="grid gap-2.5">
        {projects.map((project) => {
          const isSelected = selected === project.name
          return (
            <div
              key={project.name}
              className={`group rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-secondary/10 hover:border-primary/30 hover:bg-secondary/30"
              }`}
              onClick={() => setSelected(isSelected ? null : project.name)}
            >
              <div className="p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-3.5 w-3.5 text-terminal-cyan shrink-0" />
                    <span className="text-primary font-semibold">{project.name}</span>
                  </div>
                  {project.status === "active" && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] text-primary border border-primary/20">
                      active
                    </span>
                  )}
                  {project.status === "archived" && (
                    <span className="rounded-full bg-muted/30 px-2 py-0.5 text-[9px] text-terminal-dim border border-border">
                      archived
                    </span>
                  )}
                </div>

                <p className="mb-2 text-[11px] text-muted-foreground leading-relaxed">{project.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-secondary px-1.5 py-0.5 text-[9px] text-terminal-cyan border border-border/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded links — only shown when selected and at least one link exists */}
              {isSelected && (project.github || project.live) && (
                <div className="border-t border-border px-3 py-2 flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-3 w-3" />
                      GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-terminal-cyan transition-colors"
                    >
                      <Globe className="h-3 w-3" />
                      Live Demo
                    </a>
                  )}
                  <span className="ml-auto text-[9px] text-terminal-dim">click to collapse</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
