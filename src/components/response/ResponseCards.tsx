import { useState } from "react"
import {
  BookOpen,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  Grid3X3,
  HelpCircle,
  Info,
  Layers3,
  List,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Search,
  Table2,
  UserRound,
} from "lucide-react"

import { C, statusClr, statusLbl } from "../../theme"
import { T, statusT } from "../../utils/translations"

function ambientShadow(status: string): string {
  const clr = statusClr(status)
  return `inset 0 1px 0 rgba(255,255,255,.07), 0 0 0 1px rgba(0,196,232,.04), 0 32px 80px rgba(0,0,0,.50), 0 4px 24px ${clr}22`
}
import { nowMins, toMins } from "../../utils/schedule"
import { Card, Chip, SectionLabel, StatusBadge } from "../uiPrimitives"

function IconBubble({ children, color = C.cyan }) {
  return (
    <div style={{ width:42, height:42, borderRadius:12, background:`linear-gradient(135deg, ${color}25, ${color}12)`, border:`1px solid ${color}44`, color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 0 0 1px ${color}20, 0 4px 10px ${color}12` }}>
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
      <div style={{ width:60, height:60, margin:"0 auto 18px", borderRadius:18, background:`linear-gradient(145deg, ${C.cyan}28, ${C.cyan}12)`, border:`1px solid ${C.cyan}50`, boxShadow:`0 0 0 6px ${C.cyan}0C, 0 12px 32px ${C.cyan}22`, color:C.cyan, display:"flex", alignItems:"center", justifyContent:"center" }}>
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

export function StepIndicator({ data, lang = "EN" }) {
  const [step, setStep] = useState(0)
  const t = T(lang)
  return (
    <Card>
      <CardTitle
        icon={<IconBubble><Navigation size={22} /></IconBubble>}
        title={t.directionsTo(data.destination)}
        subtitle={t.followSteps}
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
          ? <button onClick={() => setStep(s=>s+1)} style={{ width:"100%", background:C.cyan, border:"none", borderRadius:10, padding:"13px", color:C.navy, fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>{t.nextStep}</button>
          : <div style={{ textAlign:"center", color:C.green, fontWeight:800, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Check size={18} /> {t.youHaveArrived}</div>
        }
      </div>
    </Card>
  )
}

export function RoomCard({ data, lang = "EN" }) {
  const t = T(lang)
  return (
    <Card sx={{ boxShadow: ambientShadow(data.status) }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, gap:12 }}>
        <CardTitle
          icon={<IconBubble><Building2 size={22} /></IconBubble>}
          title={data.name}
          subtitle={t.floorTypeCap(data.floor, data.type_label, data.capacity)}
        />
        <StatusBadge status={data.status} label={statusT(lang, data.status)} />
      </div>
      {data.current_class && <div style={{ color:C.yellow, fontSize:13, marginBottom:10, display:"flex", alignItems:"center", gap:7 }}><BookOpen size={15} /> {t.currentlyClass(data.current_class)}</div>}
      {data.occupied_until && data.status==="occupied" && <div style={{ color:C.text2, fontSize:13, marginBottom:6 }}>{t.occupiedUntil(data.occupied_until)}</div>}
      {data.available_from && data.status==="occupied" && <div style={{ color:C.green, fontSize:13, marginBottom:10 }}>{t.freeFrom(data.available_from)}</div>}
      {data.features?.length > 0 && (
        <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginTop:14 }}>
          {data.features.map((f,i) => <Chip key={i} label={f} color={C.text2} />)}
        </div>
      )}
    </Card>
  )
}

export function ProfessorCard({ data, lang = "EN" }) {
  const t = T(lang)
  return (
    <Card sx={{ boxShadow: ambientShadow(data.status) }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, gap:12 }}>
        <CardTitle
          icon={
            data.photo
              ? <img src={data.photo} alt={data.name} style={{ width:42, height:42, borderRadius:12, objectFit:"cover", border:`1px solid ${C.border}`, flexShrink:0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display="none" }} />
              : <IconBubble><UserRound size={22} /></IconBubble>
          }
          title={data.name}
          subtitle={`${data.title} · ${data.department}`}
        />
        <StatusBadge status={data.status} label={statusT(lang, data.status)} />
      </div>
      <div style={{ color:C.text2, fontSize:13, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}><MapPin size={14} /> {data.office}</div>
      {data.current_activity && <div style={{ color:C.yellow, fontSize:13, marginBottom:12 }}>{data.current_activity}</div>}
      {data.todays_slots?.length > 0 && (
        <>
          <SectionLabel>{t.todaySchedule}</SectionLabel>
          {data.todays_slots.map((sl,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"110px 10px 1fr", gap:10, alignItems:"center", marginBottom:7, fontSize:13 }}>
              <span style={{ color:C.text2 }}>{sl.from} - {sl.to}</span>
              <span style={{ width:7, height:7, borderRadius:"50%", background:statusClr(sl.status), flexShrink:0, boxShadow:`0 0 4px ${statusClr(sl.status)}` }} />
              <span style={{ color:C.text }}>{sl.label || statusT(lang, sl.status)}</span>
            </div>
          ))}
        </>
      )}
    </Card>
  )
}

export function Timeline({ data, lang = "EN" }) {
  const START=8*60, END=19*60, TOTAL=END-START
  const now = nowMins()
  const t = T(lang)
  const roomOrder   = ["available","occupied"]
  const profOrder   = ["in_office","teaching","meeting","unavailable"]
  const order       = data.entity_type === "room" ? roomOrder : profOrder
  const legendKeys  = order.filter(k => data.slots?.some((s: any) => s.status === k))
  return (
    <Card>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, gap:12 }}>
        <CardTitle icon={<IconBubble><Clock3 size={22} /></IconBubble>} title={data.entity_name} subtitle={t.timeline_subtitle(data.entity_type)} />
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
        {legendKeys.map(s => (
          <div key={s} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.text2 }}>
            <div style={{ width:10,height:10,borderRadius:3,background:statusClr(s) }} />{statusT(lang, s)}
          </div>
        ))}
      </div>
    </Card>
  )
}

export function MapThumbnail({ data, lang = "EN" }) {
  const t = T(lang)
  return (
    <Card>
      <CardTitle icon={<IconBubble><MapPin size={22} /></IconBubble>} title={data.room_name} subtitle={data.landmark} />
      <div style={{ display:"flex", flexDirection:"column-reverse", gap:6, alignItems:"center", marginTop:18 }}>
        {[1,2,3,4,5].map(f => (
          <div key={f} style={{ width:"100%", maxWidth:240, minHeight:32, borderRadius:8, background: f===data.floor ? `linear-gradient(135deg, ${C.cyan}E8, ${C.cyan}A0)` : `linear-gradient(135deg, ${C.border}80, ${C.border}40)`, border:`1px solid ${f===data.floor ? C.cyan+"AA" : C.border+"40"}`, boxShadow: f===data.floor ? `0 0 0 1px ${C.cyan}33, 0 4px 20px ${C.cyan}35` : "none", display:"flex", alignItems:"center", justifyContent:"center", color: f===data.floor?C.navy:C.text2, fontSize:12, fontWeight: f===data.floor?800:500, transition:"all .3s" }}>
            {f===data.floor ? <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}><Navigation size={14} /> {t.floorHeadingHere(f)}</span> : `Floor ${f}`}
          </div>
        ))}
      </div>
      <div style={{ marginTop:10, color:C.text2, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><MapPin size={12} /> FSKTM building - destination highlighted</div>
    </Card>
  )
}

export function ContextPanel({ data, lang = "EN" }) {
  return (
    <Card>
      <SectionLabel>{T(lang).relatedInfo}</SectionLabel>
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

export function AnswerCard({ data }) {
  const toneColor = data.tone === "success" ? C.green : data.tone === "warning" ? C.yellow : C.cyan
  return (
    <Card>
      <CardTitle icon={<IconBubble color={toneColor}><Info size={22} /></IconBubble>} title={data.title} subtitle={data.answer} />
      {data.facts?.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:10, marginTop:16 }}>
          {data.facts.map((fact,i) => (
            <div key={i} style={{ padding:"12px 14px", borderRadius:10, background:C.navy, border:`1px solid ${C.border}` }}>
              <div style={{ color:C.text2, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:800 }}>{fact.label}</div>
              <div style={{ color:C.text, fontSize:16, marginTop:4, fontWeight:800 }}>{fact.value}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export function ContactCard({ data, lang = "EN" }) {
  const t = T(lang)
  return (
    <Card>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:16 }}>
        <CardTitle
          icon={
            data.photo
              ? <img src={data.photo} alt={data.name} style={{ width:42, height:42, borderRadius:12, objectFit:"cover", border:`1px solid ${C.border}`, flexShrink:0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display="none" }} />
              : <IconBubble><UserRound size={22} /></IconBubble>
          }
          title={data.name}
          subtitle={`${data.role} - ${data.department}`}
        />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(190px, 1fr))", gap:10 }}>
        <div style={{ padding:"13px 14px", borderRadius:10, background:C.navy, border:`1px solid ${C.border}` }}>
          <div style={{ color:C.text2, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:800, marginBottom:6 }}>{t.emailLabel}</div>
          <div style={{ color:C.text, fontSize:15, fontWeight:800, display:"flex", alignItems:"center", gap:8, wordBreak:"break-word" }}><Mail size={15} /> {data.email}</div>
        </div>
        <div style={{ padding:"13px 14px", borderRadius:10, background:C.navy, border:`1px solid ${C.border}` }}>
          <div style={{ color:C.text2, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:800, marginBottom:6 }}>{t.officeLabel}</div>
          <div style={{ color:C.text, fontSize:15, fontWeight:800, display:"flex", alignItems:"center", gap:8 }}><MapPin size={15} /> {data.office}</div>
        </div>
      </div>
      {data.research && (
        <div style={{ marginTop:12, color:C.text2, fontSize:13, lineHeight:1.5 }}>
          <span style={{ color:C.text, fontWeight:800 }}>{t.researchLabel}: </span>{data.research}
        </div>
      )}
    </Card>
  )
}

export function DirectoryList({ data }) {
  return (
    <Card>
      <CardTitle icon={<IconBubble><List size={22} /></IconBubble>} title={data.title} subtitle={data.subtitle} />
      <div style={{ display:"flex", flexDirection:"column", gap:9, marginTop:16 }}>
        {data.items?.map((item,i) => (
          <div key={item.id || i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"12px 14px", borderRadius:10, background:C.navy, border:`1px solid ${C.border}` }}>
            <div>
              <div style={{ color:C.text, fontSize:15, fontWeight:800 }}>{item.label}</div>
              {item.detail && <div style={{ color:C.text2, fontSize:12, marginTop:3, lineHeight:1.4 }}>{item.detail}</div>}
              {item.meta?.length > 0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
                  {item.meta.slice(0,4).map((m,j) => <Chip key={j} label={m} color={C.text2} />)}
                </div>
              )}
            </div>
            {item.status && <StatusBadge status={item.status} />}
          </div>
        ))}
      </div>
    </Card>
  )
}

export function MetricStrip({ data }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:10 }}>
      {data.metrics?.slice(0,4).map((metric,i) => {
        const color = metric.status ? statusClr(metric.status) : C.cyan
        return (
          <div key={i} style={{ padding:"15px 16px", borderRadius:12, background:C.card, border:`1px solid ${C.border}`, boxShadow:`inset 0 1px 0 rgba(255,255,255,.06), 0 4px 18px ${color}10` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
              <div style={{ color:C.text2, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:800 }}>{metric.label}</div>
              <BarChart3 size={15} color={color} />
            </div>
            <div style={{ color:C.text, fontSize:26, fontWeight:900, marginTop:7, lineHeight:1 }}>{metric.value}</div>
            {metric.detail && <div style={{ color:C.text2, fontSize:12, marginTop:6 }}>{metric.detail}</div>}
          </div>
        )
      })}
    </div>
  )
}

export function ComparisonTable({ data, lang = "EN" }) {
  const t = T(lang)
  return (
    <Card>
      <CardTitle icon={<IconBubble><Table2 size={22} /></IconBubble>} title={data.title} subtitle={t.comparisonSubtitle} />
      <div style={{ overflowX:"auto", marginTop:16 }}>
        <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 6px", fontSize:13 }}>
          <thead>
            <tr>
              <th style={{ textAlign:"left", padding:"4px 8px", color:C.text2, fontWeight:800, minWidth:130 }}>{t.fieldLabel}</th>
              {data.columns?.map((col,i) => <th key={i} style={{ textAlign:"left", padding:"4px 8px", color:C.text2, fontWeight:800, minWidth:150 }}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.rows?.map((row,i) => (
              <tr key={i}>
                <td style={{ padding:"10px 8px", color:C.text2, fontWeight:800, background:C.navy, borderRadius:"8px 0 0 8px" }}>{row.label}</td>
                {row.values?.map((value,j) => (
                  <td key={j} style={{ padding:"10px 8px", color:C.text, background:C.navy, borderRadius:j === row.values.length - 1 ? "0 8px 8px 0" : 0 }}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function StatusDashboard({ data, lang = "EN" }) {
  const t = T(lang)
  return (
    <Card>
      <CardTitle icon={<IconBubble><Layers3 size={22} /></IconBubble>} title={t.statusOverview} subtitle={t.currentStatus} />
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16 }}>
        {data.rows?.map((row,i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderRadius:12, background:C.navy, border:`1px solid ${C.border}`, gap:12, boxShadow:`inset 0 1px 0 rgba(255,255,255,.03), 0 2px 8px ${statusClr(row.status)}10` }}>
            <div>
              <div style={{ color:C.text, fontWeight:700, fontSize:15 }}>{row.name}</div>
              {row.detail && <div style={{ color:C.text2, fontSize:12, marginTop:2 }}>{row.detail}</div>}
            </div>
            <StatusBadge status={row.status} label={statusT(lang, row.status)} />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function OccupancyGrid({ data, lang = "EN" }) {
  const t = T(lang)
  return (
    <Card>
      <CardTitle icon={<IconBubble><Grid3X3 size={22} /></IconBubble>} title={data.title} subtitle={t.availabilityByTime} />
      <div style={{ overflowX:"auto", marginTop:16 }}>
        <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 6px", fontSize:12 }}>
          <thead>
            <tr>
              <th style={{ textAlign:"left", padding:"4px 8px", color:C.text2, fontWeight:700, minWidth:120 }}>{t.room}</th>
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
                    <div style={{ borderRadius:999, padding:"6px 8px", background: sl==="available" ? `linear-gradient(135deg, ${C.green}28, ${C.green}14)` : `linear-gradient(135deg, ${C.red}28, ${C.red}14)`, border:`1px solid ${sl==="available" ? C.green+"55" : C.red+"55"}`, boxShadow:`0 2px 6px ${sl==="available" ? C.green+"18" : C.red+"18"}`, color: sl==="available"?C.green:C.red, fontSize:11, fontWeight:800 }}>
                      {sl==="available" ? t.free : t.busy}
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
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.cyan;e.currentTarget.style.color=C.cyan;e.currentTarget.style.boxShadow=`0 2px 12px ${C.cyan}20`}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text2;e.currentTarget.style.boxShadow="none"}}
        >{chip.label}</button>
      ))}
    </div>
  )
}

export function EventList({ data, lang = "EN" }) {
  const t = T(lang)
  return (
    <Card>
      <CardTitle icon={<IconBubble><CalendarDays size={22} /></IconBubble>} title={t.eventsTitle} subtitle={t.eventsSubtitle} />
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:16 }}>
        {data.events?.map((ev,i) => (
          <div key={i} style={{ padding:"14px 16px", borderRadius:12, background:`linear-gradient(165deg, ${C.card} 0%, #050E1A 100%)`, border:`1px solid ${C.border}`, boxShadow:"inset 0 1px 0 rgba(255,255,255,.05), 0 4px 16px rgba(0,0,0,.25)" }}>
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

export function OutOfScopeCard({ data, lang = "EN" }) {
  return (
    <Card sx={{ textAlign:"center", padding:"36px 28px" }}>
      <div style={{ width:60, height:60, margin:"0 auto 18px", borderRadius:18, background:`linear-gradient(145deg, ${C.red}28, ${C.red}12)`, border:`1px solid ${C.red}50`, boxShadow:`0 0 0 6px ${C.red}0C, 0 12px 32px ${C.red}22`, color:C.red, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <HelpCircle size={28} />
      </div>
      <div style={{ color:C.text, fontSize:17, fontWeight:600, marginBottom:10, lineHeight:1.5 }}>{data.message}</div>
      <div style={{ color:C.text2, fontSize:13, display:"flex", justifyContent:"center", alignItems:"center", gap:7 }}><Info size={14} /> {T(lang).outOfScopeHelp}</div>
    </Card>
  )
}
