"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ExternalLink, Linkedin, Mail, Send } from "lucide-react"

const EMAIL = "srygnk@gmail.com"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactForm = z.infer<typeof contactSchema>

export function ContactContent() {
  const [copied, setCopied] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const onSubmit = async (data: ContactForm) => {
    setSubmitStatus("sending")
    try {
      const res = await fetch("https://formspree.io/f/xreadjnq", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSubmitStatus("success")
        reset()
      } else {
        setSubmitStatus("error")
      }
    } catch {
      setSubmitStatus("error")
    }
  }

  return (
    <div className="space-y-4 font-mono text-sm h-full overflow-auto">
      <div className="text-terminal-dim text-xs">{"$ ./contact_form.sh"}</div>

      {/* Copy-email quick action */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/20 px-3 py-2">
        <Mail className="h-3.5 w-3.5 text-terminal-cyan shrink-0" />
        <span className="text-xs text-foreground flex-1">{EMAIL}</span>
        <button
          onClick={copyEmail}
          className="text-[10px] rounded px-2 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          {copied ? "✓ copied!" : "copy"}
        </button>
      </div>

      {submitStatus === "success" ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-5 text-center space-y-1">
          <div className="text-primary text-lg">✓</div>
          <div className="text-xs text-foreground font-semibold">Message sent!</div>
          <div className="text-[11px] text-muted-foreground">I'll get back to you soon.</div>
          <button
            onClick={() => setSubmitStatus("idle")}
            className="mt-2 text-[10px] text-primary hover:underline"
          >
            send another
          </button>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-[10px] text-terminal-cyan">{">"} name:</label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-terminal-dim"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-[10px] text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-terminal-cyan">{">"} email:</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-terminal-dim"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-[10px] text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-terminal-cyan">{">"} message:</label>
            <textarea
              rows={3}
              {...register("message")}
              className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none placeholder:text-terminal-dim"
              placeholder="Hello! I'd love to..."
            />
            {errors.message && (
              <p className="mt-1 text-[10px] text-red-400">{errors.message.message}</p>
            )}
          </div>
          {submitStatus === "error" && (
            <div className="text-[11px] text-red-400">⚠ Something went wrong. Try emailing directly.</div>
          )}
          <button
            type="submit"
            disabled={submitStatus === "sending"}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_16px_oklch(0.75_0.18_165_/_0.3)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="h-3 w-3" />
            {submitStatus === "sending" ? "sending..." : "send_message()"}
          </button>
        </form>
      )}

      {/* Social links */}
      <div className="border-t border-border pt-3">
        <div className="text-terminal-dim text-[10px] mb-2">{"// social_links"}</div>
        <div className="flex items-center gap-4 flex-wrap">
          <a
            href="https://www.linkedin.com/in/sreeyukthagnk/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-terminal-cyan"
          >
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-terminal-yellow"
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
        </div>
      </div>
    </div>
  )
}
