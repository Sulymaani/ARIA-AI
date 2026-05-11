import { useCallback, useEffect, useRef, useState } from "react"

import { Shell, WelcomeScreen, InputBar } from "./components/appShell"
import { ComponentRenderer, SkeletonLoader } from "./components/response"
import { callClaude } from "./services/claudeApi"
import { createLocalFallbackResponse } from "./services/localFallback"
import { buildSystemPrompt } from "./services/systemPrompt"
import type { AriAMode, AriaComponent } from "./types/aria"
import { C } from "./theme"

type Turn = {
  id: number
  query: string
  components: AriaComponent[]
  mode: AriAMode
  error?: string | null
}

function getTurnOpacity(idx: number, total: number): number {
  const distFromLatest = total - 1 - idx
  const steps = [1.0, 0.75, 0.55, 0.40, 0.30]
  return steps[Math.min(distFromLatest, steps.length - 1)]
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

  const recRef = useRef(null)
  const turnIdRef = useRef(0)
  const threadRef = useRef<HTMLDivElement>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  // timer cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(idleTimerRef.current!)
      clearInterval(countdownRef.current!)
    }
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

  // send
  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return
    setInputText(""); setIsRecording(false); recRef.current?.stop()
    setPendingQuery(text)
    setPhase("loading")
    startIdleTimer()

    const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const sys = buildSystemPrompt(context, language, time, days[new Date().getDay()])
    const newMsgs = [...messages, { role:"user", content:text }]
    setMessages(newMsgs)
    try {
      const result = await callClaude(newMsgs, sys)
      const newTurn: Turn = { id: ++turnIdRef.current, query: text, components: result.components||[], mode: result.mode, error: null }
      setTurns(prev => [...prev, newTurn].slice(-5))
      setMode(result.mode)
      setContext(result.context||context)
      setMessages([...newMsgs, { role:"assistant", content:JSON.stringify(result) }])
      setPhase("conversation")
    } catch(err) {
      console.error(err)
      const fallback = createLocalFallbackResponse(text, context)
      const newTurn: Turn = { id: ++turnIdRef.current, query: text, components: fallback.components||[], mode: fallback.mode, error: "ARIA is using local fallback data because the AI service is unavailable." }
      setTurns(prev => [...prev, newTurn].slice(-5))
      setMode(fallback.mode)
      setContext(fallback.context||context)
      setMessages([...newMsgs, { role:"assistant", content:JSON.stringify(fallback) }])
      setPhase("conversation")
    }
  }, [context, language, time, messages, startIdleTimer])

  const queryLabel = (text: string) => (
    <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 11px", marginBottom:12, color:C.text2, fontSize:12, fontWeight:500 }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:C.cyan, display:"inline-block", opacity:0.7 }} />
      {text}
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", height:"100vh", background:C.navy, color:C.text, fontFamily:"'Inter',-apple-system,sans-serif", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes orbIdle{0%,100%{transform:scale(1);box-shadow:0 0 40px ${C.cyan}44,0 0 90px ${C.cyan}22}50%{transform:scale(1.06);box-shadow:0 0 65px ${C.cyan}66,0 0 130px ${C.cyan}33}}
        @keyframes orbActive{0%,100%{transform:scale(1);box-shadow:0 0 30px ${C.red}66}50%{transform:scale(1.08);box-shadow:0 0 55px ${C.red}99}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder{color:${C.text2}}
        input{caret-color:${C.cyan}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.navy}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
      `}</style>

      <Shell mode={mode} language={language} setLanguage={setLanguage} time={time} onStartOver={handleReset} showStartOver={phase !== "welcome"} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", paddingTop:60, overflow:"hidden" }}>

        {phase==="welcome" && (
          <WelcomeScreen
            onOrbClick={toggleRecording}
            inputText={inputText} setInputText={setInputText}
            onSend={handleSend}
            isRecording={isRecording} onMicToggle={toggleRecording}
            micAvailable={micAvailable}
          />
        )}

        {(phase==="loading"||phase==="conversation") && (
          <div ref={threadRef} style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
            <div style={{ maxWidth:940, margin:"0 auto", padding:"28px", display:"flex", flexDirection:"column", gap:32 }}>

              {turns.map((turn, idx) => (
                <div key={turn.id} style={{ opacity: getTurnOpacity(idx, turns.length), transition:"opacity 0.4s" }}>
                  {queryLabel(turn.query)}
                  {turn.error && (
                    <div style={{ background:C.red+"22", border:`1px solid ${C.red}`, borderRadius:12, padding:"10px 14px", color:C.red, marginBottom:12, fontSize:13 }}>
                      {turn.error}
                    </div>
                  )}
                  <ComponentRenderer components={turn.components} mode={turn.mode} onOptionSelect={t=>handleSend(t)} onChipClick={l=>handleSend(l)} />
                </div>
              ))}

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

      {phase!=="welcome" && (
        <InputBar
          onSend={handleSend} isRecording={isRecording} onMicToggle={toggleRecording}
          inputText={inputText} setInputText={setInputText}
          isLoading={phase==="loading"} micAvailable={micAvailable}
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
