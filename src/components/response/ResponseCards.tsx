import { useState } from "react"
import {
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  Grid3X3,
  HelpCircle,
  Info,
  Layers3,
  MapPin,
  MessageCircle,
  Navigation,
  Search,
  UserRound,
} from "lucide-react"

import { C, statusClr, statusLbl } from "../../theme"
import { nowMins, toMins } from "../../utils/schedule"
import { Card, Chip, SectionLabel, StatusBadge } from "../uiPrimitives"

function IconBubble({ children, color = C.cyan }) {
  return (
    <div style={{ width:42, height:42, borderRadius:12, background:color+"18", border:`1px solid ${color}44`, color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      {children}
    </div>
  )
}

function CardTitle({ icon, title, subtitle }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
      {icon}
      <div>
        <div style={{ color:C.text, fontSize:20, fontWeight:800, lineHeight:1.25 }}>{title}</div>
        {subtitle && <div style={{ color:C.text2, fontSize:13, marginTop:3, lineHeight:1.45 }}>{subtitle}</div>}
      </div>
    </div>
  )
}

export function ClarifyCard({ data, onOptionSelect }) {
  return (
    <Card sx={{ textAlign:"center", padding:"34px 28px" }}>
      <div style={{ width:52, height:52, margin:"0 auto 14px", borderRadius:"50%", background:C.cyan+"18", border:`1px solid ${C.cyan}55`, color:C.cyan, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <MessageCircle size={28} />
      </div>
      <div style={{ fontSize:20, color:C.text, fontWeight:800, marginBottom:20, lineHeight:1.4 }}>{data.question}</div>
      {data.options?.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {data.options.map((opt,i) => (
            <button key={i} onClick={() => onOptionSelect(opt)} style={{
              background:"transparent", border:`1.5px solid ${C.cyan}`, borderRadius:12,
              padding:"14px 20px", color:C.cyan, fontSize:16, cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background=C.cyan;e.currentTarget.style.color=C.navy}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.cyan}}
            ><span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8 }}><Search size={16} />{opt}</span></button>
          ))}
        </div>
      )}
    </Card>
  )
}

export function StepIndicator({ data }) {
  const [step, setStep] = useState(0)
  return (
    <Card>
      <CardTitle
        icon={<IconBubble><Navigation size={22} /></IconBubble>}
        title={`Directions to ${data.destination}`}
        subtitle="Follow the steps in order. Current step is highlighted."
      />
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:18 }}>
        {data.steps.map((s,i) => (
          <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", opacity: i > step ? 0.4 : 1, transition:"opacity .35s", padding:"10px 0", borderTop:i?`1px solid ${C.border}`:"none" }}>
            <div style={{ minWidth:32, height:32, borderRadius:"50%", background: i < step ? C.green : i===step ? C.cyan : C.border, display:"flex", alignItems:"center", justifyContent:"center", color: i<=step ? C.navy : C.text2, fontWeight:800, fontSize:14, flexShrink:0, transition:"background .3s" }}>
              {i < step ? <Check size={16} /> : i+1}
            </div>
            <div style={{ color: i===step ? C.text : C.text2, fontSize:15, paddingTop:6, lineHeight:1.45 }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:18 }}>
        {step < data.steps.length - 1
          ? <button onClick={() => setStep(s=>s+1)} style={{ width:"100%", background:C.cyan, border:"none", borderRadius:10, padding:"13px", color:C.navy, fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Next step</button>
          : <div style={{ textAlign:"center", color:C.green, fontWeight:800, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Check size={18} /> You have arrived</div>
        }
      </div>
    </Card>
  )
}

export function RoomCard({ data }) {
  return (
    <Card>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, gap:12 }}>
        <CardTitle
          icon={<IconBubble><Building2 size={22} /></IconBubble>}
          title={data.name}
          subtitle={`Floor ${data.floor} · ${data.type_label} · Capacity ${data.capacity ?? "N/A"}`}
        />
        <StatusBadge status={data.status} />
      </div>
      {data.current_class && <div style={{ color:C.yellow, fontSize:13, marginBottom:10, display:"flex", alignItems:"center", gap:7 }}><BookOpen size={15} /> Currently: {data.current_class}</div>}
      {data.occupied_until && data.status==="occupied" && <div style={{ color:C.text2, fontSize:13, marginBottom:6 }}>Occupied until {data.occupied_until}</div>}
      {data.available_from && data.status==="occupied" && <div style={{ color:C.green, fontSize:13, marginBottom:10 }}>Free from {data.available_from}</div>}
      {data.features?.length > 0 && (
        <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginTop:14 }}>
          {data.features.map((f,i) => <Chip key={i} label={f} color={C.text2} />)}
        </div>
      )}
    </Card>
  )
}

export function ProfessorCard({ data }) {
  return (
    <Card>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, gap:12 }}>
        <CardTitle
          icon={<IconBubble><UserRound size={22} /></IconBubble>}
          title={data.name}
          subtitle={`${data.title} · ${data.department}`}
        />
        <StatusBadge status={data.status} />
      </div>
      <div style={{ color:C.text2, fontSize:13, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}><MapPin size={14} /> {data.office}</div>
      {data.status_label && <div style={{ color:C.text2, fontSize:14, marginBottom:8 }}>{data.status_label}</div>}
      {data.current_activity && <div style={{ color:C.yellow, fontSize:13, marginBottom:12 }}>Now: {data.current_activity}</div>}
      {data.todays_slots?.length > 0 && (
        <>
          <SectionLabel>Today's Schedule</SectionLabel>
          {data.todays_slots.map((sl,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"110px 10px 1fr", gap:10, alignItems:"center", marginBottom:7, fontSize:13 }}>
              <span style={{ color:C.text2 }}>{sl.from} - {sl.to}</span>
              <span style={{ width:7, height:7, borderRadius:"50%", background:statusClr(sl.status), flexShrink:0, boxShadow:`0 0 4px ${statusClr(sl.status)}` }} />
              <span style={{ color:C.text }}>{sl.label || statusLbl(sl.status)}</span>
            </div>
          ))}
        </>
      )}
    </Card>
  )
}

export function Timeline({ data }) {
  const START=8*60, END=19*60, TOTAL=END-START
  const now = nowMins()
  return (
    <Card>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, gap:12 }}>
        <CardTitle icon={<IconBubble><Clock3 size={22} /></IconBubble>} title={data.entity_name} subtitle={`${data.entity_type} timeline`} />
        <span style={{ color:C.cyan, fontSize:12, fontWeight:700, paddingTop:6 }}>{data.current_time}</span>
      </div>
      <div style={{ position:"relative", height:30, borderRadius:8, overflow:"hidden", background:C.navy, marginBottom:8, border:`1px solid ${C.border}` }}>
        {data.slots?.map((sl,i) => {
          const l = Math.max(0,(toMins(sl.from)-START)/TOTAL*100)
          const w = Math.min(100-l,(toMins(sl.to)-toMins(sl.from))/TOTAL*100)
          return <div key={i} style={{ position:"absolute", top:0, height:"100%", left:`${l}%`, width:`${w}%`, background:statusClr(sl.status)+"CC" }} title={sl.label||sl.status} />
        })}
        {now >= START && now <= END && (
          <div style={{ position:"absolute", top:0, left:`${(now-START)/TOTAL*100}%`, width:2, height:"100%", background:"#fff", opacity:.9 }} />
        )}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", color:C.text2, fontSize:11, marginBottom:14 }}>
        <span>8:00 AM</span><span>12:00 PM</span><span>3:00 PM</span><span>7:00 PM</span>
      </div>
      <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        {[["in_office","In Office"],["available","Available"],["teaching","Teaching"],["meeting","Meeting"],["occupied","Occupied"]].map(([s,l]) => (
          <div key={s} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.text2 }}>
            <div style={{ width:10,height:10,borderRadius:3,background:statusClr(s) }} />{l}
          </div>
        ))}
      </div>
    </Card>
  )
}

export function MapThumbnail({ data }) {
  return (
    <Card>
      <CardTitle icon={<IconBubble><MapPin size={22} /></IconBubble>} title={data.room_name} subtitle={data.landmark} />
      <div style={{ display:"flex", flexDirection:"column-reverse", gap:6, alignItems:"center", marginTop:18 }}>
        {[1,2,3,4,5].map(f => (
          <div key={f} style={{ width:"100%", maxWidth:240, minHeight:32, borderRadius:8, background: f===data.floor ? C.cyan : C.border, border:`1px solid ${f===data.floor?C.cyan:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color: f===data.floor?C.navy:C.text2, fontSize:12, fontWeight: f===data.floor?800:500, transition:"all .3s" }}>
            {f===data.floor ? <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}><Navigation size={14} /> Floor {f} · You're heading here</span> : `Floor ${f}`}
          </div>
        ))}
      </div>
      <div style={{ marginTop:10, color:C.text2, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><MapPin size={12} /> FSKTM building - destination highlighted</div>
    </Card>
  )
}

export function ContextPanel({ data }) {
  return (
    <Card>
      <SectionLabel>Related Info</SectionLabel>
      <div style={{ display:"flex", flexDirection:"column", gap:13, marginTop:4 }}>
        {data.items?.map((item,i) => (
          <div key={i} style={{ paddingBottom:i < data.items.length - 1 ? 12 : 0, borderBottom:i < data.items.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ color:C.text2, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:800 }}>{item.label}</div>
            <div style={{ color:C.text, fontSize:14, marginTop:4, lineHeight:1.4 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function StatusDashboard({ data }) {
  return (
    <Card>
      <CardTitle icon={<IconBubble><Layers3 size={22} /></IconBubble>} title="Status Overview" subtitle="Current room and professor status" />
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16 }}>
        {data.rows?.map((row,i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderRadius:12, background:C.navy, border:`1px solid ${C.border}`, gap:12 }}>
            <div>
              <div style={{ color:C.text, fontWeight:700, fontSize:15 }}>{row.name}</div>
              {row.detail && <div style={{ color:C.text2, fontSize:12, marginTop:2 }}>{row.detail}</div>}
            </div>
            <StatusBadge status={row.status} />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function OccupancyGrid({ data }) {
  return (
    <Card>
      <CardTitle icon={<IconBubble><Grid3X3 size={22} /></IconBubble>} title={data.title} subtitle="Availability by time block" />
      <div style={{ overflowX:"auto", marginTop:16 }}>
        <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 6px", fontSize:12 }}>
          <thead>
            <tr>
              <th style={{ textAlign:"left", padding:"4px 8px", color:C.text2, fontWeight:700, minWidth:120 }}>Room</th>
              {data.time_blocks?.map((t,i) => <th key={i} style={{ padding:"4px 8px", color:C.text2, fontWeight:600, textAlign:"center", minWidth:70 }}>{t}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.rows?.map((row,i) => (
              <tr key={i}>
                <td style={{ padding:"8px", background:C.navy, borderRadius:"8px 0 0 8px" }}>
                  <div style={{ color:C.text, fontWeight:700 }}>{row.name}</div>
                  <div style={{ color:C.text2, fontSize:11 }}>Floor {row.floor}</div>
                </td>
                {row.slots?.map((sl,j) => (
                  <td key={j} style={{ padding:"6px 8px", textAlign:"center", background:C.navy, borderRadius:j === row.slots.length - 1 ? "0 8px 8px 0" : 0 }}>
                    <div style={{ borderRadius:999, padding:"6px 8px", background: sl==="available"?C.green+"22":C.red+"22", border:`1px solid ${sl==="available"?C.green+"66":C.red+"66"}`, color: sl==="available"?C.green:C.red, fontSize:11, fontWeight:800 }}>
                      {sl==="available"?"Free":"Busy"}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function ActionChips({ data, onChipClick }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      {data.chips?.map((chip,i) => (
        <button key={i} onClick={() => onChipClick(chip.label)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:"8px 16px", color:C.text2, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", fontWeight:700 }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.cyan;e.currentTarget.style.color=C.cyan}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text2}}
        >{chip.label}</button>
      ))}
    </div>
  )
}

export function EventList({ data }) {
  return (
    <Card>
      <CardTitle icon={<IconBubble><CalendarDays size={22} /></IconBubble>} title="Today's Events at FSKTM" subtitle="Events currently listed for today" />
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:16 }}>
        {data.events?.map((ev,i) => (
          <div key={i} style={{ padding:"14px 16px", borderRadius:12, background:C.navy, border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
              <div style={{ color:C.text, fontWeight:700, fontSize:15 }}>{ev.title}</div>
              <div style={{ color:C.cyan, fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>{ev.from} - {ev.to}</div>
            </div>
            <div style={{ color:C.text2, fontSize:12, marginTop:6, display:"flex", alignItems:"center", gap:6 }}><MapPin size={13} /> {ev.location}</div>
            <div style={{ color:C.text2, fontSize:12, marginTop:5, lineHeight:1.45 }}>{ev.description}</div>
            <div style={{ color:C.text2, fontSize:11, marginTop:6, fontStyle:"italic" }}>Open to: {ev.open_to}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function OutOfScopeCard({ data }) {
  return (
    <Card sx={{ textAlign:"center", padding:"36px 28px" }}>
      <div style={{ width:52, height:52, margin:"0 auto 14px", borderRadius:"50%", background:C.red+"18", border:`1px solid ${C.red}55`, color:C.red, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <HelpCircle size={28} />
      </div>
      <div style={{ color:C.text, fontSize:17, fontWeight:600, marginBottom:10, lineHeight:1.5 }}>{data.message}</div>
      <div style={{ color:C.text2, fontSize:13, display:"flex", justifyContent:"center", alignItems:"center", gap:7 }}><Info size={14} /> I can help with room finding, professor availability, room bookings, and today's schedule.</div>
    </Card>
  )
}
