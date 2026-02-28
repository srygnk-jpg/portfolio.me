"use client"

import { useState, useEffect } from "react"
import {
  Code2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Star,
  GitBranch,
  Terminal,
  Globe,
  BookOpen,
  Award,
} from "lucide-react"

/* ═══════════════════════════════════════════════
   ABOUT WINDOW
═══════════════════════════════════════════════ */
export function AboutContent() {
  return (
    <div className="space-y-4 font-mono text-sm h-full overflow-auto">
      <div className="text-terminal-dim text-xs">{"# README.md"}</div>

      <h2 className="text-xl text-primary glow-green font-semibold">
        {">"} Hello, World! 👋
      </h2>

      {/* TODO: PERSONALIZE — update bio paragraph */}
      <p className="leading-relaxed text-foreground text-xs">
        {
          "I’m a backend developer who loves building reliable and efficient systems.I enjoy solving complex problems, designing clean APIs, and making sure everything works smoothly behind the scenes."
        }
      </p>

      {/* Code block — quick facts */}
      <div className="rounded-lg border border-border bg-secondary/20 p-3 text-xs">
        <div className="text-terminal-dim mb-2">{"// quick_facts.ts"}</div>
        <div className="space-y-1">
          {/* TODO: PERSONALIZE — update name, role, location, interests */}
          {[
            { key: "name", value: '"Sreeyuktha"', color: "text-primary" },
            { key: "role", value: '"Backend Developer"', color: "text-primary" },
            { key: "location", value: '"Calicut, India"', color: "text-primary" },
            { key: "education", value: '"B.Tech Information Technology"', color: "text-primary" },
            { key: "interests", value: '["Development", "AI", "Systems Design"]', color: "text-foreground" },
            { key: "status", value: '"Available for opportunities ✨"', color: "text-terminal-cyan" },
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
          {/* TODO: PERSONALIZE */}
          <div className="text-foreground text-[11px]">B.Tech Information Technology</div>
          <div className="text-terminal-dim text-[10px] mt-1.5">GEC Bartonhill</div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/10 p-3">
          <div className="flex items-center gap-1.5 text-terminal-yellow mb-1.5">
            <Award className="h-3 w-3" />
            <span>Fun fact</span>
          </div>
          {/* TODO: PERSONALIZE */}
          <div className="text-foreground text-[11px]">I debug with console.log</div>
          <div className="text-terminal-dim text-[10px] mt-1.5">and I'm proud of it</div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
        <MapPin className="h-3 w-3 shrink-0" />
        {/* TODO: PERSONALIZE */}
        <span>Calicut, India</span>
        <span className="text-terminal-dim">|</span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Open to work
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   PROJECTS WINDOW
═══════════════════════════════════════════════ */
// TODO: PERSONALIZE — replace with your real projects
const projects = [
  {
    name: "Lambdabooks",
    description: "Worked as Backend Dev, implemented new backend features, integrated third-party services, fixed documentation inconsistencies, and improved existing modules to ensure system reliability and maintainability..",
    tech: ["Java", "Spring Boot", "Liquibase", "PostgreSQL", "Monolithic"],
    status: "active"
  },
  {
    name: "Keyvault",
    description: "Worked as Backend Dev, implemented RBAC, Multi-tenancy and kafka configuration.",
    tech: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Microservices"]
  },
  {
    name: "Taskflow",
    description: "TaskFlow is a 20-minute AI-built productivity app combining design, logic, and deployment in one seamless flow. UI designed in Canva, developed with Antigravity, and powered by Firebase MCP for Google Auth and real-time database — built as a hands-on experiment in AI-driven full-stack development.",
    tech: ["Firebase", "Antigravity"],
    status: "active",
    live: "https://taskflow-ca7ef.web.app/",
  },
  {
    name: "Identification of unique concepts for DDoS attacks using XAI Techniques.",
    description: "Applied LIME, SHAP, CIU, and TCAV to interpret Random Forest models trained on the NLS-KDD dataset for detecting DDoS attacks, with a special focus on Neptune attacks. Used these XAI techniques to elucidate model decisions,identify key features, and enhance detection accuracy and robustness againstNeptune attacks. It was an acadamic project, but it was really cool",
    tech: ["XAI", "Machine Learning", "Python"],
  },
]

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
              className={`group rounded-lg border transition-all cursor-pointer ${isSelected
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
                    <span key={t} className="rounded bg-secondary px-1.5 py-0.5 text-[9px] text-terminal-cyan border border-border/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded links — only shown when selected and at least one link exists */}
              {isSelected && ((project as any).github || (project as any).live) && (
                <div className="border-t border-border px-3 py-2 flex gap-3">
                  {(project as any).github && (
                    <a
                      href={(project as any).github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-3 w-3" />
                      GitHub
                    </a>
                  )}
                  {(project as any).live && (
                    <a
                      href={(project as any).live}
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

/* ═══════════════════════════════════════════════
   SKILLS WINDOW
═══════════════════════════════════════════════ */
// TODO: PERSONALIZE — update skills and levels
const skillCategories = [
  {
    category: "Backend",
    icon: <Code2 className="h-3.5 w-3.5" />,
    color: "text-terminal-cyan",
    barColor: "bg-terminal-cyan",
    skills: [
      { name: "Java", level: 80 },
      { name: "Spring Boot", level: 80 },
      { name: "PostgreSQL", level: 85 },
      { name: "REST API", level: 80 },
    ],
  },
  {
    category: "DevOps & Tools",
    icon: <Terminal className="h-3.5 w-3.5" />,
    color: "text-primary",
    barColor: "bg-primary",
    skills: [
      { name: "Docker / K8s", level: 65 },
      { name: "AWS / Vercel", level: 60 },
      { name: "Git / CI/CD", level: 70 },
    ],
  },
  {
    category: "AI tools",
    icon: <Globe className="h-3.5 w-3.5" />,
    color: "text-terminal-yellow",
    barColor: "bg-terminal-yellow",
    skills: [
      { name: "LLMs", level: 80 },
      { name: "Prompt Engineering", level: 80 },
      { name: "AI Frameworks", level: 80 },
      { name: "Automation tools", level: 80 },
    ],
  },
]

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
            <span className={cat.color}>{cat.icon}</span>
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

/* ═══════════════════════════════════════════════
   EXPERIENCE WINDOW
═══════════════════════════════════════════════ */
// TODO: PERSONALIZE — replace with your real work experience
const experiences = [
  {
    role: "Software Engineer",
    company: "Edstem Technologies Pvt. Ltd.",
    log: "[v2.0.0] Joined as Software Associate.",
    description:
      "java backend developer",
    tech: ["Java", "Spring Boot", "PostgreSQL", "git", "Docker", "K8s"],
    dot: "bg-primary",
  },
  {

    role: "Web Development Intern",
    company: "SPRV Infosys",
    log: "[v2.0.0] Worked as student intern.",
    description:
      "Worked on company website enhancement and development.",
    tech: ["html", "css", "js", "bootstrap", "git"],
    dot: "bg-terminal-cyan",
  },
  {
    role: "Freelance Web Developer",
    log: "[v1.0.0] First role. Learning & growing.",
    description:
      "Developed responsive websites for clients. Medical and educational websites.",
    tech: ["html", "css", "js", "bootstrap", "git"],
    dot: "bg-terminal-yellow",
  },
]

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
              {(exp as any).date && (
                <>
                  <span className="text-xs text-terminal-yellow font-mono">{(exp as any).date}</span>
                  <span className="text-terminal-dim text-[10px]">—</span>
                </>
              )}
              <span className="text-xs text-foreground font-semibold">{exp.role}</span>
            </div>
            <div className="text-xs text-terminal-cyan mb-1">{exp.company}</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{exp.description}</p>
            <div className="flex flex-wrap gap-1">
              {exp.tech.map((t) => (
                <span key={t} className="rounded bg-secondary px-1.5 py-0.5 text-[9px] text-foreground border border-border/60">
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

/* ═══════════════════════════════════════════════
   CONTACT WINDOW
═══════════════════════════════════════════════ */
export function ContactContent() {
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const email = "iamsreeyuktha@gmail.com"

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("https://formspree.io/f/xreadjnq", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        setForm({ name: "", email: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="space-y-4 font-mono text-sm h-full overflow-auto">
      <div className="text-terminal-dim text-xs">{"$ ./contact_form.sh"}</div>

      {/* Copy-email quick action */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/20 px-3 py-2">
        <Mail className="h-3.5 w-3.5 text-terminal-cyan shrink-0" />
        <span className="text-xs text-foreground flex-1">{email}</span>
        <button
          onClick={copyEmail}
          className="text-[10px] rounded px-2 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          {copied ? "✓ copied!" : "copy"}
        </button>
      </div>

      {status === "success" ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-5 text-center space-y-1">
          <div className="text-primary text-lg">✓</div>
          <div className="text-xs text-foreground font-semibold">Message sent!</div>
          <div className="text-[11px] text-muted-foreground">I'll get back to you soon.</div>
          <button
            onClick={() => setStatus("idle")}
            className="mt-2 text-[10px] text-primary hover:underline"
          >
            send another
          </button>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-[10px] text-terminal-cyan">{">"} name:</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-terminal-dim"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-terminal-cyan">{">"} email:</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-terminal-dim"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-terminal-cyan">{">"} message:</label>
            <textarea
              rows={3}
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none placeholder:text-terminal-dim"
              placeholder="Hello! I'd love to..."
            />
          </div>
          {status === "error" && (
            <div className="text-[11px] text-red-400">⚠ Something went wrong. Try emailing directly.</div>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_16px_oklch(0.75_0.18_165_/_0.3)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="h-3 w-3" />
            {status === "sending" ? "sending..." : "send_message()"}
          </button>
        </form>
      )}

      {/* Social links */}
      <div className="border-t border-border pt-3">
        <div className="text-terminal-dim text-[10px] mb-2">{"// social_links"}</div>
        <div className="flex items-center gap-4 flex-wrap">
          <a href="https://www.linkedin.com/in/sreeyukthagnk/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-terminal-cyan">
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
          <a href={`mailto:${email}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-terminal-yellow">
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
        </div>
      </div>
    </div>
  )
}
