const YEAR = new Date().getFullYear()

export function SiteFooter({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="text-[10px]">
        <span className="text-terminal-dim">{"// "}</span>
        <span className="text-muted-foreground">crafted with</span>
        <span className="text-primary"> ♥ </span>
        <span className="text-muted-foreground">by</span>
        <span className="text-terminal-cyan"> sreeyuktha</span>
      </div>
      <div className="text-[10px] text-terminal-dim">© {YEAR} · all rights reserved</div>
    </div>
  )
}
