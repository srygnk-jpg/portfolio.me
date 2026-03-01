// ─────────────────────────────────────────────────────────────────────────────
// Portfolio data — edit this file to update your portfolio content
// ─────────────────────────────────────────────────────────────────────────────

export interface Project {
  name: string
  description: string
  tech: string[]
  status?: "active" | "archived"
  github?: string
  live?: string
}

export interface Skill {
  name: string
  level: number
}

export interface SkillCategory {
  category: string
  color: string
  barColor: string
  skills: Skill[]
}

export interface Experience {
  role: string
  company?: string
  log: string
  description: string
  tech: string[]
  dot: string
  date?: string
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    name: "Lambdabooks",
    description:
      "Worked as Backend Dev, implemented new backend features, integrated third-party services, fixed documentation inconsistencies, and improved existing modules to ensure system reliability and maintainability.",
    tech: ["Java", "Spring Boot", "Liquibase", "PostgreSQL", "Monolithic"],
    status: "active",
  },
  {
    name: "Keyvault",
    description:
      "Worked as Backend Dev, implemented RBAC, Multi-tenancy and kafka configuration.",
    tech: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Microservices"],
  },
  {
    name: "Taskflow",
    description:
      "TaskFlow is a 20-minute AI-built productivity app combining design, logic, and deployment in one seamless flow. UI designed in Canva, developed with Antigravity, and powered by Firebase MCP for Google Auth and real-time database — built as a hands-on experiment in AI-driven full-stack development.",
    tech: ["Firebase", "Antigravity"],
    status: "active",
    live: "https://taskflow-ca7ef.web.app/",
  },
  {
    name: "Identification of unique concepts for DDoS attacks using XAI Techniques.",
    description:
      "Applied LIME, SHAP, CIU, and TCAV to interpret Random Forest models trained on the NLS-KDD dataset for detecting DDoS attacks, with a special focus on Neptune attacks. Used these XAI techniques to elucidate model decisions, identify key features, and enhance detection accuracy and robustness against Neptune attacks. It was an academic project, but it was really cool.",
    tech: ["XAI", "Machine Learning", "Python"],
  },
]

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skillCategories: SkillCategory[] = [
  {
    category: "Backend",
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

// ─── Experience ───────────────────────────────────────────────────────────────

export const experiences: Experience[] = [
  {
    role: "Software Engineer",
    company: "Edstem Technologies Pvt. Ltd.",
    log: "[v2.0.0] Joined as Software Associate.",
    description: "Java backend developer",
    tech: ["Java", "Spring Boot", "PostgreSQL", "git", "Docker", "K8s"],
    dot: "bg-primary",
  },
  {
    role: "Web Development Intern",
    company: "SPRV Infosys",
    log: "[v2.0.0] Worked as student intern.",
    description: "Worked on company website enhancement and development.",
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
