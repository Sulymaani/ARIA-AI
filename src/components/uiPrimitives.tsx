import { C, statusClr, statusLbl } from "../theme"
export function Card({ children, sx = {} }) {
  return <div style={{
    background:`linear-gradient(180deg, ${C.card}, #17283A)`,
    border:`1px solid ${C.border}`,
    borderRadius:16,
    padding:"20px 24px",
    boxShadow:"0 18px 50px rgba(0,0,0,.18)",
    ...sx,
  }}>{children}</div>
}

export function Chip({ label, color = C.text2, bg = "transparent" }) {
  return <span style={{ background:bg || color+"18", border:`1px solid ${color}44`, borderRadius:999, padding:"4px 9px", color, fontSize:11, fontWeight:700, lineHeight:1 }}>{label}</span>
}

export function StatusBadge({ status }) {
  const clr = statusClr(status)
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:clr+"18", border:`1px solid ${clr}88`, borderRadius:999, padding:"5px 10px", color:clr, fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:clr, boxShadow:`0 0 8px ${clr}`, display:"inline-block" }} />
      {statusLbl(status)}
    </span>
  )
}

export function SectionLabel({ children }) {
  return <div style={{ color:C.text2, fontSize:11, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>{children}</div>
}
