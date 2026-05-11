import { Building2, CalendarDays, DoorOpen, Mic, MicOff, Send, Square, UserRound } from "lucide-react"

import { C, modeClr, shadow } from "../theme"

const iconButtonStyle = (active = false, disabled = false) => ({
  width: 46,
  height: 46,
  borderRadius: "50%",
  background: active ? C.red : C.card,
  border: `2px solid ${active ? C.red : C.border}`,
  color: active ? C.text : C.cyan,
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all .2s",
  flexShrink: 0,
})

const suggestionChips = [
  { label: "Find Lab 302", prompt: "Where is Lab 302?", Icon: Building2 },
  { label: "Professor status", prompt: "Is Prof. Amirah in her office?", Icon: UserRound },
  { label: "Free rooms", prompt: "Which rooms are available now?", Icon: DoorOpen },
  { label: "Today's events", prompt: "What events are happening today?", Icon: CalendarDays },
]

export function Shell({ mode, language, setLanguage, time, onStartOver, showStartOver, textScale, onTextScaleToggle }) {
  const modeColor = mode ? modeClr(mode) : C.text2

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:60, background:`linear-gradient(180deg, ${C.navy}F8, ${C.navy}EA)`, backdropFilter:"blur(32px) saturate(200%)", borderBottom:"1px solid rgba(255,255,255,.08)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", boxShadow:shadow.shell }}>
      <div style={{ fontWeight:900, fontSize:22, color:C.cyan, letterSpacing:"0.15em", fontFamily:"monospace", textShadow:`0 0 24px ${C.cyan}55, 0 0 8px ${C.cyan}33` }}>ARIA</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", flex:1 }}>
        <div style={{ background: mode ? `linear-gradient(135deg, ${modeColor}28, ${modeColor}10)` : "transparent", border:`1px solid ${mode ? modeColor+"55" : C.border}`, boxShadow: mode ? `0 0 0 1px ${modeColor}15, 0 4px 24px ${modeColor}18` : "none", borderRadius:20, padding:"4px 16px", color:modeColor, fontSize:12, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", transition:"all .5s", minWidth:90, textAlign:"center", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:modeColor, display:"inline-block", boxShadow: mode ? `0 0 8px ${modeColor}` : "none" }} />
          {mode || "idle"}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ color:C.text2, fontSize:12, fontWeight:500 }}>{time}</div>
        {showStartOver && (
          <button
            onClick={onStartOver}
            style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 12px", color:C.text2, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", letterSpacing:"0.04em" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.cyan;(e.currentTarget as HTMLButtonElement).style.color=C.cyan;(e.currentTarget as HTMLButtonElement).style.boxShadow=`0 2px 12px ${C.cyan}18`}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.color=C.text2;(e.currentTarget as HTMLButtonElement).style.boxShadow="none"}}
          >
            Start Over
          </button>
        )}
        <button
          onClick={onTextScaleToggle}
          title={textScale > 1 ? "Normal text size" : "Larger text size"}
          style={{ background: textScale > 1 ? C.cyan+"22" : "transparent", border:`1px solid ${textScale > 1 ? C.cyan : C.border}`, borderRadius:8, padding:"5px 10px", color: textScale > 1 ? C.cyan : C.text2, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", letterSpacing:"0.02em" }}
        >
          Aa
        </button>
        <div style={{ display:"flex", gap:2, background:C.card, borderRadius:8, padding:3, border:`1px solid ${C.border}` }}>
          {["EN","BM","ZH"].map(l => (
            <button key={l} onClick={()=>setLanguage(l)} style={{ background: l===language?C.cyan:"transparent", border:"none", borderRadius:6, padding:"4px 10px", color: l===language?C.navy:C.text2, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function WelcomeScreen({ onOrbClick, inputText, setInputText, onSend, isRecording, onMicToggle, micAvailable, urgentPulse }) {
  const orbAnim = isRecording
    ? "orbActive 1.2s ease-in-out infinite"
    : urgentPulse
      ? "orbUrgent 1.8s ease-in-out infinite"
      : "orbIdle 3s ease-in-out infinite"

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, padding:"80px 28px 40px" }}>
      <div style={{ textAlign:"center", marginBottom:44, animation:"fadeUp .6s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ fontSize:13, color:C.cyan, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:14, opacity:0.85 }}>FSKTM · Universiti Malaya</div>
        <div style={{ fontSize:38, fontWeight:800, letterSpacing:"-0.02em", lineHeight:1.2, background:`linear-gradient(135deg, ${C.text} 40%, ${C.cyan}CC 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Hello, I'm ARIA</div>
        <div style={{ color:C.text2, fontSize:15, marginTop:12, lineHeight:1.7, maxWidth:420 }}>
          I can help you find rooms, check professor availability,<br/>view room bookings, and see today's schedule.
        </div>
      </div>

      <button onClick={onOrbClick} style={{ width:130, height:130, borderRadius:"50%", border:`1.5px solid ${C.cyan}AA`, background:`radial-gradient(circle at 28% 25%, ${C.cyan}E0 0%, ${C.cyan}55 35%, #0A1F33 70%, ${C.navy} 100%)`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", animation: orbAnim, marginBottom:16, userSelect:"none", flexShrink:0, color:C.text }}>
        {isRecording ? <Square size={42} fill="currentColor" /> : <Mic size={46} strokeWidth={1.8} />}
      </button>
      <div style={{ color: isRecording ? C.red : urgentPulse ? C.cyan : C.text2, fontSize:13, marginBottom:34, fontWeight: isRecording||urgentPulse ? 600 : 400, transition:"color .3s", letterSpacing:"0.02em" }}>
        {isRecording ? "Listening — tap to stop" : urgentPulse ? "Still here? Tap the orb or type below" : "Tap the orb to speak"}
      </div>

      <div style={{ display:"flex", gap:8, width:"100%", maxWidth:600, animation:"fadeUp .6s cubic-bezier(0.22,1,0.36,1) .15s both" }}>
        {micAvailable && (
          <button onClick={onMicToggle} style={iconButtonStyle(isRecording)} aria-label={isRecording ? "Stop recording" : "Start voice input"}>
            {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={20} />}
          </button>
        )}
        <input value={inputText} onChange={e=>setInputText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&inputText.trim()&&onSend(inputText)}
          placeholder="Or type your question here..."
          style={{ flex:1, background:C.card, border:`1.5px solid ${isRecording?C.cyan:C.border}`, borderRadius:12, padding:"14px 18px", color:C.text, fontSize:15, outline:"none", fontFamily:"inherit", boxShadow:`inset 0 1px 0 rgba(255,255,255,.04), 0 8px 24px rgba(0,0,0,.2)`, transition:"border-color .2s, box-shadow .2s" }}
        />
        <button onClick={()=>inputText.trim()&&onSend(inputText)} style={{ background: inputText.trim()?C.cyan:C.border, border:"none", borderRadius:12, padding:"14px 20px", color: inputText.trim()?C.navy:C.text2, fontWeight:700, cursor: inputText.trim()?"pointer":"default", fontSize:15, fontFamily:"inherit", transition:"all .2s", display:"flex", alignItems:"center", gap:8, boxShadow: inputText.trim()?`0 8px 24px ${C.cyan}35`:"none" }}>
          <Send size={17} /> Send
        </button>
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", width:"100%", maxWidth:680, marginTop:18, animation:"fadeUp .6s cubic-bezier(0.22,1,0.36,1) .28s both" }}>
        {suggestionChips.map(({ label, prompt, Icon }) => (
          <button key={label} onClick={()=>onSend(prompt)} style={{ display:"inline-flex", alignItems:"center", gap:7, background:`linear-gradient(135deg, ${C.card}E0, ${C.card}C0)`, border:`1px solid ${C.border}`, borderRadius:999, padding:"8px 14px", color:C.text2, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit", transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.cyan;e.currentTarget.style.color=C.cyan;e.currentTarget.style.boxShadow=`0 2px 12px ${C.cyan}18`}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text2;e.currentTarget.style.boxShadow="none"}}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function InputBar({ onSend, isRecording, onMicToggle, inputText, setInputText, isLoading, micAvailable, inputRef }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:`linear-gradient(0deg, ${C.navy}F8, ${C.navy}EA)`, backdropFilter:"blur(32px) saturate(200%)", borderTop:"1px solid rgba(255,255,255,.08)", padding:"12px 24px", boxShadow:shadow.inputBar }}>
      <div style={{ position:"absolute", top:-26, left:24, display:"flex", alignItems:"center", gap:5, color:C.text2, fontSize:11 }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:C.green, display:"inline-block", boxShadow:`0 0 6px ${C.green}` }} />No data saved this session
      </div>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        {micAvailable ? (
          <button onClick={onMicToggle} disabled={isLoading} style={{ ...iconButtonStyle(isRecording, isLoading), boxShadow: isRecording?`0 0 16px ${C.red}55`:"none", animation: isRecording?"orbActive 1.2s ease-in-out infinite":"none" }} aria-label={isRecording ? "Stop recording" : "Start voice input"}>
            {isRecording ? <Square size={17} fill="currentColor" /> : <Mic size={19} />}
          </button>
        ) : (
          <div style={{ width:46, height:46, borderRadius:"50%", background:C.card, border:`2px solid ${C.border}`, color:C.text2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }} aria-label="Voice input unavailable"><MicOff size={19} /></div>
        )}
        <input
          ref={inputRef}
          value={inputText} onChange={e=>setInputText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!isLoading&&inputText.trim()&&onSend(inputText)}
          disabled={isLoading}
          placeholder={isRecording ? "Listening — speak now, then stop recording" : "Type or speak your follow-up question"}
          style={{ flex:1, background:C.card, border:`1.5px solid ${isRecording?C.cyan:C.border}`, borderRadius:12, padding:"12px 16px", color:C.text, fontSize:15, outline:"none", fontFamily:"inherit", transition:"border-color .2s", boxShadow:`inset 0 1px 0 rgba(255,255,255,.04)` }}
        />
        <button onClick={()=>!isLoading&&inputText.trim()&&onSend(inputText)} disabled={isLoading||!inputText.trim()} style={{ background: inputText.trim()&&!isLoading?C.cyan:C.border, border:"none", borderRadius:12, padding:"12px 22px", color: inputText.trim()&&!isLoading?C.navy:C.text2, fontWeight:700, cursor: inputText.trim()&&!isLoading?"pointer":"not-allowed", fontSize:15, fontFamily:"inherit", transition:"all .2s", whiteSpace:"nowrap", boxShadow: inputText.trim()&&!isLoading?`0 6px 20px ${C.cyan}35`:"none" }}>
          {isLoading ? "..." : <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>Send <Send size={16} /></span>}
        </button>
      </div>
    </div>
  )
}
