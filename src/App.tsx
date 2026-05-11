import { Fragment, useCallback, useEffect, useRef, useState } from "react"

import { Shell, WelcomeScreen, InputBar } from "./components/appShell"
import { ComponentRenderer, SkeletonLoader } from "./components/response"
import { callClaude } from "./services/claudeApi"
import { createLocalFallbackResponse } from "./services/localFallback"
import { buildSystemPrompt } from "./services/systemPrompt"
import type { AriAMode, AriaComponent, AriaIntent } from "./types/aria"
import { C } from "./theme"

type Turn = {
  id: number
  query: string
  components: AriaComponent[]
  mode: AriAMode
  intent?: AriaIntent | null
  error?: string | null
}

function getTurnOpacity(idx: number, total: number): number {
  const distFromLatest = total - 1 - idx
  const steps = [1.0, 0.75, 0.55, 0.40, 0.30]
  return steps[Math.min(distFromLatest, steps.length - 1)]
}

const intentLabel: Record<string, string> = {
  room_finding: "Room Finding",
  professor_finding: "Professor",
  room_availability: "Room Availability",
  schedule: "Schedule",
  out_of_scope: "General",
}

export default function ARIAApp() {
  const [phase, setPhase] = useState<"welcome"|"loading"|"conversation">("welcome")
  const [mode, setMode] = useState<AriAMode|null>(null)
  const [language, setLanguage] = useState("EN")
  const [turns, setTurns] = useState<Turn[]>([])
  const [pendingQuery, setPendingQuery] = useState("")
  const [context, setContext] = useState({ turn:0, intent_history:[], context_summary:"No prior context." })
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState([])
  const [time, setTime] = useState("")
  const [micAvailable, setMicAvailable] = useState(false)
  const [showIdleOverlay, setShowIdleOverlay] = useState(false)
  const [idleCountdown, setIdleCountdown] = useState(10)
  const [textScale, setTextScale] = useState(1)
  const [collapsedTurns, setCollapsedTurns] = useState<Set<number>>(new Set())
  const [welcomeUrgentPulse, setWelcomeUrgentPulse] = useState(false)

  const recRef = useRef(null)
  const turnIdRef = useRef(0)
  const threadRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const welcomeIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // clock
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setTime(n.toLocaleTimeString("en-MY",{hour:"2-digit",minute:"2-digit",hour12:true}) + " · " + n.toLocaleDateString("en-MY",{weekday:"short",day:"numeric",month:"short"}))
    }
    tick(); const id = setInterval(tick,30000); return ()=>clearInterval(id)
  }, [])

  // mic check
  useEffect(() => { if ("SpeechRecognition" in window||"webkitSpeechRecognition" in window) setMicAvailable(true) }, [])

  // cleanup all timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(idleTimerRef.current!)
      clearInterval(countdownRef.current!)
      clearTimeout(welcomeIdleRef.current!)
    }
  }, [])

  // welcome screen idle: start orb urgency after 3 min of inactivity on welcome
  useEffect(() => {
    if (phase !== "welcome") {
      clearTimeout(welcomeIdleRef.current!)
      setWelcomeUrgentPulse(false)
      return
    }
    welcomeIdleRef.current = setTimeout(() => setWelcomeUrgentPulse(true), 3 * 60 * 1000)
    return () => clearTimeout(welcomeIdleRef.current!)
  }, [phase])

  // Ctrl+/ focuses the input bar from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // auto-scroll thread to bottom when turns change or skeleton appears
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" })
  }, [turns, phase])

  const handleReset = useCallback(() => {
    clearTimeout(idleTimerRef.current!)
    clearInterval(countdownRef.current!)
    setPhase("welcome")
    setTurns([])
    setMessages([])
    setContext({ turn:0, intent_history:[], context_summary:"No prior context." })
    setMode(null)
    setInputText("")
    setPendingQuery("")
    setShowIdleOverlay(false)
    setCollapsedTurns(new Set())
  }, [])

  const startIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current!)
    clearInterval(countdownRef.current!)
    setShowIdleOverlay(false)
    idleTimerRef.current = setTimeout(() => {
      setShowIdleOverlay(true)
      setIdleCountdown(10)
      let count = 10
      countdownRef.current = setInterval(() => {
        count -= 1
        setIdleCountdown(count)
        if (count <= 0) {
          clearInterval(countdownRef.current!)
          handleReset()
        }
      }, 1000)
    }, 60_000)
  }, [handleReset])

  // recording
  const toggleRecording = useCallback(() => {
    if (!micAvailable) return
    if (isRecording) { recRef.current?.stop(); setIsRecording(false); return }
    const SR = (window as any).SpeechRecognition||(window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.continuous=false; rec.interimResults=true; rec.lang="en-US"
    rec.onresult = e => setInputText(Array.from(e.results).map((r:any)=>r[0].transcript).join(""))
    rec.onend = () => setIsRecording(false)
    rec.onerror = () => setIsRecording(false)
    recRef.current=rec; rec.start(); setIsRecording(true)
  }, [isRecording, micAvailable])

  const sendQuery = useCallback(async (text: string, baseMsgs: any[]) => {
    if (!text.trim()) return
    setInputText(""); setIsRecording(false); recRef.current?.stop()
    setPendingQuery(text)
    setPhase("loading")
    startIdleTimer()

    const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const sys = buildSystemPrompt(context, language, time, days[new Date().getDay()])
    const newMsgs = [...baseMsgs, { role:"user", content:text }]
    setMessages(newMsgs)
    try {
      const result = await callClaude(newMsgs, sys)
      const newTurn: Turn = { id: ++turnIdRef.current, query: text, components: result.components||[], mode: result.mode, intent: result.intent||null, error: null }
      setTurns(prev => [...prev, newTurn].slice(-5))
      setMode(result.mode)
      setContext(result.context||context)
      setMessages([...newMsgs, { role:"assistant", content:JSON.stringify(result) }])
      setPhase("conversation")
    } catch(err) {
      console.error(err)
      const fallback = createLocalFallbackResponse(text, context)
      const newTurn: Turn = { id: ++turnIdRef.current, query: text, components: fallback.components||[], mode: fallback.mode, intent: (fallback as any).intent||null, error: "ARIA is using local fallback data because the AI service is unavailable." }
      setTurns(prev => [...prev, newTurn].slice(-5))
      setMode(fallback.mode)
      setContext(fallback.context||context)
      setMessages([...newMsgs, { role:"assistant", content:JSON.stringify(fallback) }])
      setPhase("conversation")
    }
  }, [context, language, time, startIdleTimer])

  const handleSend = useCallback((text: string) => {
    sendQuery(text, messages)
  }, [messages, sendQuery])

  const handleRetry = useCallback((turn: Turn) => {
    setTurns(prev => prev.filter(t => t.id !== turn.id))
    // find last occurrence of this user message and trim from there
    let trimIdx = -1
    for (let i = messages.length - 1; i >= 0; i--) {
      if ((messages[i] as any).role === "user" && (messages[i] as any).content === turn.query) {
        trimIdx = i; break
      }
    }
    const trimmed = trimIdx >= 0 ? messages.slice(0, trimIdx) : messages
    sendQuery(turn.query, trimmed)
  }, [messages, sendQuery])

  const toggleCollapse = useCallback((id: number) => {
    setCollapsedTurns(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const queryLabel = (text: string, turnId?: number, isCollapsed?: boolean) => (
    <div
      onClick={turnId !== undefined ? () => toggleCollapse(turnId) : undefined}
      style={{ display:"inline-flex", alignItems:"center", gap:6, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 11px", marginBottom: isCollapsed ? 0 : 12, color:C.text2, fontSize:12, fontWeight:500, cursor: turnId !== undefined ? "pointer" : "default", userSelect:"none" }}
    >
      <span style={{ width:5, height:5, borderRadius:"50%", background:C.cyan, display:"inline-block", opacity:0.7 }} />
      {text}
      {turnId !== undefined && (
        <span style={{ fontSize:10, marginLeft:2, transition:"transform .2s", display:"inline-block", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}>▾</span>
      )}
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", height:"100vh", background:`linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px),radial-gradient(ellipse 70% 40% at 15% 15%,rgba(0,196,232,.08) 0%,transparent 60%),radial-gradient(ellipse 55% 45% at 85% 80%,rgba(59,130,246,.05) 0%,transparent 60%),${C.navy}`, backgroundSize:"44px 44px,44px 44px,100% 100%,100% 100%,100% 100%", color:C.text, fontFamily:"'Inter',-apple-system,sans-serif", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes orbIdle{0%,100%{transform:scale(1);box-shadow:0 0 0 5px ${C.navy},0 0 0 6px ${C.cyan}22,0 0 40px ${C.cyan}44,0 0 90px ${C.cyan}22}50%{transform:scale(1.06);box-shadow:0 0 0 5px ${C.navy},0 0 0 6px ${C.cyan}33,0 0 65px ${C.cyan}66,0 0 130px ${C.cyan}33}}
        @keyframes orbActive{0%,100%{transform:scale(1);box-shadow:0 0 0 5px ${C.navy},0 0 0 6px ${C.red}22,0 0 30px ${C.red}66}50%{transform:scale(1.08);box-shadow:0 0 0 5px ${C.navy},0 0 0 6px ${C.red}33,0 0 55px ${C.red}99}}
        @keyframes orbUrgent{0%,100%{transform:scale(1);box-shadow:0 0 0 5px ${C.navy},0 0 0 6px ${C.cyan}33,0 0 60px ${C.cyan}77,0 0 140px ${C.cyan}44}50%{transform:scale(1.1);box-shadow:0 0 0 5px ${C.navy},0 0 0 6px ${C.cyan}55,0 0 90px ${C.cyan}AA,0 0 180px ${C.cyan}55}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder{color:${C.text2}}
        input{caret-color:${C.cyan}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(42,59,77,.8);border-radius:2px}::-webkit-scrollbar-thumb:hover{background:rgba(0,180,216,.35)}
      `}</style>

      <Shell
        mode={mode} language={language} setLanguage={setLanguage} time={time}
        onStartOver={handleReset} showStartOver={phase !== "welcome"}
        textScale={textScale} onTextScaleToggle={() => setTextScale(s => s === 1 ? 1.25 : 1)}
      />

      {/* paddingTop outside the zoom so header clearance is unaffected by scale */}
      <div style={{ flex:1, paddingTop:60, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", zoom: textScale as any }}>

          {phase==="welcome" && (
            <WelcomeScreen
              onOrbClick={toggleRecording}
              inputText={inputText} setInputText={setInputText}
              onSend={handleSend}
              isRecording={isRecording} onMicToggle={toggleRecording}
              micAvailable={micAvailable}
              urgentPulse={welcomeUrgentPulse}
            />
          )}

          {(phase==="loading"||phase==="conversation") && (
            <div ref={threadRef} style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
              <div style={{ maxWidth:940, margin:"0 auto", padding:"28px", display:"flex", flexDirection:"column", gap:32 }}>

                {turns.map((turn, idx) => {
                  const isCollapsed = collapsedTurns.has(turn.id)
                  const prev = idx > 0 ? turns[idx - 1] : null
                  const topicChanged = prev && prev.intent && turn.intent && prev.intent !== turn.intent

                  return (
                    <Fragment key={turn.id}>
                      {topicChanged && (
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ flex:1, height:1, background:C.border }} />
                          <span style={{ color:C.text2, fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                            New topic · {intentLabel[turn.intent!] || turn.intent}
                          </span>
                          <div style={{ flex:1, height:1, background:C.border }} />
                        </div>
                      )}
                      <div style={{ opacity: getTurnOpacity(idx, turns.length), transition:"opacity 0.4s" }}>
                        {queryLabel(turn.query, turn.id, isCollapsed)}
                        {!isCollapsed && (
                          <>
                            {turn.error && (
                              <div style={{ background:C.red+"22", border:`1px solid ${C.red}`, borderRadius:12, padding:"10px 14px", color:C.red, marginBottom:12, fontSize:13, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                                <span>{turn.error}</span>
                                <button
                                  onClick={() => handleRetry(turn)}
                                  style={{ background:"transparent", border:`1px solid ${C.red}`, borderRadius:7, padding:"4px 10px", color:C.red, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", flexShrink:0, whiteSpace:"nowrap" }}
                                >
                                  Try again
                                </button>
                              </div>
                            )}
                            <ComponentRenderer
                              components={turn.components}
                              mode={turn.mode}
                              onOptionSelect={t => { setInputText(t); inputRef.current?.focus() }}
                              onChipClick={l => handleSend(l)}
                            />
                          </>
                        )}
                      </div>
                    </Fragment>
                  )
                })}

                {phase==="loading" && (
                  <div>
                    {queryLabel(pendingQuery)}
                    <SkeletonLoader />
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {phase!=="welcome" && (
        <InputBar
          onSend={handleSend} isRecording={isRecording} onMicToggle={toggleRecording}
          inputText={inputText} setInputText={setInputText}
          isLoading={phase==="loading"} micAvailable={micAvailable}
          inputRef={inputRef}
        />
      )}

      {showIdleOverlay && (
        <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.65)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:"36px 44px", textAlign:"center", maxWidth:360, boxShadow:"0 30px 80px rgba(0,0,0,.4)", animation:"fadeUp .3s ease" }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:8 }}>Are you still there?</div>
            <div style={{ fontSize:13, color:C.text2, marginBottom:24 }}>Resetting in {idleCountdown}s...</div>
            <button
              onClick={() => { clearInterval(countdownRef.current!); setShowIdleOverlay(false); startIdleTimer() }}
              style={{ background:C.cyan, border:"none", borderRadius:12, padding:"11px 28px", color:C.navy, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}
            >
              Yes, I'm here
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
