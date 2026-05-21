import { C, cardBorder, shadow, statusClr, statusLbl } from "../theme"

export function Card({ children, sx = {} }) {
  return <div className="aria-card" style={{
    background: cardBorder(`${C.cyan}28`),
    border: "1px solid transparent",
    borderRadius: 16,
    padding: "20px 24px",
    boxShadow: shadow.card,
    ...sx,
  }}>{children}</div>
}

export function Chip({ label, color = C.text2, bg = "transparent" }) {
  return <span style={{
    background: bg !== "transparent" ? bg : `linear-gradient(135deg, ${color}28, ${color}14)`,
    border: `1px solid ${color}60`,
    borderRadius: 999,
    padding: "4px 9px",
    color,
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
    boxShadow: `0 0 0 1px ${color}18, 0 2px 8px ${color}10`,
  }}>{label}</span>
}

export function StatusBadge({ status, label }: { status: string, label?: string }) {
  const clr = statusClr(status)
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:`linear-gradient(135deg, ${clr}22, ${clr}0E)`, border:`1px solid ${clr}66`, borderRadius:999, padding:"5px 10px", color:clr, fontSize:12, fontWeight:700, whiteSpace:"nowrap", boxShadow:`0 0 0 1px ${clr}18, 0 2px 12px ${clr}15` }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:clr, boxShadow:`0 0 0 3px ${clr}25, 0 0 10px ${clr}`, display:"inline-block", flexShrink:0 }} />
      {label ?? statusLbl(status)}
    </span>
  )
}

export function SectionLabel({ children }) {
  return <div style={{ color:C.text2, fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>{children}</div>
}
