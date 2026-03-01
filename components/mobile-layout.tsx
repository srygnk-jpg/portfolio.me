"use client"

import { useState } from "react"
import {
    Terminal, User, FolderGit2, Cpu, Briefcase, Mail,
} from "lucide-react"
import { AboutContent } from "./windows/AboutContent"
import { ProjectsContent } from "./windows/ProjectsContent"
import { SkillsContent } from "./windows/SkillsContent"
import { ExperienceContent } from "./windows/ExperienceContent"
import { ContactContent } from "./windows/ContactContent"

const sections = [
    { id: "about", label: "About", icon: User, prompt: "cat README.md" },
    { id: "projects", label: "Projects", icon: FolderGit2, prompt: "ls ~/projects" },
    { id: "skills", label: "Skills", icon: Cpu, prompt: "cat skills.json" },
    { id: "experience", label: "XP", icon: Briefcase, prompt: "git log --career" },
    { id: "contact", label: "Contact", icon: Mail, prompt: "./contact.sh" },
]

function SectionContent({ id }: { id: string }) {
    switch (id) {
        case "about": return <AboutContent />
        case "projects": return <ProjectsContent />
        case "skills": return <SkillsContent />
        case "experience": return <ExperienceContent />
        case "contact": return <ContactContent />
        default: return null
    }
}

export function MobileLayout() {
    const [active, setActive] = useState("about")

    return (
        <div className="flex flex-col h-[100dvh] w-screen bg-background overflow-hidden font-mono">
            {/* ── Top header bar ── */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-primary glow-green tracking-wider">&lt;/&gt; DevOS</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-terminal-cyan">sreeyuktha</span>
                </div>
            </header>

            {/* ── Prompt bar ── */}
            <div className="px-4 py-2 bg-secondary/20 border-b border-border shrink-0">
                <span className="text-primary text-xs">~ $&nbsp;</span>
                <span className="text-terminal-dim text-xs">
                    {sections.find(s => s.id === active)?.prompt}
                </span>
                <span className="inline-block w-2 h-3.5 bg-primary ml-1 cursor-blink align-middle" />
            </div>

            {/* ── Content area ── */}
            <main className="flex-1 overflow-y-auto px-4 py-4 pb-40">
                <SectionContent id={active} />
            </main>

            {/* ── Bottom nav ── */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur-xl px-2 pt-2 shrink-0" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
                {sections.map(({ id, label, icon: Icon }) => {
                    const isActive = active === id
                    return (
                        <button
                            key={id}
                            onClick={() => setActive(id)}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${isActive
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="text-[9px] tracking-wide uppercase">{label}</span>
                            {isActive && (
                                <span className="h-0.5 w-4 rounded-full bg-primary" />
                            )}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
