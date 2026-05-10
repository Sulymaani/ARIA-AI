export const C = {
  navy:   "#0D1B2A",
  card:   "#1A2B3D",
  border: "#2A3B4D",
  cyan:   "#00B4D8",
  text:   "#FFFFFF",
  text2:  "#94A3B8",
  green:  "#10B981",
  red:    "#EF4444",
  yellow: "#F59E0B",
  blue:   "#3B82F6",
  purple: "#8B5CF6",
}

export const statusClr = s => ({ in_office:"#10B981", available:"#10B981", occupied:"#EF4444", unavailable:"#EF4444", teaching:"#F59E0B", meeting:"#F59E0B" }[s] || C.text2)
export const statusLbl = s => ({ in_office:"In Office", available:"Available", occupied:"Occupied", unavailable:"Unavailable", teaching:"Teaching", meeting:"In Meeting" }[s] || s)
export const modeClr   = m => ({ guided:C.blue, balanced:C.purple, expert:C.cyan }[m] || C.text2)
