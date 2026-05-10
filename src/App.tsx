import { useCallback, useEffect, useRef, useState } from "react"

import { Shell, WelcomeScreen, InputBar } from "./components/appShell"
import { ComponentRenderer, SkeletonLoader } from "./components/response"
import { callClaude } from "./services/claudeApi"
import { createLocalFallbackResponse } from "./services/localFallback"
import { buildSystemPrompt } from "./services/systemPrompt"
import { C } from "./theme"
export default function ARIAApp() {
  const [phase, setPhase] = useState("welcome")        // welcome | loading | conversation
  const [mode, setMode] = useState(null)
  const [language, setLanguage] = useState("EN")
  const [components, setComponents] = useState([])
  const [context, setContext] = useState({ turn:0, intent_history:[], context_summary:"No prior context." })
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState([])
  const [time, setTime] = useState("")
  const [micAvailable, setMicAvailable] = useState(false)
  const [error, setError] = useState(null)
  const recRef = useRef(null)

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

  // recording
  const toggleRecording = useCallback(() => {
    if (!micAvailable) return
    if (isRecording) { recRef.current?.stop(); setIsRecording(false); return }
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition
    const rec = new SR()
    rec.continuous=false; rec.interimResults=true; rec.lang="en-US"
    rec.onresult = e => setInputText(Array.from(e.results).map(r=>r[0].transcript).join(""))
    rec.onend = () => setIsRecording(false)
    rec.onerror = () => setIsRecording(false)
    recRef.current=rec; rec.start(); setIsRecording(true)
  }, [isRecording, micAvailable])

  // send
  const handleSend = useCallback(async (text) => {
    if (!text.trim()) return
    setInputText(""); setIsRecording(false); recRef.current?.stop()
    setPhase("loading"); setError(null)
    const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const sys = buildSystemPrompt(context, language, time, days[new Date().getDay()])
    const newMsgs = [...messages, { role:"user", content:text }]
    setMessages(newMsgs)
    try {
      const result = await callClaude(newMsgs, sys)
      setMode(result.mode)
      setComponents(result.components||[])
      setContext(result.context||context)
      setMessages([...newMsgs, { role:"assistant", content:JSON.stringify(result) }])
      setPhase("conversation")
    } catch(err) {
      console.error(err)
      const fallback = createLocalFallbackResponse(text, context)
      setMode(fallback.mode)
      setComponents(fallback.components || [])
      setContext(fallback.context || context)
      setMessages([...newMsgs, { role:"assistant", content:JSON.stringify(fallback) }])
      setError("ARIA is using local fallback data because the AI service is unavailable.")
      setPhase("conversation")
    }
  }, [context, language, time, messages])

  return (
    <div style={{ minHeight:"100vh", background:C.navy, color:C.text, fontFamily:"'Inter',-apple-system,sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes orbIdle{0%,100%{transform:scale(1);box-shadow:0 0 40px ${C.cyan}44,0 0 90px ${C.cyan}22}50%{transform:scale(1.06);box-shadow:0 0 65px ${C.cyan}66,0 0 130px ${C.cyan}33}}
        @keyframes orbActive{0%,100%{transform:scale(1);box-shadow:0 0 30px ${C.red}66}50%{transform:scale(1.08);box-shadow:0 0 55px ${C.red}99}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder{color:${C.text2}}
        input{caret-color:${C.cyan}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.navy}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
      `}</style>

      <Shell mode={mode} language={language} setLanguage={setLanguage} time={time} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", paddingTop:60, paddingBottom: phase!=="welcome"?80:0 }}>

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
          <div style={{ flex:1, padding:"28px", maxWidth:940, margin:"0 auto", width:"100%" }}>
            {error && <div style={{ background:C.red+"22", border:`1px solid ${C.red}`, borderRadius:12, padding:"12px 16px", color:C.red, marginBottom:16 }}>{error}</div>}
            {phase==="loading" ? <SkeletonLoader/> : (
              <ComponentRenderer components={components} mode={mode} onOptionSelect={t=>handleSend(t)} onChipClick={l=>handleSend(l)} />
            )}
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
    </div>
  )
}
