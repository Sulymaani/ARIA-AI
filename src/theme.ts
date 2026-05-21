export const C = {
  navy:   "#070D16",
  card:   "#0D1A27",
  border: "#1A2840",
  cyan:   "#00C4E8",
  text:   "#EEF4FF",
  text2:  "#7A8FA8",
  green:  "#10B981",
  red:    "#EF4444",
  yellow: "#F59E0B",
  blue:   "#3B82F6",
  purple: "#8B5CF6",
}

export const shadow = {
  card:     "inset 0 1px 0 rgba(255,255,255,.09), 0 0 0 1px rgba(0,196,232,.06), 0 40px 100px rgba(0,0,0,.60), 0 8px 24px rgba(0,0,0,.35)",
  shell:    "0 1px 0 rgba(255,255,255,.06), 0 16px 48px rgba(0,0,0,.50)",
  inputBar: "0 -1px 0 rgba(255,255,255,.06), 0 -16px 48px rgba(0,0,0,.50)",
}

export function cardBorder(glowColor = "transparent") {
  return `linear-gradient(165deg, ${C.card} 0%, #050E1A 100%) padding-box, linear-gradient(145deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.03) 40%, ${glowColor} 100%) border-box`
}

export const statusClr = s => ({ in_office:"#10B981", available:"#10B981", occupied:"#EF4444", unavailable:"#6B7280", teaching:"#F59E0B", meeting:"#8B5CF6" }[s] || C.text2)
export const statusLbl = s => ({ in_office:"In Office", available:"Available", occupied:"Occupied", unavailable:"Unavailable", teaching:"Teaching", meeting:"In Meeting" }[s] || s)
export const modeClr   = m => ({ guided:C.blue, balanced:C.purple, expert:C.cyan }[m] || C.text2)
