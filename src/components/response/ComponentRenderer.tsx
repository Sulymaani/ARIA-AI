import type { AriAMode, AriaComponent } from "../../types/aria"
import {
  ActionChips,
  ClarifyCard,
  ContextPanel,
  EventList,
  MapThumbnail,
  OccupancyGrid,
  OutOfScopeCard,
  ProfessorCard,
  RoomCard,
  StatusDashboard,
  StepIndicator,
  Timeline,
} from "./ResponseCards"

type ComponentRendererProps = {
  components: AriaComponent[]
  mode: AriAMode | null
  onOptionSelect: (value: string) => void
  onChipClick: (value: string) => void
}
export function ComponentRenderer({ components, mode, onOptionSelect, onChipClick }: ComponentRendererProps) {
  const isBalanced = mode === "balanced"
  const mainComps = isBalanced ? components.filter(c=>c.type!=="ContextPanel"&&c.type!=="ActionChips") : components.filter(c=>c.type!=="ActionChips")
  const ctx = isBalanced ? components.find(c=>c.type==="ContextPanel") : null
  const chips = components.find(c=>c.type==="ActionChips")

  const render = (comp,i) => {
    const animStyle = { animation:`fadeUp .45s ease ${i*.1}s both` }
    const key = `${comp.type}-${i}`
    switch(comp.type) {
      case "ClarifyCard":     return <div key={key} style={animStyle}><ClarifyCard data={comp} onOptionSelect={onOptionSelect}/></div>
      case "StepIndicator":   return <div key={key} style={animStyle}><StepIndicator data={comp}/></div>
      case "RoomCard":        return <div key={key} style={animStyle}><RoomCard data={comp}/></div>
      case "ProfessorCard":   return <div key={key} style={animStyle}><ProfessorCard data={comp}/></div>
      case "OccupancyGrid":   return <div key={key} style={animStyle}><OccupancyGrid data={comp}/></div>
      case "Timeline":        return <div key={key} style={animStyle}><Timeline data={comp}/></div>
      case "MapThumbnail":    return <div key={key} style={animStyle}><MapThumbnail data={comp}/></div>
      case "StatusDashboard": return <div key={key} style={animStyle}><StatusDashboard data={comp}/></div>
      case "EventList":       return <div key={key} style={animStyle}><EventList data={comp}/></div>
      case "OutOfScopeCard":  return <div key={key} style={animStyle}><OutOfScopeCard data={comp}/></div>
      default: return null
    }
  }

  return (
    <div style={{ display:"flex", gap:16, width:"100%", flexDirection: isBalanced&&ctx ? "row" : "column" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16 }}>
        {mainComps.map(render)}
        {chips && <div style={{ animation:"fadeUp .45s ease .3s both" }}><ActionChips data={chips} onChipClick={onChipClick}/></div>}
      </div>
      {ctx && (
        <div style={{ width:280, flexShrink:0, animation:"fadeUp .45s ease .2s both" }}>
          <ContextPanel data={ctx}/>
        </div>
      )}
    </div>
  )
}
