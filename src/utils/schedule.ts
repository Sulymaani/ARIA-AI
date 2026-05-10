import { PROF_SCHEDULES, ROOM_SCHEDULES } from "../data/facultyData"
export const DAY_KEYS = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
export const getTodayKey = () => DAY_KEYS[new Date().getDay()]
export const toMins = t => { const [h,m] = t.split(":").map(Number); return h*60+m }
export const nowMins = () => { const n = new Date(); return n.getHours()*60+n.getMinutes() }

export function getRoomStatus(id) {
  const slots = ROOM_SCHEDULES[id]
  if (!slots) return { status:"available", label:"No bookings recorded" }
  const now = nowMins()
  return slots.find(s => now >= toMins(s.from) && now < toMins(s.to)) || { status:"available", label:"" }
}

export function getProfStatus(id) {
  const daySlots = PROF_SCHEDULES[id]?.[getTodayKey()]
  if (!daySlots) return { status:"unavailable", label:"No schedule for today" }
  const now = nowMins()
  return daySlots.find(s => now >= toMins(s.from) && now < toMins(s.to)) || { status:"unavailable", label:"Outside office hours" }
}
