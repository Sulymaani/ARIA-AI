import { useState } from "react"
import { C, modeClr } from "../theme"
import type { AriAMode } from "../types/aria"
import { T } from "../utils/translations"

type Props = {
  mode: AriAMode | null
  modePref: AriAMode | null
  setModePref: (pref: AriAMode | null) => void
  language: string
}

export function ModeIndicator({ mode, modePref, setModePref, language }: Props) {
  const [open, setOpen] = useState(false)
  const t = T(language)

  const modeLabel = (m: AriAMode | null): string => {
    if (m === "guided") return t.modeGuided
    if (m === "balanced") return t.modeBalanced
    if (m === "expert") return t.modeExpert
    return t.modeAuto
  }

  const effectiveMode = modePref ?? mode
  const currentLabel = modeLabel(modePref !== null ? modePref : (mode ?? null))
  const accentColor = effectiveMode ? modeClr(effectiveMode) : C.text2
  const isPinned = modePref !== null

  const options: Array<{ value: AriAMode | null; label: string }> = [
    { value: null, label: t.modeAuto },
    { value: "guided", label: t.modeGuided },
    { value: "balanced", label: t.modeBalanced },
    { value: "expert", label: t.modeExpert },
  ]

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={`${t.viewLabel}: ${currentLabel}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: isPinned ? `${accentColor}18` : "transparent",
          border: `1px solid ${isPinned ? accentColor + "55" : C.border}`,
          borderRadius: 8, padding: "5px 10px",
          color: isPinned ? accentColor : C.text2,
          fontSize: 12, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", transition: "all .2s",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, display: "inline-block", flexShrink: 0, boxShadow: effectiveMode ? `0 0 6px ${accentColor}` : "none" }} />
        <span>{t.viewLabel}</span>
        <span style={{ opacity: 0.4, fontSize: 10 }}>·</span>
        <span>{currentLabel}</span>
        <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 1 }}>▾</span>
      </button>

      {open && (
        <>
          <div
            role="presentation"
            style={{ position: "fixed", inset: 0, zIndex: 299 }}
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            aria-label={t.viewLabel}
            style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 300,
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: 6, minWidth: 200,
              boxShadow: "0 8px 32px rgba(0,0,0,.5)",
            }}
          >
            {options.map(opt => {
              const isSelected = modePref === opt.value
              const optColor = opt.value ? modeClr(opt.value) : C.cyan
              return (
                <button
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`${opt.label}${isSelected ? " (selected)" : ""}`}
                  onClick={() => { setModePref(opt.value); setOpen(false) }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = `${optColor}10`
                      ;(e.currentTarget as HTMLElement).style.color = optColor
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = "transparent"
                      ;(e.currentTarget as HTMLElement).style.color = C.text2
                    }
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", textAlign: "left",
                    background: isSelected ? `${optColor}18` : "transparent",
                    border: "none", borderRadius: 8,
                    padding: "10px 14px",
                    color: isSelected ? optColor : C.text2,
                    fontSize: 13, fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer", fontFamily: "inherit",
                    minHeight: 48,
                    transition: "background .15s, color .15s",
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: optColor, display: "inline-block", flexShrink: 0, boxShadow: isSelected ? `0 0 6px ${optColor}` : "none" }} />
                  <span>{opt.label}</span>
                  {isSelected && <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.7 }}>✓</span>}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
